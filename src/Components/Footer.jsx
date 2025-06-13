import React from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-100 via-white to-gray-50 text-gray-800 mt-10 shadow-inner rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          
          {/* Branding + tagline */}
          <motion.div whileHover={{ scale: 1.03 }} className="cursor-default">
            <h1 className="text-3xl font-extrabold text-black tracking-tight d">SitWise</h1>
            <p className="text-base text-gray-600 italic mt-1">
              Fu*k waiting — your study spot is ready.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div whileHover={{ scale: 1.03 }} className="flex flex-wrap gap-4 text-base font-medium">
            <a href="/" className="transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">Home</a>
            <a href="/book" className="transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">Book Seat</a>
            <a href="/reservations" className="transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">My Reservations</a>
            <a href="/about" className="transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">About</a>
            <a href="/contact" className="transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200">Contact</a>
          </motion.div>

          {/* Social */}
          <motion.div whileHover={{ scale: 1.12 }} className="flex gap-4">
            <a
              href="https://github.com/PrathamRanka/SitWise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700 transition-colors bg-white rounded-full p-2 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
          </motion.div>
        </div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mt-8 border-t border-gray-200 pt-5 text-xs text-gray-500 text-center"
        >
          <p className="mb-1">Created by <span className="font-semibold text-blue-700">Sagarika, Sanchita, Pratham</span></p>
          <p>© 2025 <span className="font-semibold text-gray-700">SitWise</span>. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
