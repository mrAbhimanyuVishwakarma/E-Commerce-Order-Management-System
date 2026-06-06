import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '', password: '', identifier: '', otp: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Login request
        const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081'}/api/auth/login`, {
          identifier: formData.identifier,
          password: formData.password
        });
        
        if (res.data.requiresOtp) {
          showToast(res.data.message, "success");
          setStep('otp');
        }
      } else {
        // Register request
        const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081'}/api/auth/register`, {
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber || null,
          password: formData.password,
          role: 'CUSTOMER'
        });
        
        if (res.data.requiresOtp) {
          showToast(res.data.message, "success");
          // Pre-fill identifier for OTP verification
          setFormData({ ...formData, identifier: formData.email });
          setStep('otp');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081'}/api/auth/verify-otp`, {
        identifier: formData.identifier,
        otp: formData.otp
      });
      
      if (res.data.token) {
        login(res.data.token);
        showToast("Successfully verified and logged in!", "success");
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid or expired OTP.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-panel animate-fade-in-up">
        <h2>{step === 'otp' ? 'Verify OTP' : (isLogin ? 'Welcome Back' : 'Create Account')}</h2>
        <p className="auth-subtitle">
          {step === 'otp' ? 'Enter the 6-digit verification code sent to your email/mobile.' : (isLogin ? 'Enter your details to access your Axedrobe account.' : 'Join Axedrobe for exclusive access to premium care.')}
        </p>

        {error && <div className="error-alert">{error}</div>}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="auth-form">
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
        ) : (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="input-group">
              <label>Verification Code</label>
              <input 
                type="text" 
                name="otp" 
                value={formData.otp} 
                onChange={handleChange} 
                required 
                placeholder="123456"
                maxLength="6"
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </div>
            
            <button type="submit" className="btn btn-primary auth-submit">
              Verify & Login
            </button>
            <div className="auth-switch">
              <p>
                <button type="button" onClick={() => setStep('credentials')} className="switch-btn">
                  Back to login
                </button>
              </p>
            </div>
          </form>
        )}

        {step === 'credentials' && (
          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="switch-btn">
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
