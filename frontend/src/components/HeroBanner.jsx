import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content animate-fade-in-up">
        <h1 className="hero-title">Elevate Your<br/><span className="highlight">Everyday Style</span></h1>
        <p className="hero-subtitle">Premium fabrics, perfect fits. Get Flat 35% OFF on all Men's and Women's Apparel.</p>
        <button className="btn btn-primary hero-btn">Shop The Collection</button>
      </div>
      <div className="hero-overlay"></div>
    </div>
  );
};

export default HeroBanner;
