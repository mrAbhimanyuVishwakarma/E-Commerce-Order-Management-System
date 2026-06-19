import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Truck, Sun, Moon, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-content">
          <div className="logo-container">
            <Link to="/" className="logo">AXEDROBE</Link>
          </div>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for clothes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="header-actions">
            <button className="action-btn theme-icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/orders" className="action-btn" title="Track Order">
              <Truck size={20} />
            </Link>
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
            <Link to="/category/best-sellers" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</Link>
            <Link to="/category/new-arrivals" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
            <Link to="/category/men" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
            <Link to="/category/women" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
            <Link to="/category/accessories" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
            <Link to="/category/sale" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
          </nav>
        </div>
      </div>
      
      <div className={`mobile-menu-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/about" className="nav-link mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>
          About Us
        </Link>
        <Link to="/orders" className="nav-link mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>
          Track Order
        </Link>
        <Link to="/cart" className="nav-link mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>
          Cart
        </Link>
        {token ? (
          <button className="nav-link mobile-dropdown-link mobile-btn" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
            Logout
          </button>
        ) : (
          <Link to="/auth" className="nav-link mobile-dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </Link>
        )}
        <button className="nav-link mobile-dropdown-link mobile-btn" onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;
