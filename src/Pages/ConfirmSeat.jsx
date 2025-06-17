import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ConfirmSeat = () => {
  const { seatId } = useParams();
  const [seat, setSeat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeat = async () => {
      const res = await axios.get("http://localhost:5000/api/seats");
      const found = res.data.find(s => s.id === parseInt(seatId, 10));
      setSeat(found);
    };
    fetchSeat();
  }, [seatId]);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/seats/book",
        { seat_id: seatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Booking response:", res.data);
      navigate(`/checkin/${seatId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  if (!seat) return <div>Loading...</div>;

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
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmSeat;