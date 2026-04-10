const express = require('express');
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../Controllers/OrderController');
const router = express.Router();

router.post('/create', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/all', getAllOrders);
router.put('/update-status/:orderId', updateOrderStatus);

module.exports = router;
