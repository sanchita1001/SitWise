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
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // book, vacate, switch
  const [popupSeat, setPopupSeat] = useState(null);

  useEffect(() => {
    setSeats(generateSeats());
    setSelectedSeat(null);
  }, [floor]);

  const getSeatLabel = (rowIdx, colIdx) =>
    `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`;

  const handleSeatClick = (rowIdx, colIdx) => {
    const currentStatus = seats[rowIdx][colIdx];
    const clickedSeat = [rowIdx, colIdx];

    // Seat is already selected, ask to vacate
    if (
      selectedSeat &&
      selectedSeat[0] === rowIdx &&
      selectedSeat[1] === colIdx &&
      currentStatus === "selected"
    ) {
      setPopupType("vacate");
      setPopupSeat(clickedSeat);
      setShowPopup(true);
    }

    // First time selecting an available seat
    else if (!selectedSeat && currentStatus === "available") {
      setPopupType("book");
      setPopupSeat(clickedSeat);
      setShowPopup(true);
    }

    // Clicking another available seat while one is already selected
    else if (
      selectedSeat &&
      currentStatus === "available" &&
      (selectedSeat[0] !== rowIdx || selectedSeat[1] !== colIdx)
    ) {
      setPopupType("switch");
      setPopupSeat(clickedSeat);
      setShowPopup(true);
    }
  };

  const handleBook = () => {
    const [row, col] = popupSeat;
    const updatedSeats = seats.map((r, rIdx) =>
      r.map((seat, cIdx) =>
        rIdx === row && cIdx === col ? "selected" : seat
      )
    );
    setSeats(updatedSeats);
    setSelectedSeat(popupSeat);
    setShowPopup(false);
    setPopupSeat(null);
  };

  const handleVacate = () => {
    const [row, col] = popupSeat;
    const updatedSeats = seats.map((r, rIdx) =>
      r.map((seat, cIdx) =>
        rIdx === row && cIdx === col ? "available" : seat
      )
    );
    setSeats(updatedSeats);
    setSelectedSeat(null);
    setShowPopup(false);
    setPopupSeat(null);
  };

  const handleSwitch = () => {
    const [newRow, newCol] = popupSeat;
    const [oldRow, oldCol] = selectedSeat;

    const updatedSeats = seats.map((row, rIdx) =>
      row.map((seat, cIdx) => {
        if (rIdx === oldRow && cIdx === oldCol) return "available";
        if (rIdx === newRow && cIdx === newCol) return "selected";
        return seat;
      })
    );

    setSeats(updatedSeats);
    setSelectedSeat([newRow, newCol]);
    setShowPopup(false);
    setPopupSeat(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white relative">
      <h1 className="text-3xl font-bold mb-6">Floor Plan - Level {floor}</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {Object.entries(seatColors).map(([key, className]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border ${seatColors[key]}`} />
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

      {/* Popup */}
      {showPopup && popupSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4 text-center">
            {popupType === "book" && (
              <>
                <h2 className="text-lg font-semibold">
                  Do you want to book seat {getSeatLabel(...popupSeat)}?
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
                  Do you want to vacate seat {getSeatLabel(...popupSeat)}?
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
                  You already booked seat {getSeatLabel(...selectedSeat)}.
                  <br />
                  Do you want to switch to seat {getSeatLabel(...popupSeat)}?
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
