const express = require('express');
const { addProduct, getProducts } = require('../Controllers/ProductController');
const router = express.Router();

router.post('/add', addProduct);
router.get('/all', getProducts);

module.exports = router;
