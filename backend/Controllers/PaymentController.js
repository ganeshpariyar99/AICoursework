const OrderModel = require('../Models/Order');

const initiatePayment = async (req, res) => {
    try {
        const { amount, purchase_order_id, purchase_order_name, name, email, phone } = req.body;

        const payload = {
            return_url: "http://localhost:3000/payment/success",
            website_url: "http://localhost:3000/",
            amount: amount, // Amount should be in paisa
            purchase_order_id: purchase_order_id,
            purchase_order_name: purchase_order_name,
            customer_info: {
                name: name || "Customer",
                email: email || "customer@example.com",
                phone: phone || "9800000000"
            }
        };

        const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok) {
            return res.status(200).json({ success: true, payment_url: data.payment_url, pidx: data.pidx });
        } else {
            console.error("Khalti Init Error:", data);
            return res.status(400).json({ success: false, message: "Payment Initiation Failed", error: data });
        }

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { pidx } = req.body;
        
        const response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pidx })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === "Completed") {
            // Update order status in DB
            const orderId = data.purchase_order_id;
            try {
                await OrderModel.findByIdAndUpdate(orderId, {
                    paymentStatus: 'Paid',
                    transactionId: data.transaction_id,
                    status: 'Processing' // Change to Processing after payment
                });
            } catch(dbErr) {
                console.error("Failed to update order status in DB", dbErr);
            }
            return res.status(200).json({ success: true, message: "Payment Verified Successfully", data });
        } else {
            return res.status(400).json({ success: false, message: "Payment Verification Failed", data });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = {
    initiatePayment,
    verifyPayment
};
