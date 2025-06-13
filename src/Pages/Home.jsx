import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/floorcard.jsx';
import Floorplan from '../Components/Floorplan.jsx'; 
import Navbar from "../Components/Navbar.jsx";

function Home() {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const location = useLocation();
  const successMessage = location.state?.success;

  return (
    <div>
      <Navbar />
      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center mt-4 mx-4">
          {successMessage}
        </div>
      )}
      <Hero />

      {!selectedFloor ? (
        <Floorcard onSelectFloor={(floor) => setSelectedFloor(floor)} />
      ) : (
        <div className="p-4">
          <button
            onClick={() => setSelectedFloor(null)}
            className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            ← Back to Floor Selection
          </button>
          <Floorplan floor={selectedFloor} />
        </div>
      )}
    </div>
  );
}

export default Home;
