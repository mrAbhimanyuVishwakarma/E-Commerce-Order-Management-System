import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import './Products.css';

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = (token && token !== 'null' && token !== 'undefined') 
            ? { Authorization: `Bearer ${token}` } 
            : {};
        
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082'}/api/products`, { headers });
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
    showToast(`${product.name} added to cart!`, 'success');
  };

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 
                    categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : 'All Products';

  return (
    <div className="products-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <span>{pageTitle}</span>
      </div>

      <div className="products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="sidebar-header">
            <h3>FILTERS</h3>
            <button className="clear-filters">CLEAR ALL</button>
          </div>

          <div className="filter-group">
            <h4>GENDER</h4>
            <label><input type="radio" name="gender" value="men" /> Men</label>
            <label><input type="radio" name="gender" value="women" /> Women</label>
            <label><input type="radio" name="gender" value="boys" /> Boys</label>
            <label><input type="radio" name="gender" value="girls" /> Girls</label>
          </div>

          <div className="filter-group">
            <h4>CATEGORIES</h4>
            <label><input type="checkbox" value="shirts" /> Shirts (650)</label>
            <label><input type="checkbox" value="tshirts" /> Tshirts (551)</label>
            <label><input type="checkbox" value="trousers" /> Trousers (201)</label>
            <label><input type="checkbox" value="jeans" /> Jeans (184)</label>
            <label><input type="checkbox" value="casual-shoes" /> Casual Shoes (99)</label>
          </div>

          <div className="filter-group">
            <h4>BRAND</h4>
            <label><input type="checkbox" value="roadster" /> Roadster</label>
            <label><input type="checkbox" value="highlander" /> HIGHLANDER</label>
            <label><input type="checkbox" value="hrx" /> HRX by Hrithik</label>
            <label><input type="checkbox" value="uspa" /> U.S. Polo Assn.</label>
          </div>

          <div className="filter-group">
            <h4>DISCOUNT RANGE</h4>
            <label><input type="radio" name="discount" value="10" /> 10% and above</label>
            <label><input type="radio" name="discount" value="20" /> 20% and above</label>
            <label><input type="radio" name="discount" value="30" /> 30% and above</label>
            <label><input type="radio" name="discount" value="40" /> 40% and above</label>
            <label><input type="radio" name="discount" value="50" /> 50% and above</label>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="products-main">
          <div className="products-topbar">
            <div className="item-count">
              <strong>{pageTitle}</strong> - {filteredProducts.length} items
            </div>
            <div className="sort-by">
              <label>Sort by : </label>
              <select>
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="pagination">
                <button className="page-btn" disabled>&lt;&lt; Page 1</button>
                <button className="page-btn" disabled>&lt; Previous</button>
                <span className="page-info">Page 1 of 1</span>
                <button className="page-btn" disabled>Next &gt;</button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or category.</p>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
