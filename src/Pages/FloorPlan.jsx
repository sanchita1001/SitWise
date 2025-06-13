import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Define color classes for seat status
const seatColors = {
  available: "bg-green-100 border-green-400 text-green-800",
  occupied: "bg-red-100 border-red-400 text-red-800",
  reserved: "bg-yellow-100 border-yellow-400 text-yellow-800",
  selected: "bg-blue-100 border-blue-400 text-blue-800",
};

// Generate 8x8 matrix of random seat statuses
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

function FloorPlanPage() {
  const { floorId } = useParams();
  const [seats, setSeats] = useState(generateSeats());

  useEffect(() => {
    setSeats(generateSeats());
  }, [floorId]);

  const handleSeatClick = (rowIdx, colIdx) => {
    setSeats((prevSeats) =>
      prevSeats.map((row, rIdx) =>
        row.map((status, cIdx) =>
          rIdx === rowIdx && cIdx === colIdx && status === "available"
            ? "selected"
            : status
        )
      )
    );
  };

  // Convert row index (0–7) to A–H
  const getSeatLabel = (rowIdx, colIdx) => {
    const rowLetter = String.fromCharCode(65 + rowIdx);
    return `${rowLetter}${colIdx + 1}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white"
    >
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floorId}</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {Object.entries(seatColors).map(([key, className]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border ${className}`}></div>
            <span className="capitalize text-gray-700 font-medium">{key}</span>
          </div>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="space-y-3">
        {seats.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-3">
            {row.map((status, colIdx) => {
              const color = seatColors[status] || seatColors.available;
              const label = getSeatLabel(rowIdx, colIdx);

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleSeatClick(rowIdx, colIdx)}
                  className={`w-14 h-14 rounded-lg font-medium text-sm border-2 flex items-center justify-center ${color}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default FloorPlanPage;
