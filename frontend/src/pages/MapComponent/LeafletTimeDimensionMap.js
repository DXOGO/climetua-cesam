import L from 'leaflet';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.css';
import 'leaflet-timedimension/dist/leaflet.timedimension.min.js';

import './LayersControl.css';
import 'leaflet/dist/leaflet.css';

import '../../extras/leaflet.timedimension.layer.wms.timeseries.js'
import '../../extras/leaflet.timedimension.circlelabelmarker.js'

import pt from './../../data/pt.json';
import europe from './../../data/europe.json';
import dummyData from '../../data/dummyData.json'


// Pedir ao CESAM info
const getInfo = (layer) => { // [0] - PALETTE, [1] - STYLES, [2] - COLORSCALERANGE
    switch (layer) {
        case 'T_2m':
            return ["default", "default", "0,40"]
        case 'Td_2m':
            return ["default", "default-scalar/default", "0,100"]
        case 'r_v_2m':
            return ["default", "raster/default", "0,20"]
        case "q_2m":
            return ["default", "default", "0,20"]
        case "rh_2m":
            return ["default", "default", "0,100"]
        case "ws_10m":
            return ["default", "default-scalar/default", "-10,10"]
        case "precip_g":
            return ["default", "default", "0,1"]
        case "precip_c":
            return ["default", "default", "0,1"]
        case "slp":
            return ["default", "default-scalar/default", "900,1100"]
        case "cldfrac":
            return ["default", "default", "0,100"]
        default:
            return ["default", "default", "-50,50"]
    }
}

const fetchWMSLayers = async () => {
    try {
        const response = await fetch("http://localhost:3001/api/wms");
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');

        const layers = Array.from(xml.querySelectorAll('Layer')).reduce((uniqueLayers, layer) => {
            const nameElement = layer.querySelector('Name');
            const titleElement = layer.querySelector('Title'); // sometimes wms response doesnt provide a title

            if (titleElement) {
                if (nameElement && titleElement && titleElement.textContent !== 'Terrain Height' && titleElement.textContent !== 'THREDDS' && titleElement.textContent !== 'wrfpost.nc') {
                    const code = nameElement.textContent;
                    const name = titleElement.textContent;

                    const isDuplicate = uniqueLayers.some(existingLayer => existingLayer.code === code);

                    if (!isDuplicate) {
                        uniqueLayers.push({ code, name });
                    }
                }
            } else {
                if (nameElement && nameElement.textContent !== "Z_sfc") {
                    const code = nameElement.textContent;

                    const isDuplicate = uniqueLayers.some(existingLayer => existingLayer.code === code);

                    if (!isDuplicate) {
                        uniqueLayers.push({ code });
                    }
                }
            }

            return uniqueLayers;
        }, []);

        return layers;

    } catch (error) {
        console.error('Error fetching WMS GetCapabilities:', error);
        alert('Failed to fetch WMS layers. Please reload or try again later.');
    }
};

const fetchTimeInterval = async () => {
    try {
        const response = await fetch("http://localhost:3001/api/time-dimensions");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching time dimensions:', error);
        alert('Failed to fetch time dimensions. Please reload or try again later.');
    }
};

const initializeMap = async () => {
    const { startTime, endTime } = await fetchTimeInterval();
    const layers = await fetchWMSLayers();
    const { cities } = dummyData;
    
    const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'CESAM',
    });

    const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'CESAM',
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'CESAM',
    });

    const map = L.map('map', {
        center: [40.6346106, -8.6573321],
        zoom: 5,
        minZoom: 4,
        zoomControl: false,
        doubleClickZoom: false,
        fullscreenControl: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
            position: 'bottomleft',
            timeSliderDragUpdate: true,
            maxSpeed: 3,
            minSpeed: 1,
            speedStep: 1,
            playerOptions: {
                transitionTime: 1000,
                loop: true,
            }
        },
        timeDimensionOptions: {
            timeInterval: startTime + "/" + endTime,
            period: 'PT1H',
            autoPlay: true,
            timeSliderDragUpdate: true,
            loopButton: true,
            currentTime: new Date(startTime).getTime(),
        },
        timeDimension: true,
        layers: baseLayer,
    });

    topoLayer.addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add your styling code here
    L.geoJSON(pt, {
        style: function (feature) {
            return {
                color: '#000000',
                weight: 1,
                opacity: 0.2,
                fillOpacity: 0,
            };
        }
    }).addTo(map);

    L.geoJSON(europe, {
        style: function (feature) {
            return {
                color: '#000000',
                weight: 1,
                opacity: 0.2,
                fillOpacity: 0,
            };
        }
    }).addTo(map);

    const baseLayers = {
        "Topo": topoLayer,
        "Satellite": satelliteLayer,
    };

    var layerControl = L.control.layers(
        baseLayers,
        null,
        {
            position: 'topleft',
            collapsed: true,
        },
    ).addTo(map);

    const legendControls = [];

    const markers = cities.map(city => {
        return {
            name: city.name,
            position: [city.lat, city.lon],
        };
    }
    );

    const baseUrl = 'http://localhost:80/thredds/wms/cesamAll/wrfpost.nc';

    layers.forEach(layer => {
        const wmsLayer = L.tileLayer.wms(baseUrl, {
            layers: layer.code,
            format: 'image/png',
            transparent: true,
            attribution: 'CESAM',
            styles: getInfo(layer.code)[1],
            colorscalerange: getInfo(layer.code)[2],
            belowmincolor: 'extend',
            abovemaxcolor: 'extend',
            uppercase: true,
        });

        const wmsLayerTime = L.timeDimension.layer.wms.timeseries(wmsLayer, {
            updateTimeDimension: true,
            name: layer.name,
            // markers: markers,
            // enableNewMarkers: true,
        });

        baseLayers[layer.name] = wmsLayerTime;

        const legendControl = L.control({ position: 'bottomright' });
        legendControl.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');

            const legendInfo = getInfo(layer.code);
            const palette = legendInfo[0];
            const styles = legendInfo[1];
            const colorscalerange = legendInfo[2];

            div.innerHTML += `<img src="http://localhost:80/thredds/wms/cesamAll/wrfpost.nc?REQUEST=GetLegendGraphic&LAYER=${layer.code}&PALETTE=${palette}&STYLES=${styles}&COLORSCALERANGE=${colorscalerange}" alt="legend" style="height: 250px;">`;
            return div;
        }
        legendControls.push(legendControl);

        layerControl.addBaseLayer(wmsLayerTime, layer.name);
    });

    map.on('baselayerchange', function (eventLayer) {
        if (eventLayer.name == 'Topo' || eventLayer.name === 'Satellite') {
            legendControls.forEach(control => control.remove());
            return;
        }
        const selectedLayerIndex = Object.keys(baseLayers).findIndex(key => key === eventLayer.name);
        legendControls.forEach(control => control.remove());

        if (selectedLayerIndex !== -1) {
            const selectedLegendControl = legendControls[selectedLayerIndex - 2];
            selectedLegendControl.addTo(map);
        }
    });
};

fetchWMSLayers();

export default initializeMap;
