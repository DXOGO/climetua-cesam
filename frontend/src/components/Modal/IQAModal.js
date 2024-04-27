import React from 'react';
import './IQAModal.css';

import { IoWarningOutline } from "react-icons/io5";

import { getIQA } from '../../helpers/helpers';

const IQAModal = () => {

    const IQAValue = ({ color, text }) => (
        <div className="iqa-value">
            <svg width="14" height="14">
                <ellipse cx="6" cy="6" rx="5" ry="5" fill={color} stroke="none" />
            </svg>
            <span className="iqa-modal-text">{text}</span>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Modal content goes here */}
                <div className='iqa-modal-title'>Índice de Qualidade do Ar</div>
                <div className="iqa-values">
                    {[1, 2, 3, 4, 5].map(iqa => {
                        const iqaData = getIQA(iqa);
                        return <IQAValue key={iqa} color={iqaData.ellipseColor} text={iqaData.text} />;
                    })}
                </div>
                <div className="iqa-modal-warning">
                    <IoWarningOutline size={16}/>
                    Informação ainda não disponível para os arquipélagos
                </div>
            </div>
        </div>
    );
};

export default IQAModal;
