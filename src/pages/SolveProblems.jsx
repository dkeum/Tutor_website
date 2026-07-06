"use client";
import React, { useEffect, useState, useRef } from "react";

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { addStyles, EditableMathField } from "react-mathquill";
import normalizeLatex from "../helperFunctions/normalizeLatex";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import SolveProblems_stepbystep from "../components/solveProblems/SolveProblems_stepbystep";
import Sidebar from "../components/Sidebar";
import { Loader2, X, PlayCircle } from "lucide-react";

import LoggedInLayout from "../components/LoggedInLayout";
import TimerBox from "../components/TimerBox";
import AIVideoModal from "../components/AIVideoModal";
import ResultsScreen from "../components/ResultScreen";
import AISidebar from "../components/AISidebar";
import MathQuestion from "../components/MathQuestion";

addStyles();

// ─── Design tokens ────────────────────────────────────────────────────────────
export const TOKEN = {
  primary: "#4441c4",
  primaryContainer: "#5d5cde",
  onPrimary: "#ffffff",
  tertiary: "#632ecd",
  tertiaryContainer: "#7c4ce6",
  onTertiary: "#ffffff",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464554",
  outlineVariant: "#c7c4d6",
  outline: "#777585",
  secondary: "#974800",
  secondaryContainer: "#fc8f40",
};

