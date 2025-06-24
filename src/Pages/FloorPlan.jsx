import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const seatColors = {
  available: "bg-green-100 text-green-800 border-green-400",
  booked: "bg-yellow-100 text-yellow-800 border-yellow-400",
  confirmed: "bg-red-100 text-red-800 border-red-400",
  selected: "bg-blue-100 text-blue-800 border-blue-400",
  flagged: "bg-red-50 text-red-700 border-red-300", // new
};

const statusLabels = {
  available: "Available",
  booked: "Booked",
  confirmed: "Occupied",
  selected: "Your Seat",
  flagged: "Reported", // new
};
const mapStatus = (seat, userId) => {
  if (seat.is_under_review) return "flagged"; // override first
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
  const gridRef = useRef(null);

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

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [loading, seats, floor]);

  const handleReport = async (seatId) => {
    if (!userId) return alert("Please log in to report.");

    try {
      await axios.post(`${API_URL}/api/reports`, { seatId });
      alert("Seat reported. Thank you!");
      fetchSeats();
    } catch (err) {
      console.error("Report failed:", err);
      alert("Failed to report. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-80">
          <span className="text-gray-600 text-lg font-medium animate-pulse">Loading seats…</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-80">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{apiError}</p>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-80">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No seats found on this floor.
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
          Floor {floor} Plan
        </h1>
        <p className="text-gray-600 text-base sm:text-lg text-center mb-10">
          Select an available seat to reserve your spot.
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center"
        >
          {filteredSeats.map((seat) => {
            const status = mapStatus(seat, userId);
            return (
              <div key={seat.id} className="flex flex-col items-center">
                <button
                  onClick={() => navigate(`/confirm/${seat.id}`)}
                  disabled={status !== "available" && status !== "selected"}
                  className={`
                    relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl font-semibold text-lg border
                    flex items-center justify-center transition transform
                    ${seatColors[status]}
                    ${status === "available" || status === "selected"
                      ? "hover:scale-105 hover:shadow-md cursor-pointer"
                      : "opacity-60 cursor-not-allowed"}
                    focus:outline-none focus:ring-2 focus:ring-blue-300 group
                  `}
                  aria-label={`Seat ${seat.seat_number} is ${statusLabels[status]}`}
                >
                  <span className="text-2xl">{seat.seat_number}</span>
                  <span
                    className={`
                      absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-0.5 text-xs font-medium rounded-full border
                      ${
                        status === "available"
                          ? "bg-white text-green-700 border-green-300"
                          : status === "selected"
                          ? "bg-white text-blue-700 border-blue-300"
                          : status === "booked"
                          ? "bg-white text-yellow-700 border-yellow-300"
                          : "bg-white text-red-700 border-red-300"
                      }
                      group-hover:scale-105 transition transform
                    `}
                  >
                    {statusLabels[status]}
                  </span>
                  {status === "selected" && (
                    <span className="absolute inset-0 rounded-xl animate-pulse bg-blue-300/20 pointer-events-none" />
                  )}
                </button>

                {["confirmed"].includes(status) && (
                  <button
                    onClick={() => handleReport(seat.id)}
                    className="mt-2 text-xs text-red-600 underline hover:text-red-800 pt-3"
                  >
                    Report seat
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;
