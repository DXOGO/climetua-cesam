import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleToggle } from '../../redux/actions';

import './Toggle.css';

const Toggle = ({ label, name }) => {
  const dispatch = useDispatch();
  const toggles = useSelector(state => state.toggles);

  const isChecked = toggles.includes(name); // Check if the toggle is checked
  const isMaxTogglesReached = toggles.length === 3;
  let isDisabled = !isChecked && isMaxTogglesReached;

  //* Here because data is not yet available
  if (name === "fog" || name === "snow" || name === "gust" || name === "highClouds" || name === "mediumClouds" || name === "lowClouds" || name === "solarRadiation" || name === "snowHeight" || name === "stormIndex" || name === "O3" || name === "NO2" || name === "PM2.5" || name === "PM10") {
    isDisabled = 'disabled';
  }

  const handleToggle = () => {
    if (!isDisabled) {
      dispatch(toggleToggle(name)); // Dispatch the toggle action
    }
  };

  return (
    <div className={`toggle ${isChecked ? 'on' : 'off'} ${isDisabled ? 'disabled' : ''}`} onClick={handleToggle}>
      <span className={`label ${isChecked ? 'on' : 'off'}`}>{label}</span>
    </div>
  );
};

export default Toggle;
