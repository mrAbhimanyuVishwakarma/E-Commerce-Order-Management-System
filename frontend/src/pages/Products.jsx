import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = (token && token !== 'null' && token !== 'undefined') 
            ? { Authorization: `Bearer ${token}` } 
            : {};
        
        const response = await axios.get('http://localhost:8082/api/products', { headers });
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    } else if (categoryId) {
      const cat = categoryId.toLowerCase();
      if (cat === 'men') {
        result = result.filter(p => p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('men') || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('trousers') || p.name.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('joggers'));
      } else if (cat === 'women') {
        result = result.filter(p => p.name.toLowerCase().includes('dress') || p.name.toLowerCase().includes('blouse') || p.name.toLowerCase().includes('women'));
      } else if (cat === 'accessories') {
        result = result.filter(p => p.name.toLowerCase().includes('watch') || p.name.toLowerCase().includes('sunglasses') || p.name.toLowerCase().includes('bag') || p.name.toLowerCase().includes('tote'));
      } else if (cat === 'sale' || cat === 'new-arrivals') {
        // Just randomizing a bit for demo purposes, picking items under $50
        result = result.filter(p => p.price < 50);
      } else {
        // Fallback for generic categories
        result = result.filter(p => p.name.toLowerCase().includes(cat) || (p.description && p.description.toLowerCase().includes(cat)));
      }
    }

    setFilteredProducts(result);
  }, [products, categoryId, searchQuery]);

  const handleAddToCart = (product) => {
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

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 
                    categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : 'All Products';

  return (
    <div className="products-page container">
      <div className="products-header">
        <h2>{pageTitle}</h2>
        <p>{filteredProducts.length} items found</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search or category.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      )}
    </div>
  );
};

export default Products;
