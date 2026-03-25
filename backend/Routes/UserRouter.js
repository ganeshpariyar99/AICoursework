const express = require('express');
const { getUserProfile, updateUserProfile } = require('../Controllers/UserController');
const router = express.Router();

router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);

module.exports = router;
