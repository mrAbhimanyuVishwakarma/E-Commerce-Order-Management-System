import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '', password: '', identifier: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081'}/api/auth/login`, {
          identifier: formData.identifier,
          password: formData.password
        });
        login(res.data);
        navigate('/');
      } else {
        // Register
        await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081'}/api/auth/register`, {
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber || null,
          password: formData.password,
          role: 'CUSTOMER'
        });
        // Auto switch to login
        setIsLogin(true);
        alert("Registration successful! Please login.");
      }
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Please check your credentials or backend connection.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-panel animate-fade-in-up">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your details to access your Axedrobe account.' : 'Join Axedrobe for exclusive access to premium care.'}
        </p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required={!isLogin} 
                placeholder="John Doe"
              />
            </div>
          )}
          
          {!isLogin ? (
            <>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="input-group">
                <label>Mobile Number (Optional)</label>
                <input 
                  type="tel" 
                  name="mobileNumber" 
                  value={formData.mobileNumber} 
                  onChange={handleChange} 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <label>Email or Mobile Number</label>
              <input 
                type="text" 
                name="identifier" 
                value={formData.identifier} 
                onChange={handleChange} 
                required 
                placeholder="Email or Mobile"
              />
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
