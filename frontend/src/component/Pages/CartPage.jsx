import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export function CartPage() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 100 : 0;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        const userName = localStorage.getItem('loggedInUser');
        if (!userName) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        setIsProcessing(true);
        try {
            const userEmail = localStorage.getItem('userEmail') || "customer@example.com";
            const userId = localStorage.getItem('userId');

            // 1. Create order in DB
            const orderPayload = {
                userId,
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    img: item.img
                })),
                totalAmount: total
            };

            const orderResponse = await fetch('http://localhost:8081/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                alert('Failed to create order.');
                setIsProcessing(false);
                return;
            }

            const orderId = orderData.order._id;

            // 2. Initiate payment
            const payload = {
                amount: total * 100, // Khalti requires amount in paisa
                purchase_order_id: orderId,
                purchase_order_name: "Cart Items",
                name: userName, 
                email: userEmail,
                phone: "9800000000"
            };
            
            const response = await fetch('http://localhost:8081/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.success && data.payment_url) {
                // Redirect user to Khalti payment page
                window.location.href = data.payment_url;
            } else {
                const errorMsg = data.message || 'Payment Intiation Failed';
                let khaltiDetail = '';
                if (data.error && typeof data.error === 'object') {
                   khaltiDetail = data.error.detail || JSON.stringify(data.error);
                }
                alert(`Failed to initiate payment: ${errorMsg}. ${khaltiDetail}`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop";

    return (
        <div className="container cart-page">
            {/* Cart Items List */}
            <div className="cart-card">
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                            alt="Empty Cart"
                            style={{ width: '120px', marginBottom: '1.5rem', opacity: 0.6 }}
                        />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Your cart is empty</h3>
                        <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem' }}>Looks like you haven't added any tech to your cart yet.</p>
                        <Link to="/products">
                            <Button variant="primary">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image-wrapper">
                                <img
                                    src={item.img || FALLBACK_IMG}
                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                            </div>
                            <div className="cart-item-info">
                                <h3 className="cart-item-title">{item.name}</h3>
                                <p className="cart-item-category">{item.category}</p>
                                <p className="cart-item-price">NPR {item.price.toLocaleString()}</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-control">
                                    <button
                                        className="qty-btn minus"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        aria-label="Decrease quantity"
                                        disabled={item.quantity <= 1}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            let newQty = parseInt(e.target.value) || 1;
                                            if (newQty > Number(item.stock)) newQty = Number(item.stock);
                                            updateQuantity(item.id, newQty);
                                        }}
                                        className="qty-input"
                                        min="1"
                                        max={item.stock}
                                    />
                                    <button
                                        className="qty-btn plus"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                        disabled={item.quantity >= Number(item.stock)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>

                                <button className="remove-btn" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Link to="/products" className="continue-shopping">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Continue Shopping
            </Link>

            {/* Order Summary */}
            <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">NPR {subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                    <span className="summary-label">Shipping estimate</span>
                    <span className="summary-value">NPR {shipping.toLocaleString()}</span>
                </div>

                <div className="summary-row total">
                    <span className="summary-label">Order total</span>
                    <span className="summary-value">NPR {total.toLocaleString()}</span>
                </div>

                <Button variant="primary" className="checkout-btn" disabled={cartItems.length === 0 || isProcessing} onClick={handleCheckout}>
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
            </div>
        </div>
    );
}
