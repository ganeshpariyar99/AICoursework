const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    adminReply: { type: String }
});

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    brand: { type: String },
    img: { type: String },
    description: { type: String },
    stock: { type: Number, default: 0 },
    reviews: [ReviewSchema]
});

const ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;
