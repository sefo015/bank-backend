const express = require('express');
const { getAllCustomers, getAllLoans, updateLoanStatus } = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/customers', protect, getAllCustomers);
router.get('/loans', protect, getAllLoans);
router.post('/loan-status', protect, updateLoanStatus);

module.exports = router;