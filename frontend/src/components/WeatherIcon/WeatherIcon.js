// WeatherIcon.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './WeatherIcon.css';
import wave_low from '../../assets/icons/wave_low.svg';
import wave_mid from '../../assets/icons/wave_mid.svg';
import wave_high from '../../assets/icons/wave_high.svg';

import {
  getIQA,
  findCityByName,
  setWeatherIcon,
} from '../../helpers/helpers';

const WeatherIcon = ({ city_name, className, date, onClick, dailyData }) => {

  const data = dailyData.flatMap(hourlyData => hourlyData);

  //* Using because there is no CESAM data available to get cloud, IQA or wave information
  const selectedCity = findCityByName(city_name)

  const temperatures = data.map(data => data.T_2m);

  const currentData = data.find(item => new Date(item.time).getTime() === new Date(date).getTime());
  const currentHumidity = Math.round(currentData.rh_2m);
  const currentPrecipitation = currentData.precip_total;

  const selectedIcon = setWeatherIcon(currentPrecipitation, selectedCity.atmosphericDataCurrent.clouds, currentHumidity, date);

  const iqa = getIQA(selectedCity.iqa);
  const waves = selectedCity.waves;

  const [maxTemperature, setMaxTemperature] = useState(null);
  const [minTemperature, setMinTemperature] = useState(null);

  useEffect(() => {
    if (dailyData.length > 0) {
      setMaxTemperature(Math.round(Math.max(...temperatures)));
      setMinTemperature(Math.round(Math.min(...temperatures)));
    }
  }, [dailyData]);

  let showWave = waves !== undefined;
  let waveIcon;

  switch (waves) {
    case 1:
      waveIcon = wave_low;
      break;
    case 2:
      waveIcon = wave_mid;
      break;
    case 3:
      waveIcon = wave_high;
      break;
    default:
      waveIcon = null;
      break;
  }

  const waveOnTheLeft = ["Viana do Castelo", "Porto", "Aveiro", "Leiria", "Lisboa", "Setúbal"];
  const waveOnTheRight = ["St. Cruz das Flores", "Angra do Heroísmo", "Funchal", "Ponta Delgada", "Porto Santo"];

  let wavePosition = ""; // Initialize wave position variable

  if (waveOnTheLeft.includes(city_name)) {
    wavePosition = "left";
  } else if (waveOnTheRight.includes(city_name)) {
    wavePosition = "right";
  } else {
    wavePosition = "bottom";
  }

  const handleClick = () => { onClick(city_name); }

  // if (isLoading) {
  //   return (
  //     <div></div>
  //   );
  // }

  return (
    <div className={className}>
      <div className="weather-component">
        <svg className="ellipse-container" viewBox="0 0 10 10">
          {/* <ellipse cx="5" cy="5" rx="4" ry="4" stroke="#A1AAB5" strokeWidth="1.5" fill="none" /> */}
          {iqa.ellipseColor !== '#A1AAB5' ? (
            <ellipse cx="6" cy="6" rx="3" ry="3" fill={iqa.ellipseColor} stroke="none" />
          ) : (
            null)}
        </svg>
        <div className="weather-icon" onClick={handleClick}>
          <img src={selectedIcon.icon} alt={selectedIcon.alt} />
        </div>
        <div className="weather-details">
          <div className="weather-detail-top" style={{ backgroundColor: '#FF710A' }}>
            {maxTemperature}
          </div>
          <div className="weather-detail-bottom" style={{ backgroundColor: '#0A77FF' }}>
            {minTemperature}
          </div>
        </div>
        <div className='weather-text'>{city_name}</div>

        {/* Conditionally render the wave icon */}
        {showWave && (
          <div className={`wave-icon ${wavePosition}`}>
            <img src={waveIcon} alt="wave" />
          </div>
        )}

      </div>
    </div>
  );
};

export default WeatherIcon;
