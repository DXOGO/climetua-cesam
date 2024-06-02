import React from "react";
import { LuCloudRainWind, LuWind } from "react-icons/lu";
import { PiWavesBold } from "react-icons/pi";
import humidity_icon from "../../assets/icons/humidity-icon.svg";
import humidity_small from "../../assets/icons/humidity-icon-small.svg";
import { WiWindDeg } from "react-icons/wi";
import { getIQA } from "../../helpers/helpers";
import { useSelector } from "react-redux";
import "./AtmosphericDataIcon.css";

const AtmosphericDataIcon = ({ type_data, humidity, wind, precipitation, pressure, hour }) => {
  const city = useSelector((state) => state.selectedCity);
  const iqa = getIQA(city.iqa);

  const getWindDirectionIcon = (direction) => {
    const degrees = [0, 45, 90, 135, 180, 225, 270, 315];
    const index = Math.round(direction / 45) % 8;
    return <WiWindDeg style={{ transform: `rotate(${degrees[index]}deg)` }} />;
  };

  const dataProps = {
    precipitation: { icon: <LuCloudRainWind />, title: "Precipitação", value: `${parseFloat(precipitation).toFixed(1)} mm` },
    pressure: { icon: <PiWavesBold />, title: "Pressão atmosférica", value: `${parseFloat(pressure).toFixed(0)} hPa` },
    wind: { icon: <LuWind />, title: "Velocidade do vento", value: `${parseFloat(wind.speed).toFixed(0)} m/s` },
    humidity: {
      icon: hour !== undefined ? humidity_small : humidity_icon,
      title: "Humidade relativa",
      value: `${parseFloat(humidity).toFixed(0)} %`,
    },
    iqa: {
      icon: (
        <svg viewBox="0 0 12 12">
          <ellipse cx="6" cy="6" rx="3" ry="3" fill={iqa.ellipseColor} stroke="none" />
        </svg>
      ),
      title: "Índ. qualidade do ar",
      value: iqa.text,
    },
  };

  const { icon, title, value } = dataProps[type_data] || {};

  return hour === undefined ? (
    <div className="atmospheric-data-icon">
      <div className="title">{title}</div>
      <div className="icon-column">
        {type_data === "humidity" ? (
          <img src={icon} alt={title} title={title} style={{ width: "15px", height: "14px", marginTop: "2px" }} />
        ) : (
          <div title={title} style={type_data === "iqa" ? { width: "18px", height: "18px" } : { height: "18px" }}>{icon}</div>
        )}
        <div className={type_data === "iqa" ? "value-iqa" : "value"}>
          {value}
          {type_data === "wind" && <div className="wind-direction-icon">{getWindDirectionIcon(parseFloat(wind.direction))}</div>}
        </div>
      </div>
    </div>
  ) : (
    <div className="icon-column-small">
      {type_data === "humidity" ? (
        <img src={icon} alt={title} title={title} style={{ width: "15px", height: "14px", marginTop: "2px", marginRight: "2px" }} />
      ) : (
        <div title={title} style={{ marginTop: "3px", marginRight: "2px" }}>{icon}</div>
      )}
      <div className="value-column">
        <div className="value-small">
          {value}
          {type_data === "wind" && <div className="wind-direction-icon-small">{getWindDirectionIcon(parseFloat(wind.direction))}</div>}
        </div>
      </div>
    </div>
  );
};

export default AtmosphericDataIcon;
