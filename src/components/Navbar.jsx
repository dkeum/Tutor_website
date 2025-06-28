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

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between px-10 sticky top-0 z-50 bg-white py-2">
      <div className="flex flex-row items-center gap-x-5 text-3xl">
        <img className="w-12 h-10" src="./src/assets/logo.png" alt="logo" />
        <p className="font-extrabold pt-2">Mathamagic</p>
      </div>
      <div className="flex flex-row gap-x-20 items-center text-xl ">
        <div className="flex flex-row gap-5">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>HOW WE HELP</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-3 gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Beautifully designed components built with Tailwind
                            CSS.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>

                    <li className=" col-span-2">
                      <div className="w-[2px] min-h-[80px] h-full bg-black" />
                    </li>

                    <li className="col-span-3 col-start-2">
                     hi
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
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <button className="p-[3px] relative text-xl w-[150px] cursor-pointer font-medium">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-2 py-2  bg-black rounded-[10px]  relative group transition duration-200 text-white hover:bg-transparent">
            <span className="font-extrabold">➜</span> Let's Chat
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
