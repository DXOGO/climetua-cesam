import "./InfoBox.css"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveButton } from "../../redux/actions";
import { fetchDataSuccess } from '../../redux/actions';

import WeatherBox from './WeatherBox';
import GraphBox from './GraphBox';

import { FaTable } from "react-icons/fa";
import { BiStats } from "react-icons/bi";

import AtmosphericDataIcon from "../AtmosphericDataIcon/AtmosphericDataIcon";

import { getTotalPrecipitation } from "../../helpers/helpers";

const InfoBox = () => {

    const dispatch = useDispatch();
    const activeButton = useSelector(state => state.activeButton);
    const city = useSelector(state => state.selectedCity);
    const isExpanded = useSelector(state => state.isExpanded);

    const [isLoading, setIsLoading] = useState(true);

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
    const [currentPrecipitation, setCurrentPrecipitation] = useState(0);

    useEffect(() => {
        const fetchDataForCity = async () => {
            console.log('Fetching data for city: ', city.name);
            try {
                const response = await fetch(`http://localhost:3001/api/data/${city.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const precip_c = data.map(item => item.precip_c);

                // get data individually instead of accumulated
                const precip_c_total = precip_c.map((item, index) => {
                    if (index === 0) {
                        return item;
                    }
                    return item - precip_c[index - 1];
                });
                
                // get data individually instead of accumulated
                const precip_g = data.map(item => item.precip_g);
                const precip_g_total = precip_g.map((item, index) => {
                    if (index === 0) {
                        return item;
                    }
                    return item - precip_c[index - 1];
                });

                const total_precip = getTotalPrecipitation(precip_g_total, precip_c_total);

                data.forEach((item, index) => {
                    item.precip_g = precip_g_total[index];
                    item.precip_c = precip_c_total[index];
                    item.precip_total = total_precip[index];
                });
                dispatch(fetchDataSuccess(data));

                const currentData = data.find(item => new Date(item.time).getTime() === now.getTime());
                const currentTemperature = currentData.T_2m;
                const currentWind = { speed: currentData.ws_10m, direction: currentData.wd_10m };
                const currentHumidity = currentData.rh_2m;

                setCurrentTemperature(currentTemperature);
                setCurrentWind(currentWind);
                setCurrentHumidity(currentHumidity);
                setCurrentPrecipitation(currentPrecipitation);
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
                                <AtmosphericDataIcon type_data={currentData[0]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                                <AtmosphericDataIcon type_data={currentData[1]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                                <AtmosphericDataIcon type_data={currentData[2]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                                <AtmosphericDataIcon type_data={currentData[3]} />
                            </div>
                        </div>
                    ) : (
                        <div className="collapsed-atmospheric-data">
                            <div className="column">
                                <AtmosphericDataIcon type_data={currentData[0]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                                <AtmosphericDataIcon type_data={currentData[1]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                            </div>
                            <div className="column">
                                <AtmosphericDataIcon type_data={currentData[2]} humidity={currentHumidity} wind={currentWind} precipitation={currentPrecipitation}/>
                                <AtmosphericDataIcon type_data={currentData[3]} />
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