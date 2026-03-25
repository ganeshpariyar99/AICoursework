const OrderModel = require('../Models/Order');

const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        const newOrder = new OrderModel({
            userId,
            items,
            totalAmount,
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

module.exports = {
    createOrder,
    getUserOrders
};
