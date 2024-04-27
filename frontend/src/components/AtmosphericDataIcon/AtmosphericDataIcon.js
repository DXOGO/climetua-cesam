
import React from "react";

import { LuCloudRainWind } from "react-icons/lu";
import { LuWind } from "react-icons/lu";
import { PiWavesBold } from "react-icons/pi";
import humidity_icon from "../../assets/icons/humidity-icon.svg";
import humidity_small from "../../assets/icons/humidity-icon-small.svg";
import { WiWindDeg } from "react-icons/wi";

import { getIQA } from "../../helpers/helpers";
import { useSelector } from "react-redux";

import './AtmosphericDataIcon.css';


const AtmosphericDataIcon = ({ type_data, humidity, wind, hour }) => {

    let icon;
    let title;
    let value;

    const city = useSelector(state => state.selectedCity);
    const iqa = getIQA(city.iqa);

    // const variableData = useSelector((state) => state.variableData);
    // const cityData = variableData[city.id];

    const prop = hour === undefined ? city.atmosphericDataCurrent : city.atmosphericDataHourly[hour];

    // Function that, based on the wind direction, returns the corresponding icon
    const getWindDirectionIcon = (direction) => {
        if (direction >= 337.5 || direction < 22.5) {
            return <WiWindDeg />;
        } else if (direction >= 22.5 && direction < 67.5) {
            return <WiWindDeg style={{ transform: "rotate(45deg)" }} />;
        } else if (direction >= 67.5 && direction < 112.5) {
            return <WiWindDeg style={{ transform: "rotate(90deg)" }} />;
        } else if (direction >= 112.5 && direction < 157.5) {
            return <WiWindDeg style={{ transform: "rotate(135deg)" }} />;
        } else if (direction >= 157.5 && direction < 202.5) {
            return <WiWindDeg style={{ transform: "rotate(180deg)" }} />;
        } else if (direction >= 202.5 && direction < 247.5) {
            return <WiWindDeg style={{ transform: "rotate(225deg)" }} />;
        } else if (direction >= 247.5 && direction < 292.5) {
            return <WiWindDeg style={{ transform: "rotate(270deg)" }} />;
        } else if (direction >= 292.5 && direction < 337.5) {
            return <WiWindDeg style={{ transform: "rotate(315deg)" }} />;
        }
    }

    switch (type_data) {
        case 'precipitation':
            icon = <LuCloudRainWind />;
            title = 'Precipitação';
            value = parseFloat(prop.precipitation).toFixed(1) + " mm";
            break;
        case 'pressure':
            icon = <PiWavesBold />;
            title = 'Pressão atmosférica';
            value = prop.pressure + " hPa";
            break;
        case 'wind':
            icon = <LuWind />;
            title = 'Velocidade do vento';
            value = parseFloat(wind.speed).toFixed(0) + " m/s";
            break;
        case 'humidity':
            if (hour !== undefined) {
                icon = humidity_small;
            } else {
                icon = humidity_icon;
            }
            title = 'Humidade relativa';
            value = parseFloat(humidity).toFixed(0) + " %";
            break;
        case 'iqa':
            icon =
                <svg viewBox="0 0 12 12">
                    <ellipse cx="6" cy="6" rx="3" ry="3" fill={iqa.ellipseColor} stroke="none" title={title} />
                </svg>;
            title = 'Índ. qualidade do ar';
            value = iqa.text;
            break;
        default:
            icon = '';
            title = '';
            break;
    }

    return (
        hour === undefined ? (
            <div className="atmospheric-data-icon">
                <div className="title">{title}</div>
                <div className="icon-column">
                    {type_data === 'humidity' ? (
                        <img src={icon} alt={title} style={{ width: "15px", height: "14px", marginTop: "2px" }} title={title} />
                    ) : (
                        <div
                            title={title}
                            style={type_data === 'iqa' ? { width: "18px", height: "18px" } : { height: "18px" }}
                        >{icon}</div>
                    )}
                    <div className={type_data === 'iqa' ? "value-iqa" : "value"}>
                        {value}
                        {type_data === 'wind' ? (
                            <div className="wind-direction-icon">
                                {getWindDirectionIcon(parseFloat(wind.direction))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        ) : (
            <div className="icon-column-small">
                {type_data === 'humidity' ? (
                    <img src={icon} alt={title} style={{ width: "15px", height: "14px", marginTop: "2px", marginRight: "2px" }} title={title} />
                ) : (
                    <div title={title} style={{ marginTop: "3px", marginRight: "2px" }}>{icon}</div>
                )}
                <div className="value-column">
                    <div className="value-small">
                        {value}
                        {type_data === 'wind' ? (
                            <div className="wind-direction-icon-small">
                                {getWindDirectionIcon(parseFloat(wind.direction))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    );
}

export default AtmosphericDataIcon;