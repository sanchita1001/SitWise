import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, onContactClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for Book Now button
  const handleBookNow = (e) => {
    e.preventDefault();
    const floorSection = document.getElementById("floorcard-section");
    if (floorSection) {
      floorSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Handler for Login button
  const handleLogin = () => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  };

  return (
    <nav
      className={`${
        isScrolled ? "bg-white shadow-md" : "bg-white/30 backdrop-blur-md"
      } fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 rounded-b-xl transition-all duration-300`}
    >
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
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

      {/* Centered Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8 text-gray-700 text-lg font-medium">
        <span className="hover:text-blue-600 transition-colors cursor-default">
          Features
        </span>
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

      <div className="flex items-center gap-3">
        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition-all duration-200"
        >
          Book Now
        </button>
        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoggedIn}
          className={`ml-2 px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 ${
            isLoggedIn
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {isLoggedIn ? "Logged In" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
