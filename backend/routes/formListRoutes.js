const express = require('express');
const router = express.Router();
const formListController = require('../controllers/formListControllers');

router.get('/get-form-list', formListController.getForm);

module.exports = router;