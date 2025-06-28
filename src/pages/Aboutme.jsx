import React from 'react'
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";


const Aboutme = () => {
  return (
    <div>
    <Navbar />
    <div className="relative flex h-[80vh] w-full  justify-center bg-white dark:bg-black mt-3">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

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
        

     
        </motion.h1>



      </section>
    </div>
  </div>
  )
}

export default Aboutme