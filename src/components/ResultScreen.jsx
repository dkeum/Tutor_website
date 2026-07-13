import { TOKEN } from "../pages/SolveProblems";

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ answerResults, totalSeconds, onRetry, onHome }) {
  const total = answerResults.length;
  const correct = answerResults.filter((r) => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

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
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
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
          margin: "auto 0",
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
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
              justifyContent: "center",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen