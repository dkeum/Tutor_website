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

  // Read environment variable cleanly from Vite engine
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT";

  // Compute CTA settings based on the current environment profile
  const ctaLink = isDevelopment ? "/login" : "/waitlist";
  const ctaLabel = isDevelopment ? "Login/Signup" : "Join Waitlist";

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex flex-row justify-between items-center px-6 md:px-10 py-2">
        {/* Logo */}
        <div className="flex flex-row items-center gap-x-3 text-2xl md:text-3xl">
          <img className="w-10 h-8 md:w-12 md:h-10" src="/mathamagic_m_blue_star.svg" alt="logo" />
          <a href="/" className="font-bold -ml-6">athamagic</a>
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
                            <div className="flex flex-col gap-y-2 text-center">
                              <p>Our Website</p>
                              <p className="text-muted-foreground text-sm leading-tight -mt-2">will help with</p>
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
{/* 
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold" href="/freeResources">Free Resources</a>
                </NavigationMenuLink>
              </NavigationMenuItem> */}

              {/* Conditionally render Pricing item only in DEVELOPMENT */}
              {isDevelopment && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a className="font-semibold" href="/pricing">Pricing</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

            </NavigationMenuList>
          </NavigationMenu>

          {/* Dynamic Desktop CTA Button */}
          <a href={ctaLink}>
            <Button
              className="
                px-7 py-3
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
              {ctaLabel}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
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
            className="text-lg font-semibold text-gray-800 hover:text-[#2b56de] transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/freeResources"
            className="text-lg font-semibold text-gray-800 hover:text-[#2b56de] transition-colors py-1"
            onClick={() => setMenuOpen(false)}
          >
            Free Resources
          </a>
          
          {/* Conditionally render Pricing link in Mobile View only in DEVELOPMENT */}
          {isDevelopment && (
            <a
              href="/pricing"
              className="text-lg font-semibold text-gray-800 hover:text-[#2b56de] transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a>
          )}

          {/* Dynamic Mobile CTA Button */}
          <a href={ctaLink} className="w-full mt-2" onClick={() => setMenuOpen(false)}>
            <button className="w-full text-base font-bold text-white bg-[#2b56de] hover:bg-[#1e40af] py-3 rounded-xl transition-all duration-150 shadow-md shadow-blue-100">
              {ctaLabel}
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;