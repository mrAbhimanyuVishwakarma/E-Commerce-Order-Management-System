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
              <Link to="/" className="app-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
              </Link>
              <Link to="/" className="app-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
              </Link>
            </div>
            <div className="social-links">
              <h4>KEEP IN TOUCH</h4>
              <div className="social-icons">
                <Link to="/">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Link>
                <Link to="/">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </Link>
                <Link to="/">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </Link>
                <Link to="/">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </Link>
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
