import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CATEGORIES, BRANDS, FALLBACK_IMG } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';
import './ProductsPage.css';

export function ProductsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [maxPrice, setMaxPrice] = useState(200000);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedBrands, setSelectedBrands] = useState([]);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { products } = useProduct();

    // Sync state with URL params on initial load or URL change
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('All Categories');
        }
        // Could also sync 'search' here if needed, but we'll apply it directly in filtering
    }, [searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const searchQuery = searchParams.get('search');

    // Filter products
    const filteredProducts = products.filter(product => {
        // Price Filter
        if (product.price > maxPrice) return false;

        // Category Filter
        if (selectedCategory !== 'All Categories' && product.category !== selectedCategory) {
            return false;
        }

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }

        // Search Query (From Navbar)
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    return (
        <div className="container products-page">
            {searchQuery && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        Search results for: <span style={{ color: 'var(--primary-color)' }}>"{searchQuery}"</span>
                    </h2>
                </div>
            )}

            <div className="products-layout">
                {/* Sidebar */}
                <aside className="products-sidebar">
                    {/* Categories */}
                    <div className="filter-section">
                        <h3 className="filter-title">Categories</h3>
                        <div className="filter-options rad-options">
                            {CATEGORIES.map(category => (
                                <label key={category} className="filter-label rad-label">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === category}
                                        onChange={() => handleCategoryChange(category)}
                                        className="rad-input"
                                    />
                                    <span className="rad-custom"></span> {category}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Max Price */}
                    <div className="filter-section price-section">
                        <div className="price-header">
                            <h3 className="filter-title" style={{ marginBottom: 0 }}>Max Price: Rs.</h3>
                            <input
                                type="number"
                                className="price-input"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div className="range-slider-container">
                            <input
                                type="range"
                                min="0"
                                max="200000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                                className="range-slider"
                            />
                            <div className="range-labels">
                                <span>Rs. 0</span>
                                <span>Rs. 200,000</span>
                            </div>
                        </div>
                    </div>

                    {/* Brands */}
                    <div className="filter-section">
                        <h3 className="filter-title">Brands</h3>
                        <div className="filter-options chk-options">
                            {BRANDS.map(brand => (
                                <label key={brand} className="filter-label chk-label">
                                    <input
                                        type="checkbox"
                                        className="chk-input"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                    />
                                    <span className="chk-custom"></span> {brand}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="products-main">
                    <div className="products-header">
                        <div>
                            <h1 className="products-title">{selectedCategory === 'All Categories' ? 'All Products' : selectedCategory}</h1>
                            <p className="products-subtitle">Showing {filteredProducts.length} results</p>
                        </div>
                        <div className="products-sort">
                            <select className="sort-select">
                                <option>Newest Arrivals</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Best Selling</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748614.png" alt="No products found" style={{ width: '100px', opacity: 0.5, marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-medium)', fontSize: '1.1rem', marginBottom: '1rem' }}>No products found matching your filters.</p>
                            <button
                                onClick={() => { setMaxPrice(200000); setSelectedCategory('All Categories'); setSelectedBrands([]); }}
                                className="btn btn-outline"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
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
                                        <p className="product-category">{product.category} • {product.brand}</p>
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
                    )}
                </main>
            </div>
        </div>
    );
}
