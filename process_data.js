const requestData = async function () {
    let lifeData = await d3.csv('INFO 3300 P2 Life Expectancy.csv');
    let mapData = await d3.json('countries-50m.json');
    console.log(mapData);

    // find minYear and maxYear so we can convert life expectancies to a number and to know time periods
    let minYear = lifeData.columns[2];
    let maxYear = lifeData.columns[64];
    // find minLife and maxLife to create life scale 
    let minLife = lifeData[0][minYear];
    let maxLife = lifeData[0][minYear];
    let lifeExpectancies = [];

    // if have period at end of name, delete and see if it contains
    // if not see if it contains
    // lowercase everything
    // special cases:
    // dem. rep. congo
    // congo
    // cote d'ivoire
    // eq. guinea
    // fr. polynesia
    // st-martin
    // Kyrgyzstan
    // curacao
    // saint lucia
    // St. Vin. and Gren.
    // sao tome and principe
    // slovakia
    // s. sudan
    // united states of america
    // U.S. Virgin Is.
    // N. Mariana Is
    // Vietnam

    let geometries = mapData.objects.countries.geometries;

    function inputNewMapData(countryName, lifeIdx, mapIdx) {
        // input dictionary with year and life expectancy into "properties" value in TopoJSON file
        let dict = {}
        dict["Country Name"] = countryName;
        for (let year = 1960; year <= 2022; year++) {
            // convert life expectancies to numbers
            if (lifeData[lifeIdx][String(year)] != "") {
                dict[String(year)] = Number(lifeData[lifeIdx][String(year)]);
                minLife = Math.min(minLife, dict[String(year)]);
                maxLife = Math.max(maxLife, dict[String(year)]);
                lifeExpectancies.push(dict[String(year)]);
            }
        }
        geometries[mapIdx].properties = dict;
    }

    for (let i = 0; i < geometries.length; i++) {
        let foundCountry = false;
        for (let j = 0; j < lifeData.length; j++) {
            let mapCountry = geometries[i].properties.name;
            // removing any accents
            // switch statement to see if any countries we are looking at
            // is a special case where names wildly differ
            switch (mapCountry.normalize('NFD').replace(/\p{Diacritic}/gu, '')) {
                case "Dem. Rep. Congo":
                    inputNewMapData('Democratic Republic of the Congo', j, i);
                    foundCountry = true;
                    break;
                case "Congo":
                    inputNewMapData('Republic of the Congo', j, i);
                    foundCountry = true;
                    break;
                case "Cote d'Ivoire":
                    inputNewMapData("Cote d'Ivoire", j, i);
                    foundCountry = true;
                    break;
                case "Eq. Guinea":
                    inputNewMapData("Equatorial Guinea", j, i);
                    foundCountry = true;
                    break;
                case "Fr. Polynesia":
                    inputNewMapData("French Polynesia", j, i);
                    foundCountry = true;
                    break
                case "St-Martin":
                    inputNewMapData("St. Martin", j, i);
                    foundCountry = true;
                    break;
                case "Kyrgyzstan":
                    inputNewMapData("Kyrgyz Republic (Kyrgyzstan)", j, i);
                    foundCountry = true;
                    break;
                case "Curacao":
                    inputNewMapData("Curacao", j, i);
                    foundCountry = true;
                    break;
                case "Saint Lucia":
                    inputNewMapData("St. Lucia", j, i);
                    foundCountry = true;
                    break;
                case "St. Vin. and Gren.":
                    inputNewMapData("St. Vincent and the Grenadines", j, i);
                    foundCountry = true;
                    break;
                case "Sao Tome and Principe":
                    inputNewMapData("Sao Tome and Principe", j, i);
                    foundCountry = true;
                    break;
                case "Slovakia":
                    inputNewMapData("Slovak Republic (Slovakia)", j, i);
                    foundCountry = true;
                    break;
                case "S. Sudan":
                    inputNewMapData("South Sudan", j, i);
                    foundCountry = true;
                    break;
                case "United States of America":
                    inputNewMapData("United States of America", j, i);
                    foundCountry = true;
                    break;
                case "U.S. Virgin Is.":
                    inputNewMapData("U.S. Virgin Islands", j, i);
                    foundCountry = true;
                    break;
                case "N. Mariana Is.":
                    inputNewMapData("Northern Mariana Islands", j, i);
                    foundCountry = true;
                    break;
                case "Vietnam":
                    inputNewMapData("Vietnam", j, i);
                    foundCountry = true;
                    break;
                default:
                    // check if country names are abbreviated or are exactly the same
                    if (mapCountry[mapCountry.length - 1] == '.') {
                        if (lifeData[j]['Country Name'].toLowerCase().includes(mapCountry.substring(0, mapCountry.length - 1).toLowerCase())) {
                            inputNewMapData(lifeData[j]['Country Name'], j, i);
                            foundCountry = true;
                        }

                    }
                    if (lifeData[j]['Country Name'].toLowerCase().includes(mapCountry.toLowerCase())) {
                        inputNewMapData(lifeData[j]['Country Name'], j, i);
                        foundCountry = true;
                    }
            }
            if (foundCountry) break;
        }
    }
    // store the list of every recorded life expectancy, the minimum life expectancy, 
    // and maximum life expectancy into their own variables in the TopoJSON file
    mapData['max_life_exp'] = maxLife;
    mapData['min_life_exp'] = minLife;
    mapData['life_expectancies'] = lifeExpectancies
    console.log(JSON.stringify(mapData, null, 2));
}
requestData();