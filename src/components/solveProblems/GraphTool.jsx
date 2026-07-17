import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Maximize2, Bot, ArrowRight, FunctionSquare } from "lucide-react";
import MathQuillInput from "../MathQuillInput"; // adjust path to match your project structure

const GraphTool = ({ onAddToAIChat }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [equation, setEquation] = useState("x^2"); // Default equation (no leading "y =", see note below)

  const graphRef = useRef(null);
  const calculatorInst = useRef(null);

  // ── Handle Dialog State & Capturing Desmos Preview ──
  const handleOpenChange = (open) => {
    if (!open && calculatorInst.current) {
      // Capture screenshot before unmounting the dialog
      try {
        calculatorInst.current.asyncScreenshot(
          { width: 400, height: 400, targetPixelRatio: 2 },
          (dataUrl) => {
            setPreviewImage(dataUrl);
          }
        );
      } catch (e) {
        console.error("Failed to capture Desmos snapshot:", e);
      }
    }
    setIsDialogOpen(open);
  };

  // ── Dynamically Load Desmos and Initialize Calculator ──
  useEffect(() => {
    if (!isDialogOpen) return;

    const initDesmos = () => {
      if (!graphRef.current) return;

      // Prevent initializing twice
      if (!calculatorInst.current) {
        calculatorInst.current = window.Desmos.GraphingCalculator(graphRef.current, {
          keypad: true,
          expressions: false, // We hide their list to use our own custom input
          settingsMenu: false,
          zoomButtons: true,
        });
        // Set initial expression
        calculatorInst.current.setExpression({ id: "eq1", latex: equation });
      }
    };

    if (window.Desmos) {
      initDesmos();
    } else if (!document.getElementById("desmos-script")) {
      // Only inject the Desmos script once, even across repeated dialog opens
      const script = document.createElement("script");
      script.id = "desmos-script";
      script.src =
        "https://www.desmos.com/api/v1.8/calculator.js?apiKey=b7f43827f4544c6ca4861c278c3727a8";
      script.async = true;
      script.onload = initDesmos;
      document.body.appendChild(script);
    } else {
      // Script tag already exists but hasn't finished loading yet — wait for it
      document.getElementById("desmos-script").addEventListener("load", initDesmos, { once: true });
    }

    // Cleanup instance when dialog closes
    return () => {
      if (calculatorInst.current) {
        calculatorInst.current.destroy();
        calculatorInst.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  // ── Handle LaTeX Input Change (now driven by MathQuill, not a raw <input>) ──
  const handleEquationChange = (newLatex) => {
    setEquation(newLatex);
    if (calculatorInst.current) {
      calculatorInst.current.setExpression({ id: "eq1", latex: newLatex });
    }
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
            alt="Your graph"
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
            Click the expand icon below to start graphing
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
          title="Maximize Graph"
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

      {/* Fullscreen interactive graphing overlay portal */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="!w-[80vw] !max-w-7xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Graph Toolboard</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          {/* Action Toolbar buttons & Input */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4338ca",
                  background: "#ede9ff",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <FunctionSquare size={18} />
              </div>

              {/* MathQuill input — replaces the old raw text <input> so ^, sqrt, fractions
                  render as real math and always produce valid LaTeX for Desmos */}
              <div style={{ flex: 1, maxWidth: "400px" }}>
                <MathQuillInput value={equation} onChange={handleEquationChange} />
              </div>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Use the keypad or type e.g. x^2, sqrt, /
              </span>
            </div>

            <DialogClose asChild>
              {/* Optional explicit close button if needed, but Dialog handles click-outside/esc by default */}
            </DialogClose>
          </div>

          {/* Active Desmos Graph target area */}
          <div
            ref={graphRef}
            style={{
              flex: 1,
              minHeight: 400, // prevents collapse to 0px inside the flex column
              width: "100%",
              overflow: "hidden",
              background: "#ffffff",
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GraphTool;