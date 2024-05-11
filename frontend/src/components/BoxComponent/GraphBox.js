import './GraphBox.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Toggle from '../ToggleComponent/Toggle';

import { LuCalendar } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import WeatherChartHighchart from '../WeatherChart/WeatherChartHighchart';
// import WeatherChartRechart from '../WeatherChart/WeatherChartRechart';
// import WeatherChartMeteogram from '../WeatherChart/WeatherChartMeteogram'


const GraphBox = ({ loading }) => {

    const isExpanded = useSelector(state => state.isExpanded);
    const [levelExpanded, setLevelExpanded] = useState([true, true]);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            const entry = entries[0];
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount and unmount

    useEffect(() => {
        if (dimensions.width > 800) {
            containerRef.current.classList.add('large-width');
        } else {
            containerRef.current.classList.remove('large-width');
        }

        if (dimensions.height > 600) {
            containerRef.current.classList.add('large-height');
        } else {
            containerRef.current.classList.remove('large-height');
        }
    }, [dimensions]); // Run this effect whenever dimensions change

    const levels = [
        [
            { name: "temperature", label: "Temperatura" },
            { name: "humidity", label: "Humidade rel." },
            { name: "wind_speed", label: "Velocidade do vento" },
            { name: "pressure", label: "Pressão" },
            { name: "precipitation", label: "Precipitação" },
            { name: "fog", label: "Nevoeiro" },
            { name: "clouds", label: "Nuvens" },
            { name: "snow", label: "Neve" },
            { name: "convectivePrecipitation", label: "Prec. convectiva" },
            { name: "nonConvectivePrecipitation", label: "Prec. não convectiva" },
            { name: "gust", label: "Rajada" },
            { name: "highClouds", label: "Nuvens altas" },
            { name: "mediumClouds", label: "Nuvens médias" },
            { name: "lowClouds", label: "Nuvens baixas" },
            { name: "solarRadiation", label: "Radiação solar" },
            { name: "snowHeight", label: "Altura da neve" },
            { name: "stormIndex", label: "Índ. de tempestade" }
        ],
        [
            { name: "O3", label: "O3" },
            { name: "NO2", label: "NO2" },
            { name: "PM2.5", label: "PM2,5" },
            { name: "PM10", label: "PM10" }
        ]
    ];

    const toggleLevel = index => {
        setLevelExpanded(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className="graph-box-container" ref={containerRef}>
            {/* Warning message */}
            <div className={isExpanded ? 'toggle-box-container-expanded' : 'toggle-box-container-collapsed'}>
                {levels.map((level, index) => (
                    <div key={index} className="toggle-level">
                        <div className="level-title">
                            <div className='level-text' onClick={() => toggleLevel(index)}>
                                {
                                    index === 0 ? (
                                        <p>Variáveis meteorológicas</p>
                                    ) : (
                                        <p>Concentração de poluentes atmosféricos</p>
                                    )
                                }
                                {levelExpanded[index] ? (
                                    <MdKeyboardArrowUp className="level-arrow" />
                                ) : (
                                    <MdKeyboardArrowDown className="level-arrow" />
                                )}
                            </div>
                        </div>
                        {levelExpanded[index] && (
                            <div className={`toggle-content-${index}`}>
                                {level.map((item, itemIndex) => (
                                    <Toggle key={itemIndex} label={item.label} name={item.name} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chart-container">
                <div className="chart-box-text">
                    <LuCalendar />
                    <p style={{ paddingLeft: 5 }}>Previsão semanal</p>
                </div>
                {loading && (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <div className="loading-icon" />
                    </div>
                )
                }
                <WeatherChartHighchart />
            </div>
        </div>
    );
};

export default GraphBox;