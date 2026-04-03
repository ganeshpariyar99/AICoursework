const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers, deleteUser, toggleBanUser } = require('../Controllers/UserController');
const router = express.Router();

router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.get('/all', getAllUsers);
router.delete('/delete/:userId', deleteUser);
router.put('/ban/:userId', toggleBanUser);

module.exports = router;
