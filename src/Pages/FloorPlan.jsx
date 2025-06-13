import React, { useState, useEffect } from "react";

// Define color classes
const seatColors = {
  available: "bg-green-100 border-green-400 text-green-800",
  occupied: "bg-red-100 border-red-400 text-red-800",
  reserved: "bg-yellow-100 border-yellow-400 text-yellow-800",
  selected: "bg-blue-100 border-blue-400 text-blue-800",
};

// Generate 8x8 matrix of seat statuses
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
  const [selectedSeat, setSelectedSeat] = useState(null); // Store selected seat coordinates

  useEffect(() => {
    setSeats(generateSeats());
    setSelectedSeat(null);
  }, [floor]);

  const handleSeatClick = (rowIdx, colIdx) => {
    const currentStatus = seats[rowIdx][colIdx];

    if (currentStatus === "available") {
      // If clicking same selected seat, deselect
      if (selectedSeat && selectedSeat[0] === rowIdx && selectedSeat[1] === colIdx) {
        setSeats((prev) =>
          prev.map((row, rIdx) =>
            row.map((seat, cIdx) =>
              rIdx === rowIdx && cIdx === colIdx ? "available" : seat
            )
          )
        );
        setSelectedSeat(null);
      } else {
        // Deselect any previous, select the new one
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
      }
    }
  };

  const getSeatLabel = (rowIdx, colIdx) => {
    const rowLetter = String.fromCharCode(65 + rowIdx); // A = 65
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
    </div>
  );
};

export default FloorPlan;
