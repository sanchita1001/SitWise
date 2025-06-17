const pool = require('../db');

/**
 * Get all seats, ordered by seat_number.
 */
exports.getSeats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats ORDER BY seat_number ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('[GetSeats] Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
