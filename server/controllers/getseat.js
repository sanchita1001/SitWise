const pool = require('../db');
exports.getSeats = async (req, res) => {
  try {
    // Query the seats table in the database (get ALL seats)
    const result = await pool.query('SELECT * FROM seats ORDER BY seat_number ASC');
    // Return the result as a JSON object
    res.json(result.rows);
  } catch (err) {
    // Log any errors to the console
    console.error(err.message);
    // Return a 500 error with a JSON object containing the error message
    res.status(500).json({ error: 'Server error' });
  }
};
