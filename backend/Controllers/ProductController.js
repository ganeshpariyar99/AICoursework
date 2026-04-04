const ProductModel = require('../Models/Product');

const addProduct = async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    addProduct,
    getProducts
};
