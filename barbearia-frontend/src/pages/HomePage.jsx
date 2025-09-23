import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import HeaderNav from '../components/common/HeaderNav'; // Importe o novo componente

// Importe suas imagens aqui
import Logo from '../assets/images/BarbeariaFroesLogo.webp';
import BarbeariaFoto1 from '../assets/images/barbFroesFachada.jpg';
import BarbeariaFoto2 from '../assets/images/barbFroes1.webp';
import BarbeariaFoto3 from '../assets/images/barbFroes2.webp';

const galleryImages = [
  BarbeariaFoto1,
  BarbeariaFoto2,
  BarbeariaFoto3,
];

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Adicione o componente de navegação aqui */}
      <HeaderNav />
      <header className="header">
        <div className="header-content">
          <img src={Logo} alt="Logo Barbearia Froes" className="header-logo" />
          <h1>Barbearia Froes</h1>
        </div>
        <p>Onde o estilo encontra a tradição.</p>
      </header>
      <main>
        <section className="gallery">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`Barbearia Froes - Foto ${index + 1}`} />
            </div>
          ))}
        </section>
        <section className="cta">
          <h2>Pronto para transformar seu visual?</h2>
          <Link to="/agendar" className="cta-button">
            Agende Seu Horário
          </Link>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Barbearia Froes. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;