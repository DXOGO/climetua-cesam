import "./InfoBox.css"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveButton } from "../../redux/actions";
import { fetchDataSuccess } from '../../redux/actions';

import {
    setWeatherIcon,
} from '../../helpers/helpers';

import WeatherBox from './WeatherBox';
import GraphBox from './GraphBox';

import { FaTable } from "react-icons/fa";
import { BiStats } from "react-icons/bi";

import AtmosphericDataIcon from "../AtmosphericDataIcon/AtmosphericDataIcon";

const InfoBox = () => {

    const dispatch = useDispatch();

    const activeButton = useSelector(state => state.activeButton);

    const city = useSelector(state => state.selectedCity);

    const dailyData = useSelector(state => state.dailyData);

    const cityDailyData = dailyData
        .filter((data) => data.city === city.id)
        .flatMap((item) => item.cityData);

    const isExpanded = useSelector(state => state.isExpanded);

    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = (buttonName) => {
        dispatch(setActiveButton(buttonName));
    };

    const nowString = useSelector((state) => state.currentDate);
    const now = new Date(nowString);
    now.setMinutes(0)
    now.setSeconds(0)

    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentWind, setCurrentWind] = useState({ speed: 0, direction: 0 });
    const [currentHumidity, setCurrentHumidity] = useState(0);
    const [currentPrecipitation, setCurrentPrecipitation] = useState(0);

    const currentData = cityDailyData.find(item => new Date(item.time).getTime() === new Date(now).getTime()) ? cityDailyData.find(item => new Date(item.time).getTime() === new Date(now).getTime()) : cityDailyData[0];

    useEffect(() => {
        setCurrentTemperature(currentData.T_2m);
        setCurrentWind({ speed: currentData.ws_10m, direction: currentData.wd_10m });
        setCurrentHumidity(currentData.rh_2m);
        setCurrentPrecipitation(currentData.precip_total);
    }, [currentData]);

    // Fetch city weather icon
    const weatherIcon = setWeatherIcon(currentPrecipitation, city.atmosphericDataCurrent.clouds, currentHumidity, now);

    useEffect(() => {
        const fetchDataForCity = async () => {
            console.log('Fetching data for city:', city.name);
            try {
                const response = await fetch(`http://localhost:3001/api/data/${city.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                dispatch(fetchDataSuccess(data));
                setIsLoading(false);
                console.log('Data fetched successfully',);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            }
        }
        setIsLoading(true);
        fetchDataForCity();
    }, [dispatch, city]);

    const renderState = activeButton === "graph" ? <GraphBox loading={isLoading} /> : <WeatherBox />;

    const variables = ["precipitation", "humidity", "wind", "iqa"];

    return (
        <div className={`info-box ${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
            <div className="info-header">
                <p className="box-text">{city.name}</p>
            </div>
            <div className={`info-content ${activeButton}`}>
                <div className={`info-row ${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
                    <div className={`info-icon ${isExpanded ? "expanded" : "collapsed"}`}>
                        <img src={weatherIcon.icon} alt={weatherIcon.alt} className="info-weather-icon" />
                    </div>
                    <div className={`temperature ${isExpanded ? "expanded" : "collapsed"}`}>
                        <span className="temperature-text">{parseFloat(currentTemperature).toFixed(0)}</span>
                        <span className="temperature-unit">°C</span>
                    </div>
                    {isExpanded ? (
                        <div className="expanded-atmospheric-data">
                            <div className="row">
                                <AtmosphericDataIcon type_data={variables[0]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                                <AtmosphericDataIcon type_data={variables[1]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                                <AtmosphericDataIcon type_data={variables[2]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                                <AtmosphericDataIcon type_data={variables[3]} />
                            </div>
                        </div>
                    ) : (
                        <div className="collapsed-atmospheric-data">
                            <div className="column">
                                <AtmosphericDataIcon type_data={variables[0]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                                <AtmosphericDataIcon type_data={variables[1]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                            </div>
                            <div className="column">
                                <AtmosphericDataIcon type_data={variables[2]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation} />
                                <AtmosphericDataIcon type_data={variables[3]} />
                            </div>
                        </div>
                    )}
                </div>
                <div className={`info-buttons-${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
                    <button className={activeButton === "table" ? "active" : ""} onClick={() => handleButtonClick("table")}>
                        Tabela <FaTable style={{ marginLeft: "8px", transform: "scale(1.2)" }} />
                    </button>
                    <button className={activeButton === "graph" ? "active" : ""} onClick={() => handleButtonClick("graph")}>
                        Gráfico <BiStats style={{ marginLeft: "8px", transform: "scale(1.6)" }} />
                    </button>
                </div>
                {renderState}
            </div>
        </div>
    );
}

export default InfoBox;