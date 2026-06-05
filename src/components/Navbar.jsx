import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";

const helpItems = [
  {
    title: "Exam Prep",
    description: "Practice tests, strategies, and review for upcoming exams",
  },
  {
    title: "Personalized Learning",
    description: "Custom lesson plans tailored to each student's pace and goals",
  },
  {
    title: "Homework Help",
    description: "Timely support with assignments and projects",
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex flex-row justify-between items-center px-6 md:px-10 py-2">
        {/* Logo */}
        <div className="flex flex-row items-center gap-x-3 text-2xl md:text-3xl">
          <img className="w-10 h-8 md:w-12 md:h-10" src="/mathamagic_m_blue_star.svg" alt="logo" />
          <a href="/" className="font-bold -ml-6 ">athamagic</a>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex flex-row gap-x-10 items-center text-xl">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>How we help</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 gap-2 md:w-[300px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-10 mb-2 text-lg font-medium h-full flex flex-col items-center">
                            <img className="mx-auto rounded-full w-15 h-15" src="/tutor.png" alt="tutor icons" />
                            <div className="flex flex-col gap-y-2">
                              <p>Our Tutors</p>
                              <p className="text-muted-foreground text-sm leading-tight">will help with</p>
                            </div>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="flex flex-col items-start gap-y-4 p-4">
                      {helpItems.map((item, idx) => (
                        <div key={idx}>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-slate-800 text-sm">{item.description}</p>
                        </div>
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold" href="/about">About</a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold" href="/freeResources">Free Resources</a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold text-lg tracking-normal" href="/login">Login / Signup</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <a href="/contact">
            <Button
              className="
              px-7 py-3
              text-base font-bold
              bg-[#1a4fd6] text-white
              rounded-[10px]
              shadow-[0_2px_12px_rgba(26,79,214,0.18)]
              hover:bg-[#1540b8] hover:shadow-[0_4px_18px_rgba(26,79,214,0.28)] hover:-translate-y-px
              active:translate-y-px
              transition-all duration-150
              cursor-pointer
              whitespace-nowrap
            "
            >
              Get Started
            </Button>

          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            // X icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Burger icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
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
          <a
            href="/login"
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            Login / Signup
          </a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>
            <button className="p-[3px] relative text-base w-full cursor-pointer font-medium mt-1">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-4 py-2 bg-black rounded-[10px] relative transition duration-200 text-white hover:bg-transparent">
                <span className="font-extrabold">➜</span> Let's Chat
              </div>
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;