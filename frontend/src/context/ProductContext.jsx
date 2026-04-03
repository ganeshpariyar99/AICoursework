import React, { createContext, useState, useContext } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';

const ProductContext = createContext();

export const useProduct = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);

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
