import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavbarLoggedIn from "./NavbarLoggedIn";
import Sidebar from "./Sidebar";

const LoggedInLayout = ({ children, bare = false }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col text-[#191c1d]">
      {/* Top Navigation Bar */}
      <NavbarLoggedIn />

      {/* Floating Mobile Hamburger Toggle Button - Adjusted z-index and top margin */}
      <div className="fixed top-3 left-4 z-[60] lg:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-md hover:bg-gray-50 focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Navigation Layout Wrapper */}
      <div className="flex flex-1 pt-16 relative min-h-0">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white z-30">
          <Sidebar />
        </div>

        {/* Mobile Slide-out Drawer */}
        <div
          className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar Drawer Panel */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 transition-transform duration-300 ease-out flex flex-col ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="h-12 flex-shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <Sidebar closeMobileMenu={() => setIsMobileOpen(false)} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 w-full min-w-0 lg:pl-64 transition-all duration-300 ${bare ? "" : "px-4 md:px-8"
            }`}
          style={bare ? undefined : { fontFamily: "'Lexend', sans-serif" }}
        >
          {bare ? children : (
            <div className="max-w-[1280px] mx-auto w-full">
              {children}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default LoggedInLayout;