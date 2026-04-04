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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    const [ordersList, setOrdersList] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [pageUsers, setPageUsers] = useState(1);
    const [pageOrders, setPageOrders] = useState(1);
    const [pageReports, setPageReports] = useState(1);
    const ROWS_PER_PAGE = 10;

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8081/orders/all');
            const data = await response.json();
            if (data.success) {
                setOrdersList(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

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
        if (activeTab === 'orders' || activeTab === 'overview') {
            fetchOrders();
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
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('loggedInUser');
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
        </aside>
    );

    const renderOverview = () => (
        <div className="admin-overview">
            <div className="stats-container">
                <div className="stat-card" onClick={() => setActiveTab('users')}>
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-details">
                        <h3>{usersList.length}</h3>
                        <p>Total Users <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab('products')}>
                    <div className="stat-icon"><Package size={24} /></div>
                    <div className="stat-details">
                        <h3>{products.length}</h3>
                        <p>Total Products <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab('orders')}>
                    <div className="stat-icon"><ShoppingCart size={24} /></div>
                    <div className="stat-details">
                        <h3>{ordersList.length}</h3>
                        <p>Total Orders <span>→</span></p>
                    </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab('orders')}>
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-details">
                        <h3>{ordersList.filter(o => o.status === 'Pending').length}</h3>
                        <p>Pending Orders <span>→</span></p>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <h3>Revenue & Orders — Last 7 Days</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={MOCK_CHART_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => value.toLocaleString()} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="revenue" />
                            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#64748B" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" name="orders" />
                        </AreaChart>
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
                        {ordersList.slice(0, 5).map((order, index) => (
                            <tr key={order._id}>
                                <td>O{index + 1}</td>
                                <td>{order.userId && order.userId.name ? order.userId.name : 'Unknown'}</td>
                                <td>{order.items ? order.items.length : 0}</td>
                                <td>NPR {order.totalAmount ? order.totalAmount.toLocaleString() : 0}</td>
                                <td><span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>{order.status}</span></td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {ordersList.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No orders found</td>
                            </tr>
                        )}
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
    const handleProductsSubmit = async (e) => {
        e.preventDefault();
        if (editingProduct) {
            updateProduct(formData);
        } else {
            try {
                const requestData = { ...formData, price: Number(formData.price) };
                delete requestData.id;
                await fetch('http://localhost:8081/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });
            } catch (err) {
                console.error("Failed to save product to backend:", err);
            }
            addProduct(formData);
        }
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
                        {products.slice((pageProducts - 1) * ROWS_PER_PAGE, pageProducts * ROWS_PER_PAGE).map(product => (
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
            
            <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline" disabled={pageProducts === 1} onClick={() => setPageProducts(pageProducts - 1)}>Prev</button>
                <span>Page {pageProducts} of {Math.ceil(products.length / ROWS_PER_PAGE) || 1}</span>
                <button className="btn btn-outline" disabled={pageProducts >= Math.ceil(products.length / ROWS_PER_PAGE)} onClick={() => setPageProducts(pageProducts + 1)}>Next</button>
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
                            <th>S.N.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.slice((pageUsers - 1) * ROWS_PER_PAGE, pageUsers * ROWS_PER_PAGE).map((user, index) => (
                            <tr key={user._id}>
                                <td>{(pageUsers - 1) * ROWS_PER_PAGE + index + 1}</td>
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
            
            <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline" disabled={pageUsers === 1} onClick={() => setPageUsers(pageUsers - 1)}>Prev</button>
                <span>Page {pageUsers} of {Math.ceil(usersList.length / ROWS_PER_PAGE) || 1}</span>
                <button className="btn btn-outline" disabled={pageUsers >= Math.ceil(usersList.length / ROWS_PER_PAGE)} onClick={() => setPageUsers(pageUsers + 1)}>Next</button>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="admin-products">
            <div className="admin-header">
                <h2>Orders Management</h2>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersList.slice((pageOrders - 1) * ROWS_PER_PAGE, pageOrders * ROWS_PER_PAGE).map((order, index) => (
                            <tr key={order._id}>
                                <td>O{(pageOrders - 1) * ROWS_PER_PAGE + index + 1}</td>
                                <td>{order.userId && order.userId.name ? order.userId.name : 'Unknown'}</td>
                                <td>{order.items ? order.items.length : 0}</td>
                                <td>NPR {order.totalAmount ? order.totalAmount.toLocaleString() : 0}</td>
                                <td>
                                    <span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>{order.status}</span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span style={{ fontSize: '0.85rem' }}>{order.paymentMethod} - {order.paymentStatus}</span>
                                </td>
                            </tr>
                        ))}
                        {ordersList.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline" disabled={pageOrders === 1} onClick={() => setPageOrders(pageOrders - 1)}>Prev</button>
                <span>Page {pageOrders} of {Math.ceil(ordersList.length / ROWS_PER_PAGE) || 1}</span>
                <button className="btn btn-outline" disabled={pageOrders >= Math.ceil(ordersList.length / ROWS_PER_PAGE)} onClick={() => setPageOrders(pageOrders + 1)}>Next</button>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="admin-products">
            <div className="admin-header">
                <h2>Reports Dashboard</h2>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Orders</th>
                            <th>Revenue (NPR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CHART_DATA.slice((pageReports - 1) * ROWS_PER_PAGE, pageReports * ROWS_PER_PAGE).map((report, index) => (
                            <tr key={index}>
                                <td>{report.name}</td>
                                <td>{report.orders}</td>
                                <td>{report.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                        {MOCK_CHART_DATA.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No reports found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline" disabled={pageReports === 1} onClick={() => setPageReports(pageReports - 1)}>Prev</button>
                <span>Page {pageReports} of {Math.ceil(MOCK_CHART_DATA.length / ROWS_PER_PAGE) || 1}</span>
                <button className="btn btn-outline" disabled={pageReports >= Math.ceil(MOCK_CHART_DATA.length / ROWS_PER_PAGE)} onClick={() => setPageReports(pageReports + 1)}>Next</button>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard-layout">
            {renderSidebar()}
            <main className="admin-main-content">
                <header className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Moon size={18} />
                            <span>Dark Mode</span>
                        </button>
                        <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>
                <div className="admin-content-area">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'reports' && renderReports()}
                </div>
            </main>
        </div>
    );
}
