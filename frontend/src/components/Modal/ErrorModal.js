import React from "react";
import "./Modal.css";

import { AiOutlineReload } from "react-icons/ai";

const ErrorModal = ({ onClose }) => {
    return (
        <div className="error-modal-overlay">
            <div className="error-modal-content">
                <div className="error-modal-title">
                    Oops.
                </div>
                <div className="error-modal-text">
                    Ocorreu um erro ao carregar os dados. Por favor, recarregue a página ou tente mais tarde.
                </div>
                    <button className="modal-button" onClick={onClose}>
                        Recarregar
                        <AiOutlineReload className="reload-icon" style={{ marginLeft: "5px" }} />
                    </button>
                </div>
            </div>
            );
}

            export default ErrorModal;