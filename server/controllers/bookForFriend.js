import db from '../db.js';
import supabaseAdmin from '../supabase/client.js'; // Ensure this correctly exports your initialized Supabase admin client

export const bookForFriend = async (req, res) => {
  const { seatId, friendEmail } = req.body; // bookedByUserId can be taken from req.user.id in a middleware

  try {
    // Validate request
    if (!seatId || !friendEmail) { // bookedByUserId is likely from auth middleware, not directly from body
      return res.status(400).json({ message: "Missing required fields." });
    }

    // --- CRITICAL CHANGE HERE ---
    // Fetch user by email using Supabase Admin SDK's listUsers and filter
    const { data: { users }, error: supabaseError } = await supabaseAdmin.auth.admin.listUsers({
        email: friendEmail
    });

    if (supabaseError) {
      console.error("[bookForFriend] Supabase error listing users:", supabaseError.message);
      return res.status(500).json({ message: "Error fetching friend details." });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Friend not found with the provided email. Please ensure they have a registered account." });
    }

    const friendUserId = users[0].id; // Get the ID of the found user
    // --- END CRITICAL CHANGE ---

    // --- You should also add the transaction and locking logic from the more robust version ---
    // The current code is missing:
    // 1. Transactions (BEGIN, COMMIT, ROLLBACK)
    // 2. Row locking (FOR UPDATE)
    // 3. Checking if the friend already has a seat and freeing it
    // 4. More robust seat status checks
    // 5. Server-side @thapar.edu email validation

    // This part should ideally be wrapped in a transaction
    // const client = await db.connect(); // Get a client for transaction
    // try {
    //     await client.query('BEGIN');

    // Check if seat exists and is available, and lock it
    const seatResult = await db.query("SELECT * FROM seats WHERE id = $1 FOR UPDATE", [seatId]); // Add FOR UPDATE
    if (seatResult.rows.length === 0) {
      // await client.query('ROLLBACK');
      return res.status(404).json({ message: "Seat not found." });
    }

    const seat = seatResult.rows[0];
    if (seat.status !== 'free') {
      // await client.query('ROLLBACK');
      return res.status(409).json({ message: "Seat is already booked or occupied." });
    }

    // Optional: Implement "One Seat Per Friend" logic here (inside the transaction)
    // const friendCurrentSeatRes = await client.query(
    //     "SELECT id FROM seats WHERE user_id = $1 AND (status = 'booked' OR status = 'confirmed') FOR UPDATE",
    //     [friendUserId]
    // );
    // if (friendCurrentSeatRes.rowCount > 0) {
    //     const oldSeatId = friendCurrentSeatRes.rows[0].id;
    //     await client.query(
    //         `UPDATE seats SET status = 'free', user_id = NULL, booked_at = NULL, expires_at = NULL WHERE id = $1`,
    //         [oldSeatId]
    //     );
    // }

    // Update seat to be booked for friend
    await db.query( // Should be client.query if using transactions
      `UPDATE seats
       SET status = 'booked', user_id = $1, booked_at = NOW(), expires_at = NOW() + INTERVAL '1 hour'
       WHERE id = $2`,
      [friendUserId, seatId]
    );

    // await client.query('COMMIT');
    return res.status(200).json({ message: `Seat booked for ${friendEmail}` });

  } catch (err) {
    // await client.query('ROLLBACK');
    console.error("[bookForFriend] Unexpected error:", err);
    // Add specific error handling for type mismatch if user_id in seats is UUID and friendUserId is string UUID
    if (err.code === '22P02') { // Common PostgreSQL error for invalid text representation/UUID type mismatch
        return res.status(400).json({ message: 'Database type mismatch error. Ensure user IDs are compatible (e.g., both UUIDs).' });
    }
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    // if (client) client.release(); // Release the client if using transactions
  }
};