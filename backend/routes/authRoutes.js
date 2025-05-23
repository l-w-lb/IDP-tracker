const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers.js')

router.get('/check-login', authController.checkLogin);
router.post('/get-user-data', authController.fetchUserData);
router.post('/logout', authController.logout);

module.exports = router;
