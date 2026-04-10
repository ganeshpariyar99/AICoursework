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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';



export function AdminDashboard() {
    const { products, addProduct, updateProduct, deleteProduct } = useProduct();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedReportInfo, setSelectedReportInfo] = useState(null);
    const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
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

    const getDynamicChartData = () => {
        const dataMap = {};
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dataMap[dateStr] = { name: dateStr, orders: 0, revenue: 0 };
        }
        
        ordersList.forEach(order => {
            if(!order.createdAt) return;
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if(dataMap[orderDate]) {
                dataMap[orderDate].orders += 1;
                dataMap[orderDate].revenue += order.totalAmount || 0;
            }
        });
        
        return Object.values(dataMap);
    };

    const getProductSalesData = () => {
        const sales = {};
        ordersList.forEach(order => {
            if (order.items && order.status !== 'Cancelled') {
                order.items.forEach(item => {
                    const key = item.id || item.productId || item.name;
                    if (!sales[key]) {
                        sales[key] = {
                            name: item.name,
                            quantity: 0,
                            revenue: 0,
                            image: item.img,
                            purchaseDates: []
                        };
                    }
                    sales[key].quantity += (item.quantity || 1);
                    sales[key].revenue += ((item.quantity || 1) * (item.price || 0));
                    
                    if (order.createdAt) {
                        sales[key].purchaseDates.push({ date: order.createdAt, qty: (item.quantity || 1), buyer: order.userId?.name || 'Unknown' });
                    }
                });
            }
        });
        return Object.values(sales).sort((a, b) => b.quantity - a.quantity);
    };

    const chartData = getDynamicChartData();
    const productSalesData = getProductSalesData();

    const handleDownloadReport = () => {
        if (!productSalesData || productSalesData.length === 0) return;
        
        const headers = ['Product Name', 'Units Sold', 'Gross Revenue (NPR)'];
        const csvContent = [
            headers.join(','),
            ...productSalesData.map(row => `"${row.name.replace(/"/g, '""')}",${row.quantity},${row.revenue}`)
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (activeTab === 'users' || activeTab === 'overview') {
            fetchUsers();
        }
        if (activeTab === 'orders' || activeTab === 'overview' || activeTab === 'reports') {
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
        window.location.href = '/login';
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8081/orders/update-status/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setOrdersList(ordersList.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
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
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => value.toLocaleString()} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="revenue" />
                            <Bar yAxisId="right" dataKey="orders" fill="#64748B" radius={[4, 4, 0, 0]} name="orders" />
                        </BarChart>
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
                            <th>Item Name</th>
                            <th>Quantity</th>
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
                                <td>{order.items ? order.items.map(item => item.name).join(', ') : 'N/A'}</td>
                                <td>{order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0}</td>
                                <td>NPR {order.totalAmount ? order.totalAmount.toLocaleString() : 0}</td>
                                <td><span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>{order.status}</span></td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {ordersList.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>No orders found</td>
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
        name: '', price: '', category: CATEGORIES[0], brand: BRANDS[0], img: '', description: '', stock: ''
    });

    const handleProductsDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) deleteProduct(id);
    };
    
    const handleStockChange = async (product, delta) => {
        const currentStock = Number(product.stock) || 0;
        const newStock = Math.max(0, currentStock + delta);
        if (newStock === currentStock) return;

        const updatedProduct = { ...product, stock: newStock };
        updateProduct(updatedProduct); // Update front-end via context

        try {
            const tempId = product._id || product.id; // Check both in case of inconsistencies
            if (tempId) { 
                await fetch(`http://localhost:8081/products/update/${tempId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock: newStock })
                });
            }
        } catch (err) {
            console.error("Failed to update stock:", err);
        }
    };

    const handleProductsEdit = (product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsModalOpen(true);
    };
    const handleProductsAddNew = () => {
        setEditingProduct(null);
        setFormData({ id: Date.now().toString(), name: '', price: '', category: CATEGORIES[0], brand: BRANDS[0], img: '', description: '', stock: ''});
        setIsModalOpen(true);
    };
    const handleProductsInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleProductsSubmit = async (e) => {
        e.preventDefault();
        const requestData = { ...formData, price: Number(formData.price), stock: Number(formData.stock) || 0 };
        delete requestData.id;
        
        if (editingProduct) {
            updateProduct(formData);
            try {
                const targetId = formData._id || formData.id;
                if (targetId && !targetId.toString().includes('mock')) {
                    await fetch(`http://localhost:8081/products/update/${targetId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData)
                    });
                }
            } catch (err) { console.error(err); }
        } else {
            try {
                const response = await fetch('http://localhost:8081/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });
                const data = await response.json();
                if (data.success && data.product) {
                    addProduct({ ...formData, _id: data.product._id, id: data.product._id });
                } else {
                    addProduct(formData);
                }
            } catch (err) {
                console.error("Failed to save product to backend:", err);
                addProduct(formData);
            }
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
                            <th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price (NPR)</th><th>Stock</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.slice((pageProducts - 1) * ROWS_PER_PAGE, pageProducts * ROWS_PER_PAGE).map(product => (
                            <tr key={product.id}>
                                <td><img src={product.img} alt={product.name} className="admin-product-img" onError={(e) => e.target.src = "https://via.placeholder.com/50"} /></td>
                                <td>{product.name}</td><td>{product.category}</td><td>{product.brand}</td><td>{Number(product.price).toLocaleString()}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button className="btn-icon" onClick={() => handleStockChange(product, -1)} style={{ padding: '0.2rem 0.5rem', background: '#F3F4F6', borderRadius: '4px' }}>-</button>
                                        <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{product.stock || 0}</span>
                                        <button className="btn-icon" onClick={() => handleStockChange(product, 1)} style={{ padding: '0.2rem 0.5rem', background: '#E5E7EB', borderRadius: '4px' }}>+</button>
                                    </div>
                                </td>
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
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleProductsInputChange} required />
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
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Shipping</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersList.slice((pageOrders - 1) * ROWS_PER_PAGE, pageOrders * ROWS_PER_PAGE).map((order, index) => (
                            <tr key={order._id}>
                                <td>O{(pageOrders - 1) * ROWS_PER_PAGE + index + 1}</td>
                                <td>{order.userId && order.userId.name ? order.userId.name : 'Unknown'}</td>
                                <td>{order.items ? order.items.map(item => item.name).join(', ') : 'N/A'}</td>
                                <td>{order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0}</td>
                                <td>NPR {order.totalAmount ? order.totalAmount.toLocaleString() : 0}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setSelectedShippingInfo(order)}>View Info</button>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.85rem' }}>{order.paymentMethod} - {order.paymentStatus}</span>
                                </td>
                                <td>
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.85rem', backgroundColor: 'var(--surface-color)', color: 'var(--text-dark)' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Order Confirm">Order Confirm</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {ordersList.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
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

            {selectedShippingInfo && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '400px' }}>
                        <h3>Shipping Details</h3>
                        <div style={{ margin: '1rem 0' }}>
                            <p style={{ margin: '0.5rem 0' }}><strong>Customer:</strong> {selectedShippingInfo.userId?.name || 'N/A'} ({selectedShippingInfo.userId?.email || 'N/A'})</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>Address:</strong> {selectedShippingInfo.shippingAddress || 'Not provided'}</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>Phone Number:</strong> {selectedShippingInfo.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div className="admin-modal-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedShippingInfo(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReports = () => (
        <div className="admin-products">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Product Sales Report</h2>
                <button className="btn btn-primary" onClick={handleDownloadReport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📥 Download CSV
                </button>
            </div>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product Info</th>
                            <th>Units Sold</th>
                            <th>Gross Revenue (NPR)</th>
                            <th>Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productSalesData.slice((pageReports - 1) * ROWS_PER_PAGE, pageReports * ROWS_PER_PAGE).map((report, index) => (
                            <tr key={index}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {report.image ? <img src={report.image} alt={report.name} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'4px'}} /> : null}
                                        <span style={{ fontWeight: 500 }}>{report.name}</span>
                                    </div>
                                </td>
                                <td><span style={{ background: '#F3F4F6', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.85rem' }}>{report.quantity} sold</span></td>
                                <td>{report.revenue.toLocaleString()}</td>
                                <td>
                                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem' }} onClick={() => setSelectedReportInfo(report)}>
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {productSalesData.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No products solid yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline" disabled={pageReports === 1} onClick={() => setPageReports(pageReports - 1)}>Prev</button>
                <span>Page {pageReports} of {Math.ceil(productSalesData.length / ROWS_PER_PAGE) || 1}</span>
                <button className="btn btn-outline" disabled={pageReports >= Math.ceil(productSalesData.length / ROWS_PER_PAGE)} onClick={() => setPageReports(pageReports + 1)}>Next</button>
            </div>

            {selectedReportInfo && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px' }}>
                        <h3>{selectedReportInfo.name} - Purchase History</h3>
                        <div style={{ maxHeight: '350px', overflowY: 'auto', margin: '1rem 0' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Quantity</th>
                                        <th>Customer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReportInfo.purchaseDates.sort((a,b) => new Date(b.date) - new Date(a.date)).map((p, i) => (
                                        <tr key={i}>
                                            <td>{new Date(p.date).toLocaleString()}</td>
                                            <td>{p.qty}</td>
                                            <td>{p.buyer}</td>
                                        </tr>
                                    ))}
                                    {(!selectedReportInfo.purchaseDates || selectedReportInfo.purchaseDates.length === 0) && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>No detailed records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-modal-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedReportInfo(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="admin-dashboard-layout">
            {renderSidebar()}
            <main className="admin-main-content">
                <header className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Moon size={18} />
                            <span>Dark Mode</span>
                        </button> */}
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
