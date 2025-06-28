import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/text-area";

const Contactme = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
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
        <section className="flex pt-[100px] items-center justify-center  ml-20  px-8 w-full h-[500px]">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "pt-10 relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <div className="shadow-input mx-auto min-w-xl max-w-2xl rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Contact Us
              </h2>
              <p className="mt-2 max-w-sm text-sm text-neutral-500 tracking-normal">
                ➔ Phone Number: 604-440-9543
              </p>

              <div className="my-7 flex items-center max-w-lg">
                <div className="flex-grow border-t border-neutral-300" />
                <span className="mx-4 text-sm text-neutral-500 tracking-wide">or</span>
                <div className="flex-grow border-t border-neutral-300" />
              </div>

              <p className="mt-2 max-w-sm text-sm text-neutral-500 tracking-normal">
                Directly email us using this form
              </p>
              <form className="my-8 tracking-normal" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <LabelInputContainer>
                    <Label htmlFor="firstname">Full Name</Label>
                    <Input
                      id="firstname"
                      placeholder="John Smith"
                      type="text"
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Message</Label>
                  {/* <Input id="password" placeholder="••••••••" type="password" /> */}
                  <Textarea
                    id="textarea"
                    placeholder="Write a message..."
                    type="text"
                    className="min-h-[50px] max-h-[100px] overflow-y-auto"
                  />
                </LabelInputContainer>

                <button
                  className="text-sm group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                  type="submit"
                >
                    Send Email
                  <BottomGradient />
                </button>
              </form>
            </div>
          </motion.h1>
        </section>
      </div>
    </div>
  );
};

export default Contactme;

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
