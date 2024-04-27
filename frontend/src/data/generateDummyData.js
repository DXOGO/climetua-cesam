const fs = require('fs');
const moment = require('moment');

const startOfWeek = moment().startOf('week');

const dummyData = {
    "cities": [
        {
            "id": "aveiro",
            "name": "Aveiro",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 40.6346106,
            "lon": -8.6573321,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "beja",
            "name": "Beja",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 38.015881,
            "lon": -7.863937,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "braga",
            "name": "Braga",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 41.545448,
            "lon": -8.426507,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "braganca",
            "name": "Bragança",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 41.8084,
            "lon": -6.7575,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "castelo_branco",
            "name": "Castelo Branco",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 39.822191,
            "lon": -7.490870,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "coimbra",
            "name": "Coimbra",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 40.203314,
            "lon": -8.410257,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "evora",
            "name": "Évora",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 38.571,
            "lon": -7.909,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "faro",
            "name": "Faro",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 37.0194,
            "lon": -7.9322,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "guarda",
            "name": "Guarda",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 40.5371,
            "lon": -7.2676,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "leiria",
            "name": "Leiria",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 39.7436,
            "lon": -8.80705,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "lisboa",
            "name": "Lisboa",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 38.7167,
            "lon": -9.1333,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "portalegre",
            "name": "Portalegre",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 39.2976,
            "lon": -7.4304,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "porto",
            "name": "Porto",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 41.1496,
            "lon": -8.6109,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "santarem",
            "name": "Santarém",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 39.2333,
            "lon": -8.6833,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "setubal",
            "name": "Setúbal",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 38.5244,
            "lon": -8.8931,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "viana",
            "name": "Viana do Castelo",
            "waves": Math.floor(Math.random() * 3) + 1,
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 41.6938,
            "lon": -8.8328,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "vila_real",
            "name": "Vila Real",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 41.300,
            "lon": -7.733,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "viseu",
            "name": "Viseu",
            "iqa": Math.floor(Math.random() * 5) + 1,
            "lat": 40.6566,
            "lon": -7.9124,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "angra",
            "name": "Angra do Heroísmo",
            "waves": Math.floor(Math.random() * 3) + 1,
            "lat": 38.6500,
            "lon": -27.2167,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "ponta_delgada",
            "name": "Ponta Delgada",
            "waves": Math.floor(Math.random() * 3) + 1,
            "lat": 37.7333,
            "lon": -25.6667,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "st_cruz",
            "name": "St. Cruz das Flores",
            "waves": Math.floor(Math.random() * 3) + 1,
            "lat": 39.4667,
            "lon": -31.1333,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "funchal",
            "name": "Funchal",
            "waves": Math.floor(Math.random() * 3) + 1,
            "lat": 32.6333,
            "lon": -16.9000,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        },
        {
            "id": "porto_santo",
            "name": "Porto Santo",
            "waves": Math.floor(Math.random() * 3) + 1,
            "lat": 33.0667,
            "lon": -16.3333,
            // for the map
            "temperature": generateTemperature(),
            // for the info component
            "atmosphericDataCurrent": generateAtmosphericDataCurrent(),
            // for the weather component
            "atmosphericDataHourly": generateHourlyData(),
            // for the chart component
            "weatherWeekly": {}
        }
    ]
}

function generateTemperature() {
    const current = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    const min = Math.floor(Math.random() * (current - 2 - 2 + 1)) + 2;
    const max = Math.floor(Math.random() * (current + 2 - current + 1)) + current;
    return { current, min, max };
}

const startDate = new Date('2021-07-08T00:00:00.000Z');
const endDate = new Date('2021-07-15T12:00:00.000Z');

for (let j = 0; j < dummyData.cities.length; j++) {
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setHours(currentDate.getHours() + 1)) {
        const dateKey = currentDate.toISOString().slice(0, 10).split('-').reverse().join('/');
        const hour = currentDate.getUTCHours().toString().padStart(2, '0');

        // Initialize weatherWeekly object if not exists
        if (!dummyData.cities[j].weatherWeekly[dateKey]) {
            dummyData.cities[j].weatherWeekly[dateKey] = {};
        }

        // Generate weather data for each hour
        dummyData.cities[j].weatherWeekly[dateKey][hour] = {
            temperature: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
            precipitation: Math.random(),
            wind: {
                speed: Math.floor(Math.random() * (30 - 5 + 1)) + 5,
                direction: Math.random() * 360
            },
            pressure: Math.floor(Math.random() * (1020 - 980 + 1)) + 980,
            humidity: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
            clouds: Math.random()
        };
    }
}


function generateAtmosphericDataCurrent() {
    return {
        "precipitation": Math.random(),
        "wind": {
            "speed": Math.floor(Math.random() * (30 - 5 + 1)) + 5,
            "direction": Math.random() * 360
        },
        "pressure": Math.floor(Math.random() * (1020 - 980 + 1)) + 980,
        "humidity": Math.floor(Math.random() * (100 - 50 + 1)) + 50,
        "clouds": Math.random()
    };
}

function generateHourlyData() {
    const hourlyData = {};
    for (let hour = 0; hour < 24; hour += 1) {
        hourlyData[hour.toString().padStart(2, '0')] = {
            "temperature": Math.floor(Math.random() * (30 - 10 + 1)) + 10,
            "precipitation": Math.random(),
            "wind": {
                "speed": Math.floor(Math.random() * (30 - 5 + 1)) + 5,
                "direction": Math.random() * 360
            },
            "pressure": Math.floor(Math.random() * (1020 - 980 + 1)) + 980,
            "humidity": Math.floor(Math.random() * (100 - 50 + 1)) + 50,
            "clouds": Math.random()
        };
    }
    return hourlyData;
}


const jsonData = JSON.stringify(dummyData, null, 2);

fs.writeFileSync('dummyData.json', jsonData);