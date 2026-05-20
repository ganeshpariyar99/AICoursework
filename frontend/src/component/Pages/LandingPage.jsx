import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FALLBACK_IMG } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';
import './LandingPage.css';

const CATEGORIES = [
  { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop' },
  { name: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop' },
  { name: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop' }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products } = useProduct();
  const FEATURED_PRODUCTS = products.slice(0, 4);

  return (
    <div className="landing-page container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Next Gen Tech <span className="hero-title-highlight">For Your Lifestyle</span>
          </h1>
          <p className="hero-subtitle">
            Discover the latest and greatest in consumer electronics. Shop our exclusive collection of premium tech items built for everyday performance.
          </p>
          <div className="hero-buttons">
            <Link to="/products">
              <Button variant="primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem'}}>Shop Now</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem', background: 'white' }}>View Top Brands</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4 4-4-4M12 8v7"></path></svg>
          </div>
          <h3 className="feature-title">Fast Shipping</h3>
          <p className="feature-desc">Delivery across the country in 1-3 days.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h3 className="feature-title">Secure Payment</h3>
          <p className="feature-desc">100% secure checkout with multiple options.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3 className="feature-title">Original Products</h3>
          <p className="feature-desc">Only authentic and handpicked brands.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </div>
          <h3 className="feature-title">24/7 Support</h3>
          <p className="feature-desc">Dedicated assistance whenever you need it.</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="view-all">View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => (
            <Link to={`/products?category=${cat.name}`} key={idx} className="category-card">
              <img
                src={cat.img || FALLBACK_IMG}
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                alt={cat.name}
              />
              <h3 className="category-name">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="view-all">View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="landing-products-grid">
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
              <div className="product-image-container">
                <button 
                  className={`wishlist-icon-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product); }}
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <img
                  src={product.img || FALLBACK_IMG}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-bottom" style={{ alignItems: 'flex-end' }}>
                  <div>
                    <span className="product-price" style={{ display: 'block' }}>NPR {product.price.toLocaleString()}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: Number(product.stock) > 0 ? 'var(--text-medium)' : 'var(--error-color, red)' }}>
                        {Number(product.stock) > 0 ? `${product.stock} left` : 'Out of Stock'}
                    </span>
                  </div>
                  <button 
                    className="add-to-cart-btn" 
                    aria-label="Add to cart" 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if(Number(product.stock) > 0) addToCart(product); 
                    }}
                    disabled={!(Number(product.stock) > 0)}
                    style={{ opacity: Number(product.stock) > 0 ? 1 : 0.5, cursor: Number(product.stock) > 0 ? 'pointer' : 'not-allowed' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand About Us Preview Section */}
      <section className="about-preview-section">
        <div className="about-preview-content">
          <span className="about-preview-badge">Discover E-GadgetHive</span>
          <h2 className="about-preview-title">Your Trusted Tech Destination</h2>
          <p className="about-preview-text">
            Welcome to E Gadget Hive, your premier marketplace for the latest electronic gadgets and accessories. We are dedicated to providing premium technology solutions, 100% genuine products, and top-tier support. Find the perfect gear to match your lifestyle in one single place.
          </p>
          
          <div className="about-preview-features">
            <div className="about-preview-feat">
              <div className="about-preview-feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4>100% Genuine</h4>
              <p>Authentic, handpicked tech brands.</p>
            </div>
            
            <div className="about-preview-feat">
              <div className="about-preview-feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h4>Fast Delivery</h4>
              <p>1-3 days countrywide shipping.</p>
            </div>

            <div className="about-preview-feat">
              <div className="about-preview-feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h4>Friendly Support</h4>
              <p>Dedicated customer service team.</p>
            </div>
          </div>

          <Link to="/about">
            <Button variant="outline" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', background: 'white' }}>
              Learn More About Us
            </Button>
          </Link>
        </div>

        <div className="about-preview-visual">
          <div className="about-preview-img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=800&auto=format&fit=crop" 
              alt="Latest electronic gadgets collection" 
            />
          </div>
          <div className="about-preview-shape"></div>
        </div>
      </section>

      {/* CTA Section */}
      {!localStorage.getItem('loggedInUser') && (
        <section className="cta-section">
          <h2 className="cta-title">Ready to upgrade your tech?</h2>
          <p className="cta-desc">
            Join our platform today and explore the best tech gadgets on the market. Create an account to unlock exclusive deals and faster checkout.
          </p>
          <Link to="/register" className="cta-btn">
            Create Account Now
          </Link>
        </section>
      )}
    </div>
  );
}
