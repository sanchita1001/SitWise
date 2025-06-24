const pool = require('../db');

exports.reportSeat = async (req, res) => {
  const { seatId } = req.body;

  if (!seatId) {
    return res.status(400).json({ message: 'seatId is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE seats SET is_under_review = true WHERE id = $1 RETURNING *',
      [seatId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.status(200).json({ message: 'Seat reported successfully' });
  } catch (error) {
    console.error('❌ Error reporting seat:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
