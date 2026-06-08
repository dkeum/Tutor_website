import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  CircleDot, 
  ArrowRight, 
  Play 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

const PracticeTopics = () => {
  const [openTopicId, setOpenTopicId] = useState(null);
  const [showToast, setShowToast] = useState(false);

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

  const topicsData = [
    {
      id: 1,
      title: "1. Linear Equations & Inequalities",
      stats: "4 Sub-sections • 120 Questions Available",
      sections: [
        { name: "Single-Variable Linear Equations", questions: "30 Qs", difficulty: "Easy", completed: true },
        { name: "Multi-Step Inequalities & Graphing", questions: "30 Qs", difficulty: "Medium", completed: true },
        { name: "Absolute Value Equations", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "Applications and Word Problems", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 2,
      title: "2. Quadratic Functions & Equations",
      stats: "3 Sub-sections • 90 Questions Available",
      sections: [
        { name: "Factoring Quadratics ($ax^2 + bx + c$)", questions: "30 Qs", difficulty: "Medium", completed: true },
        { name: "The Quadratic Formula & Discriminant", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "Vertex Form & Parabolic Graphing", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 3,
      title: "3. Systems of Equations",
      stats: "3 Sub-sections • 75 Questions Available",
      sections: [
        { name: "Solving via Substitution & Elimination", questions: "25 Qs", difficulty: "Medium", completed: true },
        { name: "Matrix Methods & Row Reduction", questions: "25 Qs", difficulty: "Hard", completed: false },
        { name: "Systems of Linear Inequalities", questions: "25 Qs", difficulty: "Medium", completed: false }
      ]
    },
    {
      id: 4,
      title: "4. Polynomials & Exponents",
      stats: "3 Sub-sections • 90 Questions Available",
      sections: [
        { name: "Laws of Exponents & Scientific Notation", questions: "30 Qs", difficulty: "Easy", completed: true },
        { name: "Polynomial Long Division", questions: "30 Qs", difficulty: "Hard", completed: false },
        { name: "Remainder and Factor Theorems", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 5,
      title: "5. Functions & Domain Relations",
      stats: "3 Sub-sections • 80 Questions Available",
      sections: [
        { name: "Evaluating Composite Functions", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "Finding Inverse Functions", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "Domain, Range & Asymptotes", questions: "25 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 6,
      title: "6. Coordinate Geometry",
      stats: "3 Sub-sections • 90 Questions Available",
      sections: [
        { name: "The Midpoint and Distance Formulas", questions: "30 Qs", difficulty: "Easy", completed: true },
        { name: "Parallel and Perpendicular Slopes", questions: "30 Qs", difficulty: "Medium", completed: true },
        { name: "Equations of Circles in Standard Form", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 7,
      title: "7. Trigonometric Ratios & Laws",
      stats: "3 Sub-sections • 90 Questions Available",
      sections: [
        { name: "Right Triangle Trigonometry (SOHCAHTOA)", questions: "30 Qs", difficulty: "Easy", completed: true },
        { name: "The Law of Sines and Law of Cosines", questions: "30 Qs", difficulty: "Hard", completed: false },
        { name: "The Unit Circle & Radian Measures", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 8,
      title: "8. Exponential & Logarithmic Functions",
      stats: "3 Sub-sections • 85 Questions Available",
      sections: [
        { name: "Evaluating & Expanding Logarithms", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "Logarithmic Change of Base Rule", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "Exponential Growth and Decay Models", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 9,
      title: "9. Sequences and Series",
      stats: "3 Sub-sections • 75 Questions Available",
      sections: [
        { name: "Arithmetic Progressions ($a_n = a_1 + (n-1)d$)", questions: "25 Qs", difficulty: "Easy", completed: false },
        { name: "Geometric Series and Infinite Sums", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "Sigma Notation & Summation Properties", questions: "25 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 10,
      title: "10. Matrices & Determinants",
      stats: "3 Sub-sections • 60 Questions Available",
      sections: [
        { name: "Matrix Operations & Multiplication", questions: "20 Qs", difficulty: "Easy", completed: false },
        { name: "Determinants of 2x2 and 3x3 Matrices", questions: "20 Qs", difficulty: "Medium", completed: false },
        { name: "Cramer's Rule & Multiplicative Inverses", questions: "20 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 11,
      title: "11. Vectors & Dot Products",
      stats: "2 Sub-sections • 50 Questions Available",
      sections: [
        { name: "Vector Component Form & Magnitude", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "The Dot Product & Orthogonality", questions: "25 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 12,
      title: "12. Probability & Combinatorics",
      stats: "3 Sub-sections • 90 Questions Available",
      sections: [
        { name: "Permutations vs. Combinations Formula", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "Conditional Probability & Bayes' Theorem", questions: "30 Qs", difficulty: "Hard", completed: false },
        { name: "Binomial Probability Distributions", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 13,
      title: "13. Descriptive Statistics",
      stats: "3 Sub-sections • 80 Questions Available",
      sections: [
        { name: "Mean, Median, Mode & Weighted Averages", questions: "30 Qs", difficulty: "Easy", completed: false },
        { name: "Variance and Standard Deviation", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "Z-Scores and Normal Distribution Curves", questions: "25 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 14,
      title: "14. Introduction to Limits & Calculus",
      stats: "2 Sub-sections • 60 Questions Available",
      sections: [
        { name: "Estimating Limits Graphically & Algebraically", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "The Difference Quotient & Derivative Definition", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    }
  ];

  // Helper method to resolve topic states cleanly programmatically
  const getTopicProgress = (sections) => {
    const total = sections.length;
    const completedCount = sections.filter(s => s.completed).length;

    if (completedCount === total) {
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" strokeWidth={2.5} />,
        label: "Done"
      };
    } else if (completedCount > 0) {
      return {
        icon: <CircleDot className="w-5 h-5 text-amber-500" strokeWidth={2.5} />,
        label: "In Progress"
      };
    } else {
      return {
        icon: <Circle className="w-5 h-5 text-slate-300" strokeWidth={2.5} />,
        label: "Not Started"
      };
    }
  };

  return (
    <div className="min-h-screen w-full text-[#101b30] flex font-sans bg-slate-50/30">
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

      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 math-grid pointer-events-none z-0"></div>

        <NavbarLoggedIn />

        <main className="mt-20 p-10 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-10">
          
          {/* Header Layout */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#101b30] tracking-tight text-left animate-fade-in" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Interactive Practice Banks
              </h2>
              <p className="text-base md:text-lg text-[#494456] max-w-xl mt-2 text-left">
                Deep-dive into core principles. Select from 14 foundational topics below to generate algorithmic training questions.
              </p>
            </div>

            {/* Session Container Layout */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl w-full lg:w-auto justify-between lg:justify-start shrink-0">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Attempted</span>
                <span className="text-sm font-bold text-slate-700 block mt-0.5">Factoring ax² + bx + c</span>
              </div>
              <button className="flex items-center gap-1.5 bg-[#4800b2] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#370094] transition-all cursor-pointer shadow-md shadow-[#4800b2]/10 active:scale-98 ml-4">
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Session
              </button>
            </div>
          </div>

          {/* 14 Math Topics Structural Accordion Tree */}
          <div className="flex flex-col gap-4 w-full">
            {topicsData.map((topic) => {
              const isOpen = openTopicId === topic.id;
              const progress = getTopicProgress(topic.sections);
              
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
                      {/* Topic-Level Status Tracker Icon */}
                      <div className="mt-1 shrink-0">
                        {progress.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#101b30] group-hover:text-[#4800b2] transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-[#494456] font-medium mt-0.5">
                          {topic.stats}
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
                      isOpen ? "max-h-[500px] opacity-100 bg-slate-50/40" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="p-6 flex flex-col gap-3">
                      {topic.sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#4800b2]/40 hover:shadow-sm transition-all cursor-pointer group/item"
                        >
                          {/* Left: Sub-section Title Status */}
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">
                              {section.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" strokeWidth={2.5} />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 group-hover/item:text-slate-400" strokeWidth={2.5} />
                              )}
                            </div>
                            <span className="text-sm font-bold text-[#101b30] group-hover/item:text-[#4800b2] transition-colors">
                              {section.name}
                            </span>
                          </div>

                          {/* Right: Meta Details and Forward Action Arrow */}
                          <div className="flex items-center gap-4 mt-2 sm:mt-0 ml-8 sm:ml-0">
                            <span className="text-xs text-[#494456] font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                              {section.questions}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              section.difficulty === "Easy" ? "bg-green-50 text-green-600 border border-green-100" :
                              section.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {section.difficulty}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#4800b2] group-hover/item:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="p-8 text-center text-[#494456]/40 text-[10px] font-bold uppercase tracking-[0.2em] z-10 mt-auto">
          Powered by Lumina Learning Systems • Grade 10 Mathamagic Portal v2.4
        </footer>

        <div
          className={`fixed bottom-10 right-10 transition-all duration-500 z-[100] flex items-center gap-4 bg-[#2ECC71] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#2ECC71]/40 ${
            showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-left">
            <p className="text-sm font-bold">Practice Engine Live!</p>
            <p className="text-xs opacity-90 mt-0.5">Your formulas are calibrated and custom models are initialized.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PracticeTopics;