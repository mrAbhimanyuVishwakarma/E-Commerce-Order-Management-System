import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Policies.css';

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day return window from the date of delivery for all unworn, unwashed items with tags attached."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and times vary depending on the destination."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order via the 'Track Orders' page."
  },
  {
    question: "Are your sizes true to size?",
    answer: "Our clothing generally runs true to size. We provide detailed sizing charts on every product page to help you find the perfect fit."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="policy-page">
      <h1>Frequently Asked Questions</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>Find answers to our most common questions below.</p>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <div className="faq-answer">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
