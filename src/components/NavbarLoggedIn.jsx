import React, { useEffect, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const NavbarLoggedIn = () => {
  const startTimeRef = useRef(null);
  const email = useSelector((state) => state.personDetail.email);
  const navigate = useNavigate(); // now you can use navigate()

  useEffect(() => {
    // Store start time when user lands
    startTimeRef.current = new Date();
  
    const handleUnload = () => {
      const endTime = new Date();
      sendSessionData(startTimeRef.current, endTime);
    };
  
    // ✅ use the same function reference for add/remove
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
  }, []); // ✅ runs only once

  const sendSessionData = async (start, end) => {
    try {
      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/save-session"
          : "https://mathamagic-backend.vercel.app/save-session",
        {
          email: email,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // e.g. "America/Vancouver"
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error sending session data:", err);
    }
  };

  const handleLogout = async () => {
    const endTime = new Date();
    try {
      // console.log("Logging out..."); // Debug
      // 1) Save the session
      const response = await sendSessionData(startTimeRef.current, endTime);

      if (response.error) {
        navigate("/login");
      }

      // 2) Log out
      const response2 = await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/logout"
          : "https://mathamagic-backend.vercel.app/logout",
        { email },
        { withCredentials: true }
      );

      // console.log("Logout success, navigating...");
      // 3) Redirect
      navigate("/login");
    } catch (err) {
      // console.error("Error during logout:", err);
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-row justify-between px-10 sticky top-0 z-50 bg-white py-2">
      <div className="flex flex-row items-center gap-x-5 text-3xl">
        <img
          className="w-12 h-10"
          src="https://github.com/dkeum/Tutor_website/blob/main/src/assets/logo.png?raw=true"
          alt="logo"
        />
        <a href="/" className="font-extrabold pt-2">
          Mathamagic
        </a>
      </div>
      <div className="hidden sm:flex flex-row gap-x-20 items-center text-xl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a className="font-semibold" href="/about">
                  Book Tutor
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button className="font-semibold" onClick={()=>{navigate("/showpersonaldata")}}>
                Profile
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button className="font-semibold" onClick={()=>{navigate("/classes")}}>
                  Classes
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a className="font-semibold" href="/freeResources">
                  Free Resources
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <button
          onClick={handleLogout}
          className="p-[3px] relative text-xl w-[150px] cursor-pointer font-medium"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-2 py-2 bg-black rounded-[10px] relative group transition duration-200 text-white hover:bg-transparent">
            <span className="font-extrabold">➜</span> Logout
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavbarLoggedIn;
