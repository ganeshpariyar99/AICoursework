import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './WishlistPage.css';

export function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop";

    return (
        <div className="container wishlist-page">
            <h1 className="wishlist-title">My Wishlist</h1>
            
            {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
                    <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem' }}>Save items you like and add them to your cart later.</p>
                    <Link to="/products">
                        <Button variant="primary">Discover Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="wishlist-item-card">
                            <div className="wishlist-item-image-wrapper">
                                <img
                                    src={item.img || FALLBACK_IMG}
                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                    alt={item.name}
                                />
                                <button className="remove-from-wishlist-btn" onClick={() => removeFromWishlist(item.id)} aria-label="Remove from wishlist">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="wishlist-item-info">
                                <p className="wishlist-item-category">{item.category}</p>
                                <h3 className="wishlist-item-title">{item.name}</h3>
                                <p className="wishlist-item-price">NPR {item.price.toLocaleString()}</p>
                                
                                <Button 
                                    variant="outline" 
                                    className="wishlist-add-cart-btn"
                                    onClick={() => {
                                        addToCart(item);
                                        removeFromWishlist(item.id);
                                    }}
                                >
                                    Move to Cart
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
