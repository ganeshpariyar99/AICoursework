import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:8081/users/profile/${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user && data.user.cart) {
                        setCartItems(data.user.cart);
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
            fetch(`http://localhost:8081/users/cart/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cartItems })
            }).catch(console.error);
        }
    }, [cartItems, isInitialized]);

    const adjustDbStock = async (productId, delta) => {
        try {
            await fetch(`http://localhost:8081/products/adjust-stock/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delta })
            });
        } catch(err) { console.error("Stock adjust failed", err); }
    };

    const addToCart = (product) => {
        const existing = cartItems.find(item => item.id === product.id);
        if (existing && existing.quantity >= Number(product.stock)) {
            return;
        }
        
        // Execute side effect exactly once outside the React state updater
        adjustDbStock(product.id, -1);
        
        setCartItems(prev => {
            const current = prev.find(item => item.id === product.id);
            if (current) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        showToast('Item added to cart');
    };

    const removeFromCart = (productId) => {
        const existing = cartItems.find(item => item.id === productId);
        if (existing) {
            adjustDbStock(productId, existing.quantity);
        }
        
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const existing = cartItems.find(item => item.id === productId);
        if (existing) {
            const delta = existing.quantity - newQuantity;
            if (delta !== 0) {
                adjustDbStock(productId, delta);
            }
        }
        
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const syncUserLogin = async (userId) => {
        try {
            const res = await fetch(`http://localhost:8081/users/profile/${userId}`);
            const data = await res.json();
            if (data.success && data.user) {
                const dbCart = data.user.cart || [];
                const mergedCart = [...dbCart];
                cartItems.forEach(item => {
                    const existing = mergedCart.find(i => i.id === item.id);
                    if (existing) {
                        // avoid duplicate increments if we just want to replace it, 
                        // but generally we take max or leave as is. We'll simply let db define or overwrite.
                        // For simplicity, just make sure item is there.
                        existing.quantity = Math.max(existing.quantity, item.quantity);
                    } else {
                        mergedCart.push(item);
                    }
                });
                setCartItems(mergedCart);
                
                await fetch(`http://localhost:8081/users/cart/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart: mergedCart })
                });
            }
        } catch(err) { console.error(err) }
        setIsInitialized(true);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); // Hide after 3 seconds
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart, syncUserLogin }}>
            {children}

            {/* Toast Notification Container */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    backgroundColor: '#10b981', // Success green
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    {toastMessage}
                </div>
            )}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
