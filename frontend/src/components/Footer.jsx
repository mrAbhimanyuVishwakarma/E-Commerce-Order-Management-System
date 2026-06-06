import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-links-section">
          <div className="footer-column">
            <h4>ONLINE SHOPPING</h4>
            <ul>
              <li><Link to="/category/men">Men</Link></li>
              <li><Link to="/category/women">Women</Link></li>
              <li><Link to="/category/kids">Kids</Link></li>
              <li><Link to="/category/home">Home</Link></li>
              <li><Link to="/category/beauty">Beauty</Link></li>
              <li><Link to="/category/accessories">Accessories</Link></li>
              <li><Link to="/category/gift-cards">Gift Cards</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>CUSTOMER POLICIES</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">T&C</Link></li>
              <li><Link to="/terms-of-use">Terms Of Use</Link></li>
              <li><Link to="/track-orders">Track Orders</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/cancellation">Cancellation</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-app-section">
          <div className="footer-column">
            <h4>EXPERIENCE AXEDROBE APP ON MOBILE</h4>
            <div className="app-buttons">
              <a href="#" className="app-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
              </a>
              <a href="#" className="app-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
              </a>
            </div>
            <div className="social-links">
              <h4>KEEP IN TOUCH</h4>
              <div className="social-icons">
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">YT</a>
                <a href="#">IG</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-trust-section">
          <div className="trust-item">
            <div className="trust-icon">💯</div>
            <p><strong>100% ORIGINAL</strong> guarantee for all products at axedrobe.com</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔄</div>
            <p><strong>Return within 14days</strong> of receiving your order</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} www.axedrobe.com. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
