import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CheckIn = () => {
  const { seatId } = useParams();
  const [timer, setTimer] = useState(300); // 5 minutes
  const [seat, setSeat] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Get user id from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id || payload.sub);
    } catch {
      setUserId(null);
    }
  }, []);

  // Fetch seat info with retry logic
  const fetchSeat = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.get(`${API_URL}/api/seats`);
      const found = res.data.find(s => s.id === parseInt(seatId, 10));
      setSeat(found || null);
    } catch {
      setApiError("Failed to load seat. Please check your connection.");
      setSeat(null);
    } finally {
      setLoading(false);
    }
  }, [seatId]);

  useEffect(() => {
    fetchSeat();
  }, [fetchSeat, retryCount]);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle confirm check-in
  const handleConfirm = async () => {
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/seats/confirm`,
        { seat_id: seatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/", { state: { success: "Seat checked in successfully!" } });
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        "Check-in failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" aria-busy="true">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <span className="text-lg font-semibold">Loading seat…</span>
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

  if (!seat || userId === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" aria-busy="true">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <span className="text-lg font-semibold">Loading…</span>
        </div>
      </div>
    );
  }

  // If seat not found
  if (!seat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-500">Seat not found</h2>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-4"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // If seat is not booked for this user
  if (seat.status !== "booked" || seat.user_id !== userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-500">Seat cannot be confirmed</h2>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-4"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Check In</h2>
        <div className="mb-2 text-lg">
          <span className="font-semibold">Seat:</span> {seat.seat_number}
        </div>
        <div className="mb-4 text-lg">
          <span className="font-semibold">Floor:</span> {seat.floor}
        </div>
        <div className="mb-6 text-3xl font-mono" aria-live="polite">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={handleConfirm}
          disabled={timer <= 0}
          aria-disabled={timer <= 0}
        >
          Confirm Check-in
        </button>
        {timer <= 0 && (
          <div className="text-red-500 mt-4" role="alert">
            Time expired! Please book again.
          </div>
        )}
        {apiError && (
          <div className="text-red-500 mt-4" role="alert">{apiError}</div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;