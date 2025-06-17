import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { CheckCircle, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ConfirmSeat = () => {
  const { seatId } = useParams();
  const [seat, setSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // GSAP entrance animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [loading, apiError, seat, success]);

  // Fetch seat details with retry logic
  const fetchSeat = useCallback(async () => {
    setLoading(true);
    setApiError("");
    setSuccess(false);
    try {
      const res = await axios.get(`${API_URL}/api/seats`);
      const found = res.data.find(s => s.id === parseInt(seatId, 10));
      if (!found) {
        setApiError("Seat not found.");
      }
      setSeat(found || null);
    } catch (err) {
      setApiError("Failed to load seat. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [seatId]);

  useEffect(() => {
    fetchSeat();
  }, [fetchSeat, retryCount]);

  // Confirm booking
  const handleConfirm = async () => {
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApiError("You must be logged in to book a seat.");
        setTimeout(() => navigate("/auth"), 1200);
        return;
      }
      await axios.post(
        `${API_URL}/api/seats/book`,
        { seat_id: seatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate(`/checkin/${seatId}`), 1200);
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        "Booking failed. Please try again."
      );
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } },
    exit: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-8">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            ref={cardRef}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
            aria-busy="true"
          >
            <motion.div
              className="mb-4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </motion.div>
            <span className="text-lg font-semibold text-blue-700">Loading seat details…</span>
          </motion.div>
        ) : apiError ? (
          <motion.div
            key="error"
            ref={cardRef}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
            role="alert"
          >
            <XCircle className="w-12 h-12 text-red-400 mb-2" />
            <h2 className="text-xl font-bold mb-2 text-red-500">Error</h2>
            <div className="mb-4 text-gray-700 text-center">{apiError}</div>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              onClick={() => setRetryCount(c => c + 1)}
              aria-label="Retry loading seat"
            >
              Retry
            </button>
          </motion.div>
        ) : !seat ? (
          <motion.div
            key="notfound"
            ref={cardRef}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
            role="status"
          >
            <XCircle className="w-12 h-12 text-gray-400 mb-2" />
            <h2 className="text-xl font-bold mb-4 text-gray-700">Seat not found</h2>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            ref={cardRef}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -20 }}
              animate={{ scale: 1.1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="mb-2"
            >
              <CheckCircle className="w-14 h-14 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-green-700">Seat Confirmed!</h2>
            <div className="mb-4 text-gray-700 text-lg">
              <span className="font-semibold">Seat:</span> {seat.seat_number} &nbsp;|&nbsp;
              <span className="font-semibold">Floor:</span> {seat.floor}
            </div>
            <div className="text-green-600 font-semibold mb-2">Redirecting to check-in…</div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            ref={cardRef}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="mb-4"
            >
              <svg className="w-14 h-14 text-blue-500" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="7" width="16" height="10" rx="3" fill="currentColor" opacity="0.15" />
                <rect x="7" y="10" width="10" height="4" rx="2" fill="currentColor" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Confirm Your Seat</h2>
            <div className="mb-2 text-lg">
              <span className="font-semibold">Seat:</span> {seat.seat_number}
            </div>
            <div className="mb-6 text-lg">
              <span className="font-semibold">Floor:</span> {seat.floor}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              onClick={handleConfirm}
              aria-label={`Confirm booking for seat ${seat.seat_number} on floor ${seat.floor}`}
            >
              Confirm Booking
            </motion.button>
            <div className="text-gray-400 text-xs mt-4 text-center">
              You have 5 minutes to check in after confirming.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfirmSeat;