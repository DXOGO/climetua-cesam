import React, { useState, useEffect } from 'react';
import WeatherIcon from '../../components/WeatherIcon/WeatherIcon';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import Searchbar from '../../components/Searchbar/Searchbar';
import {
    setWeatherIcon,
    findCityByName,
} from '../../helpers/helpers';

import { MdOutlineInfo } from "react-icons/md";
import IQAModal from '../../components/Modal/IQAModal';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCity, fetchTemperatureDataSuccess, updateDate } from '../../redux/actions';

import './WeatherInfo.css';

import dummyData from '../../data/dummyData.json';
import portugal from '../../assets/pt.svg';

const WeatherInfo = () => {
    const { cities } = dummyData;

    const dispatch = useDispatch();
    // const [now, setNow] = useState(new Date('2021-07-08T15:00:00.000Z'));
    const now = useSelector((state) => state.currentDate);
    const nowDate = new Date(now);

    const selectedCity = useSelector((state) => state.selectedCity);
    const isExpanded = useSelector((state) => state.isExpanded);
    const temperatureData = useSelector((state) => state.temperatureData);
    const [boxState, setBoxState] = useState(selectedCity ? 'info' : 'default');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getFormattedDate = (date) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        };
        return date.toLocaleString('pt-PT', options);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nowDate.setSeconds(nowDate.getSeconds() + 1);
            dispatch(updateDate(nowDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const fetchTemperatureData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/temperature');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                dispatch(fetchTemperatureDataSuccess(data));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setIsLoading(false);
            }
        };

        if (temperatureData.length === 0) {
            fetchTemperatureData();
        }
        setIsLoading(false);
    }, [dispatch, cities]);

    const handleCityClick = (cityName) => {
        setBoxState('info');
        const selectedCityData = findCityByName(cityName);
        const selectedIcon = setWeatherIcon(
            selectedCityData.atmosphericDataCurrent.precipitation,
            selectedCityData.atmosphericDataCurrent.clouds,
            selectedCityData.atmosphericDataCurrent.humidity,
            nowDate
        );
        dispatch(
            setSelectedCity({
                ...selectedCityData,
                icon: selectedIcon.icon,
                alt: selectedIcon.alt,
            })
        );
    };

    const handleMouseEnter = () => {
        setShowModal(true);
    };

    const handleMouseLeave = () => {
        setShowModal(false);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-icon" />
            </div>
        );
    }

    return (
        <div className='weather-info-container'>
            <div className='weather-info-column'>
                <Searchbar cities={cities} handleCityClick={handleCityClick} />
                <BoxComponent state={boxState} />
            </div>
            <div className='weather-info-column-map'>
                {!isExpanded ? (
                    <div className='weather-info-text'>
                        <div
                            className='weather-info-text-content'
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            Índice de Qualidade do Ar
                            <MdOutlineInfo className='iqa-info-icon' />
                        </div>
                    </div>
                ) : (
                    <div className='weather-info-text' />
                )}
                <div className='weather-info-map'>
                    <img src={portugal} alt='portugal' className='map-image' />
                    <div className='weather-icon-container'>
                        {cities.map((city, index) => {
                            const ncity = temperatureData.find((temperatureData) => temperatureData.city === city.id) || { cityData: [] };
                            const cityTemperature = ncity.cityData.map(({ T_2m }) => T_2m);
                            return (
                                <WeatherIcon
                                    key={index}
                                    city_name={city.name}
                                    onClick={() => handleCityClick(city.name)}
                                    className={`weather city-icon-${index}`}
                                    date={nowDate}
                                    temperatureData={cityTemperature.slice(0, 23)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="today-date">{getFormattedDate(nowDate)}</div>
            </div>
            {showModal && <IQAModal />}
        </div>
    );
};

export default WeatherInfo;
