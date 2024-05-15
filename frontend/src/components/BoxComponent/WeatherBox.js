import './WeatherBox.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TbClockHour4 } from "react-icons/tb";

import HourlyForecastComponent from '../HourlyForecastComponent/HourlyForecastComponent';

import { processHourlyData } from "../../helpers/helpers";

const WeatherBox = () => {

    const isExpanded = useSelector(state => state.isExpanded);

    const city = useSelector(state => state.selectedCity);
    const dailyData = useSelector(state => state.dailyData);

    const cityDailyData = dailyData
        .filter((data) => data.city === city.id)
        .flatMap((item) => item.cityData);

    const temperature = cityDailyData.map(item => item.T_2m); // Temperature
    const windSpeed = cityDailyData.map(item => item.ws_10m); // Wind speed
    const windDirection = cityDailyData.map(item => item.wd_10m); // Wind direction
    const humidity = cityDailyData.map(item => item.rh_2m); // Humidity
    const precip_total = cityDailyData.map(item => item.precip_total); // Total Precipitation
    const pressure = cityDailyData.map(item => item.slp) // Pressure

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
                    <TbClockHour4 style={{ fontSize: 16 }} />
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
            <div className="forecast-content">
                <div className={`forecast-content-${isExpanded ? "expanded" : "collapsed"}`}>
                    {adjustedHourlyArray.map((hour, index) => (
                        <HourlyForecastComponent key={index} hour={hour.hour} temperature={temperature} humidity={humidity} wind={wind} precipitation={precip_total} pressure={pressure} />
                    ))}
                </div>
            </div>
        </div>
    );
}


export default WeatherBox;