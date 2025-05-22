const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers.js')

router.post('/get-user-data', loginController.fetchUserData);

module.exports = router;
