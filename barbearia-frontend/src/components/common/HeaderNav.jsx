import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderNav.css';

const HeaderNav = () => {
  return (
    <nav className="header-nav-container">
      <div className="nav-links-left"> </div>
      
      <div className="nav-links-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/quem-somos" className="nav-link">Quem Somos</Link>
        <Link to="/onde-fica" className="nav-link">Onde Fica</Link>
      </div>
    </nav>
  );
};

export default HeaderNav;