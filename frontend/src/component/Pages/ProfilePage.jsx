import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import './ProfilePage.css';

export function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [pageOrders, setPageOrders] = useState(1);
    const ORDERS_PER_PAGE = 5;
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(true);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop";

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchProfileData = async () => {
            try {
                // Fetch user profile
                const userRes = await fetch(`http://localhost:8081/users/profile/${userId}`);
                const userData = await userRes.json();
                
                if (userData.success) {
                    setUser(userData.user);
                    setEditForm({ name: userData.user.name, email: userData.user.email });
                }

                // Fetch user orders
                const ordersRes = await fetch(`http://localhost:8081/orders/user/${userId}`);
                const ordersData = await ordersRes.json();
                
                if (ordersData.success) {
                    setOrders(ordersData.orders);
                }
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        
        try {
            const res = await fetch(`http://localhost:8081/users/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                setIsEditing(false);
                localStorage.setItem('loggedInUser', data.user.name);
                localStorage.setItem('userEmail', data.user.email);
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert('Something went wrong updating profile.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const targetId = selectedProductForReview.productId || selectedProductForReview.id;
            const res = await fetch(`http://localhost:8081/products/${targetId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id || localStorage.getItem('userId'),
                    userName: user.name,
                    rating: Number(reviewForm.rating),
                    comment: reviewForm.comment
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Review added successfully!');
                setReviewModalOpen(false);
                setReviewForm({ rating: 5, comment: '' });
            } else {
                alert(data.message || 'Failed to add review');
            }
        } catch (err) {
            console.error(err);
            alert('Error adding review');
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>Unable to load profile data.</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1 className="profile-title">My Account</h1>
                <p className="profile-subtitle">Manage your profile details and track your orders.</p>
            </div>

            <div className="profile-layout">
                {/* Profile Details Sidebar */}
                <div className="profile-card">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user.name}</h2>
                    </div>

                    {!isEditing ? (
                        <div className="profile-info">
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{user.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-item" style={{ marginTop: '1.5rem' }}>
                                <Button variant="outline" size="full" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            </div>
                        </div>
                    ) : (
                        <form className="edit-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-input" 
                                    value={editForm.email} 
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-actions">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" variant="primary">Save</Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Orders History Main Content */}
                <div className="history-card">
                    <h2 className="history-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Shopping History
                    </h2>

                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <p>You haven't made any orders yet.</p>
                            <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/products')}>Browse Products</Button>
                        </div>
                    ) : (
                        <>
                            <div className="order-list">
                                {orders.slice((pageOrders - 1) * ORDERS_PER_PAGE, pageOrders * ORDERS_PER_PAGE).map(order => (
                                    <div key={order._id} className="order-item">
                                        <div className="order-header">
                                            <div>
                                                <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                                                <div className="order-date">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                                            </div>
                                            <div className={`order-status status-${order.status}`}>
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="order-details">
                                            <div className="order-items-preview">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="order-item-detail" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <img 
                                                                src={item.img || FALLBACK_IMG} 
                                                                alt={item.name} 
                                                                className="order-item-img" 
                                                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                                            />
                                                            <span>{item.quantity}x {item.name}</span>
                                                        </div>
                                                        <Button variant="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => {
                                                            setSelectedProductForReview(item);
                                                            setReviewModalOpen(true);
                                                        }}>Review</Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-total">
                                                <div className="order-total-label">Total Amount</div>
                                                <div className="order-total-value">NPR {order.totalAmount.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '0.25rem' }}>
                                                    Paid via {order.paymentMethod}
                                                </div>
                                                {(order.paymentStatus === 'Paid' || order.paymentStatus === 'Completed') && (
                                                    <Button variant="primary" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => {
                                                        setSelectedOrderForReceipt(order);
                                                        setReceiptModalOpen(true);
                                                    }}>View Receipt</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {orders.length > ORDERS_PER_PAGE && (
                                <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', gap: '1rem', alignItems: 'center' }}>
                                    <Button type="button" variant="outline" disabled={pageOrders === 1} onClick={() => setPageOrders(pageOrders - 1)}>Prev</Button>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-medium)'}}>Page {pageOrders} of {Math.ceil(orders.length / ORDERS_PER_PAGE)}</span>
                                    <Button type="button" variant="outline" disabled={pageOrders >= Math.ceil(orders.length / ORDERS_PER_PAGE)} onClick={() => setPageOrders(pageOrders + 1)}>Next</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {reviewModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '400px' }}>
                        <h3>Review {selectedProductForReview?.name}</h3>
                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating (1-5)</label>
                                <select 
                                    value={reviewForm.rating} 
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Comment</label>
                                <textarea 
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    rows="4"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    placeholder="Write your review here..."
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="primary">Submit Review</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {receiptModalOpen && selectedOrderForReceipt && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal receipt-modal">
                        <div className="receipt-header">
                            <h2>Payment Receipt</h2>
                            <p>E-Gadget Hive</p>
                        </div>
                        <div className="receipt-body">
                            <div className="receipt-row">
                                <span className="receipt-label">Customer Name:</span>
                                <span>{user.name}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Order ID:</span>
                                <span>#{selectedOrderForReceipt._id.slice(-6).toUpperCase()}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Transaction ID:</span>
                                <span>{selectedOrderForReceipt.transactionId || 'N/A'}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Date:</span>
                                <span>{new Date(selectedOrderForReceipt.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Method:</span>
                                <span>{selectedOrderForReceipt.paymentMethod}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Status:</span>
                                <span className="receipt-status success">{selectedOrderForReceipt.paymentStatus}</span>
                            </div>
                            
                            <hr className="receipt-divider" />
                            
                            <div className="receipt-items">
                                <strong>Items:</strong>
                                {selectedOrderForReceipt.items.map((item, idx) => (
                                    <div key={idx} className="receipt-item-row">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <hr className="receipt-divider" />
                            
                            <div className="receipt-row receipt-total">
                                <span>Total Paid:</span>
                                <span>NPR {selectedOrderForReceipt.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="receipt-actions">
                            <Button variant="outline" onClick={() => window.print()}>Print Receipt</Button>
                            <Button variant="primary" onClick={() => setReceiptModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
