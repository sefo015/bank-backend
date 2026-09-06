const express = require('express');
const { getBalanceAndTransactions, makeTransfer, applyForLoan } = require('../controllers/bankController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/balance', protect, getBalanceAndTransactions);
router.post('/transfer', protect, makeTransfer);
router.post('/loan', protect, applyForLoan);

module.exports = router;