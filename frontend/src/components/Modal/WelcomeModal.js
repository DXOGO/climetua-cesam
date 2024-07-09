import React from "react";
import "./Modal.css";
import { MdOutlineInfo } from "react-icons/md";
import logo_cesam from "../../assets/logo_cesam.png";
import logo_climetua from "../../assets/logo_climetua.png";
import logo_gemac from "../../assets/logo_gemac.png";
import logo_gmo from "../../assets/logo_GMO.png";

const WelcomeModal = ({ onClose }) => {
    return (
        <div className="welcome-modal-overlay">
            <div className="welcome-modal-content">
                <div className="welcome-modal-logos">
                    <img src={logo_cesam} alt="CESAM Logo" className="welcome-modal-logo" />
                    <img src={logo_climetua} alt="Climetua Logo" className="welcome-modal-logo2" />
                    <img src={logo_gemac} alt="GEMAC Logo" className="welcome-modal-logo3" />
                    <img src={logo_gmo} alt="GMO Logo" className="welcome-modal-logo3" />
                </div>                <div className="welcome-modal-title">
                    Bem vindo ao sistema de previsão do tempo, oceano e qualidade do ar do Centro de Estudos do Ambiente e do Mar (CESAM) da Universidade de Aveiro.
                </div>
                {/* <div className="welcome-modal-subtitle">
                </div> */}
                <div className="welcome-modal-text">
                    <p>
                        As previsões disponibilizadas nesta página são obtidas a partir de simulações atmosféricas,  oceânicas e de qualidade do ar realizadas por modelos computacionais como o Weather Research and Forecasting (WRF), Regional Ocean Modelling System (ROMS), Wave Watch III (WWIII) e CHIMERE. Os grupos de investigação do CESAM-UA envolvidos neste serviço são o Grupo de Meteorologia e Climatologia (Clim@UA, Departamento de Física), Grupo de Emissões, Modelação e Alterações Climáticas (GEMAC, Departamento de Ambiente e Ordenamento) e Grupo de Modelação Oceânica (GMO, Departamento de Física).
                    </p>
                </div>
                <div className="welcome-modal-info">
                    <MdOutlineInfo style={{ fontSize: '16px', color: '#0A77FF', marginTop: '12px', marginRight: '4px' }} />
                    <p className="welcome-modal-small">
                        Os dados de teste usados para esta prova de conceito pertencem ao intervalo de tempo de 7 julho 2021 às 00:00:00 até 15 julho 2021 às 12:00:00 e, no que toca a variáveis disponíveis para cada capital de distrito, inclui os seguintes: temperatura, humidade relativa, nebulosidade, precipitação total, precipitação convenctiva, precipitação não convenctiva, pressão, velocidade do vento e direção do vento.
                    </p>
                </div>
                <button className="modal-button" onClick={onClose}>Continuar</button>
            </div>
        </div>
    );
}

export default WelcomeModal;

// const WelcomeModal = ({ onClose }) => {
//     return (
//         <div className="welcome-modal-overlay">
//             <div className="welcome-modal-content">
//                 {/* Modal content goes here */}
//                 <div className="welcome-modal-title">
//                     Bem vindo ao sistema de previsão do tempo, oceano e qualidade do ar do Centro de Estudos do Ambiente e do Mar (CESAM) da Universidade de Aveiro.                 </div>
//                 {/* <div className="welcome-modal-subtitle">
//                 </div> */}
//                 <div className="welcome-modal-text">
//                     <p>As previsões meteorológicas, oceanográficas e de qualidade do ar aqui disponibilizadas são atualizadas 2 vezes por dia, e oferecem um horizonte temporal de previsão de 10 dias. As previsões disponibilizadas nesta página são obtidas a partir de simulações atmosféricas,  oceânicas e de qualidade do ar realizadas por modelos computacionais como o Weather Research and Forecasting (WRF), Regional Ocean Modelling System (ROMS), Wave Watch III (WWIII) e CHIMERE. Os grupos de investigação do CESAM-UA envolvidos neste serviço são o Grupo de Meteorologia e Climatologia (Clim@UA, Departamento de Física), Grupo de Emissões, Modelação e Alterações Climáticas (GEMAC, Departamento de Ambiente e Ordenamento) e Grupo de Modelação Oceânica (GMO, Departamento de Física).</p>
//                 </div>
//                 {/* <div className="welcome-modal-info">
//                     <MdOutlineInfo style={{ fontSize: '16px', color: '#0A77FF', marginTop: '14px', marginRight: '4px' }} />
//                     <p className="welcome-modal-small">
//                         Os dados de teste usados pertencem ao intervalo de tempo de 7 julho 2021 às 00:00:00 até 15 julho 2021 às 12:00:00 e, no que toca aos dados disponíveis para cada distrito, inclui os seguintes: temperatura, humidade relativa, nebulosidade, precipitação total, precipitação convenctiva, precipitação não convenctiva, pressão e vento (direção e velocidade).
//                     </p>
//                 </div> */}
//                 <button className="modal-button" onClick={onClose}>Continuar</button>
//             </div>
//         </div>
//     );
// }

// export default WelcomeModal;
