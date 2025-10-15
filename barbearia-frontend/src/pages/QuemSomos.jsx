import React from 'react';
import './QuemSomos.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa'; // Ícones modernos
import HeaderNav from '../components/common/HeaderNav'; // Import do HeaderNav 



const QuemSomos = () => {
  return (
    <div className="quemsomos-container">
        {/* Header Navigation */}
      <HeaderNav />
      {/* Hero Section com fundo */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Sobre a Barbearia Froes</h1>
          <p>Tradição, estilo e cuidado desde 2010</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="content-section">
        <div className="text-content">
          <h2>Nossa História</h2>
          <p>
            A <strong>Barbearia Froes</strong> foi fundada em 2010 com um propósito claro: 
            oferecer um espaço onde tradição e modernidade se encontram. 
            Desde então, somos referência em cortes clássicos, barba feita com navalha e um atendimento que faz você se sentir em casa.
          </p>
          <p>
            Com mais de <strong>15 anos de atuação</strong> em Santo André, crescemos junto com nossa comunidade, 
            sempre buscando excelência no serviço e no cuidado com cada cliente. 
            Aqui, cada visita é uma experiência única.
          </p>
          <p>
            Nossa equipe é formada por profissionais apaixonados, treinados nas técnicas mais atuais, 
            mas sem deixar de lado o charme da barbearia tradicional. 
            Venha nos conhecer e faça parte da nossa história!
          </p>
        </div>
      </div>
      <div className="text-content">
      <h3>Venha nos visitar! <a href="/onde-fica" style={{color: '#28a745', textDecoration: 'underline'}}>Veja onde ficamos e agende seu horário.</a></h3>
      </div>
    </div>
  );
};

export default QuemSomos;