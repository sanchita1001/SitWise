const pool = require('../db');

exports.bookSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.sub; // Use user id from JWT
  try {
    const bookedAt = new Date();
    const expiresAt = new Date(bookedAt.getTime() + 5 * 60000); // 5 min

    const result = await pool.query(
      `UPDATE seats
       SET status = 'booked', user_id = $1, booked_at = $2, expires_at = $3
       WHERE id = $4 AND status = 'free'
       RETURNING *`,
      [user_id, bookedAt, expiresAt, seat_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Seat not available' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
