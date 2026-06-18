import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import { TermsAndConditions, TermsOfUse } from './pages/Terms';
import TrackOrders from './pages/TrackOrders';
import Shipping from './pages/Shipping';
import Cancellation from './pages/Cancellation';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/category/:categoryId" element={<Products />} />
                <Route path="/search" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders />} />
                
                {/* Static Pages */}
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/track-orders" element={<TrackOrders />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/cancellation" element={<Cancellation />} />
              </Routes>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
