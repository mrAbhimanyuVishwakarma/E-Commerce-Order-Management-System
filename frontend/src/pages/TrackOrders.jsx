import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import './Policies.css';

const TrackOrders = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId || !email) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        id: orderId,
        status: 'shipped',
        estimatedDelivery: 'Oct 25, 2026',
        timeline: [
          { status: 'Order Placed', date: 'Oct 20, 2026', time: '10:30 AM', icon: <Package size={16} />, completed: true },
          { status: 'Processing', date: 'Oct 21, 2026', time: '02:15 PM', icon: <Clock size={16} />, completed: true },
          { status: 'Shipped', date: 'Oct 22, 2026', time: '08:45 AM', icon: <Truck size={16} />, completed: true },
          { status: 'Out for Delivery', date: 'Pending', time: '', icon: <Truck size={16} />, completed: false },
          { status: 'Delivered', date: 'Pending', time: '', icon: <CheckCircle size={16} />, completed: false }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="policy-page">
      <h1>Track Your Order</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>Enter your order details below to see the current status of your shipment.</p>

      {!trackingData ? (
        <form onSubmit={handleTrack} className="track-form">
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="orderId" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>Order ID</label>
            <input 
              id="orderId"
              name="orderId"
              type="text" 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)} 
              placeholder="e.g. AX-123456"
              autoComplete="off"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.875rem', height: '40px' }}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Your email used during checkout"
              autoComplete="email"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.875rem', height: '40px' }}
              required
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', padding: '0.5rem 1rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '100px', fontWeight: '500', cursor: 'pointer', height: '40px', fontSize: '0.875rem' }}
            disabled={loading}
          >
            {loading ? 'Tracking…' : 'Track Order'}
          </button>
        </form>
      ) : (
        <div className="track-results">
          <button onClick={() => setTrackingData(null)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', marginBottom: '20px', textDecoration: 'underline' }}>
            &larr; Track another order
          </button>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--border-radius)', marginBottom: '30px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Order #{trackingData.id}</h3>
            <p style={{ margin: '0', color: 'var(--text-secondary)' }}>Estimated Delivery: <strong style={{ color: 'var(--primary-color)' }}>{trackingData.estimatedDelivery}</strong></p>
          </div>

          <div className="track-timeline">
            {trackingData.timeline.map((item, index) => (
              <div key={index} className={`timeline-item ${item.completed ? 'active' : ''}`}>
                <div className="timeline-icon">
                  {item.icon}
                </div>
                <div className="timeline-content">
                  <h4>{item.status}</h4>
                  <p>{item.date} {item.time && `at ${item.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
