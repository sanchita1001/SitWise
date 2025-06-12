import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
        Smart Library Seat Booking <br />
        with <span className="text-[#3182ed]">SitWise</span>
      </h1>
      <p className="text-gray-500 text-lg md:text-xl max-w-2xl mb-8">
        Reserve your perfect study spot 5 minutes before arriving.
        Choose from 5 floors, find your ideal seat, and study with confidence.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-[#3182ed] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow flex items-center justify-center gap-2">
          <span>🕒</span> Book Your Seat Now
        </button>
        <button className="bg-white hover:bg-gray-100 border border-gray-300 text-black font-semibold py-3 px-6 rounded-lg shadow">
          View Floor Plans
        </button>
      </div>
    </div>
  );
}

export default App;
