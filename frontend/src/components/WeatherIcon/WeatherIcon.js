// WeatherIcon.js
import React, { useState, useEffect } from 'react';
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

  const useDate = new Date(date);
  useDate.setMinutes(0);
  useDate.setSeconds(0);

  const data = dailyData.flatMap(hourlyData => hourlyData);
  
  const currentData = data.find(item => new Date(item.time).getTime() === new Date(useDate).getTime());
  const currentHumidity = Math.round(currentData.rh_2m);
  const currentPrecipitation = currentData.precip_total;
  const currentCloudiness = currentData.cldfrac;
  
  const selectedIcon = setWeatherIcon(currentPrecipitation, currentCloudiness, currentHumidity, useDate);
  
  //* Using because there is no CESAM data available to get IQA or wave information
  const selectedCity = findCityByName(city_name)
  const iqa = getIQA(selectedCity.iqa);
  const waves = selectedCity.waves;
  
  const [maxTemperature, setMaxTemperature] = useState(0);
  const [minTemperature, setMinTemperature] = useState(0);
  
  const temperatures = data.map(data => data.T_2m);
  useEffect(() => {
    if (data) {
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
