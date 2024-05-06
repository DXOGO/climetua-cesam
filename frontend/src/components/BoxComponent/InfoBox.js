import "./InfoBox.css"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveButton } from "../../redux/actions";
import { fetchDataSuccess } from '../../redux/actions';

import styled, { css } from 'styled-components';
import WeatherBox from './WeatherBox';
import GraphBox from './GraphBox';

import { FaTable } from "react-icons/fa";
import { BiStats } from "react-icons/bi";

import AtmosphericDataIcon from "../AtmosphericDataIcon/AtmosphericDataIcon";

const InfoBox = () => {

    const dispatch = useDispatch();
    const activeButton = useSelector(state => state.activeButton);
    const city = useSelector(state => state.selectedCity);
    const isExpanded = useSelector(state => state.isExpanded);
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect (() => {
        console.log(isLoading);
    }, [isLoading]);

    const handleButtonClick = (buttonName) => {
        dispatch(setActiveButton(buttonName)); // Dispatch the action
    };

    const nowString = useSelector((state) => state.currentDate);
    const now = new Date(nowString);
    now.setMinutes(0)
    now.setSeconds(0)
    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentWind, setCurrentWind] = useState({ speed: 0, direction: 0 });
    const [currentHumidity, setCurrentHumidity] = useState(0);

    useEffect(() => {
        const fetchDataForCity = async () => {
            console.log('Fetching data for city: ', city.name);
            try {
                const response = await fetch(`http://localhost:3001/api/data/${city.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                dispatch(fetchDataSuccess(data));
    
                const currentData = data.find(item => new Date(item.time).getTime() === now.getTime());
                const currentTemperature = currentData.T_2m;
                const currentWind = { speed: currentData.ws_10m, direction: currentData.wd_10m };
                const currentHumidity = currentData.rh_2m;
                
                setCurrentTemperature(currentTemperature);
                setCurrentWind(currentWind);
                setCurrentHumidity(currentHumidity);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            }
        }
        setIsLoading(true);
        fetchDataForCity();
    }, [dispatch, city]);

    const renderState = activeButton === "graph" ? <GraphBox /> : <WeatherBox />;

    const currentData = ["precipitation", "humidity", "wind", "iqa"];

    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            
            }}>
                <div className="loading-icon" />
            </div>
        );
    }

    return (
        <div className={`info-box ${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
            <div className="info-header">
                <p className="box-text">{city.name}</p>
            </div>
            <div className={`info-content ${activeButton}`}>
                <div className={`info-row ${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
                    <div className={`info-icon ${isExpanded ? "expanded" : "collapsed"}`}>
                        <img src={city.icon} alt={city.alt} className="info-weather-icon" />
                    </div>
                    <div className={`temperature ${isExpanded ? "expanded" : "collapsed"}`}>
                        <span className="temperature-text">{parseFloat(currentTemperature).toFixed(0)}</span>
                        <span className="temperature-unit">°C</span>
                    </div>
                    {isExpanded ? (
                        <div className="expanded-atmospheric-data">
                            <div className="row">
                                <AtmosphericDataIcon type_data={currentData[0]} />
                                <AtmosphericDataIcon type_data={currentData[1]} humidity={currentHumidity} wind={currentWind} />
                                <AtmosphericDataIcon type_data={currentData[2]} humidity={currentHumidity} wind={currentWind} />
                                <AtmosphericDataIcon type_data={currentData[3]} />
                            </div>
                        </div>
                    ) : (
                        <div className="collapsed-atmospheric-data">
                            <div className="column">
                                <AtmosphericDataIcon type_data={currentData[0]} />
                                <AtmosphericDataIcon type_data={currentData[1]} humidity={currentHumidity} wind={currentWind} />
                            </div>
                            <div className="column">
                                <AtmosphericDataIcon type_data={currentData[2]} wind={currentWind} />
                                <AtmosphericDataIcon type_data={currentData[3]} />
                            </div>
                        </div>
                    )}
                </div>
                <div className={`info-buttons-${activeButton} ${isExpanded ? "expanded" : "collapsed"}`}>
                    <Button active={activeButton === "table"} onClick={() => handleButtonClick("table")}>
                        Tabela <FaTable style={{ marginLeft: "8px", transform: "scale(1.2)" }} />
                    </Button>
                    <Button active={activeButton === "graph"} onClick={() => handleButtonClick("graph")}>
                        Gráfico <BiStats style={{ marginLeft: "8px", transform: "scale(1.6)" }} />
                    </Button>
                </div>
                {renderState}
            </div>
        </div>
    );
}

export default InfoBox;

const Button = styled.button`
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    padding: 6px 14px;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-color: #68727D;
    color: #68727D;
    
    ${props =>
        props.active &&
        css`
            background-color: #0A77FF;
            border-color: transparent;
            color: #ffffff;
        `
    }
`;
