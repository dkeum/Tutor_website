"use client";
import React, { useEffect, useState, useRef } from "react";

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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




import SolveProblems_stepbystep from "../components/solveProblems/SolveProblems_stepbystep";
import Sidebar from "../components/Sidebar";
import { Loader2, X, PlayCircle, Hammer } from "lucide-react";

import LoggedInLayout from "../components/LoggedInLayout";
import TimerBox from "../components/TimerBox";
import AIVideoModal from "../components/AIVideoModal";
import ResultsScreen from "../components/ResultScreen";
import AISidebar from "../components/AISidebar";
import MathQuestion from "../components/MathQuestion";


import { toast } from "sonner"
import DropDownTool from "../components/solveProblems/DropDownTool";
import { Button } from "../components/ui/button";
import { TOOL_REGISTRY } from "../components/solveProblems/toolRegistry";
import AnswerField from "../components/solveProblems/AnswerField";
import { supabase } from "../db/supabaseclient";
import { setCredits, setProfileInfo } from "../features/auth/personDetails";

// ─── Backend base URL — used by every axios call in this file ────────────────
const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";


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
  const dispatch = useDispatch();
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const navigate = useNavigate();
  const studentClassId = useSelector((s) => s.personDetail?.class_ID);
  const studentPlanType = useSelector((s) => s.personDetail?.plan_type); // "free" | "pro" | ...
  const [loadingSession, setLoadingSession] = useState(true);


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
  const [cachedVideo, setCachedVideo] = useState({ questionId: null, url: null });

  const [chatAttachments, setChatAttachments] = useState([]);
  const [isSubmittingMain, setIsSubmittingMain] = useState(false); // NEW

  const [muted, setMuted] = useState(false);
  const toggleMute = () => setMuted((m) => !m);
  const handlePlayAudio = (text) => {
    if (muted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };


  const MAX_ACTIVE_TOOLS = 1;
  const [activeTools, setActiveTools] = useState([]); // array of tool ids, e.g. ["draw", "graph"]

  const toggleTool = (toolId) => {
    setActiveTools((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((t) => t !== toolId);
      }
      if (prev.length >= MAX_ACTIVE_TOOLS) {
        // FIFO: swap out the oldest active tool to make room
        const [, ...rest] = prev;
        toast(`Swapped out ${TOOL_REGISTRY[prev[0]].label}`, {
          description: `Only ${MAX_ACTIVE_TOOLS} tools can be active at once.`,
        });
        return [...rest, toolId];
      }
      return [...prev, toolId];
    });
  };

  const handleGenerateAndStreamVideo = async () => {
    if (!currentQuestion || isVideoLoading) return;

    setUsedAIVideo(true);

    if (cachedVideo.questionId === currentQuestion.id && cachedVideo.url) {
      setVideoStreamUrl(cachedVideo.url);
      setIsVideoModalOpen(true);
      return;
    }

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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const res = await axios.get(streamUrl, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        // Axios defaults to responseType: "json", so no need to specify it
      });

      // Extract directly from the new backend JSON payload
      const videoSrcUrl = res.data.video_url;
      const remainingCredits = res.data.credits_remaining;

      if (remainingCredits !== undefined) {
        dispatch(setCredits({ ai_credits: Number(remainingCredits) }));
      }

      // Cache and set the public URL string directly
      setCachedVideo({ questionId, url: videoSrcUrl });
      setVideoStreamUrl(videoSrcUrl);
      setIsVideoModalOpen(true);
    } catch (err) {
      // Because we are expecting JSON, Axios parses errors cleanly without needing Blob unwrapping
      const parsedData = err?.response?.data;
      console.error("Video generation failed:", parsedData || err.message);

      const status = err?.response?.status;
      const backendMessage = parsedData?.message || parsedData?.error;

      if (status === 403 && backendMessage === "Not Enough Credits") {
        const creditsAvailable = parsedData?.ai_credits ?? 0;
        const creditsRequired = parsedData?.required ?? 10;

        toast("Not Enough Credits", {
          description: `You have ${creditsAvailable} credit${creditsAvailable === 1 ? "" : "s"}, but this video costs ${creditsRequired}. Upgrade your plan or wait for tomorrow's free video.`,
          action: {
            label: "Upgrade",
            onClick: () => navigate("/pricing"),
          },
        });
      } else {
        toast("AI Video Generation Failed", {
          description: backendMessage || "Something went wrong while generating your video. Try again?",
          action: {
            label: "Retry",
            onClick: () => handleGenerateAndStreamVideo(),
          },
        });
      }
    } finally {
      setIsVideoLoading(false);
    }
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
    const initializeUserSession = async () => {
      try {
        const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000"
          : "https://mathamagic-backend.vercel.app";

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const userEmail = session.user.email;
          const res = await axios.get(`${base}/${userEmail}/getprofile`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
            withCredentials: true
          });

          dispatch(setProfileInfo(res?.data));

          if (!res.data?.name && typeof setOpen === 'function') {
            setOpen(true);
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error initializing session:", err);
        // We only stop the spinner here if initialization explicitly failed
        setLoadingSession(false);
      }
    };

    const loadData = async () => {
      // 1. If we don't have the ID, initialize the session and STOP.
      // The Redux dispatch above will trigger a re-render and re-run this effect safely.
      if (!studentClassId) {
        await initializeUserSession();
        return; // CRITICAL: Do not continue to fetch questions yet!
      }

      // 2. We now have the ID! Turn off the full-page spinner.
      setLoadingSession(false);

      // 3. Ensure route params exist
      if (!topic || !section) return;

      // 4. Safe to fetch questions
      setLoadingQuestions(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const BASE_URL = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000"
            : "https://mathamagic-backend.vercel.app";

          // Wrapped 'topic' in encodeURIComponent to prevent URL breaking on special characters
          const res = await axios.get(
            `${BASE_URL}/questions/${encodeURIComponent(topic)}/${encodeURIComponent(section)}`,
            {
              withCredentials: true,
              params: { class: studentClassId },
              headers: { Authorization: `Bearer ${session.access_token}` },
            }
          );

          const qs = res.data.questions || [];
          setQuestions(qs);

          if (qs.length > 0) {
            setTopicId(qs[0].topic_id);
            setSectionId(qs[0].section_id);
          }
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadData();
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

    // Filter out attempts that are already marked correct (either by step-by-step AI or exact text match)
    const attemptsToVerify = finalAttempts.filter((a) => !a.is_correct);

    try {
      // Only call the AI if there are actually answers that need verifying
      if (attemptsToVerify.length > 0) {
        const res = await axios.post(
          `${getBaseUrl()}/ai/verify-answers`,
          { attempts: attemptsToVerify, plan_type: studentPlanType },
          { withCredentials: true }
        );
        const results = res.data.results || [];

        verifiedAttempts = finalAttempts.map((originalAttempt) => {
          // If it was already correct, skip overriding it to save the confirmed status
          if (originalAttempt.is_correct) {
            return originalAttempt;
          }

          const aiEvaluation = results.find(
            (r) => r.question_id === originalAttempt.question_id
          );
          return {
            ...originalAttempt,
            is_correct:
              aiEvaluation !== undefined
                ? aiEvaluation.is_correct
                : originalAttempt.is_correct,
          };
        });
      }
    } catch (aiError) {
      console.error(
        "AI evaluation failed, falling back to client-side logic:",
        aiError?.response?.data || aiError.message
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

      // 1. Check Supabase for an existing local session
      const { data: { session } } = await supabase.auth.getSession();

      // console.log("Supabase session:", session);
      if (session?.user) {
        const res = await axios.post(
          `${getBaseUrl()}/questions/save-marks`,
          payload,
          {
            withCredentials: true, headers: {
              Authorization: `Bearer ${session.access_token}`, // Inject the fresh token
            },
          }
        );

        // console.log("Marks saved successfully with AI verified data!", res.data);
      }
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


    setIsSubmittingMain(true); // NEW
    try {
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
    } finally {
      setIsSubmittingMain(false); // NEW
    }
  };

  const handleNextOrSubmit_solvetab = async (
    studentAnswerText = "",
    attachedImageUrl = null,
    isAlreadyCorrect = false
  ) => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";


    // Default to whatever the step-by-step dialog already determined
    let isCorrect = isAlreadyCorrect;

    const hasAnswerContent = !!(studentAnswerText?.trim() || attachedImageUrl);

    // Only hit the AI if step-by-step didn't already confirm "correct"
    if (!isAlreadyCorrect) {
      if (!hasAnswerContent) {
        // Nothing was actually answered (e.g. "Next Question" clicked blind) —
        // mark it wrong locally, no need to spend an API call on it.
        isCorrect = false;
      } else {
        try {
          const res = await axios.post(
            `${getBaseUrl()}/ai/verify-answer`,
            {
              question: currentQuestion?.question || "",
              correctAnswer,
              studentAnswerText,
              attachedImageBase64: attachedImageUrl || null,
              plan_type: studentPlanType,
            },
            { withCredentials: true }
          );
          isCorrect = !!res.data.is_correct;
        } catch (err) {
          console.error(
            "Answer verification failed, defaulting to incorrect:",
            err?.response?.data || err.message
          );
          isCorrect = false;
        }
      }
    }

    const newAnswer = {
      question_id: currentQuestion.id,
      answer_given: attachedImageUrl
        ? `${studentAnswerText} (image attached)`.trim()
        : normalizeLatex(studentAnswerText || ""),
      time_spent_seconds: secondsElapsed,
      is_correct: isCorrect,
      used_ai_video: usedAIVideo,
      used_ai_chat: usedAIChat,
    };

    const newResult = { questionId: currentQuestion.id, isCorrect };
    const updatedAnswers = [...recordedAnswers, newAnswer];
    const updatedResults = [...answerResults, newResult];

    setRecordedAnswers(updatedAnswers);
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

  if (loadingSession) {
    return (
      <LoggedInLayout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        </div>
      </LoggedInLayout>
    );
  }

  return (
    <LoggedInLayout>
      <div className="sp-root overflow-y-hidden "

      >
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

        <div style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)", // ← NEW: anchors the whole layout to the viewport
        }}>
          {showResults ? (
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
              <ResultsScreen
                answerResults={answerResults}
                totalSeconds={totalSeconds}
                onRetry={handleRetry}
                onHome={() => navigate("/showpersonaldata")}
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
                        question={currentQuestion}
                        handlePlayAudio={handlePlayAudio}
                        handleNextOrSubmit={handleNextOrSubmit_solvetab}
                        setIsDialogOpen={setIsDialogOpen}
                        muted={muted}
                        toggleMute={toggleMute}
                        videoStreamUrl={videoStreamUrl}
                        isVideoLoading={isVideoLoading}
                        onGenerateVideo={handleGenerateAndStreamVideo}
                        isLastQuestion={isLastQuestion}
                        setUsedAIChat={setUsedAIChat}
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




                  <DropDownTool
                    activeTools={activeTools}
                    onToggleTool={toggleTool}
                    onOpenAIChat={() => {
                      // if AISidebar exposes a ref/prop to scroll-into-view or focus its chat input, call it here
                    }}
                  />

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
                  <AnswerField
                    handleNextOrSubmit={handleNextOrSubmit}
                    isLastQuestion={isLastQuestion}
                    latex={latex}
                    setLatex={setLatex}
                  />


                </div>
              </section>

              {/* ── Right Panel: Tools (top half, max 2) + AI Sidebar (bottom half) ── */}
              <div
                className="sp-ai-sidebar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxHeight: "90vh",
                  overflow: "hidden",
                }}
              >
                {activeTools.length > 0 && (
                  <div
                    style={{
                      flex: "0 0 25%",
                      display: "flex",
                      overflow: "hidden",
                      borderBottom: `1px solid ${TOKEN.outlineVariant}`,
                    }}
                  >
                    {activeTools.map((toolId) => {
                      const tool = TOOL_REGISTRY[toolId];
                      if (!tool) return null;
                      const ToolComponent = tool.component;
                      const ToolIcon = tool.icon;
                      return (
                        <div
                          key={toolId}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            borderRight:
                              activeTools.length > 1 ? `1px solid ${TOKEN.outlineVariant}` : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 12px",
                              borderBottom: `1px solid ${TOKEN.outlineVariant}`,
                              fontSize: 12,
                              fontWeight: 700,
                              color: TOKEN.onSurfaceVariant,
                              flexShrink: 0,
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <ToolIcon size={14} />
                              {tool.label}
                            </span>
                            <button
                              onClick={() => toggleTool(toolId)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: TOKEN.onSurfaceVariant,
                                display: "flex",
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                            <ToolComponent
                              question={currentQuestion.question}
                              onAddToAIChat={(imageDataUrl) => {
                                setChatAttachments((prev) => {
                                  // If the image is exactly the same as one already in the array, do nothing
                                  if (prev.includes(imageDataUrl)) {
                                    return prev;
                                  }
                                  // Otherwise, add it
                                  return [...prev, imageDataUrl];
                                });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!showResults && (<div style={{ flex: activeTools.length > 0 ? "0 0 75%" : "1 1 auto", overflow: "hidden", minHeight: 0 }}>
                  <AISidebar
                    topic={topic}
                    section={section}
                    currentQuestion={currentQuestion}
                    onOpenStepByStep={() => setIsDialogOpen(true)}
                    setUsedAIChat={setUsedAIChat}

                    compact={activeTools.length > 0}
                    attachments={chatAttachments}
                    onRemoveAttachment={(indexToRemove) => {
                      setChatAttachments((prev) => prev.filter((_, i) => i !== indexToRemove));
                    }}
                    onClearAttachments={() => setChatAttachments([])}

                  />
                </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default SolveProblems;