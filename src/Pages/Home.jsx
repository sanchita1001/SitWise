import React, { useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/floorcard.jsx';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

function Home({ isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.success;

  // 1. Create a ref for the Floorcard section
  const floorRef = useRef(null);
  const footerRef = useRef(null);

  // 2. Scroll function
  const scrollToFloor = () => {
    if (floorRef.current) {
      floorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectFloor = (floor) => {
    navigate(`/floorplan/${floor}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.4 }}
      >
        {/* Pass scrollToFooter to Navbar */}
        <Navbar isLoggedIn={isLoggedIn} onContactClick={scrollToFooter} />
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center mt-4 mx-4">
            {successMessage}
          </div>
        )}
        <Hero scrollToFloor={scrollToFloor} />
        <div ref={floorRef}>
          <Floorcard onSelectFloor={handleSelectFloor} />
        </div>
      </motion.div>
      {/* Attach ref to Footer */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}

export default Home;
