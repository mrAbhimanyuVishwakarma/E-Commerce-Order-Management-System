import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import FAQSection from '../components/FAQSection';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

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
        
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082'}/api/products`, { headers });
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
    showToast(`${product.name} added to cart!`, 'success');
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

      <FAQSection />

      <section className="container seo-content" style={{ marginTop: '4rem', paddingBottom: '4rem', color: '#555', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#222' }}>Discover the Best AxeDrobe Official Store Online</h2>
        <p style={{ marginBottom: '1rem' }}>
          Welcome to <strong>AxeDrobe</strong>, your ultimate destination for everything style, comfort, and innovation. When you choose to <strong>shop AxeDrobe</strong>, you are choosing unparalleled quality and the latest trends crafted specifically to elevate your lifestyle. The <strong>AxeDrobe official</strong> platform is designed with our customers in mind, providing a seamless browsing and purchasing experience. Whether you're looking to <strong>buy AxeDrobe</strong> essentials for everyday wear or wanting to explore our latest premium arrivals, <strong>AxeDrobe.com</strong> is your one-stop shop.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          At the <strong>AxeDrobe store</strong>, we believe that fashion is an extension of your unique identity. That’s exactly why we offer the <strong>best AxeDrobe</strong> collections that cater to diverse tastes, sizes, and preferences. As you browse <strong>AXEDROBE.com</strong>, you'll discover a wide variety of products meticulously curated to meet our high standards. <strong>AxeDrobe Online</strong> brings the entire, expansive catalogue directly to your fingertips, ensuring you can access our premium selections from the absolute comfort of your home, at any time of the day.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          When you search for <strong>Axe Drobe</strong> or <strong>Axe drobe</strong>, you are looking for more than just a clothing brand; you are seeking a lifestyle upgrade. <strong>AXEDROBE</strong> stands for innovation in design, attention to detail, and excellence in customer service. Every single item available at the <strong>AxeDrobe store</strong> goes through rigorous quality checks to ensure you receive only the finest, most durable products. The decision to <strong>buy AxeDrobe</strong> is a decision to invest in lasting durability, breathtaking aesthetics, and unmatched daily comfort.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Our mission at <strong>AxeDrobe</strong> is to redefine online shopping by offering a platform that is not only exceptionally user-friendly but also informative, inspiring, and highly secure. <strong>AxeDrobe.com</strong> guarantees safe, encrypted transactions and incredibly prompt deliveries, making it the preferred choice for countless satisfied customers worldwide. As the authorized <strong>AxeDrobe official</strong> retailer, we guarantee the 100% authenticity of every product, giving you complete peace of mind with every purchase you make. The <strong>best AxeDrobe</strong> experience awaits you, complete with exclusive newsletter deals, flash sales, and seasonal discounts that you simply won't find anywhere else.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Why should you choose <strong>AxeDrobe Online</strong>? Because we truly understand the rapidly evolving needs of modern fashion-conscious consumers. The overarching <strong>AXEDROBE</strong> philosophy is built deeply around sustainability, ethical sourcing, and cutting-edge, forward-thinking fashion. When you visit <strong>AXEDROBE.com</strong>, you don't just buy clothes; you become part of a vibrant, global community that values quality over everything else. We warmly invite you to <strong>shop AxeDrobe</strong> today and genuinely experience the noticeable difference for yourself. Whether you prefer to spell it <strong>Axe Drobe</strong>, <strong>Axe drobe</strong>, or simply <strong>AxeDrobe</strong>, our unwavering commitment to sartorial excellence remains exactly the same.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Finding the right style shouldn't be a tedious chore, which is precisely why the <strong>AxeDrobe store</strong> is meticulously organized by categories, trends, and collections to help you find exactly what you urgently need. From relaxed casual wear to sharp formal attire, <strong>AxeDrobe</strong> has you completely covered. To <strong>buy AxeDrobe</strong> is to confidently embrace a wardrobe that speaks volumes about your distinct personality without you having to utter a single word. Join the thousands of loyal shoppers who inherently trust <strong>AxeDrobe.com</strong> for their essential fashion needs. Our dedicated, friendly customer support team at the <strong>AxeDrobe official</strong> headquarters is always on standby and ready to assist you, ensuring that your shopping journey with <strong>AxeDrobe Online</strong> is nothing short of purely spectacular.
        </p>
        <p>
          In conclusion, <strong>AXEDROBE</strong> is far more than just a typical e-commerce platform; it’s a modern fashion revolution tailored for the contemporary individual. We strive tirelessly to provide the very <strong>best AxeDrobe</strong> products that deeply resonate with your personal, unique style. By continuously and dynamically updating our vast inventory on <strong>AXEDROBE.com</strong>, we proactively ensure that you are always staying ahead of the fashion curve. Don't wait any longer to comprehensively upgrade your wardrobe. Make the choice to <strong>shop AxeDrobe</strong> right now and seamlessly unlock an exciting new world of fashion possibilities. Whether you're specifically searching for small <strong>Axe Drobe</strong> accessories or complete, head-turning outfits, the comprehensive <strong>AxeDrobe store</strong> is unquestionably your ultimate fashion partner. Experience the undeniably premium quality of <strong>AxeDrobe</strong> today, revamp your look, and let your phenomenal style do all the talking.
        </p>
        
        <div className="seo-quick-links" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <a href="/about-us.html" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>About Us</a>
          <a href="/privacy-policy.html" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>Privacy Policy</a>
          <a href="/terms-conditions.html" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>Terms & Conditions</a>
          <a href="/contact-us.html" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>Contact Us</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
