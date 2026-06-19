import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content animate-fade-in-up">
        <h1 className="hero-title">Elevate Your<br/><span className="highlight">Everyday Style</span></h1>
        <p className="hero-subtitle">Premium fabrics, perfect fits. Get Flat 35% OFF on all Men's and Women's Apparel.</p>
        <Link to="/category/new-arrivals" className="btn btn-primary hero-btn">Shop The Collection</Link>
        <div className="hero-quick-links" style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '1rem', fontWeight: '500' }}>
          <a href="/about-us.html" style={{ color: '#fff', textDecoration: 'underline', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>About Us</a>
          <a href="/privacy-policy.html" style={{ color: '#fff', textDecoration: 'underline', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Privacy Policy</a>
          <a href="/terms-conditions.html" style={{ color: '#fff', textDecoration: 'underline', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Terms & Conditions</a>
          <a href="/contact-us.html" style={{ color: '#fff', textDecoration: 'underline', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Contact Us</a>
        </div>
      </div>
      <div className="hero-overlay"></div>
    </div>
  );
};

export default HeroBanner;
