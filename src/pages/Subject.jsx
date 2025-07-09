import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const subject_links = [
  {
    subject: "physics12",
    topic: "Equilibrium",
    links: [
      { title: "worksheet", link: "/physics_12/equilibrium/Equilibrium.pdf" },
      {
        title: "answer",
        link: "/physics_12/equilibrium/Equilibrium answer.pdf",
      },
      {
        title: "Written solution",
        link: "/physics_12/equilibrium/Equilibrium All Solved.pdf",
      },
    ],
  },
  {
    subject: "physics12",
    topic: "Energy",
    links: [
      {
        title: "worksheet",
        link: "/physics_12/Energy/Basic Momentum and Impulse Questions (Level 1).pdf"
      },
      {
        title: "answer",
        link: "/physics_12/Energy/Momentum and Impulse Answer.pdf"
      },
      {
        title: "Written solution",
        link: "/physics_12/Energy/Momentum and Impulse Written Answer.pdf"
      }
    ]
  },
  {
    subject: "physics12",
    topic: "Circular Motion",
    links: [
      {
        title: "worksheet",
        link: "/physics_12/circular_motion/Circular Motion Questions.pdf"
      },
      {
        title: "answer",
        link: "/physics_12/circular_motion/Circular Motion Answers.pdf"
      },
      {
        title: "Written solution",
        link: "/physics_12/circular_motion/Circular-Motion-Solutions.pdf"
      }
    ]
  }, 
  {
    subject: "physics12",
    topic: "Gravitation",
    links: [
      {
        title: "worksheet",
        link: "/physics_12/gravitation/Gravitation Questions.pdf"
      },
      {
        title: "answer",
        link: "/physics_12/gravitation/gravitation answer.pdf"
      },
      {
        title: "Written solution",
        link: "/physics_12/gravitation/Orbits-Solutions.pdf"
      }
    ]
  }, 
  {
    subject: "physics12",
    topic: "Electrostatic",
    links: [
      {
        title: "worksheet",
        link: "/physics_12/electrostatic/Electrostatics-Provincial-Exam-Package.pdf"
      },
      {
        title: "answer",
        link: "/physics_12/electrostatic/Electrostatics-Provincial-Exam-Package-Solutions.pdf"
      },
    ]
  },
  {
    subject: "physics12",
    topic: "Electromagnetism",
    links: [
        {
            title: "notes",
            link: "/physics_12/electromagnetism/Electromagnetism-Notes.pdf"
          },
      {
        title: "worksheet",
        link: "/physics_12/electromagnetism/Electromagnetism-Provincial-Exam-Package.pdf"
      },
      {
        title: "answer",
        link: "/physics_12/electromagnetism/Electromagnetism-Provincial-Exam-Package-Solutions.pdf"
      },
    ]
  },
  {
    subject: "physics11",
    topic: "Kinematics",
    links: [
      {
        title: "worksheet",
        link: "/physics_11/kinematics/Kinematics Questions.pdf"
      },
      {
        title: "answer",
        link: "/physics_11/kinematics/Kinematics Solution.pdf"
      },
      {
        title: "notes",
        link: "/physics_11/kinematics/Uniform-Motion-Solutions.pdf"
      },
    ]
  },
];

const Subject = () => {
  const { subject } = useParams(); // grabs the dynamic part from the URL

  return (
    <div className="flex flex-col gap-y-2">
      <Navbar Navbar />
      <div className="relative  flex min-h-screen w-full  justify-center bg-white dark:bg-black ">
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
        <section className="flex flex-col pt-10 ml-20 items-center justify-center px-8 w-full">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <div className="px-4">
              <h2 className=" text-xl text-center sm:text-5xl dark:text-white text-black my-30">
                {subject} Topics
              </h2>
            </div>

            <div className="grid grid-cols-3 justify-center gap-y-10">
              {subject_links
                .filter((item) => item.subject === subject)
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-2xl shadow-md p-6 min-w-[300px]"
                  >
                    <h3 className="text-2xl font-semibold dark:text-white text-black">
                      {item.topic}
                    </h3>
                    <ul className="mt-9">
                      {item.links.map((linkObj, i) => (
                        <li className="-mt-10" key={i}>
                          <a
                            href={linkObj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {linkObj.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>





          </motion.h1>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Subject;
