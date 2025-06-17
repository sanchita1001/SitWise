const express = require('express');
const router = express.Router();
const { bookSeat } = require('../controllers/bookseat');
const { cancelSeat } = require('../controllers/cancelseat');
const { confirmSeat } = require('../controllers/confirmseat');
const { getSeats } = require('../controllers/getseat');
const auth = require('../middleware/auth');

router.get('/', getSeats);
router.post('/book', auth, bookSeat);
router.post('/confirm', auth, confirmSeat);
router.post('/cancel', auth, cancelSeat);
router.get('/seats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});

module.exports = router;
