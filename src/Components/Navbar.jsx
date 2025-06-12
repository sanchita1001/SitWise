import React, { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`${
          isScrolled ? "bg-white shadow-md" : "bg-white/30 backdrop-blur-md"
        } fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 rounded-b-xl transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/open-book--v1.png"
            alt="logo"
            className="w-6 h-6"
          />
          <span className="text-2xl font-semibold text-blue-600">SitWise</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 text-lg font-medium">
          <a href="#" className="hover:text-blue-600">
            Features
          </a>
          <a href="#" className="hover:text-blue-600">
            How it Works
          </a>
          <a href="#" className="hover:text-blue-600">
            Contact
          </a>
        </div>

        {/* Book Now Button */}
        <a
          href="#"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow"
        >
          Book Now
        </a>
      </nav>
    </>
  );
}

export default Navbar;
