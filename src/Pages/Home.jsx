import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/floorcard.jsx';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import Features from "../Components/Features.jsx";
import axios from "axios";

function Home({ isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(location.state?.success || "");
  const floorRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  const [mySeat, setMySeat] = useState(null);

  const scrollToFloor = () => floorRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFooter = () => footerRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSelectFloor = (floor) => {
    navigate(`/floorplan/${floor}`);
  };

  // Fetch user's seat
  const fetchMySeat = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setMySeat(null);
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id || payload.sub;
    const res = await axios.get("http://localhost:5000/api/seats");
    const found = res.data.find(
      seat =>
        seat.user_id === userId &&
        (seat.status === "booked" || seat.status === "confirmed")
    );
    setMySeat(found || null);
  };

  useEffect(() => {
    fetchMySeat();
    // Clear success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, successMessage]);

  const handleVacate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/cancel",
        { seat_id: mySeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Seat released successfully!");
      fetchMySeat();
    } catch (err) {
      setSuccessMessage(err.response?.data?.error || "Vacate failed");
    }
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

        {/* Premium Toast Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <Hero scrollToFloor={scrollToFloor} scrollToFeatures={scrollToFeatures} />

        <div ref={floorRef}>
          <Floorcard onSelectFloor={handleSelectFloor} />
        </div>

        {mySeat && (
          <div className="flex justify-center my-8">
            <button
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl shadow-lg text-lg font-semibold hover:scale-105 transition-transform"
              onClick={handleVacate}
            >
              Set my seat free (Seat {mySeat.seat_number}, Floor {mySeat.floor})
            </button>
          </div>
        )}
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
