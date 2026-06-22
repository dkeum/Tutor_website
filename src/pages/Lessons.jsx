import React, { useEffect } from "react";
import { CheckCircle2, PlayCircle, ArrowRight } from "lucide-react";

import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import LoggedInLayout from "../components/LoggedInLayout";

// ── Data ──────────────────────────────────────────────────────────────────────
// Set currentTopic to null to hide the Quick Review panel and show the full grid
const currentTopic = {
  title: "Pythagorean Identities",
  subject: "Geometry",
  description:
    "Prepare for the Geometry midterm with our curated summary and interactive cheat sheet.",
};

const topics = [
  {
    title: "Advanced Algebra",
    meta: "12 Lessons • 8 Hours total",
    subtopics: [
      {
        name: "Linear Equations & Inequalities",
        meta: "Video • 45 mins",
        done: true,
      },
      {
        name: "Quadratic Functions",
        meta: "Interactive • 1 hour",
        done: false,
      },
      { name: "Systems of Equations", meta: "Document • 30 mins", done: false },
      { name: "Exponential Expressions", meta: "Video • 50 mins", done: false },
    ],
  },
  {
    title: "Coordinate Geometry",
    meta: "8 Lessons • 6 Hours",
    subtopics: [
      {
        name: "Slope & Distance Formula",
        meta: "Document • 15 mins",
        done: true,
      },
      { name: "Circle Equations", meta: "Video • 40 mins", done: false },
      { name: "Transformations", meta: "Interactive • 30 mins", done: false },
      { name: "Vectors & Scalars", meta: "Document • 20 mins", done: true },
    ],
  },
  {
    title: "Trigonometry",
    meta: "10 Lessons • 7 Hours",
    subtopics: [
      {
        name: "Sine, Cosine & Tangent Laws",
        meta: "Video • 1 hour",
        done: true,
      },
      {
        name: "Trigonometric Ratios",
        meta: "Interactive • 25 mins",
        done: false,
      },
      { name: "Unit Circle", meta: "Document • 20 mins", done: false },
      { name: "Pythagorean Identities", meta: "Video • 35 mins", done: false },
    ],
  },
  {
    title: "Statistics & Probability",
    meta: "9 Lessons • 5 Hours",
    subtopics: [
      { name: "Mean, Median & Mode", meta: "Document • 20 mins", done: true },
      { name: "Probability Trees", meta: "Interactive • 30 mins", done: true },
      { name: "Standard Deviation", meta: "Video • 45 mins", done: false },
      { name: "Data Distributions", meta: "Document • 25 mins", done: false },
    ],
  },
];

const recentLesson = {
  title: "Polynomial Division",
  subject: "Algebra • Part 2",
  progress: 80,
  image:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80",
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SubtopicRow = ({ name, meta, done }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-[#4800b2]/20 hover:bg-[#F8F9FE] transition-all cursor-pointer group/row">
    <div className="flex-shrink-0">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
      ) : (
        <PlayCircle className="w-4 h-4 text-[#4800b2]" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#101b30] truncate">{name}</p>
      <p className="text-[10px] text-[#494456] font-medium mt-0.5">{meta}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-[#4800b2] opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0" />
  </div>
);

const TopicCard = ({ title, meta, subtopics }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8ddff] flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div>
      <h3 className="text-xl font-bold text-[#101b30]">{title}</h3>
      <p className="text-xs text-[#494456] font-medium mt-0.5">{meta}</p>
    </div>
    <div className="flex flex-col gap-1">
      {subtopics.map((s, i) => (
        <SubtopicRow key={i} {...s} />
      ))}
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const Lessons = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById("toast");
      if (toast) {
        toast.classList.remove("translate-y-20", "opacity-0");
        setTimeout(
          () => toast.classList.add("translate-y-20", "opacity-0"),
          5000
        );
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full text-[#101b30] flex font-sans">
      <LoggedInLayout>
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
          <main className="mt-20 p-10 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-12">
            {/* ── Page header + Quick Review card side by side ── */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-4">
              <div className="max-w-2xl">
                <h2
                  className="text-4xl font-bold text-[#101b30] tracking-tight text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Grade 10 Mathematics
                </h2>
                <p className="text-lg text-[#494456] max-w-2xl mt-2 text-left">
                  Explore the foundations of complex logic. Master the rules of
                  the universe, one theorem at a time.
                </p>
              </div>

              {/* Quick Review — only shown when there is an active topic */}
              {currentTopic && (
                <div className="bg-[#263046] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-md w-full lg:w-80 shrink-0">
                  <div className="z-10 relative">
                    <h4 className="text-xl font-bold leading-tight mb-3">
                      {currentTopic.title}
                    </h4>
                  </div>
                  <button className="z-10 relative mt-6 w-full bg-white text-[#101b30] py-3 rounded-xl text-sm font-bold hover:bg-[#e8ddff] transition-colors shadow-sm">
                    Resume Topic
                  </button>
                  <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
                    <div className="w-36 h-36 rounded-full border-[16px] border-white" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Topic grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((t, i) => (
                <TopicCard key={i} {...t} />
              ))}
            </div>

            {/* ── Single recently viewed lesson ── */}
            <div>
              <h4 className="text-xs font-bold text-[#494456] uppercase tracking-widest mb-4">
                Recently Viewed
              </h4>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#cbc3d9]/30 flex gap-4 cursor-pointer items-center hover:shadow-md transition-shadow max-w-sm">
                <img
                  alt="Lesson thumbnail"
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                  src={recentLesson.image}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#101b30] truncate">
                    {recentLesson.title}
                  </p>
                  <p className="text-[11px] text-[#494456] font-medium mb-2">
                    {recentLesson.subject}
                  </p>
                  <div className="h-1 bg-[#e8edff] rounded-full overflow-hidden w-full">
                    <div
                      className="h-full bg-[#4800b2] rounded-full"
                      style={{ width: `${recentLesson.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#494456] mt-1">
                    {recentLesson.progress}% complete
                  </p>
                </div>
              </div>
            </div>
          </main>

          <footer className="p-8 text-center text-[#494456]/40 text-[10px] font-bold uppercase tracking-[0.2em] z-10 mt-auto">
            Powered by Lumina Learning Systems • Grade 10 Mathamagic Portal v2.4
          </footer>

          {/* Toast */}
          <div
            id="toast"
            className="fixed bottom-10 right-10 translate-y-20 opacity-0 transition-all duration-500 z-[100] flex items-center gap-4 bg-[#2ECC71] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#2ECC71]/40"
          >
            <div>
              <p className="text-sm font-bold">Topic Unlocked!</p>
              <p className="text-xs opacity-90 mt-0.5">
                You've reached the prerequisite for Advanced Calculus.
              </p>
            </div>
          </div>
        </div>
      </LoggedInLayout>
    </div>
  );
};

export default Lessons;
