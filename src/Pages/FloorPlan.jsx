import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const seatColors = {
  available: "bg-green-100 border-green-400 text-green-800",
  booked: "bg-yellow-100 border-yellow-400 text-yellow-800",
  confirmed: "bg-red-100 border-red-400 text-red-800",
  selected: "bg-blue-100 border-blue-400 text-blue-800",
};

const mapStatus = (seat, userId) => {
  if (seat.status === "free") return "available";
  if (seat.status === "booked" && seat.user_id === userId) return "selected";
  if (seat.status === "booked") return "booked";
  if (seat.status === "confirmed" && seat.user_id === userId) return "selected";
  if (seat.status === "confirmed") return "confirmed";
  return "available";
};

const FloorPlan = () => {
  const { floorId } = useParams();
  const floor = parseInt(floorId, 10);
  const [seats, setSeats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

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

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.get(`${API_URL}/api/seats`);
      setSeats(res.data);
    } catch {
      setApiError("Failed to load seats. Please check your connection.");
      setSeats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats, floor, retryCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" aria-busy="true">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <span className="text-lg font-semibold">Loading seats…</span>
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
            aria-label="Retry loading seats"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredSeats = seats.filter(seat => seat.floor === floor);

  if (filteredSeats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50" role="status">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700">No seats found for this floor.</h2>
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
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white relative">
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floor}</h1>
      <div className="flex flex-wrap gap-3 justify-center" aria-label={`Seats for floor ${floor}`}>
        {filteredSeats.map((seat) => {
          const status = mapStatus(seat, userId);
          return (
            <button
              key={seat.id}
              onClick={() => navigate(`/confirm/${seat.id}`)}
              className={`w-14 h-14 rounded-lg font-medium text-sm border-2 flex items-center justify-center ${seatColors[status]} ${
                status === "available" || status === "selected"
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              disabled={status !== "available" && status !== "selected"}
              aria-label={`Seat ${seat.seat_number} is ${status}`}
            >
              {seat.seat_number}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlan;