const pool = require('../db');

exports.getSeats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats WHERE status = $1', ['free']);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
