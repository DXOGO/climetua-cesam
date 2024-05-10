import dummyData from '../data/dummyData.json'

// get icons from assets folder
import sun_icon from '../assets/icons/sun.svg';
import clouds_icon from '../assets/icons/clouds.svg';
import rain_icon from '../assets/icons/rain.svg';
import night_icon from '../assets/icons/night.svg';
import clouds_sun from '../assets/icons/clouds_sun.svg';
import night_clouds from '../assets/icons/night_clouds.svg';
import snow_icon from '../assets/icons/snow.svg';
import thunder from '../assets/icons/thunder.svg';
import rain_thunder from '../assets/icons/rain_thunder.svg';

export const getIQA = (iqa) => {
    switch (iqa) {
        case 1:
            return { ellipseColor: "#48C246", text: "Muito bom" };
        case 2:
            return { ellipseColor: "#009245", text: "Bom" };
        case 3:
            return { ellipseColor: "#FFC700", text: "Médio" };
        case 4:
            return { ellipseColor: "#FF6A00", text: "Fraco" };
        case 5:
            return { ellipseColor: "#FF0000", text: "Mau" };
        default:
            return { ellipseColor: "#A1AAB5", text: "Sem dados" };
    }
}

export const findCityByName = (cityName) => {
    const { cities } = dummyData;
    return cities.find(city => city.name === cityName)
}


//! Possible function to be developed
//! Still not implmemented correctly because there isn't available data in the static json file

export const setWeatherIcon = (precipitation, clouds, humidity, hours) => {

    // console.log('precipitation: ', precipitation);
    // console.log('clouds: ', clouds);
    // console.log('humidity: ', humidity);

    let currentTime = "";

    if (hours === undefined) { currentTime = new Date().getHours();
    } else { currentTime = hours.getHours; }
    
    // Check if it's night or day
    const isNight = currentTime < 6 || currentTime > 20;


    // Logic to determine the most appropriate weather icon based on the provided data
    if (!isNight) {
        if (clouds < 0.2 && precipitation < 0.5 ) {
            return { icon: sun_icon, alt: "sun" }; // Sunny weather during the day
        } else if (clouds > 0.2 && clouds <= 0.5 && precipitation < 0.5) {
            return { icon: clouds_sun, alt: "clouds_sun" }; // Partly cloudy weather with sun during the day
        } else if (precipitation >= 0.5 && humidity > 80) {
            return { icon: rain_thunder, alt: "rain_thunder" }; // Rain with thunderstorms
        } else if (precipitation >= 0.2) {
            return { icon: rain_icon, alt: "rain" }; // Rainy weather
        } else if (precipitation === 'snow') { //* This condition is not implemented yet
            return { icon: snow_icon, alt: "snow" }; // Snowy weather
        } else if (clouds > 0.5) {
            return { icon: clouds_icon, alt: "clouds" }; // Cloudy weather
        } else if (precipitation < 0.5 && precipitation >= 0.1 && humidity > 80) {
            return { icon: thunder, alt: "thunder" }; // Thunderstorms during the day
        }
    } else {
        if (clouds < 0.2) {
        return { icon: night_icon, alt: "night" }; // Nighttime
        } else {
            return { icon: night_clouds, alt: "night_clouds" }; // Cloudy night
        }
    }
}

export const processHourlyData = (hourlyData) => {
    const dataArray = [];

    const sortedHours = Object.keys(hourlyData).sort((a, b) => parseInt(a) - parseInt(b));
    sortedHours.forEach((hourKey) => { dataArray.push({ hour: hourKey }); });

    return dataArray;
};