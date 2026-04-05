const express = require('express');
const { addProduct, getProducts, updateProduct, adjustStock, deleteProduct } = require('../Controllers/ProductController');
const router = express.Router();

router.post('/add', addProduct);
router.get('/all', getProducts);
router.put('/update/:id', updateProduct);
router.put('/adjust-stock/:id', adjustStock);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
