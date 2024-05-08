// BoxComponent.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpanded } from '../../redux/actions';
import './BoxComponent.css';
import fullscreen from '../../assets/icons/icon_fullscreen.svg';
import fullscreen_exit from '../../assets/icons/icon_exit_fullscreen.svg';

import DefaultBox from './DefaultBox';
import InfoBox from './InfoBox';

const BoxComponent = ({ state }) => {
    const dispatch = useDispatch();
    const toggleExpand = () => {dispatch(setExpanded(!isExpanded));}
    
    const isExpanded = useSelector(state => state.isExpanded);

    let renderState;

    switch (state) {
        case "info":
            renderState = (<InfoBox />);
            break;
        default:
            renderState = (<DefaultBox />);
            break;
    }


    return (
        <div className={`box-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="box-header">
                <div className="toggle-icon" onClick={toggleExpand}>
                    {isExpanded ? (
                        <img src={fullscreen_exit} alt="exit fullscreen" style={{ width: "12px", height: "12px" }} />
                    ) : (
                        <img src={fullscreen} alt="fullscreen" style={{ width: "12px", height: "12px" }} />
                    )}
                </div>
            </div>
            {renderState}
        </div>
    );
};

export default BoxComponent;
