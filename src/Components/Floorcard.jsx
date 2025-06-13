import React from 'react';
import { Coffee, BookOpen, ArrowRight } from "lucide-react";

function FloorCard({ onSelectFloor }) {
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
                <span className="font-bold text-gray-900">45/120</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all"
                style={{ width: "37.5%" }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Limited Seats
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

          <button
            onClick={() => onSelectFloor(1)}
            aria-label="View seats for Floor 1"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Floor 1 Seats <ArrowRight className="w-5 h-5" />
          </button>
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
                <span className="font-bold text-gray-900">60/120</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                style={{ width: "50%" }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                Moderate Seats
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

          <button
            onClick={() => onSelectFloor(2)}
            aria-label="View seats for Floor 2"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Floor 2 Seats <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloorCard;
