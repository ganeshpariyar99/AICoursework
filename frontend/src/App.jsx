import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { AdminDashboard } from './component/Pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? "admin-app-wrapper" : "app-container"}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "admin-main-wrapper" : "main-content"}>
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
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ProductProvider>
          <Router>
            <AppContent />
          </Router>
        </ProductProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;