import React from "react";
import { motion } from "framer-motion";

function Hero({ scrollToFloor }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <motion.h1
        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight tracking-tight mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Smart Library Seat Booking <br />
        with <span className="text-blue-500">SitWise</span>
      </motion.h1>

      <motion.p
        className="text-gray-600 text-base xs:text-lg sm:text-xl max-w-md sm:max-w-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Your perfect seat is waiting. Reserve in 5 minutes and study stress-free.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 w-full sm:w-auto"
          onClick={scrollToFloor}
        >
          <span className="mr-2">🕒</span> Book Your Seat Now
        </motion.button>
      </div>
    </div>
  );
}

export default Hero;
