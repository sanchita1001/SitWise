const pool = require('../db');

exports.confirmSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.sub;
  try {
    const result = await pool.query(
      `UPDATE seats
       SET status = 'confirmed'
       WHERE id = $1 AND user_id = $2 AND status = 'booked'
       RETURNING *`,
      [seat_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Seat cannot be confirmed' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
