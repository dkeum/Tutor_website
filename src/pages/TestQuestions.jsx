import React, { useState } from "react";
import MathQuestion from "../components/MathQuestion"; // adjust path to wherever MathQuestion.jsx lives

const API_BASE = "http://localhost:3000";

const TestQuestions = () => {
  const [topicIdsInput, setTopicIdsInput] = useState("");
  const [sectionIdsInput, setSectionIdsInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  // Track which question's prompt was just copied for UX feedback
  const [copiedId, setCopiedId] = useState(null);

  // Per-question upload state: { [questionId]: { uploading, error, dragging } }
  const [uploadState, setUploadState] = useState({});

  const parseIds = (raw) =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const fetchQuestions = async () => {
    const topicIds = parseIds(topicIdsInput);
    const sectionIds = parseIds(sectionIdsInput);

    if (topicIds.length === 0 && sectionIds.length === 0) {

      setError("Enter at least one Topic ID or Section ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (topicIds.length) params.set("topicIds", topicIds.join(","));
      if (sectionIds.length) params.set("sectionIds", sectionIds.join(","));

      const res = await fetch(`${API_BASE}/api/test-questions?${params.toString()}`);
      if (!res.ok) {

        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setQuestions(data.questions || []);
      setCurrentPage(1); // Reset to first page when new questions load
    } catch (err) {
      setError(err.message || "Failed to fetch questions.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (questionId, file) => {
    if (!file) return;

    setUploadState((prev) => ({
      ...prev,
      [questionId]: { uploading: true, error: null, dragging: false },
    }));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/api/test-questions/${questionId}/image`, {

        method: "POST",
        body: formData,
      });

      if (!res.ok) {

        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();

      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, image_url: data.image_url } : q))
      );
      setUploadState((prev) => ({
        ...prev,
        [questionId]: { uploading: false, error: null, dragging: false },
      }));
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        [questionId]: { uploading: false, error: err.message, dragging: false },
      }));
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e, questionId) => {
    e.preventDefault();
    setUploadState((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], dragging: true },
    }));
  };

  const handleDragLeave = (e, questionId) => {
    e.preventDefault();
    setUploadState((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], dragging: false },
    }));
  };

  const handleDrop = (e, questionId) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {

      handleUpload(questionId, file);
    } else {
      setUploadState((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], dragging: false },
      }));
    }
  };

  const generatePrompt = (q) => {
    let snippet = (q.question || "").trim().replace(/\n/g, " ");
    if (snippet.length > 400) {

      snippet = snippet.substring(0, 400) + "…";
    }

    return `Create one simple, minimal educational illustration to accompany a Grade ${q.grade} math question.
Topic: ${q.topic_name}
Section: ${q.section_name}
Concept context, for your understanding only — do NOT render any of this text, do not quote it, do not include any part of it as visible text in the image: "${snippet}"

Strict requirements:
- Include only the numbers relevant in the question, do not add any extra numbers or text.
- Do not depict, hint at, or reveal the final answer or solution.
- Clean, simple, flat, minimal illustration style. Plain or transparent background.
- One clear subject only — no clutter, no borders, no frames. less than 5mB`;
  };

  const handleCopyPrompt = (q) => {
    const promptText = generatePrompt(q);
    navigator.clipboard
      .writeText(promptText)
      .then(() => {
        setCopiedId(q.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Question / LaTeX Test Harness</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        Internal tool — not part of the student-facing app. Pulls questions by Topic ID and/or
        Section ID and renders them exactly as MathQuestion would in production.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
          Topic IDs (comma-separated)
          <input
            type="text"
            value={topicIdsInput}
            onChange={(e) => setTopicIdsInput(e.target.value)}
            placeholder="e.g. 70,71,72"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
          Section IDs (comma-separated)
          <input
            type="text"
            value={sectionIdsInput}
            onChange={(e) => setSectionIdsInput(e.target.value)}
            placeholder="e.g. 820,821"
            style={inputStyle}
          />
        </label>

        <button
          type="button"
          onClick={fetchQuestions}
          disabled={loading}
          style={{
            alignSelf: "flex-end",
            padding: "8px 16px",
            backgroundColor: "#4441c4",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading…" : "Fetch questions"}
        </button>
      </div>

      {error && <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {
        questions.length > 0 && (
          <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
            {questions.length} question(s) loaded. (Showing page {currentPage} of {totalPages})
          </div>
        )
      }

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Render paginated questions instead of the full array */}
        {currentQuestions.map((q) => {
          const state = uploadState[q.id] || {};
          const isCopied = copiedId === q.id;

          return (
            <div
              key={q.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>
                Q#{q.id} · {q.topic_name} / {q.section_name} · grade {q.grade} · {q.difficulty} ·{" "}
                {q.question_type}
              </div>

              <MathQuestion
                text={q.question}
                multiplechoice={q.question_type === "multiple_choice"}
                options={q.options}
              />

              {q.hint && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                  <strong>Hint:</strong> {q.hint}
                </div>
              )}
              {q.answer && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #e5e7eb" }}>
                <div style={{ marginBottom: 16, backgroundColor: "#f9fafb", padding: 12, borderRadius: 6, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>AI Image Prompt</span>
                    <button
                      onClick={() => handleCopyPrompt(q)}
                      style={{
                        padding: "4px 12px",
                        fontSize: 12,
                        borderRadius: 4,
                        border: isCopied ? "1px solid #059669" : "1px solid #4b5563",
                        color: isCopied ? "white" : "#374151",
                        backgroundColor: isCopied ? "#10b981" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {isCopied ? "Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                  <details>
                    <summary style={{ fontSize: 11, color: "#6b7280", cursor: "pointer" }}>Show prompt text</summary>
                    <textarea
                      readOnly
                      value={generatePrompt(q)}
                      style={{
                        width: "100%",
                        minHeight: 120,
                        marginTop: 8,
                        padding: 8,
                        fontSize: 11,
                        color: "#4b5563",
                        border: "1px solid #d1d5db",
                        borderRadius: 4,
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </details>
                </div>

                {q.image_url && (
                  <img
                    src={q.image_url}
                    alt={`Question ${q.id}`}
                    style={{ maxWidth: 240, maxHeight: 240, display: "block", marginBottom: 8, borderRadius: 4 }}
                  />
                )}

                <div
                  onDragOver={(e) => handleDragOver(e, q.id)}
                  onDragLeave={(e) => handleDragLeave(e, q.id)}
                  onDrop={(e) => handleDrop(e, q.id)}
                  style={{
                    border: state.dragging ? "2px dashed #4441c4" : "1px dashed #d1d5db",
                    backgroundColor: state.dragging ? "#eef2ff" : "#fafafa",
                    borderRadius: 6,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {state.uploading ? (
                    <span style={{ fontSize: 13, color: "#4441c4", fontWeight: 600 }}>Uploading...</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 13, color: "#4b5563" }}>
                        Drag & drop an image here, or
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(q.id, file);
                        }}
                        style={{ fontSize: 12, color: "#6b7280" }}
                      />
                    </>
                  )}
                </div>

                {
                  state.error && (
                    <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>{state.error}</div>
                  )
                }
              </div >
            </div >
          );
        })}
      </div >

      {/* Pagination Controls */}
      {
        totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 24 }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                borderRadius: 6,
                border: "1px solid #d1d5db",
                backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                color: currentPage === 1 ? "#9ca3af" : "#374151",
                cursor: currentPage === 1 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: 13, color: "#4b5563" }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                borderRadius: 6,
                border: "1px solid #d1d5db",
                backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
                color: currentPage === totalPages ? "#9ca3af" : "#374151",
                cursor: currentPage === totalPages ? "default" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )
      }
    </div >
  );
};

const inputStyle = {
  padding: "6px 8px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  minWidth: 200,
};

export default TestQuestions;