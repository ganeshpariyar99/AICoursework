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
                                                    <div key={idx} className="order-item-detail">
                                                        <img 
                                                            src={item.img || FALLBACK_IMG} 
                                                            alt={item.name} 
                                                            className="order-item-img" 
                                                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                                        />
                                                        <span>{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-total">
                                                <div className="order-total-label">Total Amount</div>
                                                <div className="order-total-value">NPR {order.totalAmount.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '0.25rem' }}>
                                                    Paid via {order.paymentMethod}
                                                </div>
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
        </div>
    );
}
