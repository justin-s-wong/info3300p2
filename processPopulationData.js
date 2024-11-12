const requestData = async function () {
    let mapData = await d3.json('countries-50m-p.json');
    let populationData = await d3.csv('population_data.csv');

    const populationLookup = {};
    populationData.forEach(d => {
        if (d['Country Name']) {
            populationLookup[d['Country Name']] = d;
        }
    });

    const countryNameMap = {
        "Vatican": "Holy See",
        "American Samoa": "American Samoa",
        "S. Geo. and the Is.": "South Georgia and the South Sandwich Islands",
        "Br. Indian Ocean Ter.": "British Indian Ocean Territory",
        "Saint Helena": "St. Helena",
        "Turkey": "Turkiye",
        "Taiwan": "Taiwan, China",
        "South Korea": "Korea, Rep.",
        "Somaliland": "Somalia",
        "San Marino": "San Marino",
        "Palau": "Palau",
        "North Korea": "Korea, Dem. People's Rep.",
        "Niue": "Niue",
        "Cook Is.": "Cook Islands",
        "W. Sahara": "Western Sahara",
        "Monaco": "Monaco",
        "Laos": "Lao PDR",
        "Palestine": "West Bank and Gaza",
        "St. Pierre and Miquelon": "St. Pierre and Miquelon",
        "Wallis and Futuna Is.": "Wallis and Futuna",
        "St-Barthélemy": "St. Barthelemy",
        "Fr. S. Antarctic Lands": "French Southern Territories",
        "Åland": "Aland Islands",
        "Faeroe Is.": "Faroe Islands",
        "N. Cyprus": "Cyprus",
        "Indian Ocean Ter.": "British Indian Ocean Territory",
        "Norfolk Island": "Norfolk Island",
        "Andorra": "Andorra",
        "Cayman Islands": "Cayman Islands",
        "Jersey": "Jersey",
        "Guernsey": "Guernsey",
        "Montserrat": "Montserrat",
        "Anguilla": "Anguilla",
        "Falkland Is.": "Falkland Islands (Malvinas)"
    };

    function inputNewMapData(countryName, countryData, country) {
        const properties = {
            name: countryName
        };

        for (let year = 1960; year <= 2022; year++) {
            const yearStr = year.toString();
            if (country.properties[yearStr] !== undefined && 
                countryData[yearStr] !== undefined) {
                properties[yearStr] = {
                    life: country.properties[yearStr],
                    population: +countryData[yearStr]
                };
            }
        }
        return properties;
    }

    mapData.objects.countries.geometries = mapData.objects.countries.geometries.map(country => {
        let countryName = country.properties.name;
        let populationCountryData;

        const normalizedName = countryName.normalize('NFD').replace(/\p{Diacritic}/gu, '');

        if (countryNameMap[countryName]) {
            populationCountryData = populationLookup[countryNameMap[countryName]];
        }

        if (!populationCountryData) {
            switch(normalizedName) {
                case "Dem. Rep. Congo":
                    populationCountryData = populationLookup['Democratic Republic of the Congo'];
                    break;
                case "Congo":
                    populationCountryData = populationLookup['Republic of the Congo'];
                    break;
                case "Cote d'Ivoire":
                    populationCountryData = populationLookup["Cote d'Ivoire"];
                    break;
                case "Eq. Guinea":
                    populationCountryData = populationLookup["Equatorial Guinea"];
                    break;
                case "Fr. Polynesia":
                    populationCountryData = populationLookup["French Polynesia"];
                    break;
                case "St-Martin":
                    populationCountryData = populationLookup["St. Martin"];
                    break;
                case "Kyrgyzstan":
                    populationCountryData = populationLookup["Kyrgyz Republic (Kyrgyzstan)"];
                    break;
                case "Curacao":
                    populationCountryData = populationLookup["Curacao"];
                    break;
                case "Saint Lucia":
                    populationCountryData = populationLookup["St. Lucia"];
                    break;
                case "St. Vin. and Gren.":
                    populationCountryData = populationLookup["St. Vincent and the Grenadines"];
                    break;
                default:
                    populationCountryData = populationLookup[countryName] || 
                        populationLookup[countryName.replace(/\./g, '')] ||
                        Object.entries(populationLookup).find(([key, value]) => {
                            const k = key.toLowerCase().replace(/[.,'\s]/g, '');
                            const n = normalizedName.toLowerCase().replace(/[.,'\s]/g, '');
                            return k.includes(n) || n.includes(k);
                        })?.[1];
            }
        }

        if (populationCountryData) {
            return {
                ...country,
                properties: inputNewMapData(countryName, populationCountryData, country)
            };
        }

        return country;
    });

    console.log(JSON.stringify(mapData, null, 2));

};

requestData();