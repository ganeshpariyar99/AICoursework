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

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { delta } = req.body; // e.g. -1 for add to cart, +1 for remove
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $inc: { stock: delta } },
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Adjust Stock Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    adjustStock,
    deleteProduct
};
