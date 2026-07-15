import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavbarLoggedIn = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const startTimeRef = useRef(null);
  const email = useSelector((state) => state.personDetail.email);
  const navigate = useNavigate();

  // --- Session Tracking Lifecycle ---
  useEffect(() => {
    startTimeRef.current = new Date();

    const handleUnload = () => {
      const endTime = new Date();
      sendSessionData(startTimeRef.current, endTime);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleUnload();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const sendSessionData = async (start, end) => {
    // try {
    //   await axios.post(
    //     import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    //       ? "http://localhost:3000/save-session"
    //       : "https://mathamagic-backend.vercel.app/save-session",
    //     {
    //       email: email,
    //       startTime: start.toISOString(),
    //       endTime: end.toISOString(),
    //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //     },
    //     { withCredentials: true }
    //   );
    // } catch (err) {
    //   console.error("Error sending session data:", err);
    // }
  };

  const handleLogout = async () => {
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm w-full">
      <div className="flex flex-row justify-between items-center px-6 md:px-10 py-2">

        {/* 
          FIX: Changed ml-12 to ml-16 for better spacing. 
          Changed md:ml-0 to lg:ml-0 to match the LoggedInLayout hamburger button breakpoint.
        */}
        <div className="flex flex-row items-center gap-x-3 text-2xl md:text-3xl ml-16 lg:ml-0">
          <img
            className="w-10 h-8 md:w-12 md:h-10"
            src="/mathamagic_m_blue_star.svg"
            alt="logo"
          />
          <a href="/" className="font-bold -ml-[25px] mt-[1px]">
            athmagick
          </a>
        </div>
        {/* Desktop Interface Action Options */}
        <div className="hidden md:flex flex-row gap-x-10 items-center text-xl">


          <button onClick={() => { navigate("/pricing") }} className="text-base font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
            Pricing
          </button>

          <button onClick={() => { navigate("/classes") }} className="text-base font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
            Classes
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              px-7 py-1
              text-base font-bold
              bg-[#2b56de] text-white
              rounded-[12px]
              shadow-[0_4px_14px_rgba(43,86,222,0.2)]
              hover:bg-[#1e40af] hover:shadow-[0_6px_20px_rgba(43,86,222,0.3)] hover:-translate-y-px
              active:translate-y-px
              transition-all duration-150
              cursor-pointer
              whitespace-nowrap
  "
          >
            Logout
          </button>
        </div>

        {/* Mobile Action Dropdown Trigger Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Content Pane */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4 shadow-lg">
          <a
            href="/about"
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/freeResources"
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            Free Resources
          </a>
          <button
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors py-1 text-left w-full cursor-pointer"
            onClick={() => {
              setMenuOpen(false);
              navigate("/showpersonaldata");
            }}
          >
            Profile
          </button>

          {/* Mobile Specific User Logoff Action Element */}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="p-[3px] relative text-base w-full cursor-pointer font-medium mt-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-4 py-2 bg-black rounded-[10px] relative transition duration-200 text-white hover:bg-transparent text-center">
              <span className="font-extrabold">➜</span> Logout
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarLoggedIn;
