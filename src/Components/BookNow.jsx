import React, { useState } from 'react';

const seatStatuses = {
  available: 'bg-green-100 border-green-500 text-black',
  occupied: 'bg-red-100 border-red-500 text-black',
  reserved: 'bg-yellow-100 border-yellow-500 text-black',
  selected: 'bg-blue-100 border-blue-500 text-black',
};

const initialSeatMap = {
  A1: 'occupied', A2: 'occupied', A3: 'reserved', A4: 'available', A5: 'occupied', A6: 'reserved', A7: 'reserved', A8: 'reserved',
  B1: 'reserved', B2: 'occupied', B3: 'reserved', B4: 'available', B5: 'available', B6: 'reserved', B7: 'reserved', B8: 'occupied',
  C1: 'reserved', C2: 'available', C3: 'occupied', C4: 'available', C5: 'available', C6: 'available', C7: 'occupied', C8: 'reserved',
  D1: 'occupied', D2: 'occupied', D3: 'available', D4: 'reserved', D5: 'reserved', D6: 'reserved', D7: 'available', D8: 'occupied',
  E1: 'reserved', E2: 'reserved', E3: 'reserved', E4: 'available', E5: 'reserved', E6: 'available', E7: 'reserved', E8: 'occupied',
  F1: 'available', F2: 'available', F3: 'occupied', F4: 'reserved', F5: 'available', F6: 'available', F7: 'reserved', F8: 'available',
  G1: 'reserved', G2: 'available', G3: 'available', G4: 'reserved', G5: 'occupied', G6: 'available', G7: 'occupied', G8: 'available',
  H1: 'reserved', H2: 'reserved', H3: 'reserved', H4: 'reserved', H5: 'reserved', H6: 'reserved', H7: 'reserved', H8: 'reserved',
};

const SeatLayout = () => {
  const [seats, setSeats] = useState(initialSeatMap);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSelect = (seatId) => {
    if (seats[seatId] === 'occupied' || seats[seatId] === 'reserved') return;

    const newSeats = { ...seats };
    // Reset previous selected seat
    if (selectedSeat) newSeats[selectedSeat] = 'available';
    // Mark new seat as selected
    newSeats[seatId] = 'selected';

    setSeats(newSeats);
    setSelectedSeat(seatId);
  };

  const renderSeat = (seatId) => (
    <button
      key={seatId}
      onClick={() => handleSelect(seatId)}
      className={`w-12 h-12 rounded border font-semibold ${seatStatuses[seats[seatId]]}`}
    >
      {seatId}
    </button>
  );

  const seatGrid = [];
  const rows = 'ABCDEFGH';
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 1; j <= 8; j++) {
      const seatId = `${rows[i]}${j}`;
      row.push(renderSeat(seatId));
    }
    seatGrid.push(
      <div key={i} className="flex gap-2">
        {row}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Floor Plan - Level 1</h2>

      <div className="flex items-center gap-4 mb-6">
        <Legend color="green-400" label="Available" />
        <Legend color="red-400" label="Occupied" />
        <Legend color="yellow-400" label="Reserved" />
        <Legend color="blue-400" label="Selected" />
      </div>

      <div className="flex flex-col gap-2">{seatGrid}</div>

      {selectedSeat && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-400 rounded-lg text-blue-900 font-medium w-fit">
          ✅ Seat <strong>{selectedSeat}</strong> selected. <button className="underline text-blue-700 hover:text-blue-900">Book Now</button>
        </div>
      )}
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span className={`w-4 h-4 rounded-full bg-${color}`}></span>
    <span className="text-gray-800 text-sm">{label}</span>
  </div>
);

export default SeatLayout;
