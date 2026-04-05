import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';

const ProductContext = createContext();

export const useProduct = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    useEffect(() => {
        const fetchDBProducts = async () => {
            try {
                const res = await fetch('http://localhost:8081/products/all');
                const data = await res.json();
                if (data.success && data.products) {
                    const dbProducts = data.products.map(p => ({
                        ...p,
                        id: p._id // Map DB _id to frontend id
                    }));
                    // Completely replace state with DB products so there are no dummy unsavable items showing up in Admin table!
                    setProducts(dbProducts);
                }
            } catch (err) {
                console.error("Failed to fetch products from backend:", err);
            }
        };
        fetchDBProducts();
    }, []);

    const addProduct = (newProduct) => {
        setProducts([{ ...newProduct, id: Date.now().toString(), price: Number(newProduct.price), stock: Number(newProduct.stock) || 0 }, ...products]);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? { ...updatedProduct, price: Number(updatedProduct.price), stock: Number(updatedProduct.stock) || 0 } : p));
    };

    const deleteProduct = async (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            await fetch(`http://localhost:8081/products/delete/${id}`, { method: 'DELETE' });
        } catch(err) { console.error("Failed to delete product from backend", err); }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
