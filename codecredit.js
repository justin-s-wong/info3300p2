
// From lecture: 24.10.09.notes.htm
// Flexible legend-drawing function - Jeff Rzeszotarski, 2022
// Released under MIT Free license
// Takes in an SVG element selector <legendSelector> and a d3 color scale <legendColorScale>
//
// Usage example: drawLegend("#mapArea", lifeScale, 75, 425);
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function drawLegend(mapSelector, legendColorScale, height, width) {
    // This code should adapt to a variety of different kinds of color scales
    // Credit Prof. Rz if you are basing a legend on this structure, and note PERFORMANCE CONSIDERATIONS

    const offsets = {
        width: 50,
        top: 25,
        bottom: 25
    };
    // Number of integer 'pixel steps' to draw when showing continuous scales
    // Warning, not using a canvas element so lots of rect tags will be created for low stepSize, causing issues with performance -- keep this large
    const stepSize = 4;
    // Extend the minmax by 0% in either direction to expose more features by default
    const minMaxExtendPercent = 0;


    const mapArea = d3.select(mapSelector);
    const legendHeight = height;
    const legendBarWidth = width - (offsets.width * 2);

    // add text to top left and top right of color scale legend
    mapArea.append("g")
           .attr("class", "text")
           .attr("transform", `translate(${offsets.width}, ${10})`)
           .append("text")
           .attr("dominant-baseline", "middle")
           .style("fill", "black")
           .style("font-family", "Monaco")
           .style("font-size", 15)
           .text(showLife ? "Low Life Expectancy" : "Low Pop. Number")
    mapArea.append("g")
           .attr("class", "text")
           .attr("transform", `translate(${legendBarWidth + offsets.width}, ${10})`)
           .append("text")
           .attr("text-anchor", "end")
           .attr("dominant-baseline", "middle")
           .style("fill", "black")
           .style("font-family", "Monaco")
           .style("font-size", 15)
           .text(showLife ? "High Life Expectancy" : "High Pop. Number")
    
    const legendMinMax = d3.extent(legendColorScale.domain());
    // recover the min and max values from most kinds of numeric scales
    const minMaxExtension = (legendMinMax[1] - legendMinMax[0]) * minMaxExtendPercent;
    const barHeight = legendHeight - offsets.top - offsets.bottom;

    // In this case the "data" are pixels, and we get numbers to use in colorScale
    // Use this to make axis labels
    let barScale = undefined;
    if (showLife) {
        barScale = d3.scaleLinear().domain([legendMinMax[0] - minMaxExtension,
            legendMinMax[1] + minMaxExtension])
        .range([0, legendBarWidth]);
    }
    else {
        barScale = d3.scaleLog().domain([legendMinMax[0] - minMaxExtension,
            legendMinMax[1] + minMaxExtension])
        .range([0, legendBarWidth]);
    }
    let barAxis = showLife ? d3.axisBottom(barScale).ticks(10).tickFormat(d3.format("d"))
                           : d3.axisBottom(barScale).ticks(10).tickFormat(d => {
                                let str = String(Math.round(d));
                                if (str.length < 7) return d3.format(",")(Math.round(d));
                                if (str.length < 10) return str.substring(0, str.length - 6) + "M";
                                else return str.substring(0, str.length - 9) + "B"
                           });

    // Place for bar slices to live, in our case we place them at the bottom left of the selected canvas
    let bar = mapArea.append("g")
                     .attr("class", "legend colorbar")
                     .attr("transform", `translate(${offsets.width},${10 + barHeight})`)

    // ****** SWITCHES FOR DIFFERENT SCALE TYPES ******

    // Check if we're using a binning scale - if so, we make blocks of color
    if (legendColorScale.hasOwnProperty('thresholds') || legendColorScale.hasOwnProperty('quantiles')) {
        // Get the thresholds
        let thresholds = [];
        if (legendColorScale.hasOwnProperty('thresholds')) { thresholds = legendColorScale.thresholds() }
        else { thresholds = legendColorScale.quantiles() }

        const barThresholds = [legendMinMax[0], ...thresholds, legendMinMax[1]];
        console.log(barThresholds);

        // Use the quantile breakpoints plus the min and max of the scale as tick values
        barAxis.tickValues(barThresholds);

        // Draw rectangles between the threshold segments
        for (let i = 0; i < barThresholds.length - 1; i++) {
            let dataStart = barThresholds[i];
            let dataEnd = barThresholds[i + 1];
            let pixelStart = barAxis.scale()(dataStart);
            let pixelEnd = barAxis.scale()(dataEnd);

            bar.append("rect")
                .attr("x", pixelStart)
                .attr("y", 0)
                .attr("width", pixelEnd - pixelStart)
                .attr("height", barHeight)
                .style("fill", legendColorScale((dataStart + dataEnd) / 2.0));
        }
    }
    // Else if we have a continuous / roundable scale
    //  In an ideal world you might construct a custom gradient mapped to the scale
    //  For this one, we use a hack of making stepped rects
    else if (legendColorScale.hasOwnProperty('rangeRound')) {
        // NOTE: The barAxis may round min and max values to make them pretty
        // ** This also means there is a risk of the legend going beyond scale bounds
        // We need to use the barAxis min and max just to be sure the bar is complete
        //    Using barAxis.scale().invert() goes from *axis* pixels to data values easily
        // ** We also need to create patches for the scale if the labels exceed bounds
        //     (floating point comparisons risky for small data ranges,but not a big deal
        //      because patches will be indistinguishable from actual scale bottom)
        // It's likely that scale clamping will actually do this for us elegantly
        // ...but better to be safer and patch the regions anyways

        for (let i = 0; i < legendBarWidth; i = i + stepSize) {

            let center = i + (stepSize / 2);
            let dataCenter = barAxis.scale().invert(center);

            // below normal scale bounds
            if (dataCenter < legendMinMax[0]) {
                bar.append("rect")
                    .attr("x", i)
                    .attr("y", 0)
                    .attr("width", stepSize)
                    .attr("height", barHeight)
                    .style("fill", legendColorScale(legendMinMax[0]));
            }
            // within normal scale bounds
            else if (dataCenter < legendMinMax[1]) {
                bar.append("rect")
                    .attr("x", i)
                    .attr("y", 0)
                    .attr("width", stepSize)
                    .attr("height", barHeight)
                    .style("fill", legendColorScale(dataCenter));
            }
            // above normal scale bounds
            else {
                bar.append("rect")
                    .attr("x", i)
                    .attr("y", 0)
                    .attr("width", stepSize)
                    .attr("height", barHeight)
                    .style("fill", legendColorScale(legendMinMax[1]));
            }

        }
    }
    // Otherwise we have a nominal scale
    else {
        let nomVals = legendColorScale.domain().sort();

        // Use a scaleBand to make blocks of color and simple labels
        let barScale = d3.scaleBand().domain(nomVals)
            .range([0, legendBarWidth])
            .padding(0.05);
        barAxis.scale(barScale);

        // Draw rectangles for each nominal entry
        nomVals.forEach(d => {
            bar.append("rect")
                .attr("x", barScale(d))
                .attr("y", 0)
                .attr("width", barScale.bandwidth())
                .attr("height", barHeight)
                .style("fill", legendColorScale(d));
        });
    }
    // DONE w/SWITCH

    // Finally, draw legend labels at bottom left of the selected canvas
    mapArea.append("g")
        .attr("class", "legend axis")
        .attr("transform", `translate(${offsets.width},${legendHeight})`)
        .call(barAxis);

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// From lecture: 24.10.21.notes.htm

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function clicked(event, d) {
            
    // geoPath generators have a few extra functions. .bounds returns a pixel rectangle bounding the shape you give it
    let bounds = path.bounds(d.geometry); // get bounds for clicked state/county
    let dx = bounds[1][0] - bounds[0][0]; // width of state/county
    let dy = bounds[1][1] - bounds[0][1]; // height of state/county
    let x = (bounds[0][0] + bounds[1][0]) / 2; // center x of state/county
    let y = (bounds[0][1] + bounds[1][1]) / 2; // center y of state/county

    // We want to make sure scale is within 1-10 when we click, so things don't zoom too far or too little
    // To compute zoom, we want to make sure the bounding box "just" fits onscreen.
    // dx / mapWidth gets us the portion of the screen the shape takes up without any zoom at all
    //  the lower dx/mapWidth is, the more we need to zoom because the shape is smaller
    // We find the max of dx/mapWidth, dy/mapHeight because we don't want to zoom farther (smaller values need more zoom)
    // We do 1 or 0.9 divided by dx/mapWidth because we need larger numbers to zoom in. 0.9 allows us to pad things a bit
    let scale = Math.max(1, Math.min(10, 0.9 / Math.max( dx / width, 
                                                        dy / height )));

    // Think of the translate like a delta describing how much we need to move the map to move a point to a desired position
    // Simplistically, it works like (desired position) - (current position) = (translation)
    // In this case mapWidth/2, the center of the screen is the desired place for our viewport
    // x*scale is the position we want to move to the center (scale is there because we need to move more when zoomed in)
    let translate = [width / 2 - x * scale, height / 2 - y * scale];

    // It's hard to programmatically adjust a zoom. The best way is to take the Identity (zoom transform where nothing is changed)
    //  and then modify it using a .translate and .scale
    let newTransform = d3.zoomIdentity
                        .translate(translate[0],translate[1])
                        .scale(scale);
    // We can apply a new transform to the screen by using .call(zoom.tranform, newTransform)
    // This is kinda the same thing as running zoom.transform(newTransform), but the chaining with .call allows us to add an animation
    svg.transition().duration(1000).call(zoom.transform, newTransform);

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
