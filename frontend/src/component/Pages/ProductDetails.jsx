import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FALLBACK_IMG } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';
import { Button } from '../ui/Button';
import './ProductDetails.css';

export function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { products } = useProduct();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Compare with string ID or number ID robustly
        const foundProduct = products.find(p => String(p.id) === String(id));
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
        }
    }, [id]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <Link to="/products"><Button variant="primary">Return to Shop</Button></Link>
            </div>
        );
    }

    const inWishlist = isInWishlist(product.id);

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/cart');
    };

    return (
        <div className="container product-details-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{product.name}</span>
            </div>
            
            <div className="product-details-container">
                {/* Left side: Image */}
                <div className="product-image-large">
                    <img 
                        src={product.img || FALLBACK_IMG} 
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                        alt={product.name} 
                    />
                </div>

                {/* Right side: Info */}
                <div className="product-info-panel">
                    <p className="product-brand-category">{product.brand} | {product.category}</p>
                    <h1 className="product-title">{product.name}</h1>
                    
                    {/* Mock Rating */}
                    <div className="product-rating">
                        <div className="stars">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>
                        </div>
                        <span className="reviews-count">(128 reviews)</span>
                    </div>

                    <div className="product-price-large">
                        NPR {product.price.toLocaleString()}
                    </div>
                    <div style={{ marginBottom: '1.5rem', fontWeight: 600, color: Number(product.stock) > 0 ? 'var(--text-medium)' : 'var(--error-color, red)' }}>
                        {Number(product.stock) > 0 ? `${product.stock} items left in stock` : 'Out of Stock'}
                    </div>

                    <p className="product-description">
                        Experience the exceptional performance and design of the {product.name} from {product.brand}. This top-tier device in the {product.category} category is built to satisfy both enthusiasts and casual users, combining power and elegance in a single premium package.
                    </p>

                    <ul className="product-features">
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg> 1 Year Official Warranty</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg> 7 Days Return Policy</li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg> Free Nationwide Delivery</li>
                    </ul>

                    <div className="product-actions">
                        <Button 
                            variant="primary" 
                            className="add-to-cart-large"
                            onClick={() => addToCart(product)}
                            disabled={!(Number(product.stock) > 0)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {Number(product.stock) > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>

                        <Button 
                            className="buy-now-large"
                            onClick={handleBuyNow}
                            disabled={!(Number(product.stock) > 0)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            Buy Now
                        </Button>

                        <button 
                            className={`wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
                            onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
