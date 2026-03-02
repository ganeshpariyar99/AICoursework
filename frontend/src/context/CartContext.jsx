import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        showToast('Item added to cart');
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); // Hide after 3 seconds
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart }}>
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
