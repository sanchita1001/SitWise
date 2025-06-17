import React from 'react';
import { Coffee, BookOpen, ArrowRight, XCircle } from "lucide-react";

function FloorCard({ onSelectFloor, seats = [], isLoggedIn }) {
  // Calculate available and total seats for each floor
  const getAvailable = (floor) =>
    seats.filter(seat => seat.floor === floor && seat.status === "free").length;
  const getTotal = (floor) =>
    seats.filter(seat => seat.floor === floor).length;

  // Status label logic
  const getStatusLabel = (available, total) => {
    if (total === 0) return "No Data";
    if (available === 0) return "Full";
    if (available < 0.2 * total) return "Limited Seats";
    if (available < 0.5 * total) return "Moderate Seats";
    return "Seats Available";
  };

  // Status color logic
  const getStatusColor = (available, total, floor) => {
    if (total === 0) return floor === 1 ? "orange" : "green";
    if (available === 0) return "red";
    if (available < 0.2 * total) return floor === 1 ? "orange" : "green";
    if (available < 0.5 * total) return floor === 1 ? "orange" : "green";
    return floor === 1 ? "orange" : "green";
  };

  // Helper for button content
  const FloorButton = ({ floor, color, children }) => (
    <button
      onClick={() => isLoggedIn && onSelectFloor(floor)}
      aria-label={`View seats for Floor ${floor}`}
      disabled={!isLoggedIn}
      className={`
        w-full flex items-center justify-center gap-2 font-bold py-3 rounded-2xl shadow-md transition-all duration-200
        transform focus:outline-none focus:ring-2 focus:ring-${color}-300
        ${isLoggedIn
          ? `bg-gradient-to-r from-${color}-500 to-${color}-400 hover:from-${color}-600 hover:to-${color}-500 text-white hover:scale-[1.03] active:scale-[0.98] cursor-pointer`
          : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        group
      `}
    >
      {children}
      {isLoggedIn ? (
        <ArrowRight className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
      )}
    </button>
  );

  // Floor 1 data
  const floor1Available = getAvailable(1);
  const floor1Total = getTotal(1);
  const floor1Status = getStatusLabel(floor1Available, floor1Total);
  const floor1Color = getStatusColor(floor1Available, floor1Total, 1);

  // Floor 2 data
  const floor2Available = getAvailable(2);
  const floor2Total = getTotal(2);
  const floor2Status = getStatusLabel(floor2Available, floor2Total);
  const floor2Color = getStatusColor(floor2Available, floor2Total, 2);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-2 min-h-screen bg-white">
      <div className="text-2xl md:text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
        Choose Your <span className="text-blue-600">Floor</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Floor 1 Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-blue-100 p-7 transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                <Coffee className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ground Floor</h2>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-4 py-1 rounded-full shadow-sm">
              Floor 1
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium">Available Seats</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="font-bold text-gray-900">
                  {floor1Available}/{floor1Total}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all"
                style={{
                  width: floor1Total
                    ? `${(floor1Available / floor1Total) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full
                ${
                  floor1Status === "Full"
                    ? "text-red-600 bg-red-50"
                    : floor1Status === "Limited Seats"
                    ? "text-orange-600 bg-orange-50"
                    : floor1Status === "Moderate Seats"
                    ? "text-yellow-700 bg-yellow-50"
                    : "text-green-700 bg-green-50"
                }
              `}>
                {floor1Status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Social & Collaborative</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Group Study</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Casual Reading</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Coffee Area</span>
            </div>
          </div>

          <FloorButton floor={1} color="blue">
            Floor 1 Seats
          </FloorButton>
        </div>

        {/* Floor 2 Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-green-100 p-7 transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-inner">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">First Floor</h2>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-4 py-1 rounded-full shadow-sm">
              Floor 2
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium">Available Seats</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-bold text-gray-900">
                  {floor2Available}/{floor2Total}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                style={{
                  width: floor2Total
                    ? `${(floor2Available / floor2Total) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full
                ${
                  floor2Status === "Full"
                    ? "text-red-600 bg-red-50"
                    : floor2Status === "Limited Seats"
                    ? "text-orange-600 bg-orange-50"
                    : floor2Status === "Moderate Seats"
                    ? "text-yellow-700 bg-yellow-50"
                    : "text-green-700 bg-green-50"
                }
              `}>
                {floor2Status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quiet & Study</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Silent Study</span>
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Reference Books</span>
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Reading Area</span>
            </div>
          </div>

          <FloorButton floor={2} color="green">
            Floor 2 Seats
          </FloorButton>
        </div>
      </div>
    </div>
  );
}

export default FloorCard;
