"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const creators = [
  {
    name: "Anatasia",
    role: "CheerLeader",
    img: "/student1.png",
    rotate: -1.95,
  },
  {
    name: "Hudson",
    role: "Lacrosse Player",
    img: "/student2.png",
    rotate: 6.1,
  },
  {
    name: "Keira",
    role: "Soccer Player",
    img: "/student3.png",
    rotate: 4.0,
  },
  {
    name: "Issac",
    role: "Anime Fan",
    img: "/student4.png",
    rotate: 3.7,
  },
  {
    name: "Ava",
    role: "Volleyball Player",
    img: "/student5.png",
    rotate: 2.6,
  },
  {
    name: "Jaden",
    role: "Gamer",
    img: "/student6.png",
    rotate: -4.8,
  },
];

function AvatarItem({ creator, index }) {
  const [hovered, setHovered] = useState(false);

  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    springConfig
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    x.set(e.clientX - centerX);
  };

  return (
    <div
      className="group relative -mr-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ zIndex: hovered ? 99 : "auto" }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ translateX, rotate }}
            className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center"
          >
            <div className="relative flex flex-col items-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl px-3 py-2 whitespace-nowrap">
              <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                {creator.name}
              </p>
              <Badge variant="secondary" className="mt-0.5 text-[11px]">
                {creator.role}
              </Badge>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-neutral-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-neutral-700"
        style={{ rotate: creator.rotate }}
        whileHover={{ scale: 1.05, zIndex: 99 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <img
          src={creator.img}
          alt={creator.name}
          className="h-14 w-14 object-cover object-top"
          height={100}
          width={100}
        />
      </motion.div>
    </div>
  );
}

export default function TrustedCreators() {
  return (
    <div className="flex flex-col items-start gap-3 py-4">
      {/* Avatar stack */}
      <div className="mb-2 flex flex-row items-center">
        {creators.map((creator, i) => (
          <AvatarItem key={creator.name} creator={creator} index={i} />
        ))}

        {/* Stars inline */}
        <div className="ml-6 flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="mx-0.5 h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Trust text */}
      <p className="text-sm text-neutral-400">Trusted by 1,000+ Students</p>
    </div>
  );
}