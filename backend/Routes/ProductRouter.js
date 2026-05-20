const express = require('express');
const multer = require('multer');
const path = require('path');
const { addProduct, getProducts, updateProduct, adjustStock, deleteProduct, addReview, replyToReview } = require('../Controllers/ProductController');
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:8081/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

router.post('/add', addProduct);
router.get('/all', getProducts);
router.post('/:id/review', addReview);
router.post('/:productId/review/:reviewId/reply', replyToReview);
router.put('/update/:id', updateProduct);
router.put('/adjust-stock/:id', adjustStock);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
