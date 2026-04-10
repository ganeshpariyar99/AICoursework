const OrderModel = require('../Models/Order');
const ProductModel = require('../Models/Product');

const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress, phoneNumber } = req.body;
        
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        const newOrder = new OrderModel({
            userId,
            items,
            totalAmount,
            shippingAddress,
            phoneNumber,
            status: 'Pending',
            paymentStatus: 'Pending',
            paymentMethod: 'Khalti'
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
