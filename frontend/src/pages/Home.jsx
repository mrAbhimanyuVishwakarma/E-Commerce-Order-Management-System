import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from Product Service (port 8082)
    // Note: We need a JWT to fetch products in our current backend setup
    // For a real e-commerce, GET /products should be public, but let's 
    // handle it based on the current microservices setup where we might need a token
    // or we'll update the backend to allow public GET requests.
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = (token && token !== 'null' && token !== 'undefined') 
            ? { Authorization: `Bearer ${token}` } 
            : {};
        
        const response = await axios.get('http://localhost:8082/api/products', { headers });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Ensure the backend is running and you are logged in (if required).");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Basic cart implementation using localStorage for demo
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, productId: product.id, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="home-page">
      <HeroBanner />
      
      <section className="container section-products">
        <div className="section-header">
          <h2>Trending Now</h2>
          <p>Discover our most popular products this week.</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
