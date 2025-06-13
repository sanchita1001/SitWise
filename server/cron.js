const pool = require('./db');

async function releaseExpiredSeats() {
  try {
    await pool.query(
      `UPDATE seats
       SET status = 'free', user_id = NULL, booked_at = NULL, expires_at = NULL
       WHERE status = 'booked' AND expires_at < now()`
    );
    console.log('Expired seats released');
  } catch (err) {
    console.error('Error releasing seats:', err.message);
  }
}

setInterval(releaseExpiredSeats, 60 * 1000); // Run every minute
