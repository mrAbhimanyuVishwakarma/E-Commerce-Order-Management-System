import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card animate-fade-in-up">
      <div className="product-image-container">
        <span className="badge-tag">Selling Fast</span>
        <img 
          src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80&sig=${product.id}`} 
          alt={product.name} 
          className="product-image"
        />
      </div>
      <div className="product-info">
        <div className="rating">★ 4.6 | 143 Reviews</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="price-container">
          <span className="current-price">${product.price.toFixed(2)}</span>
          <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
          <span className="discount">15% OFF</span>
        </div>
        
        <div className="offer-text">
          <span className="check-icon">✓</span> Get it for ${(product.price * 0.8).toFixed(2)} with FLAT20
        </div>
        
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          <span className="cart-icon">🛍️</span> ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
