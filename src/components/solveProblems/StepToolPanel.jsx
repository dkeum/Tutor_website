import React from "react";
import { MessageCircle, Video, HelpCircle } from "lucide-react";
import { TOOL_REGISTRY } from "./toolRegistry";
import { INLINE_TOOL_REGISTRY } from "./InlineTools";

const BRAND = "#4441c4";
const BRAND_BORDER = "#c7c4d6";

const iconBtnClass =
  "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg border cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

const StepToolsPanel = ({
  activeTool,
  setActiveTool,
  onRequestHint,
  hintLoading,
  hintsUsedThisStep,
  maxHints,
  creditsRemaining,
  onAttachImage,
  messages,
  setMessages,
  question,
  videoStreamUrl,
  isVideoLoading,
  onGenerateVideo,
  toolState,
  setToolState,
}) => {
  const currentTool = activeTool || "chat"; // NEW: never empty, defaults to chat
  const InlineComponent = INLINE_TOOL_REGISTRY[currentTool];
  const hintsLeft = maxHints - hintsUsedThisStep;

  const btnStyle = (isActive) => ({
    borderColor: BRAND_BORDER,
    color: BRAND,
    background: isActive ? `${BRAND}1A` : "transparent",
  });
  const hover = (e) => (e.currentTarget.style.background = `${BRAND}0D`);
  const unhover = (e, isActive) => (e.currentTarget.style.background = isActive ? `${BRAND}1A` : "transparent");

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Content — always populated, top of the div */}
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden" style={{ border: `1px solid ${BRAND_BORDER}` }}>
        {InlineComponent ? (
          <InlineComponent
            onAttach={onAttachImage}
            question={question}
            messages={messages}
            setMessages={setMessages}
            videoStreamUrl={videoStreamUrl}
            isVideoLoading={isVideoLoading}
            onGenerate={onGenerateVideo}
            questionText={question?.question}
            toolState={toolState}
            setToolState={setToolState} // Ensure this is passed here
          />
        ) : (
          <div className="p-3 text-sm text-slate-400">Coming soon</div>
        )}
      </div>

      {/* Toolbar — always pinned at the bottom */}
      <div className="w-full flex gap-2 shrink-0">
        {Object.entries(TOOL_REGISTRY).map(([key, tool]) => {
          const Icon = tool.icon;
          const isActive = currentTool === key;
          return (
            <button
              key={key}
              title={tool.label}
              onClick={() => setActiveTool(key)}
              className={iconBtnClass}
              style={btnStyle(isActive)}
              onMouseEnter={hover}
              onMouseLeave={(e) => unhover(e, isActive)}
            >
              <Icon size={18} />
            </button>
          );
        })}

        <button
          title={creditsRemaining != null ? `Ask AI (${creditsRemaining} left)` : "Ask AI"}
          onClick={() => setActiveTool("chat")}
          className={iconBtnClass}
          style={btnStyle(currentTool === "chat")}
          onMouseEnter={hover}
          onMouseLeave={(e) => unhover(e, currentTool === "chat")}
        >
          <MessageCircle size={18} />
        </button>

        {/* <button
          title="Explain with Video"
          onClick={() => setActiveTool("video")}
          className={iconBtnClass}
          style={btnStyle(currentTool === "video")}
          onMouseEnter={hover}
          onMouseLeave={(e) => unhover(e, currentTool === "video")}
        >
          <Video size={18} />
        </button> */}

        <button
          title={hintsLeft > 0 ? `I'm Stuck (${hintsLeft} left)` : "No hints left"}
          onClick={onRequestHint}
          disabled={hintLoading || hintsLeft <= 0}
          className={iconBtnClass}
          style={btnStyle(false)}
          onMouseEnter={(e) => !e.currentTarget.disabled && hover(e)}
          onMouseLeave={(e) => unhover(e, false)}
        >
          <HelpCircle size={18} />

        </button>
      </div>
    </div>
  );
};

export default StepToolsPanel;