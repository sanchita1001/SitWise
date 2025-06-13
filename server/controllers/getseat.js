const pool = require('../db');

/**
 * @function getSeats
 * @description Gets all available seats from the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} A JSON object containing all available seats.
 */
exports.getSeats = async (req, res) => {
  try {
    // Query the seats table in the database
    const result = await pool.query('SELECT * FROM seats WHERE status = $1', ['free']);
    // Return the result as a JSON object
    res.json(result.rows);
  } catch (err) {
    // Log any errors to the console
    console.error(err.message);
    // Return a 500 error with a JSON object containing the error message
    res.status(500).json({ error: 'Server error' });
  }
};
   