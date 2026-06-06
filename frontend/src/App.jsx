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
import './index.css';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
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
              </Routes>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
