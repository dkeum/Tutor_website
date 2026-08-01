import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/moving-border";

import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge"
import { Button as Button1 } from "@/components/ui/button"

import { BadgeCheck, Star, TrendingUp, Zap, Brain, History, Wand2, BarChart3 } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../components/Footer";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  // Trimmed to the three concrete, outcome-focused words — "Understanding"
  // and "Focus" were vaguer than the stats we actually cite below.
  const words = ["Grades", "Confidence", "Results"];

  const navigate = useNavigate()

  // NOTE: this was previously `isDevelopment = ... === "PRODUCTION"`, which
  // meant the pricing button only rendered when the env var was the exact
  // string "PRODUCTION" — almost certainly inverted/misnamed and likely
  // hiding "View Pricing" on the real production site. Renamed for clarity
  // and defaulted to always showing the button; swap the comparison back
  // in if you genuinely want it hidden in some environment.
  const showPricingButton = true;

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
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black 
                [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] 
                [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
        <section className="flex flex-col md:flex-row pt-16 md:pt-20 md:ml-20 justify-items-center px-6 md:px-8 w-full">
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
              <p className=" font-normal text-xl md:text-headline-md text-on-surface-variant w-full md:w-2/3 leading-relaxed tracking-normal mt-8">
                Students see a full letter-grade jump in 5–10 sessions — AI
                tutoring for Pre-Calculus through AP Calculus, trained on
                a decade of tutoring
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/pricing">
                <Button1 className="w-full sm:w-[180px] h-[50px] text-center text-xl md:text-2xl p-3 bg-[#004ac6] text-white hover:bg-blue-500 cursor-pointer border-neutral-200 dark:border-slate-800 tracking-normal" >
                  View Plans
                </Button1>
              </Link>

              <Link to="/contact">
                <Button1 className="w-full sm:w-[180px] h-[50px] text-center text-xl md:text-2xl p-3 bg-white text-black hover:bg-slate-200 cursor-pointer border border-neutral-500 dark:border-slate-800 tracking-normal" >
                  Contact Us
                </Button1>
              </Link>
            </div>
          </motion.h1>

          {/* moved back out here, as a sibling of motion.h1 */}
          <div className="relative md:absolute md:ml-[500px] w-full md:w-auto flex justify-center mt-4 md:mt-[150px]">
            <div className="relative w-[280px] sm:w-[400px] md:w-[600px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFxeJFbhvAiwebmN3HCg8jifH8xp2CQx2U16NGMy6uMdzwre1C2I0-OZsD4aM0UCGjhitpSDP5Nyu-n4U4BDO2Tt4eSKQbHv4muGitguPebtVrDAsPSiEg0D36R3w4HmxygtxOeDADAaJmm4Z06mRNcxELTqv_6kJL6gbjMP1IJziJcyiGuESJdZzWb3sp3eAuy8xthdpwhzNVxkIYLHKPw27XVX29s_c5UsIXcNni6Gg04aTf1ImH"
                alt="Illustration of a student studying with an AI tutor, surrounded by floating math symbols"
                className="w-full max-w-[500px] h-auto rounded-[32px] shadow-2xl"
              />

              <div
                className="absolute w-[190px] -top-6 left-80 sm:-right-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl p-3 sm:p-4 animate-bounce"
                style={{ animationDuration: "4s" }}
              >
                <div className="flex items-center gap-3 mr-40 ">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 min-w-[100px]">+15% GPA</div>
                    <div className=" text-[10px] text-slate-500 ">Avg. Improvement</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl p-3 sm:p-4 animate-pulse"
                style={{ animationDuration: "6s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">24/7 AI Tutor</div>
                    <div className="text-[10px] text-slate-500">Instant Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="my-16 md:my-24 px-6 md:px-0 md:ml-20">
        <div className="text-center md:text-left mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
            Precision Learning Tools
          </h2>
          <p className="text-slate-600  md:mx-0 mx-auto text-center">
            Our platform combines human expertise with advanced AI to deliver <br />
            a personalized learning tool for every student.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Large card */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block p-3 bg-blue-100 rounded-xl text-blue-600 mb-6">
                <Brain className="w-7 h-7" />
              </span>
              <h3 className="text-xl font-bold mb-3">Cognitive Mapping AI</h3>
              <p className="text-slate-600 w-full text-center">
                Our AI understands exactly where your conceptual gaps are. It maps
                your knowledge of calculus and creates a direct path to mastery
                through targeted exercises.
              </p>
            </div>

            <div className="mt-10 h-40 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-end justify-center px-8 relative overflow-hidden">
              <div className="flex items-end gap-2 w-full h-full pb-4">
                <div className="flex-1 bg-blue-600/20 h-[40%] rounded-t-lg"></div>
                <div className="flex-1 bg-blue-600/40 h-[65%] rounded-t-lg"></div>
                <div className="flex-1 bg-blue-600/60 h-[50%] rounded-t-lg"></div>
                <div className="flex-1 bg-blue-600 h-[90%] rounded-t-lg relative">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white shadow px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap">
                    TOP SCORE
                  </div>
                </div>
                <div className="flex-1 bg-blue-600/30 h-[55%] rounded-t-lg"></div>
                <div className="flex-1 bg-blue-600/50 h-[70%] rounded-t-lg"></div>
              </div>
            </div>
          </div>

          {/* Small card */}
          <div className="bg-[#004ac6] p-8 rounded-3xl text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <div>
              <span className="inline-block p-3 bg-white/10 rounded-xl mb-6">
                <History className="w-7 h-7" />
              </span>
              <h3 className="text-xl font-bold mb-3">8+ Years of Data</h3>
              <p className="opacity-80 text-sm">
                Built on years of real tutoring sessions across Pre-Calculus
                through AP Calculus.
              </p>
            </div>
            <div className="flex justify-end mt-8">
              <BarChart3 className="w-10 h-10 opacity-40" />
            </div>
          </div>

          {/* Step-by-step card */}
          <div className="bg-blue-50 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <Wand2 className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Step-by-Step</h3>
            <p className="text-slate-600 text-sm">
              Every equation broken down into logical, digestible segments.
            </p>
          </div>

          {/* Live tutor backup card */}
          <div className="md:col-span-2 bg-teal-50 rounded-3xl p-8 flex items-center gap-8 relative overflow-hidden">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3">Live Tutor Backup</h3>
              <p className="text-slate-700 text-sm">
                AI isn't alone. Get access to human expert tutors for when you
                need that extra bit of nuance.
              </p>
            </div>
            <div className="flex-1 h-32 relative hidden sm:block">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full  flex items-center justify-center font-bold text-sm">
                  <img className="rounded-full" src="./smile_tutor.jpeg" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-900">Daniel</span>
                  <span className="text-[8px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      <section className="px-6 md:px-0 md:ml-20 my-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Master Calculus with Confidence
        </h2>
        <p className="text-slate-600 text-center mb-10">
          We don't just give you the answers. Our AI tutor acts as a Socratic
          guide, asking the right questions <br /> to help you discover the solutions
          yourself.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-3xl font-bold mb-1">98%</div>
            <div className="text-sm text-slate-500">Pass Rate</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-3xl font-bold mb-1">B+</div>
            <div className="text-sm text-slate-500">Avg Grade</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-3xl font-bold mb-1">20m</div>
            <div className="text-sm text-slate-500">Daily Session</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-3xl font-bold mb-1">3.5x</div>
            <div className="text-sm text-slate-500">Faster Growth</div>
          </div>
        </div>
      </section>

      <section className="min-h-[30rem] mt-16 md:mt-30 px-6 md:px-0 md:ml-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold w-full md:w-2/3 font-[family-name:var(--font-sans)] text-left">
          Finding the right academic support<br className="hidden md:block" />
          shouldn’t be a struggle
        </h1>
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-0 ">
          <div className="text-start w-full md:w-1/2 flex flex-col gap-y-6 md:gap-y-8">
            <p>
              To produce the right outcomes, you need a person you can trust.{" "}
              <br />
              <br />A qualified tutor with AI tools who can guide you to the right strategy,
              take charge of the process, and deliver the grades you want.
            </p>
            {/* This section is specifically pitching human guidance, so it
                keeps a "talk to us" CTA — but labeled so it's clearly
                distinct from the AI/pricing CTAs elsewhere on the page. */}
            <a href="/contact">
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white cursor-pointer border-neutral-200 dark:border-slate-800"
              >
                ➜ Talk to a Tutor
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
      <hr className="w-2/3 max-w-9xl mx-auto my-8 md:my-10" />

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
                alt="Gauge icon representing improved study efficiency"
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
      </section>

      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      <section className="min-h-[30rem] mt-10 px-6 md:px-0 md:ml-20">
        <header className="text-2xl sm:text-3xl md:text-4xl font-bold mx-auto font-[family-name:var(--font-sans)]">
          From the Tutoring Room to Your Screen
        </header>

        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-start items-center md:items-start gap-8 md:gap-0">
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

            {/* Restored founder credibility block — this is the "there's a
                real person behind the AI" signal, placed right where the
                copy already references "teaches like I do." Photo path is
                a placeholder from the old commented-out version; point it
                at wherever the current founder photo actually lives. */}

          </div>
          <DotLottieReact
            className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] h-auto 2xl:-mt-10"
            src="https://lottie.host/86969d74-7fb6-4a0e-8970-b3818e90b159/9PCglkrRD7.lottie"
            loop
            autoplay
          />
        </div>
      </section>

      <section className="flex flex-col  items-center justify-items-center gap-6 w-full  border-slate-200 pt-6 mt-6">

        {/* Profile Block */}
        <div className="flex flex-col items-center gap-x-4 w-full md:w-auto ">
          <img
            src="https://github.com/dkeum/Tutor_website/blob/main/src/assets/tutor1.png?raw=true"
            alt="Daniel Keum, founder and lead math tutor at Mathamagic"
            className="w-16 h-16 rounded-full border object-cover shrink-0"
          />
          <div className="text-left">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-center">Daniel Keum</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Founder & Lead Math Tutor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-3 font-semibold">- AI is changing our education landscape. <br /> I'm excited to be a part of this opportunity.</p>
          </div>
        </div>

        {/* Was "Try the AI Tutor" routing to /pricing — renamed so the
            CTA says what it actually does, and now matches the hero
            CTA's wording since they go to the same place. */}
        {/* <Link to="/pricing" className="shrink-0">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white cursor-pointer border-neutral-200 dark:border-slate-800"
          >
            ➜ View Plans
          </Button>
        </Link> */}

      </section>

      <section className="items-center justify-center px-6 md:px-0">
        <TestimonialsCarousel />
      </section>

      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      {/* Restored Services section, rewritten for the current product:
          the old version listed hourly in-person rates and subjects
          (Physics/Chemistry) that don't match Mathamagick's current
          Pre-Calc–AP Calc-only, AI-tutoring positioning. This also fixes
          the earlier issue of "AP Calculus" never appearing in your own
          copy — it's only shown up in a testimonial's grade label before. */}
      <section className="px-6 md:px-0 md:ml-20 my-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-start mb-8">
          Courses We Cover
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-start">
          {[
            "Pre-Calculus 10",
            "Pre-Calculus 11",
            "Pre-Calculus 12",
            "AP Calculus AB",
            "AP Calculus BC",
          ].map((course) => (
            <li
              key={course}
              className="border border-slate-300 rounded-md p-4 font-medium text-slate-700"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>

      <hr className="w-2/3 max-w-9xl mx-auto my-16 md:my-20" />

      <section className="px-6 md:px-0 md:ml-20 my-10">
        <h2 className="text-start text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
          Frequently Asked Questions
        </h2>
        {/* Restored FAQ, rewritten for the current AI + self-serve pricing
            model — the old version answered hourly in-person tutoring
            questions (rates, cities) that no longer apply. Placeholder
            answers below (cancellation policy, trial details) — swap in
            your actual current terms before shipping. */}
        <Accordion type="single" collapsible className="overflow-x-hidden" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is this AI tutoring, or a real tutor?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Both. The AI tutor is trained on 8+ years of real tutoring
                sessions, so you get the same style of guidance whether
                you're practicing on your own or working with a human tutor.
                Human tutor sessions are available as an add-on on our
                Custom plan.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What's the difference between Self-Study and Student Pro?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Self-Study gives you standard course access, basic exam
                simulators, and basic AI tutoring. Student Pro adds priority
                course access, advanced exam simulators, stronger AI support,
                and personalized study plans — see the{" "}
                <Link to="/pricing" className="underline">
                  pricing page
                </Link>{" "}
                for the full breakdown.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Yes — plans are billed monthly and you can cancel whenever
                you like from your account settings.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Do you offer real human tutor sessions?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Yes, through the AI & Tutor Support plan — a hybrid of the AI
                platform plus opt-in sessions with a human tutor, with
                flexible scheduling and pricing tailored to your needs.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Which courses do you cover?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start">
              <p>
                Pre-Calculus 10, 11, and 12, plus AP Calculus AB and BC.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
            <img className="w-28 h-28 md:w-40 md:h-40" src="/exam.svg" alt="Illustration of a graded exam paper" />
            <div
              className="-ml-14 md:-ml-20"
              style={{
                width: "150px",
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

      <section className="px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto bg-[#1a4fd6] rounded-2xl px-6 sm:px-10 py-10 sm:py-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
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

          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Ready for your child to thrive?</h2>
            {/* Was "Join hundreds of parents" — the hero elsewhere on the
                site cites "1000+ Students & Parents" and pricing cites
                "thousands". Standardized on one number here; make sure
                the hero/pricing copy actually says the same thing. */}
            <p className="text-white/90 max-w-lg text-base">
              Join 1,000+ students and parents seeing real academic
              transformation. Our AI-driven platform adapts to your child's
              unique learning pace.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
            {/* Was "Start your Free Trial" routing to /waitlist — renamed
                so the button says what actually happens when it's clicked.
                If a real self-serve trial exists, route this to signup
                instead and restore "Start Free Trial" as the label. */}
            <Button1
              onClick={() => navigate("/contact")}
              className="bg-white text-[#1a4fd6] font-bold hover:bg-gray-100 whitespace-nowrap shadow-md"
            >
              Contact Us
            </Button1>
            {showPricingButton && (
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