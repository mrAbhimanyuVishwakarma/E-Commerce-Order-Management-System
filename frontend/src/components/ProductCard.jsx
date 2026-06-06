import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card animate-fade-in-up">
      <Link to={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="product-link">
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
        </div>
      </Link>
      
    </div>
  );
};

export default ProductCard;
