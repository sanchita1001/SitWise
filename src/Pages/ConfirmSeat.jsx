import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ConfirmSeat = () => {
  const { seatId } = useParams();
  const [seat, setSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Fetch seat details with retry logic
  const fetchSeat = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.get(`${API_URL}/api/seats`);
      const found = res.data.find(s => s.id === parseInt(seatId, 10));
      if (!found) {
        setApiError("Seat not found.");
      }
      setSeat(found || null);
    } catch (err) {
      setApiError("Failed to load seat. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [seatId]);

  useEffect(() => {
    fetchSeat();
  }, [fetchSeat, retryCount]);

  const handleConfirm = async () => {
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApiError("You must be logged in to book a seat.");
        return;
      }
      await axios.post(
        `${API_URL}/api/seats/book`,
        { seat_id: seatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/checkin/${seatId}`);
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        "Booking failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" aria-busy="true">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <span className="text-lg font-semibold">Loading seat details…</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" role="alert">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
          <div className="mb-4 text-gray-700">{apiError}</div>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setRetryCount(c => c + 1)}
            aria-label="Retry loading seat"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!seat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" role="status">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Seat not found</h2>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Seat</h2>
        <div className="mb-4 text-lg">
          <span className="font-semibold">Seat:</span> {seat.seat_number}
        </div>
        <div className="mb-6 text-lg">
          <span className="font-semibold">Floor:</span> {seat.floor}
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleConfirm}
          aria-label={`Confirm booking for seat ${seat.seat_number} on floor ${seat.floor}`}
        >
          Confirm
        </button>
        {apiError && (
          <div className="text-red-500 mt-4" role="alert">{apiError}</div>
        )}
      </div>
    </div>
  );
};

export default ConfirmSeat;