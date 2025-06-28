import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";

import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const Homepage = () => {
  const words = ["Grades", "Understanding", "Confidence", "Results", "Focus"];

  return (
    <div className="max-w-6xl overflow-x-hidden">
      <Navbar />

      <div className="relative flex h-[40rem] w-full  justify-center bg-white dark:bg-black mt-3">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black 
                [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] 
                [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
        <section className="flex flex-row pt-20 ml-20 justify-items-center px-8 w-full h-[500px]">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "flex flex-col gap-y-10 pt-10 relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <div className=" inline-block min-h-[200px]">
              Achieve better <ContainerTextFlip words={words} />
            </div>

            <p className=" font-medium text-3xl w-2/3">
              Mathamagic have been teaching students close to a decade
            </p>

            
              <button className="p-[3px] relative text-2xl w-[200px] cursor-pointer font-medium">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2  bg-black rounded-[10px]  relative group transition duration-200 text-white hover:bg-transparent">
                ➜ Let's Chat
                </div>
              </button>
          
          </motion.h1>

          {/* 
      <services></services>
      <cards> testimonals</cards>
      <Contact> Form</Contact> */}
          <div className="absolute ml-[400px]">
            <DotLottieReact
              className="w-[750px] max-h-[500px] h-[450px] scale-x-[-1] "
              src="https://lottie.host/b4821088-6c05-4728-b189-ed6679fddbed/KkX2iSjVeC.lottie"
              loop
              autoplay
            />
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default Homepage;