export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');

  .sp-root { font-family: 'Work Sans', sans-serif; color: ${TOKEN.onSurface}; }
  .sp-headline { font-family: 'Hanken Grotesk', sans-serif; }
  .sp-mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.05em; font-weight: 500; }

  .sp-card { box-shadow: 0 4px 24px rgba(0,0,0,0.04); }

  .sp-progress-track { background: ${TOKEN.surfaceContainerHighest}; border-radius: 9999px; height: 8px; overflow: hidden; }
  .sp-progress-fill { background: ${TOKEN.primary}; border-radius: 9999px; height: 100%; transition: width 0.5s ease; }

  .bubble-ai { border-bottom-left-radius: 2px; }
  .bubble-user { border-bottom-right-radius: 2px; }

  .chat-scroll::-webkit-scrollbar { width: 4px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

  .sp-btn-primary {
    background: ${TOKEN.primary}; color: ${TOKEN.onPrimary};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 700; font-size: 14px;
    padding: 12px 28px; border-radius: 12px;
    box-shadow: 0 4px 16px rgba(68,65,196,0.18);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;
  }
  .sp-btn-primary:hover { opacity: 0.92; transform: scale(1.02); }
  .sp-btn-primary:active { transform: scale(0.97); }

  .sp-btn-outline {
    background: transparent; color: ${TOKEN.primary};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 13px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid ${TOKEN.outlineVariant};
    cursor: pointer; transition: background 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .sp-btn-outline:hover { background: rgba(68,65,196,0.05); }
  .sp-btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }

  .stat-card {
    background: ${TOKEN.surfaceContainerLow}; border: 1px solid rgba(199,196,214,0.3);
    border-radius: 12px; padding: 16px; text-align: center;
  }

  .mq-editable-field { min-height: 44px !important; padding: 8px 12px !important; border-radius: 10px !important; border: 1px solid ${TOKEN.outlineVariant} !important; font-size: 15px !important; }
  .mq-editable-field.mq-focused { border-color: ${TOKEN.primary} !important; box-shadow: 0 0 0 2px rgba(68,65,196,0.15) !important; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-icon { animation: spin 0.8s linear infinite; }

  .video-modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.72);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .video-modal-card {
    background: #0f172a;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    width: 100%;
    max-width: 780px;
    overflow: hidden;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .video-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .video-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border: none; border-radius: 8px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .video-modal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

  @media (max-width: 768px) {
    .sp-ai-sidebar { display: none; }
    .sp-main-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
const SolveProblems = () => {
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const navigate = useNavigate();
  const studentClassId = useSelector((s) => s.personDetail?.class_ID);

  const [questions, setQuestions] = useState([]);
  const [latex, setLatex] = useState("");
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [answerResults, setAnswerResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [topicId, setTopicId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(() =>
    new Date().toISOString()
  );

  const [usedAIVideo, setUsedAIVideo] = useState(false);
  const [usedAIChat, setUsedAIChat] = useState(false);

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoStreamUrl, setVideoStreamUrl] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [muted, setMuted] = useState(false);
  const toggleMute = () => setMuted((m) => !m);
  const handlePlayAudio = (text) => {
    if (muted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateAndStreamVideo = async () => {
    if (!currentQuestion || isVideoLoading) return;

    setUsedAIVideo(true);
    setIsVideoLoading(true);
    setVideoStreamUrl(null);

    const questionId = currentQuestion.id;
    const questionText = currentQuestion.question;
    const targetTopicId = currentQuestion.topic_id;
    const targetSectionId = currentQuestion.section_id;
    const topicName = decodeURIComponent(topic || "");
    const sectionName = decodeURIComponent(section || "");

    const BASE_URL =
      import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";

    const streamUrl = `${BASE_URL}/question/ai-video-generate?questionId=${questionId}&topicId=${targetTopicId}&sectionId=${targetSectionId}&questionText=${encodeURIComponent(
      questionText
    )}&topicName=${encodeURIComponent(topicName)}&sectionName=${encodeURIComponent(sectionName)}`;

    await new Promise((res) => setTimeout(res, 800));

    setVideoStreamUrl(streamUrl);
    setIsVideoLoading(false);
    setIsVideoModalOpen(true);
  };

  const perQuestionTimerRef = useRef(null);
  const totalTimerRef = useRef(null);

  const stopTimers = () => {
    clearInterval(perQuestionTimerRef.current);
    clearInterval(totalTimerRef.current);
    perQuestionTimerRef.current = null;
    totalTimerRef.current = null;
  };

  const startTimers = () => {
    stopTimers();
    perQuestionTimerRef.current = setInterval(
      () => setSecondsElapsed((p) => p + 1),
      1000
    );
    totalTimerRef.current = setInterval(
      () => setTotalSeconds((p) => p + 1),
      1000
    );
  };

  useEffect(() => {
    startTimers();
    return () => stopTimers();
  }, []);

  useEffect(() => {
    setUsedAIVideo(false);
    setUsedAIChat(false);
  }, [currentIndex]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topic || !section) return;
      setLoadingQuestions(true);
      try {
        const BASE_URL =
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000"
            : "https://mathamagic-backend.vercel.app";

        const res = await axios.get(
          `${BASE_URL}/questions/${topic}/${encodeURIComponent(section)}`,
          { withCredentials: true, params: { class: studentClassId } }
        );

        const qs = res.data.questions || [];
        setQuestions(qs);

        if (qs.length > 0) {
          setTopicId(qs[0].topic_id);
          setSectionId(qs[0].section_id);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [topic, section, studentClassId]);

  useEffect(() => {
    if (api) {
      setCurrentIndex(api.selectedScrollSnap());
      api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    }
  }, [api]);

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQuestion = questions[currentIndex] || {};
  const progressPct =
    questions.length > 0
      ? Math.round(((currentIndex + 1) / questions.length) * 100)
      : 0;

  const submitAnswers = async (finalAttempts) => {
    if (!finalAttempts || finalAttempts.length === 0) return;

    let verifiedAttempts = [...finalAttempts];
    let finalGrade = 0;

    try {
      const analysisPrompt = `
            You are an evaluation engine for a math platform. 
            Analyze the following student answers against the questions and determine if they are mathematically correct.
            
            Data to analyze:
            ${JSON.stringify(finalAttempts, null, 2)}
            
            Your task:
            1. Review each item. Verify if "answer_given" matches the mathematically correct solution for that question.
            2. Set "is_correct" strictly to true or false based on your evaluation.
            3. Return ONLY a valid JSON array containing objects with at least "question_id" and "is_correct".
            Do not include any markdown formatting, backticks, or extra text.
          `;

      const response = await window.puter.ai.chat(analysisPrompt, {
        json_mode: true,
      });

      const aiOutput = response.message?.content || response;
      const parsedAiData =
        typeof aiOutput === "string" ? JSON.parse(aiOutput.trim()) : aiOutput;

      verifiedAttempts = finalAttempts.map((originalAttempt) => {
        const aiEvaluation = parsedAiData.find(
          (aiResult) => aiResult.question_id === originalAttempt.question_id
        );
        return {
          ...originalAttempt,
          is_correct:
            aiEvaluation !== undefined
              ? aiEvaluation.is_correct
              : originalAttempt.is_correct,
        };
      });
    } catch (aiError) {
      console.error(
        "Puter.js evaluation failed, falling back to client-side logic:",
        aiError
      );
    }

    const total = verifiedAttempts.length;
    const correctCount = verifiedAttempts.filter(
      (a) => a.is_correct === true
    ).length;
    finalGrade =
      total > 0 ? Number(((correctCount / total) * 100).toFixed(2)) : 0;

    const payload = {
      topic_id: topicId,
      section_id: sectionId,
      grade: finalGrade,
      start_time: sessionStartTime,
      end_time: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      recordedAnswers: verifiedAttempts,
    };

    try {
      const BASE_URL =
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000"
          : "https://mathamagic-backend.vercel.app";

      const res = await axios.post(
        `${BASE_URL}/questions/save-marks`,
        payload,
        { withCredentials: true }
      );

      console.log("Marks saved successfully with AI verified data!", res.data);
    } catch (apiError) {
      console.error(
        "Failed to save marks to the database:",
        apiError?.response?.data || apiError.message
      );
    }
  };

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    const newAttempt = {
      question_id: currentQuestion.id,
      answer_given: latex,
      is_correct: isCorrect,
      time_spent_seconds: secondsElapsed,
      used_ai_video: usedAIVideo,
      used_ai_chat: usedAIChat,
    };

    const updatedAnswers = [...recordedAnswers, newAttempt];
    setRecordedAnswers(updatedAnswers);

    const newResult = { questionId: currentQuestion.id, isCorrect };
    const updatedResults = [...answerResults, newResult];
    setAnswerResults(updatedResults);

    setLatex("");
    setSecondsElapsed(0);

    if (isLastQuestion) {
      stopTimers();
      await submitAnswers(updatedAnswers);
      setShowResults(true);
    } else {
      api?.scrollNext();
    }
  };

  const handleNextOrSubmit_solvetab = async () => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: normalizeLatex(correctAnswer),
      timeTaken: secondsElapsed,
      isCorrect: true,
      usedAIVideo,
      usedAIChat,
    };

    const newResult = { questionId: currentQuestion.id, isCorrect: true };
    const updatedAnswers = [...recordedAnswers, newAnswer];
    const updatedResults = [...answerResults, newResult];

    setRecordedAnswers(updatedAnswers);
    setAnswerResults(updatedResults);
    setLatex("");
    setSecondsElapsed(0);

    if (isLastQuestion) {
      stopTimers();
      await submitAnswers(updatedAnswers, updatedResults);
      setShowResults(true);
    } else {
      api?.scrollNext();
    }
  };

  const handleRetry = () => {
    setAnswerResults([]);
    setRecordedAnswers([]);
    setCurrentIndex(0);
    setLatex("");
    setSecondsElapsed(0);
    setTotalSeconds(0);
    setShowResults(false);
    setSessionStartTime(new Date().toISOString());
    if (api) api.scrollTo(0);
    startTimers();
  };

  return (
    <LoggedInLayout>
      <div className="sp-root">
        <style>{styles}</style>

        {/* ── AI Video Modal ── */}
        <AIVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setVideoStreamUrl(null);
          }}
          videoStreamUrl={videoStreamUrl}
          questionText={currentQuestion?.question}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {showResults ? (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              <ResultsScreen
                answerResults={answerResults}
                totalSeconds={totalSeconds}
                onRetry={handleRetry}
                onHome={() => navigate("/showpersonaldata")}
              />
              <AISidebar
                topic={topic}
                section={section}
                currentQuestion={currentQuestion}
                onOpenStepByStep={() => setIsDialogOpen(true)}
                setUsedAIChat={setUsedAIChat}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {/* ── Solve Area ── */}
              <section
                style={{
                  flex: 1,
                  padding: "4px 24px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  overflow: "hidden",
                }}
              >
                {/* Top bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <TimerBox secondsElapsed={secondsElapsed} />

                  {/* Formula dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="sp-btn-outline">Formula</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Formula</DialogTitle>
                        <DialogDescription>
                          <MathQuestion
                            text={currentQuestion.formula || "No formula available."}
                          />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Hint dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="sp-btn-outline">Hint</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Hint</DialogTitle>
                        <DialogDescription>
                          <MathQuestion
                            text={currentQuestion.hint || "No hint available."}
                          />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Step by Step dialog */}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="sp-btn-outline">Step by Step</button>
                    </DialogTrigger>
                    <DialogContent className="min-w-6xl max-h-[700px] sm:h-[400px] lg:h-[600px]">
                      <DialogHeader className="hidden">
                        <DialogTitle>Step by Step</DialogTitle>
                        <DialogDescription />
                      </DialogHeader>
                      <SolveProblems_stepbystep
                        handlePlayAudio={handlePlayAudio}
                        handleNextOrSubmit={handleNextOrSubmit_solvetab}
                        question={currentQuestion}
                        setIsDialogOpen={setIsDialogOpen}
                        muted={muted}
                        toggleMute={toggleMute}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* AI Video — loading spinner while generating, then opens modal */}
                  <button
                    className="sp-btn-outline"
                    onClick={handleGenerateAndStreamVideo}
                    disabled={isVideoLoading}
                    style={{ minWidth: 160 }}
                  >
                    {isVideoLoading ? (
                      <>
                        <Loader2 size={14} className="spin-icon" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <PlayCircle size={14} />
                        AI Video Explanation
                      </>
                    )}
                  </button>
                </div>

                {/* Question card */}
                <div
                  className="sp-card"
                  style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: 20,
                    border: `1px solid ${TOKEN.outlineVariant}`,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 4,
                      height: "100%",
                      background: TOKEN.primary,
                      borderRadius: "20px 0 0 20px",
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: "24px 24px 24px 32px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Progress */}
                    <div style={{ marginBottom: 20 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          className="sp-mono"
                          style={{
                            color: TOKEN.primary,
                            textTransform: "uppercase",
                          }}
                        >
                          Progress
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: TOKEN.onSurfaceVariant,
                            fontWeight: 500,
                          }}
                        >
                          Question {currentIndex + 1} of {questions.length}
                        </span>
                      </div>
                      <div className="sp-progress-track">
                        <div
                          className="sp-progress-fill"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Loading state */}
                    {loadingQuestions && (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: TOKEN.onSurfaceVariant,
                          fontSize: 14,
                        }}
                      >
                        Loading questions…
                      </div>
                    )}

                    {/* Carousel */}
                    {!loadingQuestions && (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <Carousel
                          className="w-full pointer-events-none"
                          setApi={setApi}
                          opts={{ loop: false }}
                        >
                          <CarouselContent>
                            {questions.map((q, index) => (
                              <CarouselItem key={index}>
                                <div style={{ padding: "4px 0" }}>
                                  <span
                                    className="sp-mono"
                                    style={{
                                      color: TOKEN.primary,
                                      textTransform: "uppercase",
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Question {index + 1}
                                  </span>
                                  <div
                                    style={{
                                      fontSize: 16,
                                      lineHeight: 1.65,
                                      color: TOKEN.onSurface,
                                      fontWeight: 500,
                                      margin: 0,
                                      maxHeight: 160,
                                      overflowY: "hidden",
                                    }}
                                  >
                                    <MathQuestion text={q.question} />
                                  </div>
                                  {q?.image_url && (
                                    <img
                                      src={q.image_url}
                                      alt="Question visual"
                                      style={{
                                        maxHeight: 200,
                                        marginTop: 16,
                                        borderRadius: 10,
                                        border: `1px solid ${TOKEN.outlineVariant}`,
                                      }}
                                    />
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                    )}
                  </div>

                  {/* Answer area */}
                  <div
                    style={{
                      padding: "16px 24px 20px 32px",
                      borderTop: `1px solid ${TOKEN.outlineVariant}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      background: TOKEN.surfaceContainerLow,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: TOKEN.onSurfaceVariant,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          display: "block",
                          marginBottom: 6,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        Your Answer
                      </label>
                      <EditableMathField
                        latex={latex}
                        onChange={(mf) => setLatex(mf.latex())}
                        style={{
                          minWidth: 280,
                          minHeight: 44,
                          textAlign: "left",
                        }}
                      />
                    </div>
                    <button
                      className="sp-btn-primary"
                      onClick={handleNextOrSubmit}
                      style={{ flexShrink: 0, marginTop: 20 }}
                    >
                      {isLastQuestion ? "Submit" : "Next"}
                      {!isLastQuestion && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* ── AI Sidebar ── */}
              <AISidebar
                topic={topic}
                section={section}
                currentQuestion={currentQuestion}
                onOpenStepByStep={() => setIsDialogOpen(true)}
                setUsedAIChat={setUsedAIChat}
              />
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default SolveProblems;