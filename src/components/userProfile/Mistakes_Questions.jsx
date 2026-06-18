import React, { useEffect, useState, useMemo, useRef } from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
import { useSelector } from "react-redux";
import axios from "axios";
import { addStyles, EditableMathField } from "react-mathquill";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import normalizeLatex from "../../helperFunctions/normalizeLatex";
import { motion, AnimatePresence } from "framer-motion";
import SolveProblems_stepbystep from "../solveProblems/SolveProblems_stepbystep";
import useDog_standalone from "../../hook/useDog_standalone";

addStyles();

const MistakesQuestions = () => {
  const data = useSelector((state) => state.personDetail.marks_section) || [];
  const [api, setApi] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [latex, setLatex] = useState("");
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswerFeedback, setWrongAnswerFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Controls visibility of UI hint container
  const [showUiHint, setShowUiHint] = useState(false);
  // Track visual success/error states for the math input container border
  const [inputStatus, setInputStatus] = useState("default"); // "default" | "success" | "error"

  // Mathquill reference wrapper to insert virtual key values programmatically
  const mathFieldRef = useRef(null);

  const {
    divRef,
    playAnimation,
    handlePlayAudio,
    muted,
    toggleMute,
  } = useDog_standalone();

  // Get only wrong unique question IDs
  const wrongUniqueQuestionIds = useMemo(
    () =>
      Array.from(
        new Set(
          data.flatMap(
            (item) =>
              item.recordedAnswers
                ?.filter((ans) => ans.isCorrect === false)
                .map((ans) => ans.questionId) || []
          )
        )
      ),
    [data]
  );

  // Fetch wrong questions from backend
  useEffect(() => {
    if (!wrongUniqueQuestionIds.length) return;

    const getQuestions = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/questions/fix-questions"
            : "https://mathamagic-backend.vercel.app/questions/fix-questions",
          { questions_id: wrongUniqueQuestionIds },
          { withCredentials: true }
        );

        setQuestions(response.data.question || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    getQuestions();
  }, [wrongUniqueQuestionIds]);

  const currentQuestion = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  const previousAnswer = useMemo(() => {
    return (
      data
        .flatMap((item) => item.recordedAnswers || [])
        .find((ans) => ans.questionId === currentQuestion.id)?.answer || ""
    );
  }, [currentQuestion, data]);

  // Derive dynamic current tracking sections for active topics
  const computedTopicsMap = useMemo(() => {
    return data.reduce((map, item) => {
      const topic = item.topic;
      const section = item.section_name || item.section;
      if (!map.has(topic)) map.set(topic, new Set());
      if (section) map.get(topic).add(section);
      return map;
    }, new Map());
  }, [data]);

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answer || "";
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    if (isCorrect) {
      setInputStatus("success");
      setWrongAnswerFeedback("");
      setShowResults(true);

      const newAnswer = {
        questionId: currentQuestion.id,
        answer: latex,
        isCorrect,
      };

      setRecordedAnswers((prev) => [...prev, newAnswer]);
      setAnswerResults((prev) => [
        ...prev,
        { questionId: currentQuestion.id, isCorrect },
      ]);
      
      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/questions/fixed-mistakes"
          : "https://mathamagic-backend.vercel.app/questions/fixed_mistakes",
        { fixed_questions_id: [currentQuestion.id] },
        { withCredentials: true }
      );

      // Simple cooldown delay to enjoy the UI success toast/animations before advancing
      setTimeout(() => {
        setInputStatus("default");
        setShowResults(false);
        setLatex("");
        if (api && !isLastQuestion) {
          api.scrollNext();
          setCurrentIndex((prev) => prev + 1);
        }
      }, 2500);

    } else {
      setInputStatus("error");
      setWrongAnswerFeedback(`Incorrect template match. Keep investigating!`);
      
      setTimeout(() => {
        setInputStatus("default");
      }, 600);
    }
  };

  // Append virtual keypad entries into MathQuill
  const handleVirtualKeypress = (value) => {
    if (mathFieldRef.current) {
      if (value === "clear") {
        setLatex("");
      } else {
        mathFieldRef.current.write(value);
      }
    }
  };

  // Calculate dynamic progression bar percentage
  const progressPercentage = questions.length > 0 
    ? Math.min(Math.round(((currentIndex) / questions.length) * 100), 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#101b30] font-sans antialiased">
      {/* Global Style Injector for Custom Static Keyframe and Material Icons */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-effect-bar::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        /* Custom overrides to match mathquill dynamically inside tailwind layouts */
        .mq-editable-field {
          border: none !important;
          box-shadow: none !important;
          width: 100%;
        }
        .mq-root-block {
          font-size: 1.8rem !important;
          color: #6200ee !important;
        }
      `}} />

      <NavbarLoggedIn />

      {/* Main Container Core Viewport */}
      <main className="max-w-[1440px] mx-auto w-full p-6 lg:p-12 transition-all duration-300">
        
        {/* Progress Header Ribbon Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#4800b2] tracking-tight mb-1">Correction Mode</h1>
            <p className="text-[#494456] text-sm">
              Reviewing topic: <span className="font-semibold text-[#101b30]">{currentQuestion.topic || "Analyzing Submissions"}</span>
            </p>
          </div>
          <div className="w-full sm:w-72 bg-white/50 p-4 rounded-2xl border border-[#cbc3d9]/30 shadow-sm">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#4800b2] tracking-wider">
                QUESTION {questions.length > 0 ? currentIndex + 1 : 0} OF {questions.length}
              </span>
              <span className="text-xs font-medium text-[#7a7488]">{progressPercentage}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-[#e0e8ff] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#2ECC71] transition-all duration-500 relative shimmer-effect-bar" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic Empty State Fallback Handler */}
        {questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#cbc3d9]/30 shadow-sm max-w-xl mx-auto mt-12">
            <span className="material-symbols-outlined text-6xl text-[#4800b2]/30 mb-4">verified_user</span>
            <h3 className="text-xl font-bold text-[#101b30] mb-2">No pending corrections found!</h3>
            <p className="text-sm text-[#494456]">Your workbook is completely clear. Outstanding job on mastering your modules!</p>
          </div>
        ) : (
          /* Main Interactive Split Column Grid Layout Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN PANEL: Dynamic Problem Statements + Interactive Solution Engines */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Problem Content Container Card */}
              <section className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.03)] border border-[#cbc3d9]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#F3E8FF] w-12 h-12 rounded-xl flex items-center justify-center text-[#4800b2]">
                    <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101b30]">Active Challenge</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Non-Interactive Un-clickable Carousel Container Pipeline representing real-time viewport index tracking */}
                  <Carousel className="w-full pointer-events-none" setApi={setApi} opts={{ loop: false }}>
                    <CarouselContent>
                      {questions.map((q, index) => (
                        <CarouselItem key={index}>
                          <div className="w-full">
                            <p className="text-[#494456] text-base md:text-lg leading-relaxed mb-6">
                              {q.question}
                            </p>
                            {q?.image_url && (
                              <div className="mt-4 rounded-xl overflow-hidden border border-[#cbc3d9]/20 flex items-center justify-center bg-slate-50 p-4">
                                <img src={q.image_url} alt="Problem Graphic Visualization Layout" className="max-h-[260px] object-contain"/>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </section>

              {/* Advanced Mathquill Interactive Sandbox Editor Workspace Input Module */}
              <section className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.03)] border border-[#cbc3d9]/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#101b30]">Your Revision Entry</h3>
                  <button 
                    onClick={() => setShowUiHint(!showUiHint)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00696b] hover:text-[#004f50] transition-colors uppercase tracking-wider group"
                  >
                    <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">lightbulb</span>
                    Toggle Hint
                  </button>
                </div>

                {/* Micro Hint Accordion Panel component fallback container */}
                <AnimatePresence>
                  {showUiHint && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="p-4 bg-[#79f2f4]/10 border border-[#00696b]/20 rounded-xl">
                        <p className="text-xs text-[#004f50] font-medium leading-relaxed">
                          💡 <span className="font-bold">Pedagogical Framework Guidance:</span> Ensure explicit declaration rules match standard variable parameters. Review basic operator hierarchies if submission syntax fails verification limits.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Dynamic Interactive Input Field Box Wrapper housing Mathquill */}
                  <motion.div 
                    animate={inputStatus === "error" ? { x: [-8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`relative w-full p-6 pt-8 rounded-xl border-2 transition-all min-h-[100px] flex items-center ${
                      inputStatus === "success" ? "border-[#2ECC71] bg-[#2ECC71]/5 text-[#2ECC71]" :
                      inputStatus === "error" ? "border-[#ba1a1a] bg-[#ffdad6]/10 text-[#ba1a1a]" :
                      "border-[#cbc3d9] focus-within:border-[#4800b2] focus-within:ring-4 focus-within:ring-[#4800b2]/5"
                    }`}
                  >
                    <label className="absolute top-2 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-widest text-[#4800b2]">
                      f'(x) =
                    </label>
                    <div className="w-full overflow-x-auto">
                      <EditableMathField
                        latex={latex}
                        onChange={(mathField) => {
                          setLatex(mathField.latex());
                        }}
                        mathquillDidMount={(el) => {
                          mathFieldRef.current = el;
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Math Formula Virtual Input Keypad Deck Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => handleVirtualKeypress("^2")} className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20">x²</button>
                    <button onClick={() => handleVirtualKeypress("+")} className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20">+</button>
                    <button onClick={() => handleVirtualKeypress("-")} className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20">−</button>
                    <button onClick={() => handleVirtualKeypress("clear")} className="py-3.5 bg-[#f1f3ff] text-xs font-bold text-[#7a7488] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20">Clear</button>
                  </div>

                  {/* Operational Verification submission call button handler */}
                  <button 
                    onClick={handleNextOrSubmit}
                    className="w-full bg-[#4800b2] py-5 rounded-xl text-white text-base font-bold shadow-lg shadow-[#4800b2]/10 hover:bg-[#6200ee] hover:shadow-xl hover:shadow-[#4800b2]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-3 mt-4"
                  >
                    <span>{isLastQuestion ? "Verify Final Solutions" : "Verify & Advance"}</span>
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </button>

                  {/* Form input live error contextual verification string blocks */}
                  {wrongAnswerFeedback && (
                    <div className="text-center text-xs font-bold text-[#ba1a1a] tracking-wide mt-2 bg-[#ffdad6]/20 p-2 rounded-lg">
                      {wrongAnswerFeedback}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN PANEL: Previous Historical Error Context Panels + Auxiliary Action Suites */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Previous Erroneous Attempt Framework Panel Tracking Display */}
              <section className="bg-[#ffdad6]/10 border-2 border-[#ba1a1a]/20 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#ba1a1a]/20 pointer-events-none">
                  <span className="material-symbols-outlined text-4xl">error_outline</span>
                </div>
                
                <h4 className="text-xs font-bold text-[#ba1a1a] mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">history</span>
                  Previous Submission Log
                </h4>
                
                <div className="mb-4">
                  <p className="text-2xl font-mono font-bold text-[#93000a] italic tracking-tight bg-white/40 px-3 py-1.5 rounded-lg inline-block border border-[#ba1a1a]/5">
                    "{previousAnswer || "No static record found"}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/80 rounded-xl border border-[#ba1a1a]/10 shadow-sm">
                    <p className="text-xs font-bold text-[#ba1a1a] mb-1">Identified Focus Block</p>
                    <p className="text-xs text-[#93000a]/80 leading-relaxed">
                      Re-examine calculations. Take extra caution around scaling parameters, power rule constants, or inverse sign definitions applied during operations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Dynamic Modular Learning Framework Sidebar Navigator */}
              <section className="bg-[#f1f3ff] p-6 rounded-2xl border border-[#cbc3d9]/30">
                <h4 className="text-xs font-bold text-[#494456] mb-4 uppercase tracking-widest">Active Workspace Curriculums</h4>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {Array.from(computedTopicsMap.entries()).map(([topic, sections], idx) => {
                    const isCurrentTopic = topic === currentQuestion.topic;
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl transition-all duration-300 border ${
                          isCurrentTopic ? "bg-white border-[#4800b2]/20 shadow-sm" : "bg-white/40 border-transparent"
                        }`}
                      >
                        <p className={`text-xs font-bold ${isCurrentTopic ? "text-[#4800b2]" : "text-[#101b30]"}`}>{topic}</p>
                        <ul className="list-none space-y-1 mt-2 pl-2 border-l border-[#cbc3d9]/40">
                          {Array.from(sections).filter(sec => sec && sec.trim() !== "").map((sec, i) => (
                            <li key={i} className="text-[11px] font-medium text-[#494456] truncate">
                              • {sec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Standalone Modal Adaptive Integration Hub triggering Step by Step animations */}
              <section className="bg-white p-6 rounded-2xl border border-[#cbc3d9]/30 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#79f2f4]/20 flex items-center justify-center text-[#006e6f] mb-3">
                  <span className="material-symbols-outlined text-xl">auto_stories</span>
                </div>
                <h5 className="text-sm font-bold text-[#101b30] mb-1">Stuck on this solution path?</h5>
                <p className="text-xs text-[#494456] mb-4 max-w-[200px]">Review pedagogical animations step-by-step with your virtual workspace assistant.</p>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full py-2.5 text-xs font-bold border-[#4800b2] text-[#4800b2] hover:bg-[#4800b2]/5 rounded-xl transition-all">
                      Deploy Step-by-Step Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white shadow-2xl">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Interactive Problem Guide Module</DialogTitle>
                      <DialogDescription>Interactive video animations explaining the active problem block step by step</DialogDescription>
                    </DialogHeader>
                    <SolveProblems_stepbystep
                      playAnimation={playAnimation}
                      handlePlayAudio={handlePlayAudio}
                      handleNextOrSubmit={handleNextOrSubmit}
                      question={currentQuestion}
                      setIsDialogOpen={setIsDialogOpen}
                      muted={muted}
                      toggleMute={toggleMute}
                      dogRef={divRef}
                    />
                  </DialogContent>
                </Dialog>
              </section>

            </div>
          </div>
        )}
      </main>

      {/* FIXED FLOATING SYSTEM FEEDBACK SUCCESS TOAST */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2ECC71] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] transition-all duration-500 transform ${
          showResults ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        </div>
        <div>
          <p className="text-lg font-bold">Excellent Correction!</p>
          <p className="text-xs opacity-90">Database registers concept record adjustment successfully.</p>
        </div>
      </div>
    </div>
  );
};

export default MistakesQuestions;