const express = require('express');
const router = express.Router();

const approvalListControllers = require('../controllers/approvalListControllers.js')
const PDFcontrollers = require('../controllers/PDFcontrollers');

router.post('/get-approval-list', approvalListControllers.getApprovalList);

router.post('/update-pdf-status', PDFcontrollers.updatePdfStatus);

module.exports = router;
