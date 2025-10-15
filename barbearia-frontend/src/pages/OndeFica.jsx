import React from 'react';
import './OndeFica.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaDirections } from 'react-icons/fa';
import HeaderNav from '../components/common/HeaderNav';

const OndeFica = () => {
  return (
    <div className="ondefica-container">
      <HeaderNav />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Onde Estamos</h1>
          <p>Encontre a Barbearia Froes facilmente em Santo André</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="content-section">
        {/* Mapa do Google */}
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.142314057345!2d-46.542354685021!3d-23.640374984613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448d3b8f0b0d%3A0x5e5f5e5f5e5f5e5f!2sR.%20das%20Hort%C3%AAncias%2C%20430%20-%20Jardim%20do%20Est%C3%A1dio%2C%20Santo%20Andr%C3%A9%20-%20SP%2C%2009175-500!5e0!3m2!1spt-BR!2sbr!4v1698765432100!5m2!1spt-BR!2sbr"
            width="100%"
            height="450"
            style={{ border: 0 }}  // Objeto JS correto
            allowFullScreen=""  // camelCase corrigido
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"  // camelCase corrigido
            title="Mapa da Barbearia Froes"
          ></iframe>
        </div>

        {/* Card de Informações */}
        <div className="info-card">
          <h3>Informações de Contato</h3>
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <p>R. das Hortências, 430 - Jardim do Estádio, Santo André - SP, 09175-500</p>
          </div>
          <div className="info-item">
            <FaPhoneAlt className="icon" />
            <p><a href="tel:+5511977252228">(11) 97725-2228</a></p>
          </div>
          <div className="info-item">
            <FaClock className="icon" />
            <p>Seg à Sex: 9h às 20h | Sáb: 9h às 18h</p>
          </div>
          <button className="btn-rotas">
            <FaDirections className="btn-icon" />
            <a href="https://www.google.com/maps/dir/?api=1&destination=R.+das+Hort%C3%AAncias,+430+-+Jardim+do+Est%C3%A1dio,+Santo+Andr%C3%A9+-+SP,+09175-500" target="_blank" rel="noopener noreferrer">
              Traçar Rota
            </a>
          </button>
          <button className="btn-agendar">
            <a href="/">Agende seu Horário</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OndeFica;