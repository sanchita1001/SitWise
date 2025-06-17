import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function Navbar({ isLoggedIn, onContactClick, onFeaturesClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  // Handler for Book Now button
  const handleBookNow = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const floorSection = document.getElementById("floorcard-section");
    if (floorSection) {
      floorSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Handler for Login button
  const handleLogin = () => {
    setMenuOpen(false);
    if (!isLoggedIn) {
      navigate("/auth");
    }
  };

  // Handler for Contact button
  const handleContact = () => {
    setMenuOpen(false);
    onContactClick && onContactClick();
  };

  // Handler for Logout button
  const handleLogout = async () => {
    setMenuOpen(false);
    if (window.handleLogout) {
      await window.handleLogout();
      navigate("/"); // Redirect to main site after logout
    }
  };

  return (
    <nav
      className={`${
        isScrolled ? "bg-white shadow-md" : "bg-white/30 backdrop-blur-md"
      } fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-3 rounded-b-xl transition-all duration-300`}
      style={{ minHeight: 56 }}
    >
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => {
          setMenuOpen(false);
          navigate("/");
        }}
      >
        <img
          src="https://img.icons8.com/ios-filled/50/000000/open-book--v1.png"
          alt="logo"
          className="w-7 h-7"
        />
        <span className="text-2xl font-bold text-blue-600 tracking-tight">
          SitWise
        </span>
      </div>

      {/* Hamburger for mobile */}
      <div className="sm:hidden flex items-center z-50">
        <button
          className="p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Centered Navigation Links (desktop) */}
      <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 text-gray-700 text-lg font-medium">
        <button
          onClick={onFeaturesClick}
          className="hover:text-blue-600 transition-colors cursor-pointer focus:outline-none"
        >
          Features
        </button>
        <span className="hover:text-blue-600 transition-colors cursor-default">
          How it Works
        </span>
        <button
          onClick={onContactClick}
          className="hover:text-blue-600 transition-colors bg-transparent border-none outline-none cursor-pointer"
          style={{ font: "inherit" }}
        >
          Contact
        </button>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={handleBookNow}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition-all duration-200"
        >
          Book Now
        </button>
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="ml-2 px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-2 px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 bg-gray-200 border border-blue-500 text-blue-600 hover:bg-gray-300"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed left-0 right-0 top-[56px] bg-white z-50 flex flex-col items-center py-6 gap-4 h-[calc(100vh-56px)] w-full shadow-lg overflow-y-auto overflow-x-hidden"
          >
            <button
              onClick={onFeaturesClick}
              className="text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors w-11/12 py-4 rounded-lg focus:outline-none"
            >
              Features
            </button>
            <button
              disabled
              className="block w-11/12 text-center text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors py-4 rounded-lg cursor-default focus:outline-none"
              tabIndex={-1}
              aria-disabled="true"
            >
              How it Works
            </button>
            <button
              onClick={handleContact}
              className="text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors w-11/12 py-4 rounded-lg focus:outline-none"
            >
              Contact
            </button>
            <button
              onClick={handleBookNow}
              className="w-11/12 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow transition-all duration-200"
            >
              Book Now
            </button>
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="w-11/12 px-5 py-4 rounded-lg font-semibold shadow transition-all duration-200 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-11/12 px-5 py-4 rounded-lg font-semibold shadow transition-all duration-200 bg-gray-200 border border-blue-500 text-blue-600 hover:bg-gray-300"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
