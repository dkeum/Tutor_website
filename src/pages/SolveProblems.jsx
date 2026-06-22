"use client";
import React, { useEffect, useState, useRef } from "react";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
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
import useDog from "../hook/useDog";
import DogPortal from "../components/AI/DogPortal";
import Sidebar from "../components/Sidebar";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

addStyles();

// ─── Design tokens ────────────────────────────────────────────────────────────
const TOKEN = {
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

const styles = `
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
  }
  .sp-btn-outline:hover { background: rgba(68,65,196,0.05); }

  .stat-card {
    background: ${TOKEN.surfaceContainerLow}; border: 1px solid rgba(199,196,214,0.3);
    border-radius: 12px; padding: 16px; text-align: center;
  }

  .mq-editable-field { min-height: 44px !important; padding: 8px 12px !important; border-radius: 10px !important; border: 1px solid ${TOKEN.outlineVariant} !important; font-size: 15px !important; }
  .mq-editable-field.mq-focused { border-color: ${TOKEN.primary} !important; box-shadow: 0 0 0 2px rgba(68,65,196,0.15) !important; }

  @media (max-width: 768px) {
    .sp-ai-sidebar { display: none; }
    .sp-main-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Timer display ────────────────────────────────────────────────────────────
function TimerBox({ secondsElapsed }) {
  const h = Math.floor(secondsElapsed / 3600);
  const m = Math.floor((secondsElapsed % 3600) / 60);
  const s = secondsElapsed % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        background: TOKEN.surfaceContainerLow,
        border: `1px solid ${TOKEN.outlineVariant}`,
        borderRadius: 12,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span
        className="sp-mono"
        style={{ color: TOKEN.onSurfaceVariant, textTransform: "uppercase" }}
      >
        Time
      </span>
      <span
        className="sp-headline"
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: TOKEN.onSurface,
          letterSpacing: "0.04em",
        }}
      >
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

// ─── AI Chat Sidebar ──────────────────────────────────────────────────────────
function AISidebar({
  topic,
  section,
  currentQuestion,
  onOpenStepByStep,
  setUsedAIChat,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: `Hi! I'm here to help with the question. Ask me anything about this problem!`,
      },
    ]);
  }, [currentQuestion]);

  useEffect(() => {
    const initPuter = async () => {
      if (window.puter && !window.puter.auth.isSignedIn()) {
        try {
          await window.puter.auth.signIn();
        } catch (err) {
          console.warn(
            "Puter silent sign-in skipped or using anonymous mode:",
            err
          );
        }
      }
    };
    initPuter();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = ["Explain step-by-step", "Give me a hint"];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    if (setUsedAIChat) setUsedAIChat(true);

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const questionText = currentQuestion?.question || "Not available";
      const formulaContext = currentQuestion?.formula
        ? `Formula: ${currentQuestion.formula}`
        : "No specific formula provided.";
      const hintContext = currentQuestion?.hint
        ? `Hint: ${currentQuestion.hint}`
        : "No specific hint provided.";

      const systemInstruction = `You are a helpful, encouraging math tutor for grade 10 students. 
  The student is working on "${decodeURIComponent(
    topic || ""
  )}" — specifically "${decodeURIComponent(section || "")}".
  
  [CONTEXT]
  Current Question: "${questionText}"
  ${formulaContext}
  ${hintContext}
  
  [RULES]
  1. Be concise, clear, and highly encouraging.
  2. Guide the student step-by-step without giving away the direct answer explicitly.
  3. You MUST break down your explanation using clear, sequentially numbered steps strictly matching the pattern: "Step 1:", "Step 2:", etc.
  4. DO NOT use raw LaTeX format like \\( ... \\) or \\frac{}{}. Instead, use clean, readable Markdown math notation that looks great in plaintext (e.g., use "25 / 100" for fractions, Bold text, and standard operators like +, -, ×, ÷, =).`;

      const messageHistory = [
        { role: "system", content: systemInstruction },
        ...messages.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.text,
        })),
        { role: "user", content: text },
      ];

      const response = await window.puter.ai.chat(messageHistory);
      const aiText =
        response.toString() || "I couldn't process that. Try again!";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("Puter AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong with the AI service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className="sp-ai-sidebar mt-10 border-b-2 rounded-lg"
      style={{
        width: 400,
        minWidth: 320,
        background: "#fff",
        borderLeft: `1px solid ${TOKEN.outlineVariant}`,
        borderRight: `1px solid ${TOKEN.outlineVariant}`,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 145px)",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "-4px 0 24px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <div
        className="border-t-2 border-slate"
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${TOKEN.outlineVariant}`,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid rgba(99,46,205,0.2)`,
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5MWfPK7Lp_L6gatHr0JdsghMh3x1Br3HZ53BUaWek2RUuD7t7l7qFN8zKYCz43cj-u59w2BYIk-ijmx4Rk0hMjImWgGwgcuwn07tY1GrvM_NMCTIIzBlAKnHdzW0b4pt1QXLjn_W2SCm9V5BIfL-SQew5-7jIWuKduxZmWP5pvMguwBaEieS12eeNOI4nmR_GEwG2Oz2B6rZvdHsW8n9SIBN0RmHYFylqgaRdDCS7eYg7k6JMU-C8vSE-QLM4SQObktPtoflelSk"
              alt="AI Tutor"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>
        <div>
          <div
            className="sp-headline"
            style={{ fontWeight: 700, fontSize: 15, color: TOKEN.onSurface }}
          >
            AI Tutor
          </div>
          <div className="sp-mono" style={{ color: TOKEN.tertiary }}>
            {decodeURIComponent(topic || "")}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              maxWidth: "88%",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "ai" && (
              <div
                className="bubble-ai"
                style={{
                  background: "rgba(124,76,230,0.07)",
                  border: `1px solid rgba(99,46,205,0.1)`,
                  borderRadius: 16,
                  padding: "12px 14px",
                }}
              >
                <div
                  className="sp-mono"
                  style={{ color: TOKEN.tertiary, marginBottom: 4 }}
                >
                  AI Tutor
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: TOKEN.onSurface,
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div
                className="bubble-user"
                style={{
                  background: TOKEN.primary,
                  borderRadius: 16,
                  padding: "12px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {msg.text}
                </p>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(124,76,230,0.07)",
              borderRadius: 16,
              padding: "10px 14px",
            }}
          >
            <span style={{ fontSize: 13, color: TOKEN.onSurfaceVariant }}>
              Thinking…
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick prompts */}
      <div
        className="pb-3 pl-7"
        style={{ display: "flex", gap: 6, overflowX: "auto" }}
      >
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            style={{
              whiteSpace: "nowrap",
              padding: "4px 10px",
              background: TOKEN.surfaceContainer,
              border: `1px solid rgba(199,196,214,0.3)`,
              borderRadius: 9999,
              fontSize: 11,
              color: TOKEN.onSurfaceVariant,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="pb-5 px-5"
        style={{
          background: "#fff",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Ask about this question…"
          rows={1}
          style={{
            flex: 1,
            background: TOKEN.surfaceContainerLow,
            border: `1px solid ${TOKEN.outlineVariant}`,
            borderRadius: 16,
            padding: "10px 14px",
            fontSize: 14,
            fontFamily: "'Work Sans', sans-serif",
            resize: "none",
            outline: "none",
            lineHeight: 1.5,
            minHeight: 44,
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          style={{
            width: 44,
            height: 44,
            background: TOKEN.tertiary,
            color: "#fff",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99,46,205,0.25)",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ answerResults, totalSeconds, onRetry, onHome }) {
  const total = answerResults.length;
  const correct = answerResults.filter((r) => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Format totalSeconds into a human-readable string
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const timeDisplay =
    hrs > 0
      ? `${hrs}h ${mins}m ${String(secs).padStart(2, "0")}s`
      : `${mins}m ${String(secs).padStart(2, "0")}s`;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: `1px solid ${TOKEN.outlineVariant}`,
          padding: 48,
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "rgba(93,92,222,0.12)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke={TOKEN.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h1
          className="sp-headline"
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: TOKEN.onSurface,
            marginBottom: 8,
          }}
        >
          Great job!
        </h1>
        <p
          style={{
            fontSize: 15,
            color: TOKEN.onSurfaceVariant,
            marginBottom: 32,
          }}
        >
          You've finished the practice session.
        </p>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {/* Completed */}
          <div className="stat-card">
            <div
              className="sp-mono"
              style={{
                color: TOKEN.onSurfaceVariant,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Completed
            </div>
            <div
              className="sp-headline"
              style={{ fontSize: 28, fontWeight: 700, color: TOKEN.primary }}
            >
              {correct}/{total}
            </div>
            <div style={{ fontSize: 11, color: TOKEN.onSurfaceVariant }}>
              Questions
            </div>
          </div>

          {/* Accuracy */}
          <div className="stat-card">
            <div
              className="sp-mono"
              style={{
                color: TOKEN.onSurfaceVariant,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Accuracy
            </div>
            <div
              className="sp-headline"
              style={{ fontSize: 28, fontWeight: 700, color: TOKEN.primary }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: 11, color: TOKEN.onSurfaceVariant }}>
              Mastery
            </div>
          </div>

          {/* Total time */}
          <div className="stat-card">
            <div
              className="sp-mono"
              style={{
                color: TOKEN.onSurfaceVariant,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Time
            </div>
            <div
              className="sp-headline"
              style={{ fontSize: 22, fontWeight: 700, color: TOKEN.primary }}
            >
              {timeDisplay}
            </div>
            <div style={{ fontSize: 11, color: TOKEN.onSurfaceVariant }}>
              Total
            </div>
          </div>
        </div>

        {/* Per-question result list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          {answerResults.map((r, i) => (
            <div
              key={r.questionId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                background: TOKEN.surfaceContainerLow,
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  color: r.isCorrect ? "#16a34a" : "#dc2626",
                  fontSize: 16,
                }}
              >
                {r.isCorrect ? "✓" : "✗"}
              </span>
              <span style={{ color: TOKEN.onSurface }}>Question {i + 1}</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: r.isCorrect ? "#16a34a" : "#dc2626",
                  fontWeight: 600,
                }}
              >
                {r.isCorrect ? "Correct" : "Wrong"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            className="sp-btn-primary"
            onClick={onRetry}
            style={{ width: "100%", justifyContent: "center" }}
          >
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
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
            </svg>
            Try Again
          </button>
          <button
            className="sp-btn-outline"
            onClick={onHome}
            style={{
              width: "100%",
              padding: "12px 28px",
              borderRadius: 12,
              fontSize: 14,
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // ── Refs for imperative timer control ──
  // Using refs so we can start/stop from anywhere without stale closure issues.
  const perQuestionTimerRef = useRef(null);
  const totalTimerRef = useRef(null);

  const stopTimers = () => {
    clearInterval(perQuestionTimerRef.current);
    clearInterval(totalTimerRef.current);
    perQuestionTimerRef.current = null;
    totalTimerRef.current = null;
  };

  const startTimers = () => {
    stopTimers(); // clear any existing before starting fresh
    perQuestionTimerRef.current = setInterval(
      () => setSecondsElapsed((p) => p + 1),
      1000
    );
    totalTimerRef.current = setInterval(
      () => setTotalSeconds((p) => p + 1),
      1000
    );
  };

  // Start timers on mount, stop on unmount
  useEffect(() => {
    startTimers();
    return () => stopTimers();
  }, []);

  const {
    canvasRef: mountRef,
    playAnimation,
    handlePlayAudio,
    muted,
    toggleMute,
  } = useDog();

  // Reset per-question tracking flags when question changes
  useEffect(() => {
    setUsedAIVideo(false);
    setUsedAIChat(false);
  }, [currentIndex]);

  // Fetch questions
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
        // 1. Guard against empty data
        if (!finalAttempts || finalAttempts.length === 0) return;
    
        let verifiedAttempts = [...finalAttempts];
        let finalGrade = 0;
    
        try {
          // 2. Format a clear prompt for Puter.js to analyze[cite: 3]
          const analysisPrompt = `
            You are an evaluation engine for a math platform. 
            Analyze the following student answers against the questions and determine if they are mathematically correct.[cite: 3]
            
            Data to analyze:
            ${JSON.stringify(finalAttempts, null, 2)}
            
            Your task:
            1. Review each item. Verify if "answer_given" matches the mathematically correct solution for that question.[cite: 3]
            2. Set "is_correct" strictly to true or false based on your evaluation.[cite: 3]
            3. Return ONLY a valid JSON array containing objects with at least "question_id" and "is_correct".[cite: 3]
            Do not include any markdown formatting, backticks, or extra text.[cite: 3]
          `;
    
          // 3. Call Puter.js AI Chat
          const response = await window.puter.ai.chat(analysisPrompt, { json_mode: true });
          
          // 4. Parse the verified output from Puter.js
          const aiOutput = response.message?.content || response;
          const parsedAiData = typeof aiOutput === "string" ? JSON.parse(aiOutput.trim()) : aiOutput;
    
          // 5. MERGE STRATEGY: Update the original safe array with Puter's evaluation
          // This guarantees we never lose 'time_spent_seconds' or 'used_ai_video'
          verifiedAttempts = finalAttempts.map(originalAttempt => {
            const aiEvaluation = parsedAiData.find(aiResult => aiResult.question_id === originalAttempt.question_id);
            
            return {
              ...originalAttempt,
              // If Puter evaluated it, use Puter's answer. Otherwise, fallback to the client-side check.
              is_correct: aiEvaluation !== undefined ? aiEvaluation.is_correct : originalAttempt.is_correct
            };
          });
    
        } catch (aiError) {
          console.error("Puter.js evaluation failed, falling back to client-side logic:", aiError);
          // If AI fails, verifiedAttempts simply defaults to the client-side evaluation already mapped inside it.
        }
    
        // 6. Calculate the verified grade mathematically based on the final merged attempts[cite: 3]
        const total = verifiedAttempts.length;
        const correctCount = verifiedAttempts.filter((a) => a.is_correct === true).length;
        finalGrade = total > 0 ? Number(((correctCount / total) * 100).toFixed(2)) : 0;
    
        // 7. Build the exact payload the backend expects
        const payload = {
          topic_id: topicId,
          section_id: sectionId,
          grade: finalGrade,
          start_time: sessionStartTime,
          end_time: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          recordedAnswers: verifiedAttempts // Now contains safe keys + Puter's intelligence
        };
    
        // 8. Post the Puter-verified payload to your backend
        try {
          const BASE_URL = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000"
            : "https://mathamagic-backend.vercel.app";
    
          const res = await axios.post(`${BASE_URL}/questions/save-marks`, payload, {
            withCredentials: true,
          });
          
          console.log("Marks saved successfully with AI verified data!", res.data);
        } catch (apiError) {
          console.error("Failed to save marks to the database:", apiError?.response?.data || apiError.message);
        }
      };

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    // 1. Format the data EXACTLY as the backend `recordedAnswers` array expects it
    const newAttempt = {
      question_id: currentQuestion.id,
      answer_given: latex,
      is_correct: isCorrect,
      time_spent_seconds: secondsElapsed,
      used_ai_video: usedAIVideo,
      used_ai_chat: usedAIChat,
    };

    // For the backend
    const updatedAnswers = [...recordedAnswers, newAttempt];
    setRecordedAnswers(updatedAnswers);

    // For the ResultsScreen UI
    const newResult = { questionId: currentQuestion.id, isCorrect };
    const updatedResults = [...answerResults, newResult];
    setAnswerResults(updatedResults);

    // 2. Reset UI for next question
    setLatex("");
    setSecondsElapsed(0);

    // 3. Handle routing
    if (isLastQuestion) {
      stopTimers();
      // Pass the perfectly formatted array directly to the submit function
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
      stopTimers(); // ← stop both timers before showing results
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
    startTimers(); // ← restart both timers for the new session
  };

  return (
    <div className="sp-root" style={{ minHeight: "80vh" }}>
      <style>{styles}</style>
      <NavbarLoggedIn />
      <Sidebar />

      <div
        style={{
          marginTop: 30,
          height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showResults ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
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
                padding: 24,
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
                <div>
                  <h2
                    className="sp-headline"
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: TOKEN.onSurface,
                      margin: 0,
                    }}
                  >
                    Practice Session
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: TOKEN.onSurfaceVariant,
                      margin: "2px 0 0",
                    }}
                  >
                    {decodeURIComponent(topic || "")} —{" "}
                    {decodeURIComponent(section || "")}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
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
                          {currentQuestion.formula || "No formula available."}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild />
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
                          {currentQuestion.hint || "No hint available."}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild />
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
                        playAnimation={playAnimation}
                        handlePlayAudio={handlePlayAudio}
                        handleNextOrSubmit={handleNextOrSubmit_solvetab}
                        question={currentQuestion}
                        setIsDialogOpen={setIsDialogOpen}
                        muted={muted}
                        toggleMute={toggleMute}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* AI Video — sets usedAIVideo flag */}
                  <button
                    className="sp-btn-outline"
                    onClick={() => setUsedAIVideo(true)}
                  >
                    AI Video Explanation
                  </button>
                </div>
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
                                <p
                                  style={{
                                    fontSize: 16,
                                    lineHeight: 1.65,
                                    color: TOKEN.onSurface,
                                    fontWeight: 500,
                                    margin: 0,
                                    maxHeight: 160,
                                    overflowY: "auto",
                                  }}
                                >
                                  {q.question}
                                </p>
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

      <DogPortal
        mountRef={mountRef}
        targetId={isDialogOpen ? "dog-dialog" : "dog-sidebar"}
      />
    </div>
  );
};

export default SolveProblems;
