import { TOKEN } from "../pages/SolveProblems";


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

export default TimerBox