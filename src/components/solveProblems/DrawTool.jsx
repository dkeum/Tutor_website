import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Maximize2,
  Bot,
  ArrowRight,
  Eraser,
  Pencil,
  X,
  Undo,
  Grid2x2,
  HelpCircle,
} from "lucide-react";

const DrawTool = ({ onAddToAIChat, question }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true); // toggle for the question overlay

  // ── Logic State from your snippet ──
  const [tool, setTool] = useState("pen"); // 'pen' | 'eraser'
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  // Layout-specific UI refs
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [stageDimensions, setStageDimensions] = useState({ width: 500, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      setStageDimensions({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    };

    updateDimensions(); // Initial size

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // ── Dynamically size the stage container without erasing vector state arrays ──
  useEffect(() => {
    if (!isDialogOpen || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setStageDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isDialogOpen]);

  const GRID_SIZE = 25;

  const renderGrid = () => {
    const gridLines = [];

    // Vertical lines
    for (let x = 0; x <= stageDimensions.width; x += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, stageDimensions.height]}
          stroke="#d1d5db"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= stageDimensions.height; y += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, stageDimensions.width, y]}
          stroke="#d1d5db"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    return gridLines;
  };

  // ── Integrated Drawing Logic Handlers ──
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [
      ...prev,
      {
        tool,
        points: [pos.x, pos.y],
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];

      if (!lastLine) return prevLines;

      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };

      return [...prevLines.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    setLines((prev) => prev.slice(0, -1));
  };

  // ── Process flat base64 layout image preview string on workspace closing ──
  const handleOpenChange = (open) => {
    if (!open) {
      savePreview();
    }

    if (!open && stageRef.current) {
      try {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
        setPreviewImage(dataUrl);
      } catch (e) {
        console.error("Failed to capture Konva snapshot:", e);
      }
    }
    setIsDialogOpen(open);
  };

  const savePreview = () => {
    if (!stageRef.current) return;

    stageRef.current.draw();

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2,
    });

    setPreviewImage(dataURL);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Preview box wrapper context */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          overflow: "hidden",
        }}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Your drawing"
            style={{
              maxWidth: "100px",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />
        ) : (
          <span style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
            Click the expand icon below to start drawing
          </span>
        )}
      </div>

      {/* Bottom action row controls bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "transparent",
            cursor: "pointer",
            color: "#4441c4",
          }}
          title="Maximize Canvas"
        >
          <Maximize2 size={16} />
        </button>

        <button
          onClick={() => onAddToAIChat?.(previewImage)}
          disabled={!previewImage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "transparent",
            cursor: previewImage ? "pointer" : "not-allowed",
            opacity: previewImage ? 1 : 0.5,
            fontSize: 12,
            fontWeight: 600,
            color: "#4441c4",
          }}
          title="Send to Chat Workspace"
        >
          <Bot size={14} />
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Fullscreen interactive drawing overlay portal */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="!w-[80vw] !max-w-7xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Draw Toolboard</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          {/* Action Toolbar buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setTool("pen")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: tool === "pen" ? "#ede9ff" : "transparent",
                  color: tool === "pen" ? "#4338ca" : "#6b7280",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Pencil size={14} />
                Pen
              </button>
              <button
                onClick={() => setTool("eraser")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: tool === "eraser" ? "#ede9ff" : "transparent",
                  color: tool === "eraser" ? "#4338ca" : "#6b7280",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Eraser size={14} />
                Eraser
              </button>

              <button
                onClick={() => setShowGrid((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: showGrid ? "#ede9ff" : "transparent",
                  color: showGrid ? "#4338ca" : "#6b7280",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Grid2x2 size={14} />
                Grid
              </button>

              <button
                onClick={() => setShowQuestion((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: showQuestion ? "#ede9ff" : "transparent",
                  color: showQuestion ? "#4338ca" : "#6b7280",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                title="Show/hide the question above the canvas"
              >
                <HelpCircle size={14} />
                Show Question
              </button>

              <button
                onClick={handleUndo}
                disabled={lines.length === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "transparent",
                  color: lines.length === 0 ? "#d1d5db" : "#6b7280",
                  cursor: lines.length === 0 ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  marginLeft: 8,
                }}
                title="Undo last line stroke"
              >
                <Undo size={14} />
              </button>
            </div>

            <DialogClose asChild></DialogClose>
          </div>

          {/* Active Canvas target area layout boundary */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              width: "100%",
              overflow: "hidden",
              background: "#ffffff",
              cursor: "crosshair",
              position: "relative", // anchors the question overlay
            }}
          >
            {/* Question overlay — floats above the canvas, doesn't block drawing */}
            {showQuestion && question && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  right: 12,
                  zIndex: 10,
                  pointerEvents: "none", // let pen/eraser strokes pass through underneath
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    textAlign: "center",
                  }}
                >
                  {question}
                </div>
              </div>
            )}

            {stageDimensions.width > 0 && (
              <Stage
                width={stageDimensions.width}
                height={stageDimensions.height}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <Layer>
                  <Rect
                    width={stageDimensions.width}
                    height={stageDimensions.height}
                    fill="white"
                  />

                  {showGrid && renderGrid()}
                </Layer>

                <Layer>
                  {lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points}
                      stroke={line.tool === "eraser" ? "#ffffff" : "#000000"}
                      strokeWidth={line.tool === "eraser" ? 25 : 5}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={
                        line.tool === "eraser"
                          ? "destination-out"
                          : "source-over"
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrawTool;