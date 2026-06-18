import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Products.css'; // Reusing some CSS for empty states

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In our current backend, the order-service might not have a GET /api/orders endpoint 
    // that returns user specific orders yet. If it fails, we catch it.
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Attempt to fetch from order-service
        const response = await axios.get(`${import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8083'}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        // It's possible the endpoint doesn't exist yet for fetching all orders, 
        // so we just handle the error gracefully.
        setError("Failed to fetch order history. This feature might be under construction on the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Order History</h2>
        <p>Please log in to track your orders.</p>
        <Link to="/auth" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <h2 style={{ marginBottom: '30px' }}>Your Orders</h2>
      
      {loading ? (
        <div className="loading-spinner">Loading orders...</div>
      ) : error ? (
        <div className="empty-state">
          <h3>Oops!</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div key={idx} style={{ padding: '20px', border: '1px solid var(--border-light)', marginBottom: '15px', borderRadius: '8px' }}>
              <h4>Order #{order.id || idx + 1}</h4>
              <p>Status: <strong>{order.status || 'PENDING'}</strong></p>
              <p>Total: ${order.totalAmount?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
