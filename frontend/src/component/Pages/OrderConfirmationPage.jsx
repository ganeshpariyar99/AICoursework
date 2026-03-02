import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import './OrderConfirmationPage.css';

export function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [status, setStatus] = useState('Verifying Payment...');
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pidx = queryParams.get('pidx');
        const payment_status = queryParams.get('status');

        if (!pidx) {
            setStatus('Invalid payment request.');
            return;
        }

        if (payment_status !== 'Completed') {
            setStatus('Payment was not completed.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch('http://localhost:8081/payment/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pidx })
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('Payment Verified! Order Confirmed.');
                    setIsVerified(true);
                    if (clearCart) {
                        clearCart();
                    }
                } else {
                    setStatus('Payment verification failed.');
                }
            } catch (error) {
                console.error("Verification Error:", error);
                setStatus('An error occurred during verification.');
            }
        };

        verifyPayment();
    }, [location, clearCart]);

    return (
        <div className="container confirmation-page">
            <div className={`confirmation-card ${isVerified ? 'success' : 'error'}`}>
                {isVerified ? (
                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                ) : (
                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                )}

                <h1 className="confirmation-title">{status}</h1>

                {isVerified ? (
                    <p className="confirmation-msg">
                        Thank you for your purchase! Your order has been placed successfully and will be processed soon.
                    </p>
                ) : (
                    <p className="confirmation-msg">
                        We could not verify your payment. Please try again or contact support if the issue persists.
                    </p>
                )}

                <div className="confirmation-actions">
                    <Link to="/products">
                        <Button variant="primary">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
