import React from 'react'
import { Coffee, BookOpen } from "lucide-react";

function FloorCard() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="text-xl md:text-6xl font-bold text-black text-center mb-10">
        Choose Your <span className="text-blue-500">Floor</span>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {/* Card 1 */}
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Ground Floor</h2>
            </div>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">Floor 1</span>
          </div>
          {/* Available Seats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Available Seats</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="font-semibold text-gray-900">45/120</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                style={{ width: "37.5%" }}
              ></div>
            </div>
            {/* Limited Seats Badge */}
            <div className="flex justify-center">
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Limited Seats</span>
            </div>
          </div>
          {/* Social & Collaborative Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social & Collaborative</h3>
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Group Study</span>
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Casual Reading</span>
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Coffee Area</span>
            </div>
          </div>
          {/* Select Floor Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            Select Floor
          </button>
        </div>
        {/* Card 2 */}
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">First Floor</h2>
            </div>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">Floor 2</span>
          </div>
          {/* Available Seats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Available Seats</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="font-semibold text-gray-900">60/120</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
            {/* Limited Seats Badge */}
            <div className="flex justify-center">
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Limited Seats</span>
            </div>
          </div>
          {/* Quiet & Study Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quiet & Study</h3>
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Silent Study</span>
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Reference Books</span>
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Reading Area</span>
            </div>
          </div>
          {/* Select Floor Button */}
          <button className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            Select Floor
          </button>
        </div>
      </div>
    </div>
  )
}

export default FloorCard