import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-content">
          <div className="logo-container">
            <Link to="/" className="logo">AXEDROBE</Link>
          </div>
          
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search for clothes..." />
          </div>

          <div className="header-actions">
            <div className="action-btn" title="Track Order">
              <Truck size={20} />
            </div>
            {token ? (
              <button onClick={logout} className="action-btn" title="Logout">
                <User size={20} /> {/* Ideally a profile dropdown, just logging out for now */}
              </button>
            ) : (
              <Link to="/auth" className="action-btn" title="Login">
                <User size={20} />
              </Link>
            )}
            <Link to="/cart" className="action-btn" title="Cart">
              <ShoppingBag size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="header-bottom">
        <div className="container">
          <nav className="nav-links">
            <Link to="/" className="nav-link">Best Sellers</Link>
            <Link to="/" className="nav-link">New Arrivals</Link>
            <Link to="/" className="nav-link">Men</Link>
            <Link to="/" className="nav-link">Women</Link>
            <Link to="/" className="nav-link">Accessories</Link>
            <Link to="/" className="nav-link">Sale</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
