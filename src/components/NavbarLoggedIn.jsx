import React, { useEffect, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useSelector } from "react-redux";
import axios from "axios";

const NavbarLoggedIn = () => {
  const startTimeRef = useRef(null);
  const email = useSelector((state) => state.personDetail.email);

  useEffect(() => {
    // Store start time when user lands
    startTimeRef.current = new Date();

    const handleUnload = () => {
      const endTime = new Date();
      sendSessionData(startTimeRef.current, endTime);
    };

    window.addEventListener("beforeunload", handleUnload);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleUnload();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleUnload);
    };
  }, []);

  const sendSessionData = async (start, end) => {
    try {
      await axios.post("/save-session", {
        email: email,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
    } catch (err) {
      console.error("Error sending session data:", err);
    }
  };

  const handleLogout = async () => {
    const endTime = new Date();
    try {
      // 1) Save the session
      await sendSessionData(startTimeRef.current, endTime);

      // 2) Log out
      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/logout"
          : "https://mathamagic-backend.vercel.app/logout",
        { email },
        { withCredentials: true }
      );

      // 3) Redirect
      window.location.href = "/logout";
    } catch (err) {
      console.error("Error during logout:", err);
      window.location.href = "/logout"; // still redirect even if API fails
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
                <a className="font-semibold" href="/about">
                  Classes
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a className="font-semibold" href="/freeResources">
                  FREE RESOURCES
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
