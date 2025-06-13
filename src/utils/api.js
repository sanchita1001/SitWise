const BASE_URL = 'http://localhost:5000/api';  // Update this if deploying

// Fetch the current seat matrix (all seats + their status)
export async function fetchSeats() {
  const res = await fetch(`${BASE_URL}/seats`);
  if (!res.ok) throw new Error('Failed to fetch seats');
  return res.json();
}

// Book a seat (requires auth if protected)
export async function bookSeat(seatId, floor, userId, token) {
  const res = await fetch(`${BASE_URL}/seats/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ seatId, floor, userId })
  });
  if (!res.ok) throw new Error('Failed to book seat');
  return res.json();
}

// Confirm a seat (within 5 min timer)
export async function confirmSeat(seatId, token) {
  const res = await fetch(`${BASE_URL}/seats/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ seatId })
  });
  if (!res.ok) throw new Error('Failed to confirm seat');
  return res.json();
}

// Cancel a booking (or auto-cancel via cron)
export async function cancelSeat(seatId, token) {
  const res = await fetch(`${BASE_URL}/seats/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ seatId })
  });
  if (!res.ok) throw new Error('Failed to cancel seat');
  return res.json();
}
