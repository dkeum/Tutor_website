import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import to grab the logged-in student's class
import axios from "axios";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  CircleDot,
  ArrowRight,
  Play,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { useNavigate } from "react-router-dom";
import LoggedInLayout from "../components/LoggedInLayout";

const PracticeTopics = () => {
  // 1. Core States for Dynamic Data
  const [topics, setTopics] = useState([]);
  const [lastWorkedSection, setLastWorkedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for handling questions payload separately
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [openTopicId, setOpenTopicId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Grab the student's class ID from your Redux store
  const studentClassId = useSelector((s) => s.personDetail?.class_ID);

  const navigate = useNavigate();

  // console.log(studentClassId)

  // 2. Fetch Practice Bank Architecture On Mount
  useEffect(() => {
    const fetchPracticeBank = async () => {
      try {
        setLoading(true);

        const API_URL =
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/practice-bank"
            : "https://mathamagic-backend.vercel.app/practice-bank";

        const response = await axios.get(API_URL, {
          params: { class: studentClassId },
          withCredentials: true,
        });

        // console.log(response);

        setTopics(response.data.topics || []);
        setLastWorkedSection(response.data.last_worked_section);
        setError(null);
      } catch (err) {
        console.error("Error fetching practice bank:", err);
        setError(err.response?.data?.error || "Failed to load practice banks.");
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeBank();
  }, [studentClassId]);

  // 3. On-Click Question Fetching Handler Function
  const handleFetchQuestions = async (topicName, sectionName) => {
    // try {
    //   setLoadingQuestions(true);

    //   const BASE_URL = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    //     ? "http://localhost:3000"
    //     : "https://mathamagic-backend.vercel.app";

    //   // encodeURIComponent sanitizes spaces, slashes, and ampersands inside names
    //   const targetUrl = `${BASE_URL}/questions/${encodeURIComponent(topicName)}/${encodeURIComponent(sectionName)}`;

    //   console.log(`Initializing custom session via: ${targetUrl}`);

    //   const res = await axios.get(targetUrl, { withCredentials: true, params: { class: studentClassId }  });

    //   console.log(res.data)

    //   setQuestions(res.data.questions || []);
    //   console.log("Questions loaded successfully into state:", res.data.questions);

    //   if(length(res.data.questions != 0))
    //   {
    //     navigate(
    //       `/questions/${encodeURIComponent(topicName)}?section=${encodeURIComponent(sectionName)}&class=${studentClassId}`
    //     );
    //   }

    //   // OPTIONAL: Add navigation routing here (e.g., navigate('/practice-session'))
    //   // alert(`Successfully loaded ${res.data.questions?.length || 0} questions for ${sectionName}!`);

    // } catch (err) {
    //   console.error("Error fetching targeted questions:", err);
    //   alert(err.response?.data?.error || "Could not launch practice engine session.");
    // } finally {
    //   setLoadingQuestions(false);
    // }
    navigate(
      `/question/${encodeURIComponent(topicName)}?section=${encodeURIComponent(
        sectionName
      )}`
    );
  };

  // Original Toast Timer logic
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowToast(true);
      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  const toggleTopic = (id) => {
    setOpenTopicId(openTopicId === id ? null : id);
  };

  const getTopicProgress = (sections = []) => {
    const total = sections.length;
    const completedCount = sections.filter((s) => s.completed).length;

    if (total > 0 && completedCount === total) {
      return {
        icon: (
          <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" strokeWidth={2.5} />
        ),
        label: "Done",
      };
    } else if (completedCount > 0) {
      return {
        icon: (
          <CircleDot className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
        ),
        label: "In Progress",
      };
    } else {
      return {
        icon: <Circle className="w-5 h-5 text-slate-300" strokeWidth={2.5} />,
        label: "Not Started",
      };
    }
  };

  return (
    <div className="min-h-screen w-full text-[#101b30] flex bg-slate-50/30">
      <style>{`
        .math-grid {
          background-image: 
            linear-gradient(#e8ddff 1px, transparent 1px),
            linear-gradient(90deg, #e8ddff 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center center;
          opacity: 0.12;
        }
        .accordion-content {
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }
      `}</style>

      <LoggedInLayout>
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 math-grid pointer-events-none z-0"></div>

          <main className=" mx-auto flex-1 z-10 flex flex-col gap-10">
            {/* Header Layout */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h2
                  className="text-4xl font-bold text-[#101b30] tracking-tight text-left"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Interactive Practice Banks
                </h2>
                <p className="text-base md:text-lg text-[#494456] max-w-xl mt-2 text-left">
                  Deep-dive into core principles. Select from your available
                  topics below to generate algorithmic training questions.
                </p>
              </div>

              {/* Session Container Layout linked to Database tracking */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl w-full lg:w-auto justify-between lg:justify-start shrink-0">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Last Attempted
                  </span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5 truncate max-w-[180px]">
                    {lastWorkedSection
                      ? lastWorkedSection.name
                      : "No previous session"}
                  </span>
                </div>
                <button
                  disabled={!lastWorkedSection || loadingQuestions}
                  onClick={() => {
                    if (
                      lastWorkedSection?.topic_name &&
                      lastWorkedSection?.name
                    ) {
                      handleFetchQuestions(
                        lastWorkedSection.topic_name,
                        lastWorkedSection.name
                      );
                    }
                  }}
                  className="flex items-center gap-1.5 bg-[#4800b2] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#370094] transition-all cursor-pointer shadow-md shadow-[#4800b2]/10 active:scale-98 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {loadingQuestions ? "Loading..." : "Resume Session"}
                </button>
              </div>
            </div>

            {/* Loading and Error Handling views */}
            {loading && (
              <div className="text-center py-20 text-sm font-semibold text-slate-400">
                Loading your targeted training curriculum...
              </div>
            )}

            {error && (
              <div className="text-center py-20 text-sm font-semibold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl">
                {error}
              </div>
            )}

            {/* Math Topics Structural Accordion Tree */}
            {!loading && !error && (
              <div className="flex flex-col gap-4 w-full">
                {topics.map((topic, index) => {
                  const isOpen = openTopicId === topic.id;
                  const nestedSections = topic.Section || [];
                  const progress = getTopicProgress(nestedSections);

                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 z-10"
                    >
                      {/* Accordion Head */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50/50 transition-colors text-left outline-none group rounded-t-2xl"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 shrink-0">{progress.icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-[#101b30] group-hover:text-[#4800b2] transition-colors">
                              {`${index + 1}. ${topic.name}`}
                            </h3>
                            <p className="text-xs text-[#494456] font-medium mt-0.5">
                              {`${nestedSections.length} Sub-sections Available`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-[#4800b2]" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Accordion Dropdown Section Body Area */}
                      <div
                        className={`accordion-content overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 ${
                          isOpen
                            ? "max-h-[800px] opacity-100 bg-slate-50/40"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="p-6 flex flex-col gap-3">
                          {nestedSections.map((section) => {
                            const normalizedDifficulty =
                              section.difficulty?.toLowerCase();

                            return (
                              <div
                                key={section.id}
                                onClick={() =>
                                  !loadingQuestions &&
                                  handleFetchQuestions(topic.name, section.name)
                                }
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#4800b2]/40 hover:shadow-sm transition-all cursor-pointer group/item ${
                                  loadingQuestions
                                    ? "pointer-events-none opacity-60"
                                    : ""
                                }`}
                              >
                                {/* Left: Sub-section Title Status */}
                                <div className="flex items-center gap-3">
                                  <div className="shrink-0">
                                    {section.completed ? (
                                      <CheckCircle2
                                        className="w-5 h-5 text-[#2ECC71]"
                                        strokeWidth={2.5}
                                      />
                                    ) : (
                                      <Circle
                                        className="w-5 h-5 text-slate-300 group-hover/item:text-slate-400"
                                        strokeWidth={2.5}
                                      />
                                    )}
                                  </div>
                                  <span className="text-sm font-bold text-[#101b30] group-hover/item:text-[#4800b2] transition-colors">
                                    {section.name}
                                  </span>
                                </div>

                                {/* Right: Meta Details and Forward Action Arrow */}
                                <div className="flex items-center gap-4 mt-2 sm:mt-0 ml-8 sm:ml-0">
                                  <span className="text-xs text-[#494456] font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                                    {section.questions || "30 Qs"}
                                  </span>

                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                      normalizedDifficulty === "easy"
                                        ? "bg-green-50 text-green-600 border border-green-100"
                                        : normalizedDifficulty === "hard"
                                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                                        : "bg-amber-50 text-amber-600 border border-amber-100"
                                    }`}
                                  >
                                    {section.difficulty || "Medium"}
                                  </span>

                                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#4800b2] group-hover/item:translate-x-1 transition-all" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

         

          <div
            className={`fixed bottom-10 right-10 transition-all duration-500 z-[100] flex items-center gap-4 bg-[#2ECC71] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#2ECC71]/40 ${
              showToast
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-left">
              <p className="text-sm font-bold">Practice Engine Live!</p>
              <p className="text-xs opacity-90 mt-0.5">
                Your formulas are calibrated and custom models are initialized.
              </p>
            </div>
          </div>
        </div>
      </LoggedInLayout>
    </div>
  );
};

export default PracticeTopics;
