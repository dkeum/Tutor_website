import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="relative flex h-[80vh] max-h-[700px] w-full  justify-center bg-white dark:bg-black mt-3">
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
            <div className="ml-20 flex flex-row items-center  w-full">
              <div className="">
                <h2 className="text-2xl">Hi there!</h2>
                <h2 className="text-6xl tracking-tighter">
                  We're Mathamagic <br /> — No smoke, just solutions.{" "}
                </h2>
              </div>

              <div className=" flex flex-row justify-end max-h-[400px]">
                <div className="flex flex-col  ">
                  <img className="w-40 h-auto" src="/purple_smoke.webp" />
                  <img
                    className="w-40 h-auto"
                    src="/flask.gif"
                    alt="Loading animation"
                  />
                </div>
              </div>
            </div>
          </motion.h1>
        </section>
      </div>
      <section className="ml-20 my-30">
        <div className="flex flex-row text-start">
          <div className="w-1/2">
            <h1 className="font-extrabold text-2xl">
              We Started From Teaching The Neighbour's Child, Now We're Here
            </h1>
            <br />
            <p>
              Our story begins in 2016, where a close neighbour contacted
              Daniel, our lead STEM tutoring to teach their child math.
              <br />
              <br />
              Fueled by a passion for teaching and desire to work with amazing
              students, we poured countless hours into improving student's
              grades.
              <br />
              <br />
              Fast forward to today, Mathamagic has taught 100+ students and is
              expanding.
              <br />
              <br />
              <b>Our Mission</b> To be the number one tutoring service to work
              with, and number one education provider
            </p>
          </div>
          <DotLottieReact
            className="w-[800px]"
            src="https://lottie.host/f55578a5-54be-4bd5-afe3-bfd5cb6f55ed/6qeS5HujT2.lottie"
            loop
            autoplay
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
