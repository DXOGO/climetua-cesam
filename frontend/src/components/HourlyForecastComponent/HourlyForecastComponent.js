import React from "react";
import { useSelector } from 'react-redux';
import './HourlyForecastComponent.css';

import AtmosphericDataIcon from "../AtmosphericDataIcon/AtmosphericDataIcon";
import { setWeatherIcon } from "../../helpers/helpers";

const HourlyForecastComponent = ({ hour }) => {

    const city = useSelector(state => state.selectedCity);
    const isExpanded = useSelector(state => state.isExpanded);

    const variableData = useSelector(state => state.variableData);

    const todayData = variableData.slice(0, 24);

    const temperature = todayData.map(item => item.T_2m);
    const windSpeed = todayData.map(item => item.ws_10m);
    const windDirection = todayData.map(item => item.wd_10m);
    const humidity = todayData.map(item => item.rh_2m);

    const wind = {
        speed: windSpeed,
        direction: windDirection
    };

    function speedIndex(index) {
        const speed = wind.speed[index];
        const direction = wind.direction[index];
        return { speed, direction };
    }
    
    const hourIcon = setWeatherIcon(city.atmosphericDataHourly[hour].precipitation, city.atmosphericDataHourly[hour].clouds, city.atmosphericDataHourly[hour].humidity, hour)

    return (
        isExpanded ? (
            <div className="hourly-forecast-box-content">
                <div className="hourly-forecast-container">
                    <div className="hourly-forecast-hour">
                        {/* {hour !== "24" ? hour + "h" : "00h"} */}
                        {hour + ":00"}
                    </div>
                    <div className="hourly-forecast-details">
                        <img src={hourIcon.icon} alt={hourIcon.alt} className="hourly-forecast-icon" />
                        <div className="forecast-temperature">
                            <span className="forecast-temperature-text">{Math.round(temperature[parseInt(hour)])}</span>
                            <span className="forecast-temperature-unit">°C</span>
                        </div>
                        <div className="forecast-column">
                            <div className="forecast-column-content">
                                <div className="forecast-column-data">
                                    <AtmosphericDataIcon type_data="precipitation" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                                </div>
                                <div className="forecast-column-data">
                                    <AtmosphericDataIcon type_data="wind" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                                </div>
                                <div className="forecast-column-data">
                                    <AtmosphericDataIcon type_data="humidity" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                                </div>
                                <div className="forecast-column-data">
                                    <AtmosphericDataIcon type_data="pressure" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="hourly-forecast-box-content-collapsed">
                <div className="hourly-forecast-container-collapsed">
                    <div className="hourly-forecast-hour-collapsed">
                        {/* {hour !== "24" ? hour + "h" : "00h"} */}
                        {hour + ":00"}
                    </div>
                    <div className="hourly-forecast-details-collapsed">
                        <img src={hourIcon.icon} alt={hourIcon.alt} className="hourly-forecast-icon-collapsed" />
                        {/* Temperature */}
                        <div className="forecast-temperature-collapsed">
                            <span className="forecast-temperature-text-collapsed">{Math.round(temperature[parseInt(hour)])}</span>
                            <span className="forecast-temperature-unit-collapsed">°C</span>
                        </div>
                        <div className="forecast-row-collapsed">
                            <div className="forecast-row-data-collapsed-precipitation">
                                <AtmosphericDataIcon type_data="precipitation" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                            </div>
                            <div className="forecast-row-data-collapsed-wind">
                                <AtmosphericDataIcon type_data="wind" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                            </div>
                            <div className="forecast-row-data-collapsed-humidity">
                                <AtmosphericDataIcon type_data="humidity" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                            </div>
                            <div className="forecast-row-data-collapsed-pressure">
                                <AtmosphericDataIcon type_data="pressure" humidity={humidity[parseInt(hour)]} wind={speedIndex(parseInt(hour))} hour={hour} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default HourlyForecastComponent;
