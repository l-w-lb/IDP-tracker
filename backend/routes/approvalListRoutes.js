const express = require('express');
const router = express.Router();const multer = require('multer');
const upload = multer({ dest: 'uploads/generatedPdf/' });

const approvalListControllers = require('../controllers/approvalListControllers.js')
const PDFcontrollers = require('../controllers/PDFcontrollers');

router.post('/get-approval-list', approvalListControllers.getApprovalList);

router.post('/update-pdf-status', PDFcontrollers.updatePdfStatus);
router.post('/save-edited-pdf', PDFcontrollers.saveEditedPdf);
router.post('/update-pdf-comment', PDFcontrollers.updatePdfComment);
router.post('/upload-pdf', upload.single('pdf'), PDFcontrollers.uploadPDF);

module.exports = router;
