import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Which is the biggest sale on AxeDrobe?",
      answer: "The biggest sale on AxeDrobe is our annual Black Friday and Cyber Monday event, offering discounts up to 80% off. We also host a massive Summer Clearance Sale."
    },
    {
      question: "What is AxeDrobe helpline number 24x7? / How can I contact customer care?",
      answer: "You can contact our 24x7 customer care and helpline at 1-800-AXEDROBE or email us at support@axedrobe.com."
    },
    {
      question: "How to cancel an order on AxeDrobe?",
      answer: "To cancel an order on AxeDrobe, go to 'My Account', select 'Orders', find the order you wish to cancel, and click 'Cancel Order'. Note that orders can only be canceled before they are dispatched."
    },
    {
      question: "How to sell on AxeDrobe?",
      answer: "To become a seller on AxeDrobe, visit our 'Seller Portal' at seller.axedrobe.com, click on 'Register as a Seller', and follow the onboarding instructions to list your products."
    },
    {
      question: "How to add or redeem a gift card in AxeDrobe?",
      answer: "To add or redeem an AxeDrobe gift card, navigate to your 'Account Dashboard', select 'Gift Cards', and enter your unique gift card code to apply the balance to your account."
    },
    {
      question: "Who owns AxeDrobe?",
      answer: "AxeDrobe is privately owned by the AxeDrobe Group Inc., dedicated to providing top-tier fashion and lifestyle products."
    },
    {
      question: "How to track AxeDrobe order?",
      answer: "Track your AxeDrobe order by visiting the 'Track Order' page on our website and entering your Order ID and email address. You will also receive real-time updates via email."
    },
    {
      question: "How to delete AxeDrobe account?",
      answer: "To delete your AxeDrobe account, log in, go to 'Account Settings', scroll to the bottom, and click 'Delete Account'. Please note this action is irreversible."
    },
    {
      question: "When is AxeDrobe sale?",
      answer: "AxeDrobe sales happen throughout the year, including End of Season Sales, Holiday Sales, and Flash Sales. Subscribe to our newsletter to stay updated on upcoming sales!"
    },
    {
      question: "How to delete AxeDrobe order history?",
      answer: "Currently, AxeDrobe does not support deleting individual order history for accounting and warranty tracking purposes. However, you can archive orders in your account settings."
    },
    {
      question: "How to get AxeDrobe coupon?",
      answer: "You can get AxeDrobe coupons by signing up for our newsletter, following our social media channels, or checking the 'Promotions' tab on our homepage."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `<p>${faq.answer}</p>`
      }
    }))
  };

  return (
    <section className="faq-section container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to the most common questions about AxeDrobe.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
