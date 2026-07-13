import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { Button } from "../components/ui/moving-border";

import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge"
import { Button as Button1 } from "@/components/ui/button"

import { BadgeCheck, Star, TrendingUp } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../components/Footer";
import TrustedCreators from "../components/HomePage/Testimonial";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  const words = ["Grades", "Understanding", "Confidence", "Results", "Focus"];

  const navigate = useNavigate()
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "PRODUCTION";


  return (
    <div className="max-w-6xl mx-auto overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative flex min-h-[44rem] md:h-[44rem] w-full justify-center bg-white dark:bg-black mt-3 overflow-hidden">
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
        <section className="flex flex-col md:flex-row pt-16 md:pt-20 md:ml-20 justify-items-center px-6 md:px-8 w-full">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "flex flex-col gap-y-6 md:gap-y-10 pt-6 md:pt-10 relative mb-6 max-w-2xl text-left text-3xl leading-tight md:leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >

            <div className="flex flex-col min-h-0 md:min-h-[250px] ">
              <Badge className=" w-max text-sm md:text-[16px] tracking-normal bg-blue-200 text-blue-500 font-semibold " variant="outline">

                <BadgeCheck className="w-6 h-6 md:w-10 md:h-10" />
                Available Now with AI Support
              </Badge>
              <div>
                Achieve Better <ContainerTextFlip words={words} />
              </div>

              <p className=" font-medium text-xl md:text-3xl w-full md:w-2/3 h-auto mt-5">
                We've been teaching students close to a decade
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <Link to="/contact">
                <Button1 className="w-full sm:w-[180px] h-[50px] text-center text-xl md:text-2xl p-3 bg-[#004ac6] text-white hover:bg-blue-500 cursor-pointer border-neutral-200 dark:border-slate-800 tracking-normal" >
                  Let's Chat
                </Button1>
              </Link>
            </div>

            <div className="tracking-normal">
              <TrustedCreators />
            </div>


          </motion.h1>

          {/* Lottie: normal flow + centered on mobile, absolute-positioned like the original on desktop */}
          <div className="relative md:absolute md:ml-[400px] w-full md:w-auto flex justify-center mt-4 md:mt-0">
            <DotLottieReact
              className="w-[240px] h-[240px] sm:w-[360px] sm:h-[320px] md:w-[750px] md:max-h-[500px] md:h-[450px] scale-x-[-1] "
              src="https://lottie.host/b4821088-6c05-4728-b189-ed6679fddbed/KkX2iSjVeC.lottie"
              loop
              autoplay
            />
          </div>
        </section>
      </div>

      <section className="min-h-[30rem] mt-16 md:mt-30 px-6 md:px-0 md:ml-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold w-full md:w-2/3 font-[family-name:var(--font-sans)] text-left">
          Finding the right tutor, learning style <br className="hidden md:block" /> and academic support
          shouldn’t be a struggle
        </h1>
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-0 ">
          <div className="text-start w-full md:w-1/2 flex flex-col gap-y-6 md:gap-y-8">
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
            className=" w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] h-auto 2xl:-mt-20 "
            src="https://lottie.host/83b0c885-27f9-499a-9d46-46e495cc7a90/cAM12iHmA3.lottie"
            loop
            autoplay
          />
        </div>
      </section>
      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      <section className="min-h-[30rem] px-6 md:px-0 sm:mt-10 md:mt-0">
        <header className="text-2xl sm:text-3xl md:text-4xl font-bold mx-auto font-[family-name:var(--font-sans)]">
          🎖️ The Results
        </header>
        <h1 className="mt-5 text-base sm:text-lg">
          After 5-10 Tutoring Sessions, Our Students Typically Experience...
        </h1>




        <ul className="flex flex-col sm:flex-row gap-6 sm:gap-x-10 text-extrabold items-center justify-center my-10 sm:overflow-x-auto sm:min-w-fit text-2xl sm:text-3xl">
          <li className="flex flex-col justify-center gap-y-4 border border-slate-300 rounded-md p-5 min-h-[260px] md:min-h-[300px] w-full max-w-[320px]">

            <Badge className="mx-auto  text-[16px] tracking-normal bg-blue-200 border-blue-400 border-[1.5px] text-blue-500 font-semibold w-20 h-20 " variant="outline">
              <TrendingUp className="!w-10 !h-10" />
            </Badge>

            <p className="font-extrabold text-blue-500 text-4xl">+15%</p>
            <p className="font-semibold">Average Grade</p>
            <p className="text-lg text-slate-600">That's a whole letter grade!</p>
          </li>
          <li className="flex flex-col justify-center gap-y-4 border border-slate-300 rounded-md p-5 min-h-[260px] md:min-h-[300px] w-full max-w-[320px]">

            <Badge className="mx-auto  text-[16px] tracking-normal border-green-400 border-[1.5px] bg-green-200 text-green-500 font-semibold w-20 h-20 " variant="outline">
              <img
                src="noun-gauge-17970-cropped.svg"
                className="ml-1 mb-2 !w-10 !h-10"
                style={{ filter: "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg) brightness(95%) contrast(95%)" }}
              />
            </Badge>
            <p className="font-extrabold  text-green-600 text-4xl">+32%</p>
            <p className="font-semibold" >Study Efficiency</p>
            <p className="text-lg text-slate-600">
              Students complete work faster with better focus
            </p>
          </li>
          <li className="flex flex-col justify-center gap-y-4 border border-slate-300 rounded-md p-5 min-h-[260px] md:min-h-[300px] w-full max-w-[320px]">
            <Badge
              className="mx-auto bg-[#FAEEDA] border-[#EF9F27] border-[1.5px] text-[#854F0B] w-20 h-20 rounded-full"
              variant="outline"
            >
              <Star className="!w-10 !h-10" />
            </Badge>

            <p className="font-extrabold text-[#854F0B] text-4xl">+100%</p>
            <p className="font-semibold">Confidence</p>
            <p className="text-lg text-slate-600">Students become self-learners!</p>
          </li>
        </ul>

        {/* <div className="my-20 text-slate-800">
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
        </div> */}
      </section>


      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      <section className="min-h-[30rem] mt-10 px-6 md:px-0 md:ml-20">
        <header className="text-2xl sm:text-3xl md:text-4xl font-bold mx-auto font-[family-name:var(--font-sans)]">
          From the Tutoring Room to Your Screen
        </header>

        <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-0">
          <div className="text-start w-full md:w-1/2 flex flex-col gap-y-6 md:gap-y-8">
            <h1 className="text-2xl sm:text-xl md:text-2xl font-bold font-[family-name:var(--font-sans)]">
              8+ years of tutoring, distilled into an AI that teaches like I do
            </h1>
            <p>
              Every hint, every step-by-step breakdown, every "let's try that a
              different way" moment — built from real sessions with real students.{" "}
              <br />
              <br />
              The AI tutor doesn't replace that experience. It's trained on it, so
              you get the same guidance whether you're booking a session or
              practicing on your own at 11pm before a test.
            </p>
            <Link to="/pricing">
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white cursor-pointer border-neutral-200 dark:border-slate-800"
              >
                ➜ Try the AI Tutor
              </Button>
            </Link>
          </div>
          <DotLottieReact
            className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] h-auto 2xl:-mt-20"
            src="https://lottie.host/86969d74-7fb6-4a0e-8970-b3818e90b159/9PCglkrRD7.lottie"
            loop
            autoplay
          />
        </div>
      </section>


      <section className="items-center justify-center px-6 md:px-0">
        {/* <h3 className="mt-10  w-full flex justify-center sm:text-xl xl:text-4xl font-extrabold ">
          Previous Student's Testimonials
        </h3> */}
        {/* <div className=" h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div> */}
        <TestimonialsCarousel />
      </section>




      <section className="px-6 md:px-0 md:xl:ml-20 my-16 md:my-30 text-start">
        <div className="flex flex-col md:flex-row items-center w-full justify-start gap-x-5 xl:gap-x-30 gap-y-8 md:gap-y-0">
          <div>
            <p className="text-lg font-semibold text-blue-700">Act now</p>
            <br />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-sans)] ">
              Be Better than Good Enough
            </h1>
            <br />
            <p className="text-lg md:text-xl">
              You have an amazing opportunity — don't settle for a sub-optimal
              grades.
              <br />
              It's time to build it better.
            </p>
          </div>
          <div className="flex flex-row items-center justify-center">
            <img className="w-28 h-28 md:w-40 md:h-40" src="/exam.svg" />
            <div
              className="-ml-14 md:-ml-20"
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

      {/* <section className="xl:ml-20 overflow-y-hidden">
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
      </section> */}

      {/* <section className="xl:ml-20 overflow-y-hidden">
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
      </section> */}

      <section className="px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto bg-[#1a4fd6] rounded-2xl px-6 sm:px-10 py-10 sm:py-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Text */}
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Ready for your child to thrive?</h2>
            <p className="text-white/90 max-w-lg text-base">
              Join hundreds of parents seeing real academic transformation. Our AI-driven platform adapts to your child's unique learning pace.
            </p>
          </div>

          {/* Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">

            <Button1 onClick={() => navigate("/waitlist")} className="bg-white text-[#1a4fd6] font-bold hover:bg-gray-100 whitespace-nowrap shadow-md">
              Start your Free Trial
            </Button1>
            {isDevelopment && (
              <Button1
                onClick={() => navigate("/pricing")}
                className="bg-white/90 text-[#1a4fd6] font-bold hover:bg-white whitespace-nowrap shadow-md"
              >
                View Pricing
              </Button1>
            )}
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Homepage;