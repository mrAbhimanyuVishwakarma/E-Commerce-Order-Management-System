import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AddProduct.css';

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    stockQuantity: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If the user isn't logged in, they can't add a product
  if (!token) {
    return (
      <div className="add-product-page">
        <div className="add-product-container glass-panel">
          <h2>Access Denied</h2>
          <p>You must be logged in to add products.</p>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(
        `${import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082'}/api/products`,
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stockQuantity: parseInt(formData.stockQuantity),
          imageUrl: formData.imageUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Failed to add product. Make sure the Product Service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container glass-panel animate-fade-in-up">
        <h2>Add New Product</h2>
        <p className="auth-subtitle">Publish a new item to the Axedrobe catalog.</p>
        
        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">Product added successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="auth-form add-product-form">
          <div className="input-group">
            <label>Product Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Classic White T-Shirt"
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              placeholder="Describe the product..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="input-group half-width">
              <label>Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                min="0"
                step="0.01"
                placeholder="29.99"
              />
            </div>

            <div className="input-group half-width">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                name="stockQuantity" 
                value={formData.stockQuantity} 
                onChange={handleChange} 
                required 
                min="0"
                step="1"
                placeholder="100"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
              <option value="Sale">Sale</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Best Sellers">Best Sellers</option>
            </select>
          </div>

          <div className="input-group">
            <label>Image URL</label>
            <input 
              type="url" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              required 
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading || success}>
            {loading ? 'Adding Product...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
