import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/seats");
        setSeats(res.data);
      } catch {
        setSeats([]);
      }
    };
    fetchSeats();
  }, [floor]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white relative">
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floor}</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {seats
          .filter((seat) => seat.floor === floor)
          .map((seat) => {
            const status = mapStatus(seat, userId);
            return (
              <button
                key={seat.id}
                onClick={() => navigate(`/confirm/${seat.id}`)}
                className={`w-14 h-14 rounded-lg font-medium text-sm border-2 flex items-center justify-center ${seatColors[status]} ${
                  status === "available" || status === "selected"
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={status !== "available" && status !== "selected"}
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