import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import { Navbar } from './component/Navbar';
import { Footer } from './component/Footer';

// Pages
import { LoginPage } from './component/Pages/LoginPage';
import { RegisterPage } from './component/Pages/RegisterPage';
import { LandingPage } from './component/Pages/LandingPage';
import { ProductsPage } from './component/Pages/ProductsPage';
import { CartPage } from './component/Pages/CartPage';
import { WishlistPage } from './component/Pages/WishlistPage';
import { ProductDetails } from './component/Pages/ProductDetails';
import { OrderConfirmationPage } from './component/Pages/OrderConfirmationPage';
import { ProfilePage } from './component/Pages/ProfilePage';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/payment/success" element={<OrderConfirmationPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Fallback routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;