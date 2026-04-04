const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../Controllers/OrderController');
const router = express.Router();

router.post('/create', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/all', getAllOrders);

module.exports = router;
