import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import FloorPlan from "./Pages/FloorPlan";
import ConfirmSeat from "./Pages/ConfirmSeat";
import CheckIn from "./Pages/CheckIn";
import MyReservations from "./Pages/MyReservations"; // Import MyReservations page
import supabase from "./supabase/client";
import './App.css'
import PageWrapper from "./components/PageWrapper";

function AnimatedRoutes({ isLoggedIn }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home isLoggedIn={isLoggedIn} /></PageWrapper>} />
        <Route path="/floorplan/:floorId" element={<PageWrapper><FloorPlan /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/confirm/:seatId" element={<PageWrapper><ConfirmSeat /></PageWrapper>} />
        <Route path="/checkin/:seatId" element={<PageWrapper><CheckIn /></PageWrapper>} />
        <Route path="/reservations" element={<PageWrapper><MyReservations isLoggedIn={isLoggedIn} /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Listen for auth state changes and store token
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        if (session?.access_token) {
          localStorage.setItem("token", session.access_token);
        }
      }
    );
    // On mount, also check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.access_token) {
        localStorage.setItem("token", session.access_token);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Listen for logout event (from Navbar)
  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    };
    window.handleLogout = handleLogout; // Expose globally for Navbar
    return () => { delete window.handleLogout; };
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes isLoggedIn={isLoggedIn} />
    </BrowserRouter>
  );
}

export default App;
