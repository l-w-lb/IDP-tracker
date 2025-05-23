const express = require('express');
const router = express.Router();
const formController = require('../controllers/formControllers');

router.post('/get-form-title-description', formController.getFormTitleDescription);
router.post('/get-part-topic-question', formController.getPartTopicQuestion);
router.post('/insert-user-answer', formController.insertUserAnswer);

module.exports = router;
