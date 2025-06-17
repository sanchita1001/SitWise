const pool = require('../db');

/**
 * Cancel a booked or confirmed seat for the authenticated user.
 */
exports.cancelSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.id;

  if (!seat_id) {
    return res.status(400).json({ error: 'Seat ID is required.' });
  }

  try {
    const result = await pool.query(
      `UPDATE seats
       SET status = 'free', user_id = NULL, booked_at = NULL, expires_at = NULL
       WHERE id = $1 AND user_id = $2 AND (status = 'booked' OR status = 'confirmed')
       RETURNING *`,
      [seat_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ error: 'Seat cannot be cancelled. It may not be booked/confirmed or may belong to another user.' });
    }

    res.status(200).json({ message: 'Seat cancelled successfully.', seat: result.rows[0] });
  } catch (err) {
    console.error('[CancelSeat] Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
