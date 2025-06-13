import React, { useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/floorcard.jsx';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import Features from "../Components/Features.jsx";

function Home({ isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.success;

  const floorRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  const scrollToFloor = () => {
    floorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <Navbar
          isLoggedIn={isLoggedIn}
          onContactClick={scrollToFooter}
          onFeaturesClick={scrollToFeatures}
        />
        
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center mt-4 mx-4">
            {successMessage}
          </div>
        )}

        <Hero scrollToFloor={scrollToFloor} scrollToFeatures={scrollToFeatures} />

        <div ref={floorRef}>
          <Floorcard onSelectFloor={handleSelectFloor} />
        </div>
      </motion.div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <Features />
      </div>

      {/* Footer Section */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}

export default Home;
