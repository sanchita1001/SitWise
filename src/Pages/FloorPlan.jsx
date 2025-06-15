import React, { useState, useEffect } from "react";
import axios from "axios";

const seatColors = {
  available: "bg-green-100 border-green-400 text-green-800",
  booked: "bg-yellow-100 border-yellow-400 text-yellow-800",
  confirmed: "bg-red-100 border-red-400 text-red-800",
  selected: "bg-blue-100 border-blue-400 text-blue-800",
};

// Map backend status to UI status
const mapStatus = (seat, userId) => {
  if (seat.status === "free") return "available";
  if (seat.status === "booked" && seat.user_id === userId) return "selected";
  if (seat.status === "booked") return "booked";
  if (seat.status === "confirmed" && seat.user_id === userId) return "selected";
  if (seat.status === "confirmed") return "confirmed";
  return "available";
};

const FloorPlan = ({ floor }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // book, vacate, switch
  const [popupSeat, setPopupSeat] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user info (assumes JWT in localStorage)
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

  // Fetch seats from backend
  const fetchSeats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seats");
      setSeats(res.data);
      // Set selected seat if user has one booked/confirmed
      const found = res.data.find(
        (seat) =>
          seat.user_id === userId &&
          (seat.status === "booked" || seat.status === "confirmed")
      );
      setSelectedSeat(found ? found : null);
    } catch (err) {
      setSeats([]);
    }
  };

  useEffect(() => {
    fetchSeats();
    // eslint-disable-next-line
  }, [floor, userId]);

  const handleSeatClick = (seat) => {
    const status = mapStatus(seat, userId);

    if (selectedSeat && selectedSeat.id === seat.id && status === "selected") {
      setPopupType("vacate");
      setPopupSeat(seat);
      setShowPopup(true);
    } else if (!selectedSeat && status === "available") {
      setPopupType("book");
      setPopupSeat(seat);
      setShowPopup(true);
    } else if (
      selectedSeat &&
      status === "available" &&
      selectedSeat.id !== seat.id
    ) {
      setPopupType("switch");
      setPopupSeat(seat);
      setShowPopup(true);
    }
  };

  // Book seat
  const handleBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/book", // FULL URL
        { seat_id: popupSeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPopup(false);
      setPopupSeat(null);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  // Vacate seat
  const handleVacate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/cancel", // FULL URL
        { seat_id: popupSeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPopup(false);
      setPopupSeat(null);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.error || "Vacate failed");
    }
  };

  // Switch seat (cancel old, book new)
  const handleSwitch = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/cancel", // FULL URL
        { seat_id: selectedSeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        "http://localhost:5000/api/seats/book", // FULL URL
        { seat_id: popupSeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPopup(false);
      setPopupSeat(null);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.error || "Switch failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white relative">
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floor}</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full border ${seatColors.available}`} />
          <span className="capitalize text-gray-700 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full border ${seatColors.booked}`} />
          <span className="capitalize text-gray-700 font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full border ${seatColors.confirmed}`} />
          <span className="capitalize text-gray-700 font-medium">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full border ${seatColors.selected}`} />
          <span className="capitalize text-gray-700 font-medium">Your Seat</span>
        </div>
      </div>

      {/* Seat List */}
      <div className="flex flex-wrap gap-3 justify-center">
        {seats.map((seat) => {
          const status = mapStatus(seat, userId);
          return (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
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

      {/* Popup */}
      {showPopup && popupSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4 text-center">
            {popupType === "book" && (
              <>
                <h2 className="text-lg font-semibold">
                  Do you want to book seat {popupSeat.seat_number}?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleBook}
                  >
                    Book Seat
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {popupType === "vacate" && (
              <>
                <h2 className="text-lg font-semibold">
                  Do you want to vacate seat {popupSeat.seat_number}?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={handleVacate}
                  >
                    Vacant Seat
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {popupType === "switch" && (
              <>
                <h2 className="text-lg font-semibold">
                  You already booked seat {selectedSeat.seat_number}.
                  <br />
                  Do you want to switch to seat {popupSeat.seat_number}?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={handleSwitch}
                  >
                    Switch Seat
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;