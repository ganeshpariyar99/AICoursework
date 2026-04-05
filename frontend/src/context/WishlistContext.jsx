import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:8081/users/profile/${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user && data.user.wishlist) {
                        setWishlistItems(data.user.wishlist);
                    }
                    setIsInitialized(true);
                })
                .catch(() => setIsInitialized(true));
        } else {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:8081/users/wishlist/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wishlist: wishlistItems })
            }).catch(console.error);
        }
    }, [wishlistItems, isInitialized]);

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

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const syncUserLogin = async (userId) => {
        try {
            const res = await fetch(`http://localhost:8081/users/profile/${userId}`);
            const data = await res.json();
            if (data.success && data.user) {
                const dbWishlist = data.user.wishlist || [];
                const mergedWishlist = [...dbWishlist];
                wishlistItems.forEach(item => {
                    if (!mergedWishlist.find(i => i.id === item.id)) {
                        mergedWishlist.push(item);
                    }
                });
                setWishlistItems(mergedWishlist);
                
                await fetch(`http://localhost:8081/users/wishlist/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wishlist: mergedWishlist })
                });
            }
        } catch(err) { console.error(err) }
        setIsInitialized(true);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount, clearWishlist, syncUserLogin }}>
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
