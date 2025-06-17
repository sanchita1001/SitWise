const pool = require('../db');

/**
 * Confirm a booked seat for the authenticated user.
 * Only possible if the seat is currently booked by the user.
 */
exports.confirmSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.id;

  if (!seat_id) {
    return res.status(400).json({ error: 'Seat ID is required.' });
  }

  try {
    const result = await pool.query(
      `UPDATE seats
       SET status = 'confirmed'
       WHERE id = $1 AND user_id = $2 AND status = 'booked'
       RETURNING *`,
      [seat_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ error: 'Seat cannot be confirmed. It may not be booked or may belong to another user.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('[ConfirmSeat] Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
