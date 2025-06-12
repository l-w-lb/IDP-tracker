const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const formController = require('../controllers/formControllers');
const PDFcontrollers = require('../controllers/PDFcontrollers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'answers');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { formTitle } = req.body;
    const uniqueName = `${formTitle}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/get-form-title-description', formController.getFormTitleDescription);
router.post('/get-part-topic-question', formController.getPartTopicQuestion);
router.post('/insert-user-answer', formController.insertUserAnswer);
router.post('/get-user-answer', formController.getUserAnswer);
router.post('/generate-pdf',PDFcontrollers.genPDF);
router.post('/upload-pdf', upload.single('pdf'), PDFcontrollers.uploadPDF);
router.post('/get-special-question',formController.getSpecialQuestion);
router.post('/insert-special-answer',formController.insertSpecialAnswer);
router.post('/insert-new-datalist',formController.insertNewDatalist);

module.exports = router;
