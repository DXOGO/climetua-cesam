import './WeatherBox.css';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import { TbClockHour4 } from "react-icons/tb";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

import HourlyForecastComponent from '../HourlyForecastComponent/HourlyForecastComponent';

const WeatherBox = () => {
    const isExpanded = useSelector(state => state.isExpanded);
    const city = useSelector(state => state.selectedCity);
    const cityDailyData = city.cityDailyData;

    const temperature = cityDailyData.map(item => item.T_2m); // Temperature
    const windSpeed = cityDailyData.map(item => item.ws_10m); // Wind speed
    const windDirection = cityDailyData.map(item => item.wd_10m); // Wind direction
    const humidity = cityDailyData.map(item => item.rh_2m); // Humidity
    const precip_total = cityDailyData.map(item => item.precip_total); // Total Precipitation
    const pressure = cityDailyData.map(item => item.slp); // Pressure
    const clouds = cityDailyData.map(item => item.cldfrac); // Clouds

    const wind = {
        speed: windSpeed,
        direction: windDirection
    };

    const hourlyArray = Array.from({ length: 24 }, (_, i) => i);
    const [viewType, setViewType] = useState('3hourly');
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // Initially set to false
    const forecastContentRef = useRef(null);

    const handleViewTypeChange = (type) => {
        setViewType(type);
    };

    const adjustedHourlyArray = viewType === '3hourly'
        ? hourlyArray.filter((hour, index) => index % 3 === 0)
        : hourlyArray;

    const scrollLeft = () => {
        if (forecastContentRef.current) {
            forecastContentRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (forecastContentRef.current) {
            forecastContentRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (forecastContentRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = forecastContentRef.current;
            const isScrollable = scrollWidth > clientWidth;

            if (isScrollable) {
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
            }
        }
    };

    useEffect(() => {
        const forecastContentElement = forecastContentRef.current;
        if (forecastContentElement) {
            forecastContentElement.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check

            return () => {
                forecastContentElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return (
        <div className="weather-box-container">
            <div className='forecast-box'>
                <div className='forecast-box-text'>
                    <TbClockHour4 style={{ fontSize: 16 }} />
                    <p style={{ paddingLeft: 5 }}>Previsão diária</p>
                </div>
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
                <div className={`forecast-content-${isExpanded ? "expanded" : "collapsed"}`} ref={forecastContentRef}>
                    {adjustedHourlyArray.map((hour, index) => (
                        <HourlyForecastComponent
                            key={index}
                            hour={hour}
                            data={{ temperature, humidity, wind, precip_total, pressure, clouds }}
                        />
                    ))}
                </div>
                {isExpanded && viewType === 'hourly' && (
                    <div className="scroll-arrows">
                        {canScrollLeft ? (
                            <button className="scroll-arrow-left" onClick={scrollLeft}>
                                <MdOutlineArrowBackIos />
                            </button>
                        ) : (
                            <div className="scroll-arrow-placeholder" />
                        )}
                        {canScrollRight ? (
                            <button className="scroll-arrow-right" onClick={scrollRight}>
                                <MdOutlineArrowForwardIos />
                            </button>
                        ) : (
                            <div className="scroll-arrow-placeholder" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherBox;
