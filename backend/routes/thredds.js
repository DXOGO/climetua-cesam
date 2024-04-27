const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

const router = express.Router();

const threddsUrl = 'http://thredds:8080/thredds/wms/testAll/wrfpost.nc';

let layersData = null;

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
const fetchDataForCity = async (city, variable) => {
    const { X, Y } = cities[city];
    const startTime = new Date('2021-07-08T00:00:00.000Z');
    const endTime = new Date('2021-07-15T12:00:00.000Z');
    const timeSeriesData = [];

    const variables = ['T_2m', 'rh_2m', 'ws_10m', 'wd_10m'];

    const bbox = city === 'funchal'
        ? '-17.19291687011719,32.41416806011186,-16.58248901367188,32.83517369200289'
        : '-28.212890625000004,27.449790329784214,10.854492187500002,51.67255514839676';

    for (let time = startTime; time <= endTime; time.setHours(time.getHours() + 1)) {
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


const fetchData = async () => {
    try {
        const response = await axios.get(`${threddsUrl}?service=WMS&version=1.3.0&request=GetCapabilities`);
        layersData = response.data;
        console.log('/wms Thredds GetCapabilites fetched successfully');

        // await Promise.all(Object.keys(cities).map(city => fetchDataForCity(city)));
        // console.log('/data Data for all cities fetched successfully');

    } catch (error) {
        console.error('Error fetching Thredds data:', error.message);
        setTimeout(fetchData, 5000);
    }
};

fetchData();

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

//! not working when fetching all the cities info, why?
router.get('/data', async (req, res) => {
    console.log('Accessing /data');
    try {
        const allCityData = await Promise.all(Object.keys(cities).map(async (city) => {
            const cityData = await fetchDataForCity(city);
            return { city, cityData };
        }));
        res.json(allCityData);
    } catch (error) {
        console.error('Error fetching data for all cities:', error.message);
        res.status(500).json({ error: 'Failed to fetch data for all cities' });
    }
});

router.get('/data/:city', async (req, res) => {
    const { city } = req.params;
    console.log(`Accessing /data/${city}`);
    try {
        const data = await fetchDataForCity(city);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching data for ${city}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

router.get('/data/:city/:variable', async (req, res) => {
    const { city, variable } = req.params;
    console.log(`Accessing /data/${city}/${variable}`);
    try {
        const data = await fetchDataForCity(city, variable);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching ${variable} data for ${city}:`, error.message);
        res.status(500).json({ error: `Failed to fetch ${variable} data` });
    }
});

// route to get temperature for all cities
router.get('/temperature', async (req, res) => {
    console.log('Accessing /temperature');
    try {
        const allCityData = await Promise.all(Object.keys(cities).map(async (city) => {
            const cityData = await fetchDataForCity(city, 'T_2m');
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