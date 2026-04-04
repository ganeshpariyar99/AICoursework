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
                    // DB products mapped to match frontend IDs and structures if needed
                    const dbProducts = data.products.map(p => ({
                        ...p,
                        id: p._id // Map DB _id to frontend id so deletes/updates still work nominally if implemented later
                    }));
                    // Add DB products to the top of mock list, preserving mocks underneath
                    setProducts([...dbProducts, ...MOCK_PRODUCTS]);
                }
            } catch (err) {
                console.error("Failed to fetch products from backend:", err);
            }
        };
        fetchDBProducts();
    }, []);

    const addProduct = (newProduct) => {
        setProducts([{ ...newProduct, id: Date.now().toString(), price: Number(newProduct.price) }, ...products]);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? { ...updatedProduct, price: Number(updatedProduct.price) } : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
