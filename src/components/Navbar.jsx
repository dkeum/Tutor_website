import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "../components/ui/moving-border";

const helpItems = [
  {
    title: "Exam Prep",
    description: "Practice tests, strategies, and review for upcoming exams",
  },
  {
    title: "Personalized Learning",
    description:
      "Custom lesson plans tailored to each student's pace and goals",
  },
  {
    title: "Homework Help",
    description: "Timely support with assignments and projects",
  },
];

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between px-10 sticky top-0 z-50 bg-white py-2 ">
      <div className="flex flex-row items-center gap-x-5 text-3xl ">
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
        <div className="flex flex-row gap-5">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>HOW WE HELP</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 gap-2 md:w-[300px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-10 mb-2 text-lg font-medium h-full flex flex-col items-center">
                            <img
                              className="mx-auto rounded-full w-15 h-15"
                              src="/tutor.png"
                              alt="tutor icons"
                            />
                            <div className="flex flex-col gap-y-2">
                              <p>Our Tutors</p>
                              <p className="text-muted-foreground text-sm leading-tight">
                                will help with
                              </p>
                            </div>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>

                    <li className="flex flex-col items-start gap-y-4">
                      {helpItems.map((item, idx) => (
                        <div key={idx}>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-slate-800 text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold" href="/about">
                    ABOUT
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

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className="font-semibold text-lg tracking-normal" href="/login">Login/Signup</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <a href="/contact">
          <button className="p-[3px] relative text-xl w-[150px] cursor-pointer font-medium">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-2 py-2  bg-black rounded-[10px]  relative group transition duration-200 text-white hover:bg-transparent">
              <span className="font-extrabold">➜</span> Let's Chat
            </div>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
