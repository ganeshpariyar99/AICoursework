const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    img: { type: String }
});

const OrderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    paymentMethod: {
        type: String,
        default: 'Khalti'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Paid'],
        default: 'Pending'
    },
    transactionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;
