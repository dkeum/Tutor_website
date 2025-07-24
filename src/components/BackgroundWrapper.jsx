import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative flex h-screen w-full justify-center bg-white dark:bg-black mt-3">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <section className="flex pt-[100px] items-center justify-center ml-20 px-8 w-full h-[600px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={cn(
            "pt-10 relative mb-6 w-fit min-w-sm max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
          )}
          layout
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
};

export default BackgroundWrapper;
