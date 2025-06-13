import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/floorcard.jsx';
import Navbar from "../Components/Navbar.jsx";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.success;

  // Redirect to /floorplan/{floor} when a floor is selected
  const handleSelectFloor = (floor) => {
    navigate(`/floorplan/${floor}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center mt-4 mx-4">
          {successMessage}
        </div>
      )}
      <Hero />
      <Floorcard onSelectFloor={handleSelectFloor} />
    </motion.div>
  );
}

export default Home;
