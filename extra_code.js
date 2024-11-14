// create an average life span from 1960 to 2022??

                // creating functions for axes/gridlines and drawing axes and gridlines
                // let leftAxis = d3.axisLeft(lifeScale).tickFormat( d => String(d))
                // svg.append("g")
                //     .attr("transform", `translate(${margins.left - 10}, ${margins.top})`)
                //     .call(leftAxis)

                // let leftGridlines = d3.axisLeft(lifeScale).tickFormat("").tickSize(-chartWidth - 10)
                // svg.append("g")
                //    .attr("class", "gridlines")
                //    .attr("transform", `translate(${margins.left - 10}, ${margins.top})`)
                //    .call(leftGridlines)

                // let bottomAxis = d3.axisBottom()
                // let bottomAxisG = svg.append("g")
                //                      .attr("transform",`translate(${margins.left},${chartHeight+margins.top+10})`)


// const allKeys = lifeData.columns.slice(2, 65).sort();
                // console.log(allKeys);
                // allKeys.forEach( d => {
                //     // For each year key, add a new button to the button bar
                //     d3.select("div#button-bar")
                //       .append("button")
                //       .text( d )
                //       .on("click", function() {
                //         // When it's clicked, call updateBars to update the map
                //         updateMap( d );
                //       })
                // });


// let yearData = []
                    // most common starting letter for each country
                    // B, C, E, G, I, K, L, M, N, P, S, T, U
                    // let startCountry = [['B',""],['C',""],['E',""],['G',""],['I',""],['K',""],['L',""],['M',""],['N',""],['P',""],['S',""],['T',""],['U',""]];
                    // let index = 0;
                    // data.forEach( (d) => {
                    //     if (d[yearKey] != "") {
                    //         let country = {"Country Name" : d["Country Name"], "Life Expectancy" : d[yearKey]}
                    //         yearData.push(country);
                    //         if (index < startCountry.length && d["Country Name"].charAt(0) == startCountry[index][0]) {
                    //             startCountry[index][1] = d["Country Name"];
                    //             index++;
                    //         }
                    //     }
                    // })

                    // console.log(startCountry);

                    // const countries = d3.map(yearData, d => d['Country Name']) 
                    // const countryScale = d3.scaleBand().domain(countries).range([0, mapWidth])
                    //                                      .padding(0.05);

                    // chartArea.selectAll("line.letter").data(startCountry)
                    //    .join("line")
                    //    .attr("class", "letter")
                    //    .attr("x1", d => countryScale(d[1]))
                    //    .attr("y1", 0)
                    //    .attr("x2", d => countryScale(d[1]))
                    //    .attr("y2", chartHeight)
                    //    .attr("stroke", "lightgrey")
                    //    .attr("stroke-width", 1)

                    // chartArea.selectAll("text.letter").data(startCountry)
                    //    .join("text")
                    //    .attr("class", "letter")
                    //    .attr("x", d => countryScale(d[1]))
                    //    .attr("y", -10)
                    //    .attr("text-anchor", "middle")
                    //    .attr("font-size", "14px")
                    //    .style("font-weight", "bold")
                    //    .text(d => d[0]);

                    // chartArea.selectAll('rect.bar').data(yearData)
                    //          .join( enter => enter.append('rect')
                    //                               .attr('class','bar')
                    //                               .attr("fill", "green")
                    //                               .attr("x", d => countryScale(d['Country Name']))
                    //                               .attr("y", d => lifeScale(d['Life Expectancy']))
                    //                               .attr("height", d => lifeScale(minLife) - lifeScale(d['Life Expectancy']))
                    //                               .attr("width", countryScale.bandwidth())
                    //                               .attr("opacity", 0) // Set opacity low, then animate to 1 to make them fade in
                    //                               .call( enter => enter.transition()
                    //                                             .attr('opacity', 1) ),
                    //             update => update.call( update => update.transition()  // Animate resizing and movement
                    //                                                 .attr("fill", "green")
                    //                                                 .attr("x", d => countryScale(d['Country Name']))
                    //                                                 .attr("y", d => lifeScale(d['Life Expectancy']))
                    //                                                 .attr("height", d => lifeScale(0) - lifeScale(d['Life Expectancy']))
                    //                                                 .attr("width", countryScale.bandwidth()) ),
                    //             exit => exit.call( exit => exit.transition().attr('opacity',0).remove() ) ); // Animate opacity to fade out
                    // chartArea.raise()
                    //     map.raise();


// let intervalId; // Variable to hold the interval ID

                // // Function to start the animation
                // function startAnimation() {
                //     // Set year to current slider value (initially from div)
                //     year = Number(d3.select('div.sliderValue').text().substring(6));

                //     // Disable the slider during animation
                //     d3.select("input.yearSlider").attr("disabled", true);

                //     // Start interval animation
                //     intervalId = setInterval(() => {
                //         year += 1; // Increment the year
                //         if (year === 2023) year = 1960; // Reset if year exceeds 2022

                //         // Update display and slider value
                //         console.log(year);
                        
                //         d3.select('div.sliderValue').text("Year: " + year);
                //         d3.select("input.yearSlider")
                //             .attr("value", year)
                //             .dispatch("input"); // Trigger the input event on the input element

                //         // Uncomment to update the map
                //         // updateMap(String(year));
                //     }, sliderTransitionTime);

                //     animate = true;
                // }

                // // Function to stop the animation
                // function stopAnimation() {
                //     clearInterval(intervalId); // Stop the interval
                //     d3.select("input.yearSlider").attr("disabled", null); // Re-enable the slider
                //     animate = false;
                // }

                // // Event listeners for play and stop buttons
                // d3.select("#play").on("click", () => {
                //     if (!animate) { // Only start if not already animating
                //         startAnimation();
                //     }
                // });

                // d3.select("#stop").on("click", () => {
                //     if (animate) { // Only stop if currently animating
                //         stopAnimation();
                //     }
                // });
                //             }