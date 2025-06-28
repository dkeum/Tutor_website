import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

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

      <section className="h-[30rem] mt-30 ml-20">
        <h1 className="text-4xl font-extrabold w-2/3">
          Getting the right help, compatabile, and technology is no easy task
        </h1>
        <div className="mt-10 flex flex-row justify-start items-start ">
          <p className="text-start w-1/2">
            To produce the right outcomes, you need a person you can trust.{" "}
            <br />
            <br />A qualified tutor who can guide you to the right strategy,
            take charge of the process, and deliver a grades you want.
          </p>
          <DotLottieReact
            className=" w-[700px] h-auto"
            src="https://lottie.host/83b0c885-27f9-499a-9d46-46e495cc7a90/cAM12iHmA3.lottie"
            loop
            autoplay
          />
        </div>
      </section>
      <hr className="w-2/3 max-w-9xl mx-auto my-20" />

      <section className="h-[30rem]">
        <header className="text-4xl font-extrabold mx-auto">
          🎖️ The Results
        </header>
        <h1 className="mt-5">
          After 5-10 Tutoring Sessions, Our Students Typically Experience...
        </h1>
        <ul className="flex flex-row gap-x-10 text-3xl text-extrabold items-center justify-center my-10">
          <li className="flex flex-col gap-y-2">
            <p className="font-extrabold">+15%</p>
            <p>Average Grade</p>
            <p className="text-lg">That's a whole letter grade!</p>
          </li>
          <li className="flex flex-col gap-y-2">
            <p className="font-extrabold">+32%</p>
            <p>Study Efficiency</p>
            <p className="text-lg">
              Students complete work faster with better focus
            </p>
          </li>
          <li className="flex flex-col gap-y-2">
            <p className="font-extrabold">+100%</p>
            <p>Confidence</p>
            <p className="text-lg">Students become self-learner!</p>
          </li>
        </ul>

        <div className="my-20 text-slate-800">
          <p className="w-2/3 max-w-[600px] mx-auto text-xl">
            "Making a postive impact on student's academic journey
             is a humbling experience. If you're looking for a tutor
             with a positive attitude with fun exciting lesson, then
             Mathamagic is the place."  
          </p>

          <div className="flex flex-col items-center justify-center gap-y-5 mt-10">
            <img src="src/assets/tutor1.png" alt="tutor image" className="w-22 h-20 rounded-full border" />
            <p>Daniel Keum, STEM tutor at Mathamagic</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col my-30">
        <h3 className="ml-20 w-full flex justify-start text-4xl font-extrabold">
          Success Stories
        </h3>
        <div className="ml-20 h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      <section>
        Act now
        <h1>Be Better than Good Enough</h1>
        <p>
          You've built an amazing business—don't settle for a below-average
          website. It's time to build something better.
        </p>
      </section>

      <section>Services</section>

      <section>FAQ</section>
      <footer></footer>
    </div>
  );
};

export default Homepage;

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];
