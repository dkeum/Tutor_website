import React, { useState, useMemo, useRef, useEffect } from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
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
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

addStyles();

// ─── Load Puter.js once via script tag ───────────────────────────────────────
function usePuter() {
  const [ready, setReady] = useState(!!window.puter);

  useEffect(() => {
    if (window.puter) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
      /* leave script in DOM — only load once */
    };
  }, []);

  return ready;
}

// ─── Ask Puter AI whether the student's answer is mathematically correct ─────
async function checkWithAI(questionText, correctAnswer, studentAnswer) {
  const prompt = `
You are a strict math answer checker. A student is attempting to correct a mistake.

Question: ${questionText}
Expected correct answer: ${correctAnswer}
Student's answer: ${studentAnswer}

Determine if the student's answer is mathematically equivalent to the expected answer.
Respond with ONLY a JSON object in this exact format, no other text:
{"correct": true} or {"correct": false, "reason": "brief explanation of what is wrong"}
`.trim();

  try {
    const response = await window.puter.ai.chat(prompt, {
      model: "gpt-4o-mini",
    });
    const text =
      response?.message?.content?.[0]?.text ?? response?.toString?.() ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return { correct: Boolean(parsed.correct), reason: parsed.reason ?? null };
  } catch (err) {
    console.error("Puter AI check failed:", err);
    // Fall back to local normalizeLatex comparison if AI fails
    return null;
  }
}

const MistakesQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const puterReady = usePuter();

  const rawMistakes = location.state?.mistakes || [];
  const topicLabel = location.state?.topicName || "Review";
  const sectionLabel = location.state?.sectionName || "";

  const questions = useMemo(
    () =>
      rawMistakes.map((m) => ({
        id: m.question_id,
        question: m.question_text,
        answer: m.correct_answers?.[0] ?? "",
        hint: m.hint ?? null,
        formula: m.formula ?? null,
        image_url: m.image_url ?? null,
        difficulty: m.difficulty ?? null,
      })),
    [rawMistakes]
  );

  const [api, setApi] = useState(null);
  const [latex, setLatex] = useState("");
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswerFeedback, setWrongAnswerFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showUiHint, setShowUiHint] = useState(false);
  const [inputStatus, setInputStatus] = useState("default");
  const [allDone, setAllDone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // AI in-flight

  const mathFieldRef = useRef(null);

  const { divRef, playAnimation, handlePlayAudio, muted, toggleMute } =
    useDog_standalone();

  const currentQuestion = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  const previousAnswer = useMemo(() => {
    return (
      rawMistakes.find((m) => m.question_id === currentQuestion.id)
        ?.answer_given || ""
    );
  }, [currentQuestion, rawMistakes]);

  const progressPercentage =
    questions.length > 0
      ? Math.min(Math.round((currentIndex / questions.length) * 100), 100)
      : 0;

  const base =
    import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
      ? "http://localhost:3000"
      : "https://mathamagic-backend.vercel.app";


  // ─── Advance to next question or finish ──────────────────────────────────────
  const advanceAfterCorrect = async () => {
    setRecordedAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer: latex, isCorrect: true },
    ]);
    setAnswerResults((prev) => [
      ...prev,
      { questionId: currentQuestion.id, isCorrect: true },
    ]);
  
    // Fire backend call without awaiting — don't block UI on it
    const response = await axios.post(
      `${base}/questions/fixed-mistakes`,
      { fixed_questions_id: [currentQuestion.id] },
      { withCredentials: true }
    ).catch((err) => console.error("Failed to mark question as fixed:", err));

    // console.log(response)
  
    // Move immediately — don't wait for toast or backend
    setInputStatus("default");
    setLatex("");
    setWrongAnswerFeedback("");
  
    if (isLastQuestion) {
      setAllDone(true);
    } else {
      if (api) api.scrollNext();
      setCurrentIndex((prev) => prev + 1);
    }
  
    // Toast shows briefly then fades — purely cosmetic, doesn't block anything
    setShowResults(true);
    setTimeout(() => setShowResults(false), 1500);
  };

  // ─── Main submit handler ──────────────────────────────────────────────────────
  const handleNextOrSubmit = async () => {
    if (isVerifying) return; // Prevent double-tap

    const correctAnswer = currentQuestion?.answer || "";
    const studentAnswer = latex.trim();

    if (!studentAnswer) {
      setWrongAnswerFeedback("Please enter an answer before submitting.");
      return;
    }

    setIsVerifying(true);
    setWrongAnswerFeedback("");

    // ── Step 1: fast local check ──────────────────────────────────────────────
    const localMatch =
      normalizeLatex(studentAnswer) === normalizeLatex(correctAnswer);

    if (localMatch) {
      // Local check passed — no need to spend AI tokens
      setInputStatus("success");
      setShowResults(true);
      setIsVerifying(false);
      await advanceAfterCorrect();
      return;
    }

    // ── Step 2: local check failed — ask AI to double check ───────────────────
    // Covers cases where the student wrote an equivalent form (e.g. "2x" vs "x+x")
    if (puterReady && window.puter) {
      setWrongAnswerFeedback("🤖 AI is checking your answer...");

      const aiResult = await checkWithAI(
        currentQuestion.question,
        correctAnswer,
        studentAnswer
      );

      setIsVerifying(false);

      if (aiResult === null) {
        // AI call failed — fall through to wrong answer
        setInputStatus("error");
        setWrongAnswerFeedback(
          "Could not verify with AI. Try again or simplify your answer."
        );
        setTimeout(() => setInputStatus("default"), 600);
        return;
      }

      if (aiResult.correct) {
        // AI says correct ✓
        setInputStatus("success");
        setShowResults(true);
        await advanceAfterCorrect();
      } else {
        // AI says wrong ✗
        setInputStatus("error");
        setWrongAnswerFeedback(
          aiResult.reason
            ? `Incorrect: ${aiResult.reason}`
            : "Incorrect. Keep investigating!"
        );
        setTimeout(() => setInputStatus("default"), 600);
      }
    } else {
      // Puter not ready — fall back to local result only
      setIsVerifying(false);
      setInputStatus("error");
      setWrongAnswerFeedback("Incorrect. Keep investigating!");
      setTimeout(() => setInputStatus("default"), 600);
    }
  };

  const handleVirtualKeypress = (value) => {
    if (mathFieldRef.current) {
      if (value === "clear") {
        setLatex("");
      } else {
        mathFieldRef.current.write(value);
      }
    }
  };

  // ─── All done screen ──────────────────────────────────────────────────────────
  if (allDone) {
    return (
      <div className="min-h-screen antialiased">
        <NavbarLoggedIn />
        <main className="max-w-[1440px] mx-auto w-full p-6 lg:p-12 flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-3xl p-12 text-center border border-[#cbc3d9]/30 shadow-sm max-w-xl w-full">
            <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-[#101b30] mb-2">
              Section Complete!
            </h3>
            <p className="text-sm text-[#494456] mb-2">
              You corrected all{" "}
              <span className="font-bold text-[#4800b2]">
                {questions.length}
              </span>{" "}
              mistake{questions.length !== 1 ? "s" : ""} in
            </p>
            <p className="text-lg font-bold text-[#4800b2] mb-8">
              {topicLabel} — {sectionLabel}
            </p>
            <button
              onClick={() => navigate("/showpersonaldata")}
              className="w-full bg-[#4800b2] py-4 rounded-xl text-white font-bold hover:bg-[#6200ee] transition-all active:scale-[0.99]"
            >
              Back to Mistakes Overview
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#101b30] font-sans antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
        .mq-editable-field {
          border: none !important;
          box-shadow: none !important;
          width: 100%;
        }
        .mq-root-block {
          font-size: 1.8rem !important;
          color: #6200ee !important;
        }
      `,
        }}
      />

      <NavbarLoggedIn />
      <Sidebar />

      <main className="max-w-[1440px] mx-auto w-full p-6 lg:p-12 transition-all duration-300">
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => navigate("/showpersonaldata")}
                className="text-[#7a7488] hover:text-[#4800b2] transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Back
              </button>
            </div>
            <h1 className="text-3xl font-extrabold text-[#4800b2] tracking-tight mb-1 text-left">
              Correction Mode
            </h1>
            <p className="text-[#494456] text-sm">
              Reviewing:{" "}
              <span className="font-semibold text-[#101b30]">
                {topicLabel} — {sectionLabel}
              </span>
            </p>
          </div>
          <div className="w-full sm:w-72 bg-white/50 p-4 rounded-2xl border border-[#cbc3d9]/30 shadow-sm">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#4800b2] tracking-wider">
                QUESTION {questions.length > 0 ? currentIndex + 1 : 0} OF{" "}
                {questions.length}
              </span>
              <span className="text-xs font-medium text-[#7a7488]">
                {progressPercentage}% Complete
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#e0e8ff] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#2ECC71] transition-all duration-500 relative shimmer-effect-bar"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {/* Puter.js status indicator */}
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  puterReady ? "bg-[#2ECC71]" : "bg-[#7a7488]"
                }`}
              ></div>
              <span className="text-[10px] text-[#7a7488]">
                {puterReady
                  ? "AI verification ready"
                  : "Loading AI verifier..."}
              </span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#cbc3d9]/30 shadow-sm max-w-xl mx-auto mt-12">
            <span className="material-symbols-outlined text-6xl text-[#4800b2]/30 mb-4">
              verified_user
            </span>
            <h3 className="text-xl font-bold text-[#101b30] mb-2">
              No pending corrections found!
            </h3>
            <p className="text-sm text-[#494456]">
              Your workbook is completely clear. Outstanding job!
            </p>
            <button
              onClick={() => navigate("/showpersonaldata")}
              className="mt-6 px-6 py-3 bg-[#4800b2] text-white rounded-xl font-bold text-sm hover:bg-[#6200ee] transition-all"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              {/* Problem Card */}
              <section className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.03)] border border-[#cbc3d9]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#F3E8FF] w-12 h-12 rounded-xl flex items-center justify-center text-[#4800b2]">
                    <span className="material-symbols-outlined text-2xl">
                      calculate
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101b30]">
                    Active Challenge
                  </h3>
                </div>

                <Carousel
                  className="w-full pointer-events-none"
                  setApi={setApi}
                  opts={{ loop: false }}
                >
                  <CarouselContent>
                    {questions.map((q, index) => (
                      <CarouselItem key={index}>
                        <div className="w-full">
                          <p className="text-[#494456] text-base md:text-lg leading-relaxed mb-6">
                            {q.question}
                          </p>
                          {q?.image_url && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-[#cbc3d9]/20 flex items-center justify-center bg-slate-50 p-4">
                              <img
                                src={q.image_url}
                                alt="Problem visual"
                                className="max-h-[260px] object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </section>

              {/* Answer Input Card */}
              <section className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_32px_0_rgba(98,0,238,0.03)] border border-[#cbc3d9]/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#101b30]">
                    Your Revision Entry
                  </h3>
                  <button
                    onClick={() => setShowUiHint(!showUiHint)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00696b] hover:text-[#004f50] transition-colors uppercase tracking-wider group"
                  >
                    <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
                      lightbulb
                    </span>
                    Toggle Hint
                  </button>
                </div>

                <AnimatePresence>
                  {showUiHint && currentQuestion.hint && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="p-4 bg-[#79f2f4]/10 border border-[#00696b]/20 rounded-xl">
                        <p className="text-xs text-[#004f50] font-medium leading-relaxed">
                          💡 <span className="font-bold">Hint:</span>{" "}
                          {currentQuestion.hint}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {showUiHint && !currentQuestion.hint && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="p-4 bg-[#79f2f4]/10 border border-[#00696b]/20 rounded-xl">
                        <p className="text-xs text-[#004f50] font-medium leading-relaxed">
                          💡 No hint available for this question.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* MathQuill input */}
                  <motion.div
                    animate={
                      inputStatus === "error" ? { x: [-8, 8, -6, 6, 0] } : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`relative w-full p-6 pt-8 rounded-xl border-2 transition-all min-h-[100px] flex items-center ${
                      inputStatus === "success"
                        ? "border-[#2ECC71] bg-[#2ECC71]/5 text-[#2ECC71]"
                        : inputStatus === "error"
                        ? "border-[#ba1a1a] bg-[#ffdad6]/10 text-[#ba1a1a]"
                        : isVerifying
                        ? "border-[#4800b2]/40 bg-[#4800b2]/5 animate-pulse"
                        : "border-[#cbc3d9] focus-within:border-[#4800b2] focus-within:ring-4 focus-within:ring-[#4800b2]/5"
                    }`}
                  >
                    <label className="absolute top-2 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-widest text-[#4800b2]">
                      f'(x) =
                    </label>
                    <div className="w-full overflow-x-auto">
                      <EditableMathField
                        latex={latex}
                        onChange={(mathField) => setLatex(mathField.latex())}
                        mathquillDidMount={(el) => {
                          mathFieldRef.current = el;
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Virtual keypad */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleVirtualKeypress("^2")}
                      className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20"
                    >
                      x²
                    </button>
                    <button
                      onClick={() => handleVirtualKeypress("+")}
                      className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleVirtualKeypress("-")}
                      className="py-3.5 bg-[#e8edff] hover:bg-[#d7e2ff] text-sm font-bold text-[#101b30] rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20"
                    >
                      −
                    </button>
                    <button
                      onClick={() => handleVirtualKeypress("clear")}
                      className="py-3.5 bg-[#f1f3ff] text-xs font-bold text-[#7a7488] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-xl transition-all active:scale-95 border border-[#cbc3d9]/20"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleNextOrSubmit}
                    disabled={isVerifying}
                    className={`w-full py-5 rounded-xl text-white text-base font-bold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-3 mt-4 ${
                      isVerifying
                        ? "bg-[#4800b2]/60 cursor-not-allowed shadow-none"
                        : "bg-[#4800b2] hover:bg-[#6200ee] shadow-[#4800b2]/10 hover:shadow-xl hover:shadow-[#4800b2]/20"
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        <span>AI Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isLastQuestion
                            ? "Verify Final Solution"
                            : "Verify & Advance"}
                        </span>
                        <span className="material-symbols-outlined text-xl">
                          check_circle
                        </span>
                      </>
                    )}
                  </button>

                  {/* Feedback message */}
                  {wrongAnswerFeedback && (
                    <div
                      className={`text-center text-xs font-bold tracking-wide mt-2 p-2 rounded-lg ${
                        wrongAnswerFeedback.startsWith("🤖")
                          ? "text-[#4800b2] bg-[#4800b2]/5 border border-[#4800b2]/10"
                          : "text-[#ba1a1a] bg-[#ffdad6]/20"
                      }`}
                    >
                      {wrongAnswerFeedback}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 space-y-8">
              {/* Previous wrong answer panel */}
              <section className="bg-[#ffdad6]/10 border-2 border-[#ba1a1a]/20 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#ba1a1a]/20 pointer-events-none">
                  <span className="material-symbols-outlined text-4xl">
                    error_outline
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#ba1a1a] mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    history
                  </span>
                  Previous Submission
                </h4>
                <div className="mb-4">
                  <p className="text-2xl font-mono font-bold text-[#93000a] italic tracking-tight bg-white/40 px-3 py-1.5 rounded-lg inline-block border border-[#ba1a1a]/5">
                    "{previousAnswer || "No record found"}"
                  </p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-[#ba1a1a]/10 shadow-sm">
                  <p className="text-xs font-bold text-[#ba1a1a] mb-1">
                    Focus Area
                  </p>
                  <p className="text-xs text-[#93000a]/80 leading-relaxed">
                    Re-examine calculations. Take extra caution around scaling
                    parameters, power rule constants, or inverse sign
                    definitions.
                  </p>
                </div>
              </section>

              {/* AI verifier info card */}
              <section className="bg-[#f1f3ff] p-6 rounded-2xl border border-[#cbc3d9]/30">
                <h4 className="text-xs font-bold text-[#494456] mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    smart_toy
                  </span>
                  AI Verifier
                </h4>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      puterReady ? "bg-[#2ECC71]/15" : "bg-[#7a7488]/10"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${
                        puterReady ? "text-[#2ECC71]" : "text-[#7a7488]"
                      }`}
                    >
                      {puterReady ? "verified" : "hourglass_empty"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#101b30] mb-1">
                      {puterReady
                        ? "GPT-4o Mini Active"
                        : "Loading AI engine..."}
                    </p>
                    <p className="text-[11px] text-[#494456] leading-relaxed">
                      Your answer is first checked locally. If it doesn't match
                      exactly, AI checks whether your answer is mathematically
                      equivalent.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section context panel */}
              <section className="bg-[#f1f3ff] p-6 rounded-2xl border border-[#cbc3d9]/30">
                <h4 className="text-xs font-bold text-[#494456] mb-4 uppercase tracking-widest">
                  Current Section
                </h4>
                <div className="p-3 rounded-xl bg-white border border-[#4800b2]/20 shadow-sm">
                  <p className="text-xs font-bold text-[#4800b2]">
                    {topicLabel}
                  </p>
                  <p className="text-xs text-[#494456] mt-1">{sectionLabel}</p>
                  <p className="text-xs text-[#7a7488] mt-2">
                    {questions.length} question
                    {questions.length !== 1 ? "s" : ""} to correct
                  </p>
                </div>
              </section>

              {/* Step-by-step guide modal */}
              <section className="bg-white p-6 rounded-2xl border border-[#cbc3d9]/30 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#79f2f4]/20 flex items-center justify-center text-[#006e6f] mb-3">
                  <span className="material-symbols-outlined text-xl">
                    auto_stories
                  </span>
                </div>
                <h5 className="text-sm font-bold text-[#101b30] mb-1">
                  Stuck on this problem?
                </h5>
                <p className="text-xs text-[#494456] mb-4 max-w-[200px]">
                  Review step-by-step animations with your virtual assistant.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full py-2.5 text-xs font-bold border-[#4800b2] text-[#4800b2] hover:bg-[#4800b2]/5 rounded-xl transition-all"
                    >
                      Deploy Step-by-Step Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white shadow-2xl">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Interactive Problem Guide</DialogTitle>
                      <DialogDescription>
                        Step-by-step animations for the active problem
                      </DialogDescription>
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

      {/* Success toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2ECC71] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] transition-all duration-500 transform ${
          showResults
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
        </div>
        <div>
          <p className="text-lg font-bold">Excellent Correction!</p>
          <p className="text-xs opacity-90">Moving to next question...</p>
        </div>
      </div>
    </div>
  );
};

export default MistakesQuestions;
