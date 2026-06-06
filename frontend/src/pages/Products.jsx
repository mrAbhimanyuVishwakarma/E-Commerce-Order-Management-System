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
  const { showToast } = useToast();

  // Filter States
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState('recommended');

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
    let result = [...products];

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
        result = result.filter(p => p.price < 50);
      } else {
        result = result.filter(p => p.name.toLowerCase().includes(cat) || (p.description && p.description.toLowerCase().includes(cat)));
      }
    }

    // Apply Sidebar Gender Filter
    if (selectedGender) {
      if (selectedGender === 'men') {
        result = result.filter(p => !p.name.toLowerCase().includes('women') && (p.name.toLowerCase().includes('men') || p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('jacket')));
      } else if (selectedGender === 'women') {
        result = result.filter(p => p.name.toLowerCase().includes('women') || p.name.toLowerCase().includes('dress') || p.name.toLowerCase().includes('blouse') || p.name.toLowerCase().includes('top'));
      } else {
         result = result.filter(p => p.name.toLowerCase().includes(selectedGender));
      }
    }

    // Apply Sidebar Categories Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        selectedCategories.some(cat => 
          p.name.toLowerCase().includes(cat.toLowerCase()) || 
          (p.description && p.description.toLowerCase().includes(cat.toLowerCase()))
        )
      );
    }

    // Apply Sidebar Brands Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => 
        selectedBrands.some(brand => 
          p.name.toLowerCase().includes(brand.toLowerCase()) || 
          (p.description && p.description.toLowerCase().includes(brand.toLowerCase()))
        )
      );
    }

    // Apply Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [products, categoryId, searchQuery, selectedGender, selectedCategories, selectedBrands, sortOption]);

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

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories(prev => 
      e.target.checked ? [...prev, value] : prev.filter(c => c !== value)
    );
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrands(prev => 
      e.target.checked ? [...prev, value] : prev.filter(b => b !== value)
    );
  };

  const clearAllFilters = () => {
    setSelectedGender('');
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 
                    categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : 'All Products';

  return (
    <div className="products-page container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <span>{pageTitle}</span>
      </div>

      <div className="products-layout">
        <div className="mobile-filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <span className="filter-icon">⚙️</span> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </div>

        <aside className={`products-sidebar ${isFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>FILTERS</h3>
            <button className="clear-filters" onClick={clearAllFilters}>CLEAR ALL</button>
          </div>

          <div className="filter-group">
            <h4>GENDER</h4>
            <label><input type="radio" name="gender" value="men" checked={selectedGender === 'men'} onChange={(e) => setSelectedGender(e.target.value)} /> Men</label>
            <label><input type="radio" name="gender" value="women" checked={selectedGender === 'women'} onChange={(e) => setSelectedGender(e.target.value)} /> Women</label>
            <label><input type="radio" name="gender" value="boys" checked={selectedGender === 'boys'} onChange={(e) => setSelectedGender(e.target.value)} /> Boys</label>
            <label><input type="radio" name="gender" value="girls" checked={selectedGender === 'girls'} onChange={(e) => setSelectedGender(e.target.value)} /> Girls</label>
          </div>

          <div className="filter-group">
            <h4>CATEGORIES</h4>
            <label><input type="checkbox" value="shirt" checked={selectedCategories.includes('shirt')} onChange={handleCategoryChange} /> Shirts (650)</label>
            <label><input type="checkbox" value="tshirt" checked={selectedCategories.includes('tshirt')} onChange={handleCategoryChange} /> Tshirts (551)</label>
            <label><input type="checkbox" value="trouser" checked={selectedCategories.includes('trouser')} onChange={handleCategoryChange} /> Trousers (201)</label>
            <label><input type="checkbox" value="jeans" checked={selectedCategories.includes('jeans')} onChange={handleCategoryChange} /> Jeans (184)</label>
            <label><input type="checkbox" value="shoe" checked={selectedCategories.includes('shoe')} onChange={handleCategoryChange} /> Casual Shoes (99)</label>
          </div>

          <div className="filter-group">
            <h4>BRAND</h4>
            <label><input type="checkbox" value="roadster" checked={selectedBrands.includes('roadster')} onChange={handleBrandChange} /> Roadster</label>
            <label><input type="checkbox" value="highlander" checked={selectedBrands.includes('highlander')} onChange={handleBrandChange} /> HIGHLANDER</label>
            <label><input type="checkbox" value="hrx" checked={selectedBrands.includes('hrx')} onChange={handleBrandChange} /> HRX by Hrithik</label>
            <label><input type="checkbox" value="polo" checked={selectedBrands.includes('polo')} onChange={handleBrandChange} /> U.S. Polo Assn.</label>
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

        <div className="products-main">
          <div className="products-topbar">
            <div className="item-count">
              <strong>{pageTitle}</strong> - {filteredProducts.length} items
            </div>
            <div className="sort-by">
              <label>Sort by : </label>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
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
