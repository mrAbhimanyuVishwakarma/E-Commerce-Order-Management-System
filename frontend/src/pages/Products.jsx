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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const initialFilterState = {
    gender: '',
    categories: [],
    brands: [],
    discount: ''
  };

  const [activeFilters, setActiveFilters] = useState(initialFilterState);
  const [pendingFilters, setPendingFilters] = useState(initialFilterState);
  
  const { showToast } = useToast();

  const handleGenderChange = (e) => setPendingFilters({ ...pendingFilters, gender: e.target.value });
  
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const newCategories = pendingFilters.categories.includes(value) 
      ? pendingFilters.categories.filter(c => c !== value)
      : [...pendingFilters.categories, value];
    setPendingFilters({ ...pendingFilters, categories: newCategories });
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    const newBrands = pendingFilters.brands.includes(value) 
      ? pendingFilters.brands.filter(b => b !== value)
      : [...pendingFilters.brands, value];
    setPendingFilters({ ...pendingFilters, brands: newBrands });
  };

  const handleDiscountChange = (e) => setPendingFilters({ ...pendingFilters, discount: e.target.value });

  const handleApplyFilters = () => {
    setActiveFilters(pendingFilters);
    setIsFilterOpen(false); // optional: close on mobile
  };

  const handleClearFilters = () => {
    setActiveFilters(initialFilterState);
    setPendingFilters(initialFilterState);
  };

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

    // Apply Active Filters
    if (activeFilters.gender) {
      const g = activeFilters.gender.toLowerCase();
      if (g === 'men') {
        result = result.filter(p => !p.name.toLowerCase().includes('women') && !p.name.toLowerCase().includes('girls') && !p.name.toLowerCase().includes('dress'));
      } else if (g === 'women') {
        result = result.filter(p => p.name.toLowerCase().includes('women') || p.name.toLowerCase().includes('dress') || p.name.toLowerCase().includes('blouse'));
      } else if (g === 'boys' || g === 'girls') {
        result = result.filter(p => p.name.toLowerCase().includes(g));
      }
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter(p => {
        const name = p.name.toLowerCase();
        return activeFilters.categories.some(cat => name.includes(cat.replace('-', ' ')));
      });
    }

    if (activeFilters.brands.length > 0) {
      result = result.filter(p => {
        const name = p.name.toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return activeFilters.brands.some(brand => name.includes(brand.toLowerCase()) || desc.includes(brand.toLowerCase()));
      });
    }

    setFilteredProducts(result);
  }, [products, categoryId, searchQuery, activeFilters]);

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
        <div className="mobile-filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <span className="filter-icon">⚙️</span> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </div>

        {/* Sidebar */}
        <aside className={`products-sidebar ${isFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>FILTERS</h3>
            <button className="clear-filters" onClick={handleClearFilters}>CLEAR ALL</button>
          </div>

          <div className="filter-group">
            <h4>GENDER</h4>
            <label><input type="radio" name="gender" value="men" checked={pendingFilters.gender === 'men'} onChange={handleGenderChange} /> Men</label>
            <label><input type="radio" name="gender" value="women" checked={pendingFilters.gender === 'women'} onChange={handleGenderChange} /> Women</label>
            <label><input type="radio" name="gender" value="boys" checked={pendingFilters.gender === 'boys'} onChange={handleGenderChange} /> Boys</label>
            <label><input type="radio" name="gender" value="girls" checked={pendingFilters.gender === 'girls'} onChange={handleGenderChange} /> Girls</label>
          </div>

          <div className="filter-group">
            <h4>CATEGORIES</h4>
            <label><input type="checkbox" value="shirts" checked={pendingFilters.categories.includes('shirts')} onChange={handleCategoryChange} /> Shirts</label>
            <label><input type="checkbox" value="tshirts" checked={pendingFilters.categories.includes('tshirts')} onChange={handleCategoryChange} /> Tshirts</label>
            <label><input type="checkbox" value="trousers" checked={pendingFilters.categories.includes('trousers')} onChange={handleCategoryChange} /> Trousers</label>
            <label><input type="checkbox" value="jeans" checked={pendingFilters.categories.includes('jeans')} onChange={handleCategoryChange} /> Jeans</label>
            <label><input type="checkbox" value="shoes" checked={pendingFilters.categories.includes('shoes')} onChange={handleCategoryChange} /> Casual Shoes</label>
          </div>

          <div className="filter-group">
            <h4>BRAND</h4>
            <label><input type="checkbox" value="roadster" checked={pendingFilters.brands.includes('roadster')} onChange={handleBrandChange} /> Roadster</label>
            <label><input type="checkbox" value="highlander" checked={pendingFilters.brands.includes('highlander')} onChange={handleBrandChange} /> HIGHLANDER</label>
            <label><input type="checkbox" value="hrx" checked={pendingFilters.brands.includes('hrx')} onChange={handleBrandChange} /> HRX by Hrithik</label>
            <label><input type="checkbox" value="uspa" checked={pendingFilters.brands.includes('uspa')} onChange={handleBrandChange} /> U.S. Polo Assn.</label>
          </div>

          <div className="filter-group">
            <h4>DISCOUNT RANGE</h4>
            <label><input type="radio" name="discount" value="10" checked={pendingFilters.discount === '10'} onChange={handleDiscountChange} /> 10% and above</label>
            <label><input type="radio" name="discount" value="20" checked={pendingFilters.discount === '20'} onChange={handleDiscountChange} /> 20% and above</label>
            <label><input type="radio" name="discount" value="30" checked={pendingFilters.discount === '30'} onChange={handleDiscountChange} /> 30% and above</label>
            <label><input type="radio" name="discount" value="40" checked={pendingFilters.discount === '40'} onChange={handleDiscountChange} /> 40% and above</label>
            <label><input type="radio" name="discount" value="50" checked={pendingFilters.discount === '50'} onChange={handleDiscountChange} /> 50% and above</label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleApplyFilters}>Apply Filters</button>
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
