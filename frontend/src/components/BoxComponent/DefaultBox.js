import './BoxComponent.css';
import { MdOutlineInfo } from "react-icons/md";
const DefaultBox = ({ isExpanded }) => {
    return (
        <div className="box-content">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MdOutlineInfo style={{ fontSize: '26px', color: '#0A77FF' }} />
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#68727D', width: "52%", textAlign: 'center', margin: 5 }}>
                    Pesquisa uma cidade ou clica no mapa para saber mais informação
                </p>
            </div>

        </div>
    );
}

export default DefaultBox;