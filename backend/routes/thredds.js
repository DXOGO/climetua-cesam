const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

const router = express.Router();

const threddsUrl = 'http://thredds:8080/thredds/wms/cesamAll/wrfpost.nc';

let layersData = null;
let startTime = null;
let endTime = null;

const cities = {
    aveiro: { X: 445, Y: 364 },
    beja: { X: 463, Y: 441 },
    braga: { X: 450, Y: 337 },
    braganca: { X: 488, Y: 329 },
    castelo_branco: { X: 472, Y: 389 },
    coimbra: { X: 451, Y: 377 },
    evora: { X: 462, Y: 425 },
    faro: { X: 461, Y: 470 },
    guarda: { X: 462, Y: 425 },
    leiria: { X: 442, Y: 391 },
    lisboa: { X: 434, Y: 421 },
    portalegre: { X: 473, Y: 404 },
    porto: { X: 446, Y: 349 },
    santarem: { X: 440, Y: 427 },
    setubal: { X: 441, Y: 332 },
    viana: { X: 466, Y: 344 },
    vila_real: { X: 462, Y: 364 },
    viseu: { X: 458, Y: 450 },
    angra: { X: 550, Y: 453 },
    ponta_delgada: { X: 257, Y: 592 },
    st_cruz: { X: 270, Y: 580 },
    funchal: { X: 418, Y: 309 },
    porto_santo: { X: 270, Y: 580 }
};

const fetchData = async () => {
    try {
        const response = await axios.get(`${threddsUrl}?service=WMS&version=1.3.0&request=GetCapabilities`);
        layersData = response.data;
        console.log('/wms Thredds GetCapabilites fetched successfully');

        await fetchTimeDimensions();
    } catch (error) {
        console.error('Error fetching Thredds data:', error.message);
        setTimeout(fetchData, 5000);
    }
};

fetchData();

// Function to fetch time dimensions from Thredds GetCapabilities
const fetchTimeDimensions = async () => {
    try {
        if (layersData) {
            parseString(layersData, (err, result) => {
                if (err) {
                    throw new Error('Error parsing GetCapabilities XML');
                }

                // Find the first layer
                const layer = result?.WMS_Capabilities?.Capability[0].Layer[0].Layer[0].Layer[2].Dimension[0];

                if (layer) {
                    const timeDimension = layer._;
                    const [start, end] = timeDimension.trim().split('/');
                    startTime = new Date(start);
                    endTime = new Date(end);
                }

            });
        } else {
            throw new Error('Failed to fetch Thredds data');
        }

        if (!startTime || !endTime) {
            throw new Error('Failed to extract time dimensions from XML response');
        }
        console.log('Time dimensions fetched successfully:', startTime, endTime);
        return { startTime, endTime };
    } catch (error) {
        console.error('Error fetching time dimensions:', error.message);
        throw new Error('Failed to fetch time dimensions');
    }
};

// Route to get time dimensions
router.get('/time-dimensions', async (req, res) => {
    console.log('Accessing /time-dimensions');
    try {
        const { startTime, endTime } = await fetchTimeDimensions();
        res.json({ startTime, endTime });
    } catch (error) {
        console.error('Error fetching time dimensions:', error.message);
        res.status(500).json({ error: 'Failed to fetch time dimensions' });
    }
});

