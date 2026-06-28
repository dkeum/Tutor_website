import { useState, useRef, useEffect } from "react";
import { TOKEN } from "../pages/SolveProblems";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
  const chatEndRef = useRef(null);

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

export default AISidebar