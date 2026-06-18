import React from 'react';
import './Policies.css';

const Cancellation = () => {
  return (
    <div className="policy-page">
      <h1>Cancellation & Returns</h1>
      
      <h2>Order Cancellation</h2>
      <p>You can cancel your order within 24 hours of placing it. To cancel an order, please visit the "Orders" section in your account or contact our support team immediately. Once an order has been processed for shipping, it cannot be canceled.</p>

      <h2>Return Policy</h2>
      <p>We accept returns up to 14 days after delivery, if the item is unused and in its original condition. We will refund the full order amount minus the shipping costs for the return.</p>
      
      <h3>How to initiate a return:</h3>
      <ol>
        <li>Log into your Axedrobe account and navigate to the "Orders" page.</li>
        <li>Select the order containing the item you wish to return.</li>
        <li>Click on "Request Return" and follow the instructions.</li>
        <li>Print the provided return shipping label and attach it to your package.</li>
        <li>Drop off the package at the designated courier location.</li>
      </ol>

      <h2>Refunds</h2>
      <p>Once we receive your return, we will inspect the item and notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
    </div>
  );
};

export default Cancellation;
