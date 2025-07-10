import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { Button } from "../components/ui/moving-border";

import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../components/Footer";

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

            <a href="/contact">
              <button className="p-[3px] relative text-2xl w-[200px] cursor-pointer font-medium">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2  bg-black rounded-[10px]  relative group transition duration-200 text-white hover:bg-transparent">
                  ➜ Let's Chat
                </div>
              </button>
            </a>
          </motion.h1>

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
        <h1 className="sm:text-xl first-letter md:text-4xl font-extrabold w-2/3">
          Finding the right tutor, learning style, and academic support
          shouldn’t be a struggle
        </h1>
        <div className="mt-10 flex flex-row justify-start items-start ">
          <div className="text-start w-1/2 flex flex-col gap-y-8">
            <p>
              To produce the right outcomes, you need a person you can trust.{" "}
              <br />
              <br />A qualified tutor who can guide you to the right strategy,
              take charge of the process, and deliver the grades you want.
            </p>
            <a href="/contact">
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white cursor-pointer border-neutral-200 dark:border-slate-800"
              >
                ➜ Let's Chat
              </Button>
            </a>
          </div>
          <DotLottieReact
            className=" w-[700px] h-auto lg:-mt-20 "
            src="https://lottie.host/83b0c885-27f9-499a-9d46-46e495cc7a90/cAM12iHmA3.lottie"
            loop
            autoplay
          />
        </div>
      </section>
      <hr className="w-2/3 max-w-9xl mx-auto my-20" />

      <section className="h-[30rem] sm:mt-50 md:mt-0">
        <header className="text-4xl font-extrabold mx-auto">
          🎖️ The Results
        </header>
        <h1 className="mt-5">
          After 5-10 Tutoring Sessions, Our Students Typically Experience...
        </h1>
        <ul className="flex flex-row gap-x-10 text-3xl text-extrabold items-center justify-center my-10 overflow-auto">
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
            "Making a postive impact on student's academic journey is a humbling
            experience. If you're looking for a tutor with a positive attitude
            with fun exciting lesson, then Mathamagic is the place."
          </p>

          <div className="flex flex-col items-center justify-center gap-y-5 mt-10">
            <img
              src="https://github.com/dkeum/Tutor_website/blob/main/src/assets/tutor1.png?raw=true"
              alt="tutor image"
              className="w-22 h-20 rounded-full border"
            />
            <p>Daniel Keum, Founder and Lead STEM tutor</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col mt-70 lg:mt-30">
        <h3 className="mt-10 ml-20 w-full flex justify-start text-4xl font-extrabold">
          Previous Student's Testimonials
        </h3>
        <div className="ml-20 h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      <section className="ml-20 my-30 text-start">
        <div className="flex flex-row items-center w-full justify-start gap-x-30">
          <div>
            <p className="text-lg">Act now</p>
            <br />
            <h1 className="text-4xl font-extrabold ">
              Be Better than Good Enough
            </h1>
            <br />
            <p className="text-xl">
              You have an amazing opportunity — don't settle for a sub-optimal
              grades.
              <br />
              It's time to build it better.
            </p>
          </div>
          <div className="flex flex-row items-center justify-center">
            <img className="w-40 h-40" src="/exam.svg" />
            <div
              className="-ml-20"
              style={{
                width: "150px", // control the length of the pencil
                height: "40px",
                background: `
      linear-gradient(90deg, #e7e7e7 30%, #fe668c 0) 100% / 50px 100% no-repeat, 
      conic-gradient(from 55deg at left, #fee7b3, #0000 1deg 69deg, #fee7b3 70deg) 100% 8px / calc(100% - 40px) 16px repeat-y, 
      linear-gradient(#0003 50%, #0000 0) 100% 8px / calc(100% - 41px) 32px repeat-y, 
      linear-gradient(90deg, #2b2026 15px, #fee7b3 16px 40px, #fecc2b 0)
    `,
                clipPath:
                  "polygon(0 50%, 42px 0, 100% 0, 100% 100%, 42px 100%)",
                borderRadius: "0 10px 10px 0",
                transform: "rotate(-40deg)",
              }}
            />
          </div>
        </div>
      </section>

      <section className="ml-20 overflow-y-hidden">
        <h2 className="text-start text-4xl font-extrabold">Services</h2>

        <ul className="flex flex-row justify-around gap-x-10 my-10">
          <li>
            <div className="flex flex-row gap-x-3 justify-center underline font-medium text-lg">
              <p>Math</p>
              <img className="pb-5" src="/math.png" />
            </div>
            <p>Math 1-9</p>
            <p>Math 10-12 Foundations</p>
            <p>Precal 11</p>
            <p>Precal 12</p>
            <p>AP Calculus 12</p>
            <p>Gauss 7-8</p>
            <p>AMC 8</p>
            <p>AMC 10</p>
          </li>

          <li>
          <div className="flex flex-row gap-x-3 justify-center underline font-medium text-lg">
              <p>Physics</p>
              <img className="pb-5" src="/physics.png" />
            </div>
            <p>Physics 11 </p>
            <p>Physics 12</p>
            <p>AP Physics 11 </p>
            <p>AP Physics 12</p>
          </li>

          <li>
          <div className="flex flex-row gap-x-3 justify-center underline font-medium text-lg">
              <p>Chemistry</p>
              <img className="pb-5" src="/chemistry.png" />
            </div>
            <p>Chem 11</p>
            <p>Chem 12</p>
            <p>AP Chem 11</p>
            <p>AP Chem 12</p>
          </li>

          <li>
          <div className="flex flex-row gap-x-3 justify-center underline font-medium text-lg">
              <p>Others</p>
              <img className="pb-5 w-[32px] h-auto" src="/others.png" />
            </div>
            <p>Science 10 BC</p>
            <p>Introduction to Python</p>
            <p>Calculus I - Derivatives</p>
            <p>Calculus II - Integrals</p>
            <p>Linear Algebra</p>
          </li>
        </ul>
      </section>

      <section className="ml-20 overflow-y-hidden">
        <h2 className="text-start text-4xl font-extrabold mb-5">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="overflow-x-hidden"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>How much is a tutoring session?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>$20/hr for remote and $25/hr for in-person</p>
              <p>
                For AP classes and first year university topics the price
                increases to $30/hr
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I try out the tutoring session once for free?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Yes, of course! The first lesson is on us. We want to make sure
                you're comfortable with the tutor.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Are there deals for multiple sessions?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>Yes! After every 10 lessons, you can redeem 1 free lesson.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Where is the in-person tutoring usually done?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Typically at the public library or inside the student's home.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>How is online tutoring done?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Tutors will turn on their camera and share screen during the
                session. Students will upload any homework or questions
                beforehand.
                <br />
                Tutors can use software such as Zoom, Discord, or etc for the
                session.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              Which cities do you offer in-person tutoring in?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Currently the cities are: <br />
                <br />
                Coquitlam, Port Coquitlam, Port Moody, Surrey, New Westminster,
                Burnaby
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <Footer />
    </div>
  );
};

export default Homepage;

const testimonials = [
  {
    quote:
      "I can't wait to have Daniel as a math tutor again for my next term! I went from 63% to 77%.",
    name: "- Hudson gr.9",
    title: "",
  },
  {
    quote:
      "I got a 98% on my Pre-cal 12 final! 93% on my physics 12. Thank you.",
    name: "- Dajeong  gr.12",
    title: "",
  },
  {
    quote: "My physics 11 grade went up, I'm really happy with the tutoring.",
    name: "- Jackson gr.11",
    title: "",
  },
  {
    quote:
      "I didn't really like math before and I still don't but at least now I can do it",
    name: "- Anatasizia gr.7",
    title: "",
  },
  {
    quote:
      "I play a lot of soccer after school but with tutoring I don't have to worry about my grades anymore.",
    name: "- Yousif gr.8",
    title: "",
  },
];
 