import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Bot } from 'lucide-react';
import './Policies.css';

const ContactUs = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm the Axedrobe AI Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let botResponse = "I'm sorry, I didn't quite catch that. You can ask me about shipping, returns, or tracking your order. For complex issues, please email our support team.";
      
      if (lowerInput.includes('shipping') || lowerInput.includes('delivery')) {
        botResponse = "Standard shipping takes 3-5 business days. We also offer expedited shipping for a flat rate of $15. International shipping varies by country.";
      } else if (lowerInput.includes('return') || lowerInput.includes('refund')) {
        botResponse = "We have a 14-day return policy for unworn items with tags attached. You can initiate a return from the Orders page in your account.";
      } else if (lowerInput.includes('track') || lowerInput.includes('where is my order')) {
        botResponse = "You can track your order using your Order ID and Email on our 'Track Orders' page, accessible from the footer.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = "Hello! How can I assist you with your Axedrobe shopping experience today?";
      }

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 800);
  };

  return (
    <div className="policy-page" style={{ maxWidth: '1000px' }}>
      <h1 style={{ marginBottom: '10px' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', marginBottom: '50px' }}>We're here to help! Reach out to us or ask our AI assistant below.</p>

      <div className="contact-container">
        {/* Contact Details & Manual Form */}
        <div className="contact-info">
          <h2 style={{ marginTop: 0 }}>Get in Touch</h2>
          
          <div className="contact-details" style={{ marginTop: '30px', marginBottom: '40px' }}>
            <div className="contact-item">
              <MapPin size={24} />
              <div>
                <h4>Our Headquarters</h4>
                <p>123 Fashion Ave, Suite 400<br/>New York, NY 10001<br/>United States</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={24} />
              <div>
                <h4>Phone Support</h4>
                <p>+1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={24} />
              <div>
                <h4>Email Support</h4>
                <p>support@axedrobe.com<br/>We reply within 24 hours</p>
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Send us a Message</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Your Name" style={{ padding: '12px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
            <input type="email" placeholder="Your Email" style={{ padding: '12px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
            <textarea placeholder="How can we help?" rows="4" style={{ padding: '12px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }} required></textarea>
            <button type="submit" style={{ padding: '12px', background: 'transparent', color: 'var(--primary-color)', border: '2px solid var(--primary-color)', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer' }}>
              Submit Request
            </button>
          </form>
        </div>

        {/* Simulated AI Bot */}
        <div className="ai-bot-container" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="chat-window" style={{ border: 'none', height: '100%' }}>
            <div className="chat-header">
              <Bot size={24} />
              Axedrobe AI Support
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Ask me about shipping, returns..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
