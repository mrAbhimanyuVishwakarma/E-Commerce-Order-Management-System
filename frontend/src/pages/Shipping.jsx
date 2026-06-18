import React from 'react';
import './Policies.css';

const Shipping = () => {
  return (
    <div className="policy-page">
      <h1>Shipping Policy</h1>
      
      <h2>Domestic Shipping</h2>
      <p>We offer standard and expedited shipping options within the country.</p>
      <ul>
        <li><strong>Standard Shipping:</strong> 3-5 business days. Free for orders over $50.</li>
        <li><strong>Expedited Shipping:</strong> 1-2 business days. Flat rate of $15.</li>
      </ul>

      <h2>International Shipping</h2>
      <p>We ship to over 100 countries worldwide. International shipping rates are calculated at checkout based on the destination and weight of the package.</p>
      <ul>
        <li><strong>Standard International:</strong> 7-14 business days.</li>
        <li><strong>Express International:</strong> 3-5 business days.</li>
      </ul>

      <h2>Order Processing</h2>
      <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

      <h2>Customs, Duties, and Taxes</h2>
      <p>Axedrobe is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>
    </div>
  );
};

export default Shipping;
