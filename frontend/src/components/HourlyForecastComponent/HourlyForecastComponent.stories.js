import React from "react";
import HourlyForecastComponent from "./HourlyForecastComponent";

export default {
    title: "HourlyForecastComponent",
    component: HourlyForecastComponent,
    };

const createHourlyForecastComponentStory = (hour, temperature, precipitation, humidity, pressure) => () => (
    <HourlyForecastComponent
        hour={hour}
        temperature={temperature}
        precipitation={precipitation}
        humidity={humidity}
        pressure={pressure}
    />
);

export const HourlyForecastComponentStory1 = createHourlyForecastComponentStory("12:00", "28", "sun");