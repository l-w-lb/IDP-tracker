// const express = require('express');
// const router = express.Router();
// const approvalListControllers = require('../controllers/approvalListController.js')

// router.get('/get-approval-list', approvalListControllers.getApprovalList);

// module.exports = router;

const express = require('express');
const router = express.Router();
const approvalListControllers = require('../controllers/approvalListControllers.js')

router.post('/get-approval-list', approvalListControllers.getApprovalList);

module.exports = router;
