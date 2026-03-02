import React, { createContext, useState, useContext } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev; // Already in wishlist
            }
            return [...prev, product];
        });
        showToast('Item added to wishlist');
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        showToast('Item removed from wishlist');
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
            {children}

            {/* Toast Notification Container */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '80px', /* Give room for cart toast */
                    right: '24px',
                    backgroundColor: '#f59e0b', // Amber color for wishlist
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {toastMessage}
                </div>
            )}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
