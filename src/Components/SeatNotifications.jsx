import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const icons = {
  booked: <CheckCircle className="text-blue-500 w-6 h-6" />,
  released: <XCircle className="text-green-500 w-6 h-6" />,
};

export default function SeatNotifications() {
  const [notifications, setNotifications] = useState([]);
  const prevSeats = useRef([]);

  // Poll every 3 seconds
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/seats`);
        const newSeats = res.data;

        // Compare with previous seats to detect changes
        if (prevSeats.current.length > 0) {
          newSeats.forEach((seat, idx) => {
            const prev = prevSeats.current[idx];
            if (!prev) return;
            if (seat.status !== prev.status) {
              setNotifications((prevNotifs) => [
                ...prevNotifs,
                {
                  id: Date.now() + Math.random(),
                  seat_number: seat.seat_number,
                  action: seat.status === "free" ? "released" : "booked",
                  timestamp: new Date(),
                },
              ]);
            }
          });
        }
        prevSeats.current = newSeats;
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchSeats();
    const interval = setInterval(fetchSeats, 20000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss after 4s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 max-w-xs w-full">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="flex items-center gap-3 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100 w-full cursor-pointer hover:shadow-2xl"
            onClick={() => dismiss(n.id)}
          >
            {icons[n.action]}
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-base">
                Seat {n.seat_number} {n.action === "booked" ? "booked" : "released"}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(n.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <button
              className="ml-2 text-gray-400 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                dismiss(n.id);
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}