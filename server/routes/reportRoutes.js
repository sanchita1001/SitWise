const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportSeat');

// This will now handle POST /api/reports
router.post('/', reportController.reportSeat);

module.exports = router;
