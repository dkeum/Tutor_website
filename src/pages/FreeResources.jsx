import React, { useState } from "react";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const placeholders = [
  "Pre-Calculus 12",
  "AP Physics 11",
  "Linear Algebra",
  "Chemistry 12",
  "Calculus I",
];

const subjects = [
  {
    subject: "Physics 11",
    image:
      "https://stickmanphysics.com/wp-content/uploads/2020/09/Angular-Projectile-Throw-Definitions.gif",
    topics: ["Projectile motion"],
    link: "/freeResources/physics11",
  },
  {
    subject: "Physics 12",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY25kczFxeXNjNXRsbDk4bW9xNHAyajBqMTlkemp0a2ZqZWlqcjNnZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nkAIKYsPVk4yA/giphy.gif",
    topics: ["Equilibrium"],
    link: "/freeResources/physics12",
  },
  {
    subject: "Pre-Calculus 11",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmFvbDAwZnhydjAzdzVsN3FmbXl6aXJjaTV5a29sNXN2aGduZWNxciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6wlrY2ABvHxDi/giphy.gif",
    topics: ["Quadratic equations"],
    link: "/freeResources/precalculus11",
  },
  {
    subject: "Pre-Calculus 12",
    image:
      "https://personal.morris.umn.edu/~mcquarrb/teachingarchive/Precalculus/Animations/CosineAnim.gif",
    topics: ["trigonometry"],
    link: "/freeResources/precalculus12",
  },
  {
    subject: "Calculus I",
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2t6MHBieml1aHFwNG16eXoxN2ZvM3NtcmFscXphZnF2ajgyenZmaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mnK2Zncuu9IFa/giphy.gif",
    topics: ["Derivatives"],
    link: "/freeResources/calculusI",
  },
  {
    subject: "Calculus II",
    image: "https://www.maplesoft.com/view.aspx?SI=3477/leftbox3.gif",
    topics: ["Integrals"],
    link: "/freeResources/calculusII",
  },
  {
    subject: "Chemistry 11",
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXZ1cnNlbXVtMTNsaDgwdmVtc3pqcTRoYzNkZ3R3NHk4Y2l0N2hkMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gH2RV00WIBEzebvTgN/giphy.gif",
    topics: ["Stoichiometry"],
    link: "/freeResources/chemistry11",
  },
  {
    subject: "Chemistry 12",
    image: "https://i.makeagif.com/media/5-23-2022/S_pyWS.gif",
    topics: ["Reaction Kinetics"],
    link: "/freeResources/chemistry12",
  },
];

const FreeResources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  const filteredSubjects = subjects.filter((item) =>
    searchTerm === "" ? true : item.subject.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="relative flex w-full min-h-screen justify-center bg-white dark:bg-black">
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

        <section className="flex flex-col ml-20 mt-10 items-center justify-center px-8 w-full">
          <div className="flex flex-col justify-center px-4 z-10">
            <h2 className="sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black font-bold">
              Search the Class Needed
            </h2>

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={cn(
              "flex flex-col gap-y-10 pt-10 relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <div className="grid grid-cols-3 sm:gap-x-90 w-full min-h-[240px] justify-center mt-10">
              {filteredSubjects.map((item, index) => (
                <CardContainer
                  className="inter-var max-w-[400px] max-h-[240px]"
                  key={index}
                >
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {item.subject}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="tracking-normal text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      Learn topics like {item.topics[0]}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <a href={item.link}>
                        <img
                          src={item.image}
                          className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt="thumbnail"
                        />
                      </a>
                    </CardItem>
                    <div className="flex justify-between items-center mt-10">
                      <CardItem
                        translateZ={20}
                        as="a"
                        href={item.link}
                        target="__blank"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white tracking-normal"
                      >
                        Learn now →
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
          </motion.h1>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default FreeResources;
