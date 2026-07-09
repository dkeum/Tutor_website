import { PlayCircle, X } from "lucide-react";

// ─── AI Video Modal ───────────────────────────────────────────────────────────
function AIVideoModal({ isOpen, onClose, videoStreamUrl, questionText }) {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="video-modal-card">
        {/* Header */}
        <div className="video-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PlayCircle size={18} color="#a78bfa" />
            <span
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
              }}
            >
              AI Video Explanation
            </span>
          </div>
          <button className="video-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Question context pill */}
        {questionText && (
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Work Sans', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {questionText}
          </div>
        )}

        {/* Video player */}
        <div style={{ padding: "20px", background: "#000" }}>
          {videoStreamUrl ? (
            <video
              src={videoStreamUrl}
              controls
              autoPlay
              style={{
                width: "100%",
                borderRadius: 12,
                display: "block",
                maxHeight: "460px",
                background: "#000",
              }}
            />
          ) : (
            <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
              Loading video…
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 8,
              transition: "color 0.15s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#fff")}
            onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIVideoModal