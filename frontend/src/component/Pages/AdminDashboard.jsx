import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Users, 
    FileText, 
    LogOut, 
    Moon, 
    Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const MOCK_CHART_DATA = [
  { name: 'Apr 2', orders: 12, revenue: 45000 },
  { name: 'Apr 3', orders: 0, revenue: 0 },
  { name: 'Apr 4', orders: 2, revenue: 10000 },
  { name: 'Apr 5', orders: 0, revenue: 0 },
  { name: 'Apr 6', orders: 0, revenue: 0 },
  { name: 'Apr 7', orders: 0, revenue: 0 },
  { name: 'Apr 8', orders: 0, revenue: 0 },
];

export function AdminDashboard() {
    const { products, addProduct, updateProduct, deleteProduct } = useProduct();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [usersList, setUsersList] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8081/users/all');
            const data = await response.json();
            if (data.success) {
                setUsersList(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail !== 'ganeshadmin@egadgethive.com') {
            // Uncomment to enforce admin guard
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleBanUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8081/users/ban/${userId}`, { method: 'PUT' });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Failed to ban user", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            const response = await fetch(`http://localhost:8081/users/delete/${userId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const renderSidebar = () => (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>E-GadgetHive</h2>
                <p>Admin Panel</p>
            </div>
            
            <nav className="sidebar-nav">
                <button 
                    className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </button>
                <button 
                    className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <ShoppingCart size={20} />
                    <span>Orders</span>
                </button>
                <button 
                    className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    <Package size={20} />
                    <span>Products</span>
                </button>
                <button 
                    className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={20} />
                    <span>Users</span>
                </button>
                <button 
                    className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <FileText size={20} />
                    <span>Reports</span>
                </button>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item">
                    <Moon size={20} />
                    <span>Dark Mode</span>
                </button>
                <button className="nav-item logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );

    const renderOverview = () => (
        <div className="admin-overview">
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-details">
                        <h3>13</h3>
                        <p>Total Users <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Package size={24} /></div>
                    <div className="stat-details">
                        <h3>19</h3>
                        <p>Total Products <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><ShoppingCart size={24} /></div>
                    <div className="stat-details">
                        <h3>36</h3>
                        <p>Total Orders <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-details">
                        <h3>17</h3>
                        <p>Pending Orders <span>→</span></p>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <h3>Revenue & Orders — Last 7 Days</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <LineChart data={MOCK_CHART_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => value.toLocaleString()} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#D1A784" strokeWidth={3} activeDot={{ r: 8 }} name="orders" />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#78716C" strokeWidth={3} name="revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recent-orders-container">
                <div className="recent-orders-header">
                    <h3>Recent Orders</h3>
                    <a href="#" className="view-all" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>View All →</a>
                </div>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-001</td>
                            <td>John Doe</td>
                            <td>2</td>
                            <td>NPR 3,500</td>
                            <td><span className="status pending">Pending</span></td>
                            <td>Apr 8, 2026</td>
                        </tr>
                        <tr>
                            <td>#ORD-002</td>
                            <td>Jane Smith</td>
                            <td>1</td>
                            <td>NPR 1,200</td>
                            <td><span className="status completed">Completed</span></td>
                            <td>Apr 7, 2026</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Products Tab State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: CATEGORIES[0], brand: BRANDS[0], img: '', description: ''
    });

    const handleProductsDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) deleteProduct(id);
    };
    const handleProductsEdit = (product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsModalOpen(true);
    };
    const handleProductsAddNew = () => {
        setEditingProduct(null);
        setFormData({ id: Date.now().toString(), name: '', price: '', category: CATEGORIES[0], brand: BRANDS[0], img: '', description: ''});
        setIsModalOpen(true);
    };
    const handleProductsInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleProductsSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) updateProduct(formData);
        else addProduct(formData);
        setIsModalOpen(false);
    };

    const renderProducts = () => (
        <div className="admin-products">
            <div className="admin-header">
                <h2>Product Management</h2>
                <button className="btn btn-primary" onClick={handleProductsAddNew}>+ Add New Product</button>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price (NPR)</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td><img src={product.img} alt={product.name} className="admin-product-img" onError={(e) => e.target.src = "https://via.placeholder.com/50"} /></td>
                                <td>{product.name}</td><td>{product.category}</td><td>{product.brand}</td><td>{Number(product.price).toLocaleString()}</td>
                                <td>
                                    <button className="btn-icon edit-btn" onClick={() => handleProductsEdit(product)}>✏️ Edit</button>
                                    <button className="btn-icon delete-btn" onClick={() => handleProductsDelete(product.id)}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleProductsSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleProductsInputChange} required />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Price (NPR)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleProductsInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleProductsInputChange}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <select name="brand" value={formData.brand} onChange={handleProductsInputChange}>
                                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" name="img" value={formData.img} onChange={handleProductsInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleProductsInputChange} rows="3" />
                            </div>
                            <div className="admin-modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="admin-products">
            <div className="admin-header">
                <h2>Users Management</h2>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id.substring(0, 8)}...</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`status ${user.banned ? 'pending' : 'completed'}`}>
                                        {user.banned ? 'Banned' : 'Active'}
                                    </span>
                                </td>
                                <td>
                                    {user.email !== 'ganeshadmin@egadgethive.com' && (
                                        <>
                                            <button 
                                                className="btn-icon edit-btn" 
                                                onClick={() => handleBanUser(user._id)}
                                                style={{ color: user.banned ? '#10B981' : '#F59E0B' }}
                                            >
                                                {user.banned ? '✅ Unban' : '🚫 Ban'}
                                            </button>
                                            <button 
                                                className="btn-icon delete-btn" 
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {usersList.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard-layout">
            {renderSidebar()}
            <main className="admin-main-content">
                <header className="admin-topbar">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                </header>
                <div className="admin-content-area">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'orders' && <div className="admin-placeholder"><h2>Orders Management</h2><p>This section is under development.</p></div>}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'reports' && <div className="admin-placeholder"><h2>Reports Dashboard</h2><p>This section is under development.</p></div>}
                </div>
            </main>
        </div>
    );
}
