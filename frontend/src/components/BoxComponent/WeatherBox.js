import './WeatherBox.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TbClockHour4 } from "react-icons/tb";

import HourlyForecastComponent from '../HourlyForecastComponent/HourlyForecastComponent';

import { processHourlyData, getTotalPrecipitation } from "../../helpers/helpers";

const WeatherBox = () => {

    const city = useSelector(state => state.selectedCity);
    const isExpanded = useSelector(state => state.isExpanded);

    const variableData = useSelector(state => state.variableData);

    const todayData = variableData.slice(0, 24);

    const temperature = todayData.map(item => item.T_2m); // Temperature
    const windSpeed = todayData.map(item => item.ws_10m); // Wind speed
    const windDirection = todayData.map(item => item.wd_10m); // Wind direction
    const humidity = todayData.map(item => item.rh_2m); // Humidity
    const precip_g = todayData.map(item => item.precip_g); // Grid scale Precipitation (convenctiva)
    const precip_c = todayData.map(item => item.precip_c); // Cumulative Precipitation (não convectiva)
    const precip_total = getTotalPrecipitation(precip_g, precip_c); // Total Precipitation
    const pressure = todayData.map(item => item.slp) // Pressure

    const wind = {
        speed: windSpeed,
        direction: windDirection
    };

    const hourlyArray = processHourlyData(city.atmosphericDataHourly);
    const [viewType, setViewType] = useState('3hourly');

    const handleViewTypeChange = (type) => {
        setViewType(type);
    };
    const adjustedHourlyArray = viewType === '3hourly'
        ? hourlyArray.filter((hour, index) => index % 3 === 0)
        : hourlyArray;

    return (
        <div className="weather-box-container">
            <div className='forecast-box'>
                <div className='forecast-box-text'>
                    <TbClockHour4 />
                    <p style={{ paddingLeft: 5 }}>Previsão diária</p>
                </div>
                {/* Radio option buttons */}
                <div className="radio-options">
                    <label>
                        <input
                            type="radio"
                            value="hourly"
                            checked={viewType === 'hourly'}
                            onChange={() => handleViewTypeChange('hourly')}
                        />
                        1h
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="3hourly"
                            checked={viewType === '3hourly'}
                            onChange={() => handleViewTypeChange('3hourly')}
                        />
                        3h
                    </label>
                </div>
            </div>
            <div className={`forecast-content-${isExpanded ? "expanded" : "collapsed"}`}>
                {adjustedHourlyArray.map((hour, index) => (
                    <HourlyForecastComponent key={index} hour={hour.hour} temperature={temperature} humidity={humidity} wind={wind} precipitation={precip_total} pressure={pressure}/>
                ))}
            </div>
        </div>
    );
}


export default WeatherBox;