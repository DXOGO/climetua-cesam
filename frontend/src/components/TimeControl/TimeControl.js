import React, { useState, useEffect } from 'react';
import './TimeControl.css';

import { FaPlay, FaStepForward, FaStepBackward, FaPause } from "react-icons/fa";

const TimeControl = ({ handlePlay, handleBack, handleForward, hour, speed, handleSpeedChange, handleHourChange }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSpeed, setSelectedSpeed] = useState(1);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        handlePlay(!isPlaying);
    };

    const handleSpeedClick = (value) => {
        setSelectedSpeed(value);
        handleSpeedChange(value);
    };

    const formatHour = (hour) => {
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(0); 
        const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleString('pt-PT', options);    };

    return (
        <div className='leaflet-time-control'>
            <div className='buttons-container'>
                <button className='control-button' onClick={handleBack}><FaStepBackward size="16px"/></button>
                <button className='control-button' onClick={togglePlay}>
                    {isPlaying ? <FaPause size="14px"/> : <FaPlay size="14px"/>}
                </button>
                <button className='control-button' onClick={handleForward}><FaStepForward size="16px"/></button>
            </div>
            <div className='date-container'>
                <span>{formatHour(hour)}</span>
            </div>
            <div className='slider-container'>
                <input type="range" min="0" max="24" value={hour} onChange={handleHourChange} />
            </div>
            <div className='speed-container'>
                <span
                    className={selectedSpeed === 1 ? 'selected-speed' : ''}
                    onClick={() => handleSpeedClick(1)}
                >
                    1x
                </span>
                <span
                    className={selectedSpeed === 2 ? 'selected-speed' : ''}
                    onClick={() => handleSpeedClick(2)}
                >
                    2x
                </span>
            </div>
        </div>
    );
};

export default TimeControl;
