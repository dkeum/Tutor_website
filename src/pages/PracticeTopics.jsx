import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

const PracticeTopics = () => {
  // Track open states for each accordion topic
  const [openTopicId, setOpenTopicId] = useState(null);
  // React-managed state for the notification toast micro-interaction
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Trigger toast transition after a 2-second delay
    const showTimer = setTimeout(() => {
      setShowToast(true);

      // Hide toast automatically after 5 seconds of visibility
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

  // Structured dataset mapping exactly 14 foundational math practice modules
  const topicsData = [
    {
      id: 1,
      title: "1. Linear Equations & Inequalities",
      stats: "4 Sub-sections • 120 Questions Available",
      icon: "function",
      color: "#4800b2",
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
      icon: "variable",
      color: "#4800b2",
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
      icon: "grid_view",
      color: "#4800b2",
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
      icon: "calculate",
      color: "#4800b2",
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
      icon: "mediation",
      color: "#4800b2",
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
      icon: "shapes",
      color: "#00696b",
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
      icon: "waves",
      color: "#594e6d",
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
      icon: "trending_up",
      color: "#4800b2",
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
      icon: "reorder",
      color: "#4800b2",
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
      icon: "grid_on",
      color: "#4800b2",
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
      icon: "navigation",
      color: "#00696b",
      sections: [
        { name: "Vector Component Form & Magnitude", questions: "25 Qs", difficulty: "Medium", completed: false },
        { name: "The Dot Product & Orthogonality", questions: "25 Qs", difficulty: "Hard", completed: false }
      ]
    },
    {
      id: 12,
      title: "12. Probability & Combinatorics",
      stats: "3 Sub-sections • 90 Questions Available",
      icon: "casino",
      color: "#594e6d",
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
      icon: "bar_chart",
      color: "#594e6d",
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
      icon: "insights",
      color: "#4800b2",
      sections: [
        { name: "Estimating Limits Graphically & Algebraically", questions: "30 Qs", difficulty: "Medium", completed: false },
        { name: "The Difference Quotient & Derivative Definition", questions: "30 Qs", difficulty: "Hard", completed: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full  text-[#101b30] flex font-sans">
      {/* Blueprint Grid Layout Styles Injection */}
      <style>{`
        .math-grid {
          background-image: 
            linear-gradient(#e8ddff 1px, transparent 1px),
            linear-gradient(90deg, #e8ddff 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center center;
          opacity: 0.15;
        }
        .accordion-content {
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }
      `}</style>

      {/* 1. Shared Left Sidebar Navigation Module */}
      <Sidebar />

      {/* 2. Main Workspace Layout Layer */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Absolute Background Math Grid System */}
        <div className="absolute inset-0 math-grid pointer-events-none z-0"></div>

        {/* 3. Top Authorized Account Application Bar */}
        <NavbarLoggedIn />

        {/* 4. Canvas Core Content Layer */}
        <main className="mt-20 p-10 max-w-[1280px] w-full mx-auto flex-1 z-10 flex flex-col gap-10">
          
          {/* Header Dashboard Identity Rows */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="bg-[#e8ddff] text-[#4800b2] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Problem Set Engine
              </span>
              <h2 className="text-4xl font-extrabold text-[#101b30] tracking-tight">Interactive Practice Banks</h2>
              <p className="text-lg text-[#494456] max-w-2xl mt-2">
                Deep-dive into core principles. Select from 14 architectural topics below to generate algorithmic training questions.
              </p>
            </div>
            
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 bg-white border border-[#cbc3d9] px-6 py-3 rounded-full text-sm font-bold text-[#101b30] hover:bg-[#f1f3ff] transition-all">
                <span className="material-symbols-outlined text-[#494456]">history</span>
                Session History
              </button>
              <button className="flex items-center gap-2 bg-[#4800b2] text-white px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#4800b2]/20">
                <span className="material-symbols-outlined">shuffle</span>
                Surprise Me Mix
              </button>
            </div>
          </div>

          {/* 14 Math Topics Structural Accordion Tree */}
          <div className="flex flex-col gap-4 w-full">
            {topicsData.map((topic) => {
              const isOpen = openTopicId === topic.id;
              return (
                <div 
                  key={topic.id} 
                  className="bg-white rounded-2xl border border-[#e8ddff] shadow-sm overflow-hidden transition-all duration-200 z-10"
                >
                  {/* Accordion Trigger Element Head */}
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#F8F9FE] transition-colors text-left outline-none group rounded-t-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 text-white rounded-xl flex items-center justify-center shadow-md"
                        style={{ backgroundColor: topic.color }}
                      >
                        <span className="material-symbols-outlined text-2xl">{topic.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#101b30] group-hover:text-[#4800b2] transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-[#494456] font-medium mt-0.5">{topic.stats}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span 
                        className={`material-symbols-outlined text-[#494456] transform transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#4800b2]" : ""
                        }`}
                      >
                        keyboard_arrow_down
                      </span>
                    </div>
                  </button>

                  {/* Accordion Dropdown Section Body Area */}
                  {/* FIXED: Changed bg-[#F8F9FE]/50 to solid bg-[#F8F9FE] so lines don't show through */}
                  <div
                    className={`accordion-content overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 ${
                      isOpen ? "max-h-[500px] opacity-100 bg-[#F8F9FE]" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="p-6 flex flex-col gap-3">
                      {topic.sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-[#d7e2ff] hover:border-[#4800b2]/40 hover:shadow-sm transition-all cursor-pointer group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              section.completed ? "bg-[#2ECC71]/10 text-[#2ECC71]" : "bg-gray-100 text-gray-400"
                            }`}>
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: section.completed ? "'FILL' 1" : "'FILL' 0" }}>
                                {section.completed ? "check_circle" : "radio_button_unchecked"}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-[#101b30] group-hover/item:text-[#4800b2] transition-colors">
                              {section.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-2 sm:mt-0 ml-9 sm:ml-0">
                            <span className="text-xs text-[#494456] font-semibold bg-[#e8edff] px-2.5 py-1 rounded-md">
                              {section.questions}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              section.difficulty === "Easy" ? "bg-green-50 text-green-600 border border-green-100" :
                              section.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {section.difficulty}
                            </span>
                            <span className="material-symbols-outlined text-sm text-gray-400 group-hover/item:text-[#4800b2] group-hover/item:translate-x-1 transition-all">
                              arrow_forward
                            </span>
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

        {/* Global Footer Elements */}
        <footer className="p-8 text-center text-[#494456]/40 text-[10px] font-bold uppercase tracking-[0.2em] z-10 mt-auto">
          Powered by Lumina Learning Systems • Grade 10 Mathamagic Portal v2.4
        </footer>

        {/* 5. Interactive Floating Toast Structure */}
        <div
          className={`fixed bottom-10 right-10 transition-all duration-500 z-[100] flex items-center gap-4 bg-[#2ECC71] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#2ECC71]/40 ${
            showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        >
          <span className="material-symbols-outlined">celebration</span>
          <div>
            <p className="text-sm font-bold">Practice Engine Live!</p>
            <p className="text-xs opacity-90 mt-0.5">Your formulas are calibrated and custom models are initialized.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PracticeTopics;