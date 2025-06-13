import React, { useState, useEffect } from "react";

const seatColors = {
  available: "bg-green-100 border-green-400 text-green-800",
  occupied: "bg-red-100 border-red-400 text-red-800",
  reserved: "bg-yellow-100 border-yellow-400 text-yellow-800",
  selected: "bg-blue-100 border-blue-400 text-blue-800",
};

const generateSeats = () => {
  const statuses = ["available", "occupied", "reserved"];
  const grid = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      row.push(statuses[Math.floor(Math.random() * statuses.length)]);
    }
    grid.push(row);
  }
  return grid;
};

const FloorPlan = ({ floor }) => {
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSeats(generateSeats());
    setSelectedSeat(null);
    setShowModal(false);
  }, [floor]);

  const handleSeatClick = (rowIdx, colIdx) => {
    const currentStatus = seats[rowIdx][colIdx];

    if (currentStatus === "available") {
      if (selectedSeat && selectedSeat[0] === rowIdx && selectedSeat[1] === colIdx) {
        // Deselect if clicking same selected seat
        setSeats((prev) =>
          prev.map((row, rIdx) =>
            row.map((seat, cIdx) =>
              rIdx === rowIdx && cIdx === colIdx ? "available" : seat
            )
          )
        );
        setSelectedSeat(null);
        setShowModal(false);
      } else {
        // Select new seat
        setSeats((prev) =>
          prev.map((row, rIdx) =>
            row.map((seat, cIdx) => {
              if (seat === "selected") return "available";
              if (rIdx === rowIdx && cIdx === colIdx) return "selected";
              return seat;
            })
          )
        );
        setSelectedSeat([rowIdx, colIdx]);
        setShowModal(true);
      }
    }
  };

  const handleCancel = () => {
    if (!selectedSeat) return;
    const [rowIdx, colIdx] = selectedSeat;
    setSeats((prev) =>
      prev.map((row, rIdx) =>
        row.map((seat, cIdx) =>
          rIdx === rowIdx && cIdx === colIdx ? "available" : seat
        )
      )
    );
    setSelectedSeat(null);
    setShowModal(false);
  };

  const handleBook = () => {
    setShowModal(false);
    // You can later add backend booking here
  };

  const getSeatLabel = (rowIdx, colIdx) => {
    const rowLetter = String.fromCharCode(65 + rowIdx);
    return `${rowLetter}${colIdx + 1}`;
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floor}</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {Object.entries(seatColors).map(([key, className]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border ${className}`} />
            <span className="capitalize text-gray-700 font-medium">{key}</span>
          </div>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="space-y-3">
        {seats.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-3">
            {row.map((status, colIdx) => (
              <button
                key={`${rowIdx}-${colIdx}`}
                onClick={() => handleSeatClick(rowIdx, colIdx)}
                className={`w-14 h-14 rounded-lg font-medium text-sm border-2 flex items-center justify-center ${seatColors[status]}`}
              >
                {getSeatLabel(rowIdx, colIdx)}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Confirm Seat:{" "}
              <span className="text-blue-600">
                {getSeatLabel(selectedSeat[0], selectedSeat[1])}
              </span>
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleBook}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Book Now
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;
