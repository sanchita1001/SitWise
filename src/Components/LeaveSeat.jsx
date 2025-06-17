import React from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function LeaveSeat({ mySeat, onVacate, loading }) {
  if (!mySeat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-8 z-50 flex justify-center sm:justify-end"
    >
      <button
        onClick={onVacate}
        disabled={loading}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-95"
        aria-label={`Leave seat ${mySeat.seat_number} on floor ${mySeat.floor}`}
      >
        <LogOut className="w-6 h-6" />
        {loading ? (
          <span className="animate-pulse">Leaving...</span>
        ) : (
          <>
            Leave Seat&nbsp;
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold ml-2">
              Floor {mySeat.floor} • Seat {mySeat.seat_number}
            </span>
          </>
        )}
      </button>
    </motion.div>
  );
}