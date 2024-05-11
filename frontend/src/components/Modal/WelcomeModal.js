import React from "react";
import "./Modal.css";
import { MdOutlineInfo } from "react-icons/md";

const WelcomeModal = ({ onClose }) => {
    return (
        <div className="welcome-modal-overlay">
            <div className="welcome-modal-content">
                {/* Modal content goes here */}
                <div className="welcome-modal-title">
                    Sistema Integrado de Visualização de Previsões Ambientais Unificado do CESAM
                </div>
                {/* <div className="welcome-modal-subtitle">
                </div> */}
                <div className="welcome-modal-text">
                    <p>Bem vindo! Esta plataforma foi desenvolvida pelo investigador Diogo Cruz no âmbito do projeto de dissertação no Mestrado de Comunicação e Tecnologias Web na Universidade de Aveiro.
                    Esta tem como objetivo principal disponibilizar previsões estatísticas e evoluções temporais para dados atmosféricos, meteorológicos, oceanográficos, qualidade do ar e outros para os distritos de Portugal Continental e os arquipélagos dos Açores e da Madeira.</p>
                </div>
                <div className="welcome-modal-info">
                    <MdOutlineInfo style={{ fontSize: '16px', color: '#0A77FF', marginTop: '14px', marginRight: '4px' }} />
                    <p className="welcome-modal-small">
                    Devido a limitações por parte do CESAM, os dados reais presentes nesta plataforma pertencem ao intervalo de tempo de 7 julho 2021 às 00:00:00 até 15 julho 2021 às 12:00:00 e, no que toca aos dados disponíveis para cada distrito, inclui os seguintes: temperatura, humidade relativa, precipitação total, precipitação convenctiva, precipitação não convenctiva, pressão e vento (direção e velocidade).
                    </p>
                </div>
            <button className="modal-button" onClick={onClose}>Continuar</button>
            </div>
        </div>
    );
}

export default WelcomeModal;