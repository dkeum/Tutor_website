import { useState, useRef, useEffect } from "react";
import { TOKEN } from "../pages/SolveProblems";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { X } from "lucide-react"; // ← NEW: Import X icon for deleting images

// ─── AI Chat Sidebar ──────────────────────────────────────────────────────────
function AISidebar({
  topic,
  section,
  currentQuestion,
  onOpenStepByStep,
  setUsedAIChat,
  compact = false,
  attachments = [], // ← NEW: Receive attachments from parent
  onRemoveAttachment, // ← NEW: Callback to delete a specific attachment
  onClearAttachments, // ← NEW: Callback to clear all after sending
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
    // Prevent sending if both text and attachments are empty
    if (!text.trim() && attachments.length === 0) return;

    if (setUsedAIChat) setUsedAIChat(true);

    const currentAttachments = [...attachments]; // Snapshot attachments
    const userMsg = { role: "user", text, attachments: currentAttachments };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (onClearAttachments) onClearAttachments(); // Clear parent attachment state
    setLoading(true);

    try {


      if (!window.puter || !window.puter.ai) {
        throw new Error("Puter is not loaded or initialized yet.");
      }
      
      const questionText = currentQuestion?.question || "Not available";
      const formulaContext = currentQuestion?.formula
        ? `Formula: ${currentQuestion.formula}`
        : "No specific formula provided.";
      const hintContext = currentQuestion?.hint
        ? `Hint: ${currentQuestion.hint}`
        : "No specific hint provided.";

      const systemInstruction = `You are a helpful, encouraging math tutor for grade 10 students. 
  The student is working on "${decodeURIComponent(topic || "")}" — specifically "${decodeURIComponent(section || "")}".
  
  [CONTEXT]
  Current Question: "${questionText}"
  ${formulaContext}
  ${hintContext}
  
  [RULES]
  1. Be concise, clear, and highly encouraging.
  2. Guide the student step-by-step without giving away the direct answer explicitly.
  3. You MUST break down your explanation using clear, sequentially numbered steps strictly matching the pattern: "Step 1:", "Step 2:", etc.
  4. DO NOT use raw LaTeX format like \\( ... \\) or \\frac{}{}. Instead, use clean, readable Markdown math notation that looks great in plaintext (e.g., use "25 / 100" for fractions, Bold text, and standard operators like +, -, ×, ÷, =).
  5. If the user attached an image, analyze it closely to help them with their specific work.`;

      // Format previous message history for Puter
      const messageHistory = [
        { role: "system", content: systemInstruction },
        ...messages.map((msg) => {
          let content = msg.text;
          // If a previous user message had images, format it as a multimodal array
          if (msg.role === "user" && msg.attachments?.length > 0) {
            content = [
              { type: "text", text: msg.text || "Here are some images." },
              ...msg.attachments.map((url) => ({
                type: "image_url",
                image_url: { url },
              })),
            ];
          }
          return {
            role: msg.role === "ai" ? "assistant" : "user",
            content: content,
          };
        }),
      ];

      // Format the current message
      let finalContent = text || "Check out this image.";
      if (currentAttachments.length > 0) {
        finalContent = [
          { type: "text", text: finalContent },
          ...currentAttachments.map((url) => ({
            type: "image_url",
            image_url: { url },
          })),
        ];
      }
      messageHistory.push({ role: "user", content: finalContent });

      // Request chat with a vision-capable model
      const response = await window.puter.ai.chat(messageHistory, {
        model: "google/gemini-3.5-flash", // Ensure a multimodal model is used
      });
      
      const aiText = response?.message?.content || response.toString() || "I couldn't process that. Try again!";
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
        height: "100%",
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
          flexShrink: 0,
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
          minHeight: 0,
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
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {/* Display Sent Images in the Chat Bubble */}
                {msg.attachments?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {msg.attachments.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="Sent attachment"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      />
                    ))}
                  </div>
                )}
                {msg.text && (
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
                )}
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
        style={{ display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}
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

      {/* NEW: Attachments Preview Strip */}
      {attachments?.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "8px 20px 0 20px",
            background: "#fff",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {attachments.map((imgUrl, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                width: 60,
                height: 60,
                flexShrink: 0,
              }}
            >
              <img
                src={imgUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                  border: `1px solid ${TOKEN.outlineVariant}`,
                }}
              />
              <button
                onClick={() => onRemoveAttachment?.(idx)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="pb-5 pt-3 px-5"
        style={{
          background: "#fff",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          flexShrink: 0,
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

export default AISidebar;