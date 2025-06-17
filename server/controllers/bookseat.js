const pool = require('../db');

/**
 * Book a seat for the authenticated user.
 * Handles all edge cases and prevents race conditions.
 */
exports.bookSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.id;

  if (!seat_id) {
    return res.status(400).json({ error: 'Seat ID is required.' });
  }

  try {
    await pool.query('BEGIN');

    // Lock the seat row for update to prevent race conditions
    const seatRes = await pool.query(
      'SELECT * FROM seats WHERE id = $1 FOR UPDATE',
      [seat_id]
    );
    if (seatRes.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Seat does not exist.' });
    }
    const seat = seatRes.rows[0];

    // Prevent booking if seat is already booked/confirmed by another user
    if (
      (seat.status === 'booked' || seat.status === 'confirmed') &&
      seat.user_id !== user_id
    ) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'Seat is already booked or confirmed by another user.' });
    }

    // Prevent double booking by the same user
    if (
      (seat.status === 'booked' || seat.status === 'confirmed') &&
      seat.user_id === user_id
    ) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'You have already booked or confirmed this seat.' });
    }

    // Prevent user from booking more than one seat
    const userSeatRes = await pool.query(
      "SELECT * FROM seats WHERE user_id = $1 AND (status = 'booked' OR status = 'confirmed')",
      [user_id]
    );
    if (userSeatRes.rowCount > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'You have already booked another seat.' });
    }

    // Book the seat
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
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'Seat not available or already taken.' });
    }

    await pool.query('COMMIT');
    res.status(200).json(result.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('[BookSeat] Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};