import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CheckIn = () => {
  const { seatId } = useParams();
  const [timer, setTimer] = useState(300); // 5 minutes
  const [seat, setSeat] = useState(null);
  const [userId, setUserId] = useState(null);
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

  // Fetch seat info
  useEffect(() => {
    const fetchSeat = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/seats");
        const found = res.data.find(s => s.id === parseInt(seatId, 10));
        setSeat(found || null);
        // console.log("Seat at check-in:", found);
      } catch {
        setSeat(null);
      }
    };
    fetchSeat();
  }, [seatId]);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle confirm check-in
  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/confirm",
        { seat_id: seatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/", { state: { success: "Seat checked in successfully!" } });
    } catch (err) {
      alert(err.response?.data?.error || "Check-in failed");
    }
  };

  // Loading state
  if (!seat || userId === null) return <div>Loading...</div>;

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
        <div className="mb-6 text-3xl font-mono">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          onClick={handleConfirm}
          disabled={timer <= 0}
        >
          Confirm Check-in
        </button>
        {timer <= 0 && (
          <div className="text-red-500 mt-4">Time expired! Please book again.</div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;