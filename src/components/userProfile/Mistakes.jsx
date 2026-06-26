import React, { useState, useEffect, useRef } from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoggedInLayout from "../LoggedInLayout";

const TOPIC_COLORS = [
  {
    dot: "#4800b2",
    text: "#4800b2",
    button: "bg-[#e8ddff] text-[#4800b2] hover:bg-[#6200ee] hover:text-white",
  },
  {
    dot: "#00696b",
    text: "#00696b",
    button: "bg-[#7cf5f7] text-[#002020] hover:bg-[#00696b] hover:text-white",
  },
  {
    dot: "#594e6d",
    text: "#594e6d",
    button: "bg-[#ebddff] text-[#201632] hover:bg-[#413755] hover:text-white",
  },
  {
    dot: "#b24800",
    text: "#b24800",
    button: "bg-[#ffe8dd] text-[#4a1e00] hover:bg-[#b24800] hover:text-white",
  },
  {
    dot: "#006b3a",
    text: "#006b3a",
    button: "bg-[#d4f7e7] text-[#003a1e] hover:bg-[#006b3a] hover:text-white",
  },
];

export default function Mistakes() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [worstSection, setWorstSection] = useState(null);
  const [openAccordions, setOpenAccordions] = useState({});
  const [sortBy, setSortBy] = useState("Priority");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        setLoading(true);

        const base =
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000"
            : "https://mathamagic-backend.vercel.app";

        const { data } = await axios.get(`${base}/questions/mistakes`, {
          withCredentials: true,
        });

        console.log(data);
        setTotalMistakes(data.total_mistakes);
        setWorstSection(data.worst_section);
        setTopics(data.topics);

        if (data.topics.length > 0) {
          setOpenAccordions({ [data.topics[0].topic_id]: true });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load mistakes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMistakes();
  }, []);

  const toggleAccordion = (topicId) => {
    setOpenAccordions((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const sortedTopics = [...topics].sort((a, b) => {
    if (sortBy === "Topic Name")
      return a.topic_name.localeCompare(b.topic_name);
    if (sortBy === "Questions Count")
      return b.total_mistakes - a.total_mistakes;
    return 0; // Priority = API default order
  });

  const handleReview = (section, topic) => {
    navigate("/mistakes/questions", {
      state: {
        mistakes: section.mistakes,
        topicName: topic.topic_name,
        sectionName: section.section_name,
      },
    });
  };

  return (
    <div className="min-h-screen text-[#101b30] font-sans antialiased">
      <LoggedInLayout>
        <main className=" mx-auto transition-all duration-300">
          {/* Hero Header */}
          <section className="mb-10">
            <div className="flex items-end justify-between mx-auto">
              <div>
                <h2
                  className="text-4xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Correct Your Mistakes
                </h2>
                <p className="text-lg text-[#494456] text-left">
                  Every mistake is a step towards mastery.
                </p>
              </div>
            </div>
          </section>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-24 text-[#7a7488] text-sm font-medium">
              Loading your mistakes...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-24 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-[#7a7488] uppercase tracking-widest">
                    Review Topics
                  </h3>
                  <div className="flex gap-2 items-center text-sm">
                    <span className="text-[#494456]">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-none font-bold text-[#4800b2] focus:ring-0 cursor-pointer p-0 text-sm"
                    >
                      <option>Priority</option>
                      <option>Topic Name</option>
                      <option>Questions Count</option>
                    </select>
                  </div>
                </div>

                {/* Empty state */}
                {sortedTopics.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-12 text-center shadow-[0_8px_32px_0_rgba(98,0,238,0.06)]">
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="font-bold text-[#101b30]">
                      No mistakes to review!
                    </p>
                    <p className="text-sm text-[#494456] mt-1">
                      Keep up the great work.
                    </p>
                  </div>
                ) : (
                  sortedTopics.map((topic, idx) => {
                    const color = TOPIC_COLORS[idx % TOPIC_COLORS.length];
                    const isOpen = !!openAccordions[topic.topic_id];

                    return (
                      <div
                        key={topic.topic_id}
                        className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] hover:shadow-[0_12px_40px_0_rgba(98,0,238,0.12)] transition-all duration-300 overflow-hidden"
                      >
                        {/* Accordion Header */}
                        <div
                          className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F3E8FF]/20 transition-colors"
                          onClick={() => toggleAccordion(topic.topic_id)}
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="text-xl font-bold text-[#101b30] leading-tight text-left">
                                {topic.topic_name}
                              </h4>
                              <p
                                className="text-xs font-semibold flex items-center gap-1 mt-1"
                                style={{ color: color.text }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full inline-block"
                                  style={{ backgroundColor: color.dot }}
                                ></span>
                                {topic.total_mistakes} Question
                                {topic.total_mistakes !== 1 ? "s" : ""} to
                                review
                              </p>
                            </div>
                          </div>
                          <ChevronIcon isOpen={isOpen} />
                        </div>

                        {/* Accordion Body */}
                        <AccordionWrapper isOpen={isOpen}>
                          <div className="p-6 space-y-3 bg-[#F8F9FE]/50 border-t border-[#cbc3d9]/30">
                            {topic.sections.map((section) => (
                              <div
                                key={section.section_id}
                                className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#cbc3d9]/10"
                              >
                                <div>
                                  <p className="font-bold text-[#101b30]">
                                    {section.section_name}
                                  </p>
                                  <p className="text-xs text-[#494456] capitalize">
                                    {section.difficulty ?? "Mixed difficulty"} ·{" "}
                                    {section.mistakes.length} mistake
                                    {section.mistakes.length !== 1 ? "s" : ""}
                                  </p>
                                </div>
                                <ReviewButton
                                  count={section.mistakes.length}
                                  colorClass={color.button}
                                  onClick={() => handleReview(section, topic)}
                                />
                              </div>
                            ))}
                          </div>
                        </AccordionWrapper>
                      </div>
                    );
                  })
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Total Pending Card */}
                <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] transition-all duration-300">
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-[#4800b2] mb-4 uppercase tracking-wider">
                      Total Pending
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold text-[#101b30]">
                        {totalMistakes}
                      </span>
                      <span className="text-sm text-[#494456]">Questions</span>
                    </div>
                    {worstSection ? (
                      <p className="text-xs text-[#494456] mt-4 leading-relaxed">
                        Most errors found in{" "}
                        <span className="font-bold text-[#4800b2]">
                          {worstSection.topic_name} {worstSection.section_name}
                        </span>
                        . Review this first!
                      </p>
                    ) : (
                      <p className="text-xs text-[#494456] mt-4 leading-relaxed">
                        No mistakes yet. Keep practising!
                      </p>
                    )}
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#4800b2]/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 bg-[#e8ddff]/50 rounded-full flex items-center justify-center text-[#4800b2]">
                      <span className="text-xl">✦</span>
                    </div>
                  </div>
                </div>

                {/* Mastery Tip Card */}
                <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(98,0,238,0.06)] hover:translate-y-[-4px] transition-all duration-300">
                  <h5 className="font-bold text-[#494456] uppercase tracking-widest text-[10px] mb-6">
                    Mastery Tip
                  </h5>
                  <div className="flex gap-4 items-start mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#2ECC71]/10 flex items-center justify-center flex-shrink-0 text-[#2ECC71]">
                      <span className="text-lg">💡</span>
                    </div>
                    <p className="text-xs text-[#494456] italic leading-relaxed">
                      "Reviewing mistakes within 24 hours increases long-term
                      retention by 60%. Try to tackle 2 questions now."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </LoggedInLayout>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENTS
   ========================================================================== */

function AccordionWrapper({ isOpen, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{ maxHeight: height }}
      className="transition-[max-height] duration-300 ease-out overflow-hidden text-left"
    >
      {children}
    </div>
  );
}

function ReviewButton({ count, colorClass, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${colorClass}`}
    >
      Review {count}
      <span className="text-xs font-bold">→</span>
    </button>
  );
}

function ChevronIcon({ isOpen }) {
  return (
    <span
      className={`text-[#7a7488] block text-xs transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  );
}
