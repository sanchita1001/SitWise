import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/client";
import gsap from "gsap";

function AuthForm() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
    // On success, Supabase will redirect back to your app
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center"
      >
        <img
          src="https://img.icons8.com/ios-filled/50/000000/open-book--v1.png"
          alt="SitWise Logo"
          className="w-14 h-14 mb-4"
        />
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight text-center">
          Welcome to SitWise
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Sign in with your Google account to continue
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-semibold text-gray-700 transition text-lg shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
