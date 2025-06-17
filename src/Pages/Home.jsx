import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../Components/Hero.jsx";
import Floorcard from '../Components/Floorcard.jsx';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import Features from "../Components/Features.jsx";
import HowItWorks from "../Components/HowItWorks";
import axios from "axios";
import LeaveSeat from "../Components/LeaveSeat";

function Home({ isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(location.state?.success || "");
  const floorRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  const [mySeat, setMySeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [vacateLoading, setVacateLoading] = useState(false);

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

  // Fetch all seats for real-time updates
  const fetchSeats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seats");
      setSeats(res.data);
    } catch {
      setSeats([]);
    }
  };

  useEffect(() => {
    fetchMySeat();
    fetchSeats();
    const interval = setInterval(() => {
      fetchSeats();
      fetchMySeat();
    }, 20000); // every 20 seconds
    // Clear success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isLoggedIn, successMessage]);

  const handleVacate = async () => {
    try {
      setVacateLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/seats/cancel",
        { seat_id: mySeat.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Seat released successfully!");
      setMySeat(null); // Optimistically clear seat
      setTimeout(async () => {
        await fetchSeats();
        await fetchMySeat();
      }, 300); // Add a short delay to ensure backend updates
    } catch (err) {
      setSuccessMessage(err.response?.data?.error || "Vacate failed");
    } finally {
      setVacateLoading(false);
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

        <Hero scrollToFloor={scrollToFloor} isLoggedIn={isLoggedIn} />

        <div ref={floorRef}>
          <Floorcard onSelectFloor={handleSelectFloor} seats={seats} isLoggedIn={isLoggedIn} />
        </div>

        {/* Add HowItWorks section here, just after Floorcard and before Features */}
        <HowItWorks />

        <div ref={featuresRef}>
          <Features />
        </div>
        <div ref={footerRef}>
          <Footer isLoggedIn={isLoggedIn} />
        </div>

        <LeaveSeat mySeat={mySeat} onVacate={handleVacate} loading={vacateLoading} />
      </motion.div>
    </>
  );
}

export default Home;