const fetchDataForCity = async (city, isDaily, variable) => {
    const { X, Y } = cities[city];

    if (isDaily) {
        new_endTime = new Date(startTime);
        new_endTime.setHours(new_endTime.getHours() + 23);
    }

    const checkEndTime = isDaily ? new_endTime : new Date(endTime);

    const timeSeriesData = [];

    //* Available variables to fetch from CESAM test file
    const variables = ['T_2m', 'rh_2m', 'ws_10m', 'wd_10m', 'precip_g', 'precip_c', 'slp', 'cldfrac'];

    const bbox = city === 'funchal'
        ? '-17.19291687011719,32.41416806011186,-16.58248901367188,32.83517369200289'
        : '-28.212890625000004,27.449790329784214,10.854492187500002,51.67255514839676';

    for (let time = new Date(startTime); time <= checkEndTime; time.setHours(time.getHours() + 1)) {
        const dataPoint = { time: time.toISOString() };

        try {
            const requests = variable ? [variable] : variables;
            // Concurrently fetch data for all variables
            const promises = requests.map(async (variable) => {
                const response = await axios.get(threddsUrl, {
                    params: {
                        SERVICE: 'WMS',
                        VERSION: '1.1.1',
                        REQUEST: 'GetFeatureInfo',
                        SRS: 'EPSG:4326',
                        LAYERS: variable,
                        QUERY_LAYERS: variable,
                        X,
                        Y,
                        I: X,
                        J: Y,
                        BBox: bbox,
                        INFO_FORMAT: 'text/xml',
                        TIME: time.toISOString(),
                        WIDTH: 889,
                        HEIGHT: 728,
                    },
                });

                return { [variable]: await parseValueFromResponse(response.data) };
            });

            // Wait for all requests to complete
            const results = await Promise.all(promises);

            // Merge results into dataPoint
            results.forEach((result) => Object.assign(dataPoint, result));

        } catch (error) {
            console.error(`Error fetching data for ${city} at time ${time.toISOString()}:`, error.message);
            // Set dataPoint variable to null on error
            variables.forEach((variable) => (dataPoint[variable] = null));
        }
        timeSeriesData.push(dataPoint);
    }
    return timeSeriesData;
};

const parseValueFromResponse = (response) => {
    return new Promise((resolve, reject) => {
        parseString(response, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const value = result.FeatureInfoResponse.Feature[0].FeatureInfo[0].value[0];
                resolve(value);
            }
        });
    });
};

//! not working when fetching all the cities info, must be overflow request problem
// router.get('/data', async (req, res) => {
//     console.log('Accessing /data');
//     try {
//         const allCityData = await Promise.all(Object.keys(cities).map(async (city) => {
//             const cityData = await fetchDataForCity(city, false);
//             return { city, cityData };
//         }));
//         res.json(allCityData);
//     } catch (error) {
//         console.error('Error fetching data for all cities:', error.message);
//         res.status(500).json({ error: 'Failed to fetch data for all cities' });
//     }
// });

router.get('/daily', async (req, res) => {
    console.log('Accessing /daily');
    try {
        const allCityData = await Promise.all(Object.keys(cities).map(async (city) => {
            const cityData = await fetchDataForCity(city, true);
            return { city, cityData };
        }));

        res.json(setData(allCityData));
    } catch (error) {
        console.error('Error fetching daily data for all cities:', error.message);
        res.status(500).json({ error: 'Failed to fetch daily data for all cities' });
    }
});

router.get('/data/:city', async (req, res) => {
    const { city } = req.params;
    console.log(`Accessing /data/${city}`);
    try {
        const data = await fetchDataForCity(city, false);
        res.json(setData(data));
    } catch (error) {
        console.error(`Error fetching data for ${city}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

//* not being used currently
router.get('/data/:city/:variable', async (req, res) => {
    const { city, variable } = req.params;
    console.log(`Accessing /data/${city}/${variable}`);
    try {
        const data = await fetchDataForCity(city, false, variable);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching ${variable} data for ${city}:`, error.message);
        res.status(500).json({ error: `Failed to fetch ${variable} data` });
    }
});

//* not being used currently
// route to get temperature for all cities
router.get('/temperature', async (req, res) => {
    console.log('Accessing /temperature');
    try {
        const allCityData = await Promise.all(Object.keys(cities).map(async (city) => {
            const cityData = await fetchDataForCity(city, false, 'T_2m');
            return { city, cityData };
        }));
        res.json(allCityData);
    } catch (error) {
        console.error('Error fetching temperature data for all cities:', error.message);
        res.status(500).json({ error: 'Failed to fetch temperature data for all cities' });
    }
});

