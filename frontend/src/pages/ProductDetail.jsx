import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const { showToast } = useToast();

  const mockSizes = ['36', '38', '40', '42', '44', '46'];
  // We use the same image with a hue-rotate filter to mock different colors
  const mockColors = [0, 45, 90, 135, 180, 225, 270, 315];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = (token && token !== 'null' && token !== 'undefined') 
            ? { Authorization: `Bearer ${token}` } 
            : {};
        
        // Ensure you have an endpoint for fetching a single product by ID in product-service
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082'}/api/products/${id}`, { headers });
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size first.', 'error');
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.productId === product.id && item.size === selectedSize);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, productId: product.id, quantity: 1, size: selectedSize });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    showToast(`${product.name} (Size: ${selectedSize}) added to bag!`, 'success');
  };

  if (loading) return <div className="container loading-spinner">Loading product...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!product) return <div className="container error-message">Product not found.</div>;

  const imageUrl = `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${product.id}`;

  return (
    <div className="product-detail-page container animate-fade-in-up">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/category/clothing">Clothing</Link> / <span>{product.name}</span>
      </div>

      <div className="pdp-layout">
        {/* Left Side: Image Gallery */}
        <div className="pdp-images">
          <div className="main-image">
            <img src={imageUrl} alt={product.name} />
          </div>
          <div className="main-image">
            <img src={imageUrl} alt={product.name} style={{filter: 'hue-rotate(45deg)'}} />
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="pdp-details">
          <h1 className="pdp-brand">AXEDROBE</h1>
          <h2 className="pdp-title">{product.name}</h2>
          
          <div className="pdp-rating">
            <span className="rating-stars">4.3 ★</span>
            <span className="rating-count"> | 27.8k Ratings</span>
          </div>

          <div className="pdp-pricing">
            <span className="current-price">₹{product.price.toFixed(2)}</span>
            <span className="original-price">MRP ₹{(product.price * 2.5).toFixed(2)}</span>
            <span className="discount">(60% OFF)</span>
          </div>
          <p className="tax-inclusive">inclusive of all taxes</p>

          <div className="pdp-colors">
            <h4>MORE COLORS</h4>
            <div className="color-thumbnails">
              {mockColors.map((hue, index) => (
                <div key={index} className="color-thumb">
                  <img src={imageUrl} alt="color variant" style={{ filter: `hue-rotate(${hue}deg)` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pdp-sizes">
            <div className="size-header">
              <h4>SELECT SIZE</h4>
              <span className="size-chart-link">SIZE CHART &gt;</span>
            </div>
            <div className="size-options">
              {mockSizes.map(size => (
                <button 
                  key={size} 
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-actions">
            <button className="btn-add-to-bag" onClick={handleAddToCart}>
              <span className="bag-icon">🛍️</span> ADD TO BAG
            </button>
            <button className="btn-wishlist">
              <span className="heart-icon">♡</span> WISHLIST
            </button>
          </div>
          
          <div className="pdp-description">
            <h4>PRODUCT DETAILS</h4>
            <p>{product.description || "This premium quality product is made from the finest materials to ensure maximum comfort and durability. Perfect for your everyday style."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
