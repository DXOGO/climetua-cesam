import React, { useState, useEffect } from 'react';
import WeatherIcon from '../../components/WeatherIcon/WeatherIcon';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import Searchbar from '../../components/Searchbar/Searchbar';

import { findCityByName } from '../../helpers/helpers';

import { AiOutlineQuestionCircle } from "react-icons/ai";
import IQAModal from '../../components/Modal/IQAModal';
import ErrorModal from '../../components/Modal/ErrorModal';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCity, fetchDailyDataSuccess, updateDate } from '../../redux/actions';

import './WeatherInfo.css';

import dummyData from '../../data/dummyData.json';
import portugal from '../../assets/pt.svg';

const WeatherInfo = () => {
    const { cities } = dummyData;

    const dispatch = useDispatch();
    const now = useSelector((state) => state.currentDate);
    const initialDate = new Date(now);

    const selectedCity = useSelector((state) => state.selectedCity);

    const isExpanded = useSelector((state) => state.isExpanded);
    const dailyData = useSelector((state) => state.dailyData);
    const [boxState, setBoxState] = useState(selectedCity ? 'info' : 'default');
    const [showIqaModal, setShowIqaModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [closestCityName, setClosestCityName] = useState(null);

    // * Ask user for location permissions
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('User location:', position.coords.latitude, position.coords.longitude);
                    const closestCity = cities.reduce((prev, curr) =>
                        Math.abs(curr.lat - position.coords.latitude) < Math.abs(prev.lat - position.coords.latitude) &&
                            Math.abs(curr.lon - position.coords.longitude) < Math.abs(prev.lon - position.coords.longitude) ? curr : prev
                    );
                    setClosestCityName(closestCity.name);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser');
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        const fetchDailyData = async () => {
            console.log('Fetching daily data');
            try {
                const response = await fetch('http://localhost:3001/api/daily');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                dispatch(fetchDailyDataSuccess(data));
                setIsLoading(false);
                console.log('Daily data fetched successfully');
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setIsLoading(false);
            }
        };

        if (dailyData.length === 0) {
            fetchDailyData();
        } else {
            setIsLoading(false);
        }
    }, [dispatch, dailyData]);

    useEffect(() => {
        if (!isLoading) {
            const intervalId = setInterval(() => {
                setCurrentDate(prevDate => {
                    const newDate = new Date(prevDate.getTime() + 1000);
                    dispatch(updateDate(newDate));
                    return newDate;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [dispatch, isLoading]);

    useEffect(() => {
        if (closestCityName && dailyData.length > 0) {
            handleCityClick(closestCityName);
        }
    }, [closestCityName, dailyData]);

    const handleCityClick = (cityName) => {
        const city = findCityByName(cityName);
        if (city && city !== selectedCity) {
            const cityDailyData = dailyData
                .filter((data) => data.city === city.id)
                .flatMap((item) => item.cityData);

            if (cityDailyData.length > 0) {
                city.cityDailyData = cityDailyData;
                dispatch(setSelectedCity(city));
                setBoxState('info');
            }
        }
    };

    const handleMouseEnter = () => { setShowIqaModal(true); };
    const handleMouseLeave = () => { setShowIqaModal(false); };

    const handleReload = () => { window.location.reload(); };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-icon" />
            </div>
        );
    }

    if (dailyData.length === 0) {
        return <ErrorModal onClose={handleReload} />;
    }

    return (
        <div className='weather-info-container'>
            <div className='weather-info-column'>
                <Searchbar cities={cities} handleCityClick={handleCityClick} />
                <BoxComponent state={boxState} />
            </div>
            <div className='weather-info-column-map'>
                {!isExpanded ? (
                    <>
                        <div className='weather-info-text'>
                            Índice de Qualidade do Ar
                            <div
                                className='weather-info-text-content'
                                onClick={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <AiOutlineQuestionCircle className='iqa-info-icon' />
                            </div>
                        </div>
                        <div className='weather-info-map'>
                            <img src={portugal} alt='portugal' className='map-image' />
                            <div className='weather-icon-container'>
                                {dailyData.length > 0 && !isLoading &&
                                    cities.map((city, index) => {
                                        const cityDailyData = dailyData
                                            .filter((data) => data.city === city.id)
                                            .flatMap((item) => item.cityData);
                                        if (cityDailyData.length > 0) {
                                            return (
                                                <WeatherIcon
                                                    key={index}
                                                    city_name={city.name}
                                                    onClick={() => handleCityClick(city.name)}
                                                    className={`weather city-icon-${index}`}
                                                    date={initialDate}
                                                    dailyData={cityDailyData} />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })
                                } 
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            marginTop: '677px',
                        }}
                    />
                )}
            </div>
            {showIqaModal && <IQAModal />}
        </div>
    );
};

export default WeatherInfo;
