import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = React.useState('');
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

          <div className="header-actions">
            <div className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleTheme} title="Toggle Dark/Light Mode">
              <div className="toggle-thumb"></div>
            </div>
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
            <Link to="/category/best-sellers" className="nav-link">Best Sellers</Link>
            <Link to="/category/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link to="/category/men" className="nav-link">Men</Link>
            <Link to="/category/women" className="nav-link">Women</Link>
            <Link to="/category/accessories" className="nav-link">Accessories</Link>
            <Link to="/category/sale" className="nav-link">Sale</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
