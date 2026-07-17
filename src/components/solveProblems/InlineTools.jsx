import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import { Eraser, Pencil, Undo, Grid2x2, Check, Send, PlayCircle  } from "lucide-react";
import { motion } from "motion/react"; // Assuming framer-motion
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import MathQuillInput from "../MathQuillInput";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const BRAND = "#4441c4";
const BRAND_BORDER = "#e5e7eb";

// ── Inline Draw ──
export const InlineDrawTool = ({ onAttach }) => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ width, height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const GRID_SIZE = 25;
  const renderGrid = () => {
    const gridLines = [];
    for (let x = 0; x <= dims.width; x += GRID_SIZE) {
      gridLines.push(<Line key={`v-${x}`} points={[x, 0, x, dims.height]} stroke="#d1d5db" strokeWidth={1} listening={false} />);
    }
    for (let y = 0; y <= dims.height; y += GRID_SIZE) {
      gridLines.push(<Line key={`h-${y}`} points={[0, y, dims.width, y]} stroke="#d1d5db" strokeWidth={1} listening={false} />);
    }
    return gridLines;
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev, { tool, points: [pos.x, pos.y] }]);
  };
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const point = e.target.getStage().getPointerPosition();
    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      return [...prev.slice(0, -1), { ...last, points: [...last.points, point.x, point.y] }];
    });
  };
  const handleMouseUp = () => (isDrawing.current = false);
  const handleUndo = () => setLines((prev) => prev.slice(0, -1));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderBottom: `1px solid ${BRAND_BORDER}` }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setTool("pen")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: `1px solid ${BRAND_BORDER}`, background: tool === "pen" ? "#ede9ff" : "transparent", color: tool === "pen" ? BRAND : "#6b7280", fontSize: 11, fontWeight: 600 }}>
            <Pencil size={12} /> Pen
          </button>
          <button onClick={() => setTool("eraser")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: `1px solid ${BRAND_BORDER}`, background: tool === "eraser" ? "#ede9ff" : "transparent", color: tool === "eraser" ? BRAND : "#6b7280", fontSize: 11, fontWeight: 600 }}>
            <Eraser size={12} /> Eraser
          </button>
          <button onClick={() => setShowGrid((p) => !p)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: `1px solid ${BRAND_BORDER}`, background: showGrid ? "#ede9ff" : "transparent", color: showGrid ? BRAND : "#6b7280", fontSize: 11, fontWeight: 600 }}>
            <Grid2x2 size={12} />
          </button>
          <button onClick={handleUndo} disabled={lines.length === 0} style={{ display: "flex", alignItems: "center", padding: "4px 8px", borderRadius: 6, border: `1px solid ${BRAND_BORDER}`, background: "transparent", color: lines.length === 0 ? "#d1d5db" : "#6b7280" }}>
            <Undo size={12} />
          </button>
        </div>
        <button
          onClick={() => onAttach?.(stageRef.current?.toDataURL({ pixelRatio: 2 }), "drawing")}
          disabled={lines.length === 0}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, background: "transparent", fontSize: 11, fontWeight: 600, color: BRAND, opacity: lines.length === 0 ? 0.5 : 1, cursor: lines.length === 0 ? "not-allowed" : "pointer" }}
          title="Attach to this step"
        >
          <Check size={12} /> Attach
        </button>
      </div>

      <div ref={containerRef} style={{ flex: 1, width: "100%", overflow: "hidden", background: "#fff", cursor: "crosshair" }}>
        {dims.width > 0 && (
          <Stage width={dims.width} height={dims.height} ref={stageRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}>
            <Layer>
              <Rect width={dims.width} height={dims.height} fill="white" />
              {showGrid && renderGrid()}
            </Layer>
            <Layer>
              {lines.map((line, i) => (
                <Line key={i} points={line.points} stroke={line.tool === "eraser" ? "#fff" : "#000"} strokeWidth={line.tool === "eraser" ? 25 : 5} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"} />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

// ── Inline Graph ──
// ── Inline Graph ──
export const InlineGraphTool = ({ onAttach }) => {
  const [equation, setEquation] = useState("x^2"); // no leading "y =" — MathQuill handles that as you type
  const graphRef = useRef(null);
  const calculatorInst = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!graphRef.current || calculatorInst.current) return;
      calculatorInst.current = window.Desmos.GraphingCalculator(graphRef.current, {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        zoomButtons: true,
      });
      calculatorInst.current.setExpression({ id: "eq1", latex: equation });
    };

    if (window.Desmos) {
      init();
    } else if (!document.getElementById("desmos-script")) {
      // Only inject the Desmos script once, even across repeated mounts
      // (this component mounts/unmounts every time the tool tab is switched)
      const script = document.createElement("script");
      script.id = "desmos-script";
      script.src = "https://www.desmos.com/api/v1.8/calculator.js?apiKey=b7f43827f4544c6ca4861c278c3727a8";
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      // Script tag already exists but hasn't finished loading yet — wait for it
      document.getElementById("desmos-script").addEventListener("load", init, { once: true });
    }

    return () => {
      calculatorInst.current?.destroy();
      calculatorInst.current = null;
    };
  }, []);

  const handleEquationChange = (newLatex) => {
    setEquation(newLatex);
    calculatorInst.current?.setExpression({ id: "eq1", latex: newLatex });
  };

  const handleAttach = () => {
    calculatorInst.current?.asyncScreenshot({ width: 400, height: 400, targetPixelRatio: 2 }, (dataUrl) => {
      onAttach?.(dataUrl, "graph");
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 10px", borderBottom: `1px solid ${BRAND_BORDER}` }}>
        <div style={{ flex: 1 }}>
          <MathQuillInput value={equation} onChange={handleEquationChange} />
        </div>
        <button onClick={handleAttach} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, background: "transparent", fontSize: 11, fontWeight: 600, color: BRAND }}>
          <Check size={12} /> Attach
        </button>
      </div>
      <div ref={graphRef} style={{ flex: 1, minHeight: 300, width: "100%", overflow: "hidden", background: "#fff" }} />
    </div>
  );
};
// ── Inline Upload ──
export const InlineUploadTool = ({ onAttach }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;
    
    setFile(f);
    
    // Read the file and pass the DataURL to the onAttach callback
    const reader = new FileReader();
    reader.onload = () => onAttach?.(reader.result, "uploaded picture");
    reader.readAsDataURL(f);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: handleFileChange,
  });

  return (
    <div 
      className="w-full h-full flex items-center justify-center" 
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <motion.div
        whileHover="animate"
        className="p-4 group/file block rounded-lg cursor-pointer w-full h-full relative overflow-hidden flex flex-col items-center justify-center min-h-[150px]"
      >
        <div className="flex flex-col items-center justify-center">
          {!file ? (
            <div className="relative w-full max-w-xl mx-auto flex items-center justify-center">
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-16 w-16 mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <IconUpload className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </motion.div>
                ) : (
                  <IconUpload className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>

              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-16 w-16 mx-auto rounded-md"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs mt-1">Attached to step</span>
            </div>
          )}
          
          {!file && (
             <p className="mt-6 text-xs text-neutral-500 font-medium">Click or drag an image here</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};


// ── Inline Calculator ── (ported from Calculator.jsx, no Dialog/preview wrapper)
export const InlineCalculatorTool = () => {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOp, setPendingOp] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [isDegrees, setIsDegrees] = useState(true);

  const applyOp = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      case "^": return Math.pow(a, b);
      default: return b;
    }
  };

  const inputDigit = (digit) => {
    if (overwrite) {
      setDisplay(digit === "." ? "0." : digit);
      setOverwrite(false);
    } else {
      if (digit === "." && display.includes(".")) return;
      setDisplay((prev) => (prev === "0" && digit !== "." ? digit : prev + digit));
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
  };

  const backspace = () => {
    if (overwrite) return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const chooseOperator = (op) => {
    const current = parseFloat(display);
    if (storedValue !== null && pendingOp && !overwrite) {
      const result = applyOp(storedValue, current, pendingOp);
      setStoredValue(result);
      setDisplay(String(result));
    } else {
      setStoredValue(current);
    }
    setPendingOp(op);
    setOverwrite(true);
  };

  const equals = () => {
    if (pendingOp === null || storedValue === null) return;
    const current = parseFloat(display);
    const result = applyOp(storedValue, current, pendingOp);
    setDisplay(String(result));
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
  };

  const applyFn = (fn) => {
    const current = parseFloat(display);
    const rad = isDegrees ? (current * Math.PI) / 180 : current;
    let result;
    switch (fn) {
      case "sin": result = Math.sin(rad); break;
      case "cos": result = Math.cos(rad); break;
      case "tan": result = Math.tan(rad); break;
      case "sqrt": result = Math.sqrt(current); break;
      case "sq": result = current * current; break;
      case "log": result = Math.log10(current); break;
      case "ln": result = Math.log(current); break;
      case "inv": result = current === 0 ? NaN : 1 / current; break;
      case "pi": result = Math.PI; break;
      case "e": result = Math.E; break;
      default: result = current;
    }
    setDisplay(String(result));
    setOverwrite(true);
  };

  const btnStyle = (variant = "default") => ({
    padding: "8px 0",
    borderRadius: 6,
    border: `1px solid ${BRAND_BORDER}`,
    background:
      variant === "op" ? `${BRAND}1A` :
        variant === "equals" ? BRAND :
          variant === "fn" ? "#f2f4f6" :
            "#fff",
    color:
      variant === "equals" ? "#fff" :
        variant === "op" ? BRAND :
          "#191c1e",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  const buttonRows = [
    [{ l: "sin", type: "fn" }, { l: "cos", type: "fn" }, { l: "tan", type: "fn" }, { l: "C", type: "fn", act: clearAll }],
    [{ l: "x²", type: "fn" }, { l: "√", type: "fn" }, { l: "log", type: "fn" }, { l: "⌫", type: "fn", act: backspace }],
    [{ l: "ln", type: "fn" }, { l: "π", type: "fn" }, { l: "e", type: "fn" }, { l: "÷", type: "op" }],
    [{ l: "7" }, { l: "8" }, { l: "9" }, { l: "×", type: "op" }],
    [{ l: "4" }, { l: "5" }, { l: "6" }, { l: "-", type: "op" }],
    [{ l: "1" }, { l: "2" }, { l: "3" }, { l: "+", type: "op" }],
    [{ l: "1/x", type: "fn" }, { l: "0" }, { l: "." }, { l: "=", type: "equals" }],
  ];

  const handlePress = (btn) => {
    const { l } = btn;
    if (btn.act) return btn.act();
    if (!isNaN(l) || l === ".") return inputDigit(l);
    if (["+", "-", "×", "÷"].includes(l)) return chooseOperator(l);
    if (l === "=") return equals();
    const fnMap = { sin: "sin", cos: "cos", tan: "tan", "x²": "sq", "√": "sqrt", log: "log", ln: "ln", π: "pi", e: "e", "1/x": "inv" };
    if (fnMap[l]) return applyFn(fnMap[l]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", padding: 10, gap: 8, overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={() => setIsDegrees((d) => !d)}
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 6,
            border: `1px solid ${BRAND_BORDER}`,
            background: "#f2f4f6",
            color: BRAND,
            cursor: "pointer",
          }}
        >
          {isDegrees ? "DEG" : "RAD"}
        </button>
      </div>

      <div
        style={{
          background: "#f2f4f6",
          borderRadius: 8,
          padding: "10px 12px",
          textAlign: "right",
          fontSize: 20,
          fontWeight: 700,
          color: "#191c1e",
          overflowX: "auto",
          whiteSpace: "nowrap",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {display}
      </div>

      <div style={{ display: "grid", gridTemplateRows: `repeat(${buttonRows.length}, 1fr)`, gap: 6, flex: 1 }}>
        {buttonRows.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {row.map((btn, j) => (
              <button key={j} onClick={() => handlePress(btn)} style={btnStyle(btn.type)}>
                {btn.l}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Inline AI Chat (Shared State Version) ──
export const InlineChatTool = ({ question, messages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to safely extract text (since your parent sometimes passes image arrays to content)
  const extractText = (content) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      const textNode = content.find((c) => c.type === "text");
      return textNode ? textNode.text : "(Image attached)";
    }
    return "";
  };

  // Only show AI messages
  const aiMessages = messages.filter((m) => m.role === "assistant");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "10px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {aiMessages.length === 0 ? (
          <div style={{ fontSize: 12, color: "#9ca3af", padding: "8px 4px" }}>
            AI feedback will appear here once you check a step.
          </div>
        ) : (
          aiMessages.map((msg, i) => {
            const textContent = extractText(msg.content);
            return (
              <div key={i} style={{ maxWidth: "100%" }}>
                <div
                  style={{
                    background: `${BRAND}0D`,
                    border: `1px solid ${BRAND_BORDER}`,
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "#191c1e",
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {textContent}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};


// ── Inline Video ──
// export const InlineVideoTool = ({ videoStreamUrl, isVideoLoading, onGenerate, questionText }) => {
//   // auto-kick generation the first time this panel opens
//   useEffect(() => {
//     if (!videoStreamUrl && !isVideoLoading) onGenerate?.();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           padding: "8px 10px",
//           borderBottom: `1px solid ${BRAND_BORDER}`,
//         }}
//       >
//         <PlayCircle size={14} color={BRAND} />
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#191c1e" }}>AI Video</span>
//       </div>

    

//       <div
//         style={{
//           flex: 1,
//           minHeight: 0,
//           background: "#000",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {isVideoLoading ? (
//           <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Generating video…</div>
//         ) : videoStreamUrl ? (
//           <video
//             src={videoStreamUrl}
//             controls
//             autoPlay
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//           />
//         ) : (
//           <button
//             onClick={() => onGenerate?.()}
//             style={{
//               color: "#fff",
//               background: BRAND,
//               border: "none",
//               borderRadius: 8,
//               padding: "6px 14px",
//               fontSize: 12,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             Generate video
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

export const INLINE_TOOL_REGISTRY = {
  draw: InlineDrawTool,
  graph: InlineGraphTool,
  uploadPicture: InlineUploadTool,
  calculator: InlineCalculatorTool,
  chat: InlineChatTool,
  // video: InlineVideoTool, // NEW
};