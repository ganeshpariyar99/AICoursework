const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    brand: { type: String },
    img: { type: String },
    description: { type: String }
});

const ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;