router.get('/wms', (req, res) => {
    console.log('Accessing /wms');
    if (layersData) {
        res.send(layersData);
    } else {
        res.status(500).json({ error: 'Failed to fetch Thredds data' });
    }
});

module.exports = router;

const setData = (allCityData) => {

    if (allCityData.length <= 23) {
        const precip_g_accumulated = allCityData.flatMap(city => city.cityData.map(data => data.precip_g));
        const precip_c_accumulated = allCityData.flatMap(city => city.cityData.map(data => data.precip_c));

        // Grid scale precipitation for each timestamp
        const precip_g = precip_g_accumulated.map((value, index, array) => {
            if (index === 0) {
                return parseFloat(value);
            } else {
                const prevValue = parseFloat(array[index - 1]);
                const currentValue = parseFloat(value);
                return currentValue - prevValue;
            }
        });

        // Cummulus precipitation for each timestamp
        const precip_c = precip_c_accumulated.map((value, index, array) => {
            if (index === 0) {
                return parseFloat(value);
            } else {
                const prevValue = parseFloat(array[index - 1]);
                const currentValue = parseFloat(value);
                return currentValue - prevValue;
            }
        });

        const precip_total_accumulated = precip_g_accumulated.map((item, index) => parseFloat(item) + parseFloat(precip_c_accumulated[index]));

        const precip_total = precip_total_accumulated.map((item, index) => {
            if (index === 0) {
                return item;
            }
            return item - precip_total_accumulated[index - 1];
        });

        allCityData.forEach(city => {
            city.cityData.forEach(data => {
                data.T_2m = parseFloat(data.T_2m);
                data.rh_2m = parseFloat(data.rh_2m);
                data.ws_10m = parseFloat(data.ws_10m);
                data.wd_10m = parseFloat(data.wd_10m);
                data.slp = parseFloat(data.slp);
                data.precip_g = parseFloat(precip_g.shift());
                data.precip_c = parseFloat(precip_c.shift());
                data.precip_total = precip_total.shift();
                data.cldfrac = parseFloat(data.cldfrac);
            });
        });
    } else {
        const precip_g_accumulated = allCityData.map(data => data.precip_g);
        const precip_c_accumulated = allCityData.map(data => data.precip_c);

        // Grid scale precipitation for each timestamp
        const precip_g = precip_g_accumulated.map((value, index, array) => {
            if (index === 0) {
                return parseFloat(value);
            } else {
                const prevValue = parseFloat(array[index - 1]);
                const currentValue = parseFloat(value);
                return currentValue - prevValue;
            }
        });

        // Cummulus precipitation for each timestamp
        const precip_c = precip_c_accumulated.map((value, index, array) => {
            if (index === 0) {
                return parseFloat(value);
            } else {
                const prevValue = parseFloat(array[index - 1]);
                const currentValue = parseFloat(value);
                return currentValue - prevValue;
            }
        });

        const precip_total_accumulated = precip_g_accumulated.map((item, index) => parseFloat(item) + parseFloat(precip_c_accumulated[index]));

        const precip_total = precip_total_accumulated.map((item, index) => {
            if (index === 0) {
                return item;
            }
            return item - precip_total_accumulated[index - 1];
        });

        allCityData.forEach(city => {
            city.T_2m = parseFloat(city.T_2m);
            city.rh_2m = parseFloat(city.rh_2m);
            city.ws_10m = parseFloat(city.ws_10m);
            city.wd_10m = parseFloat(city.wd_10m);
            city.slp = parseFloat(city.slp);
            city.precip_g = parseFloat(precip_g.shift());
            city.precip_c = parseFloat(precip_c.shift());
            city.precip_total = precip_total.shift();
            city.cldfrac = parseFloat(city.cldfrac);
        });
    }

    return allCityData;
}