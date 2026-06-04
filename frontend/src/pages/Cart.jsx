import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const handleRemove = (productId) => {
    const newCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to place an order.");
      navigate('/auth');
      return;
    }

    try {
      for (const item of cartItems) {
        await axios.post('http://localhost:8083/api/orders', {
          userId: 1, // Ideally decoded from JWT, but hardcoded to 1 for this demo
          productId: item.productId,
          quantity: item.quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      alert("Order placed successfully! Check backend logs for Kafka events.");
      setCartItems([]);
      localStorage.removeItem('cart');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Ensure you are logged in and backend is running.");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page container">
      <h2 className="page-title">Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart glass-panel">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item glass-panel">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="item-actions">
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="btn btn-secondary" onClick={() => handleRemove(item.productId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
              Checkout Securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
