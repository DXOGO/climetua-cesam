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

export const setWeatherIcon = (precipitation, clouds, humidity, hours) => {
    const currentTime = typeof hours === 'number' ? hours : new Date(hours).getHours();

    const isNight = currentTime < 6 || currentTime > 20;

    const dayIcons = [
        { condition: clouds <= 0.20 && precipitation < 0.5, icon: sun_icon, alt: "sun" },
        { condition: clouds > 0.20 && clouds < 0.80 && precipitation < 0.5, icon: clouds_sun, alt: "clouds_sun" },
        { condition: precipitation >= 0.5 && humidity > 80, icon: rain_thunder, alt: "rain_thunder" },
        { condition: precipitation >= 0.2, icon: rain_icon, alt: "rain" },
        { condition: clouds >= 0.80, icon: clouds_icon, alt: "clouds" },
        { condition: precipitation < 0.5 && precipitation >= 0.2 && humidity > 80, icon: thunder, alt: "thunder" },
    ];

    const nightIcons = [
        { condition: clouds <= 0.20 && precipitation < 0.5, icon: night_icon, alt: "night" },
        { condition: clouds > 0.20 && clouds < 0.80 && precipitation < 0.5, icon: night_clouds, alt: "night_clouds" },
        { condition: precipitation >= 0.5 && humidity > 80, icon: rain_thunder, alt: "rain_thunder" },
        { condition: precipitation >= 0.2, icon: rain_icon, alt: "rain" },
        { condition: true, icon: clouds_icon, alt: "clouds" },  // Default for night
    ];

    const icons = isNight ? nightIcons : dayIcons;

    for (const { condition, icon, alt } of icons) {
        if (condition) {
            return { icon, alt };
        }
    }

    // Default case, though logically all cases should be covered.
    return { icon: clouds_icon, alt: "clouds" };
};