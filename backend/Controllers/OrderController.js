const OrderModel = require('../Models/Order');
const ProductModel = require('../Models/Product');
const nodemailer = require('nodemailer');

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
        const { status, note } = req.body;
        
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'name email');
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Send email to customer if email is present
        if (updatedOrder.userId && updatedOrder.userId.email) {
            const customerEmail = updatedOrder.userId.email;
            const customerName = updatedOrder.userId.name || 'Valued Customer';
            
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'egadgethive101@gmail.com',
                    pass: process.env.EMAIL_PASS || 'dummypassword'
                }
            });
            
            let emailText = `Hello ${customerName},

We would like to inform you that your order status has been updated to: ${status}.

Order Details:
Order ID: ${updatedOrder._id}
Total Amount: NPR ${updatedOrder.totalAmount.toLocaleString()}

Thank you for shopping with E-GadgetHive!`;

            if (status === 'Cancelled') {
                emailText = `Hello ${customerName},

We regret to inform you that your order has been Cancelled.

Cancellation Details & Notes:
Reason: ${note || 'No reason provided'}

Order Details:
Order ID: ${updatedOrder._id}
Total Amount: NPR ${updatedOrder.totalAmount.toLocaleString()}

If you have any questions or concerns, feel free to reply to this email.

Thank you for shopping with E-GadgetHive!`;
            }
            
            const mailOptions = {
                from: process.env.EMAIL_USER || 'egadgethive101@gmail.com',
                to: customerEmail,
                subject: status === 'Cancelled' ? 'Order Cancelled' : 'Order Status Update',
                text: emailText
            };
            
            try {
                await transporter.sendMail(mailOptions);
                console.log(`Status update email sent successfully to ${customerEmail}`);
            } catch (mailErr) {
                console.log(`Failed to send order status update email to ${customerEmail}:`, mailErr.message);
            }
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
