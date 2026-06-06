import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './MobileNav.css';

const MobileNav = () => {
  const { token } = useContext(AuthContext);

  return (
    <nav className="mobile-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/search" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <Search size={24} />
        <span>Categories</span>
      </NavLink>
      
      <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <ShoppingBag size={24} />
        <span>Cart</span>
      </NavLink>
      
      <NavLink to={token ? "/orders" : "/auth"} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
