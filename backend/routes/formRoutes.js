const express = require('express');
const router = express.Router();
const formController = require('../controllers/formControllers');
const generatePDF = require('../controllers/generatePDF.js')

router.post('/get-form-title-description', formController.getFormTitleDescription);
router.post('/get-part-topic-question', formController.getPartTopicQuestion);
router.post('/insert-user-answer', formController.insertUserAnswer);
router.post('/get-user-answer', formController.getUserAnswer);
router.post('/generate-pdf',generatePDF.genPDF)

module.exports = router;
