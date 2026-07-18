import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Maximize2, Bot, ArrowRight, FunctionSquare } from "lucide-react";
import MathQuillInput from "../MathQuillInput";

const GraphTool = ({ onAddToAIChat }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [equation, setEquation] = useState("x^2");

  const graphRef = useRef(null);
  const calculatorInst = useRef(null);

  const destroyCalculator = () => {
    const inst = calculatorInst.current;
    calculatorInst.current = null;
    if (inst) {
      try {
        inst.destroy();
      } catch (e) {
        console.error("Error destroying Desmos instance:", e);
      }
    }
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    // graphRef.current is a FRESH <div> every time the dialog opens
    // (confirmed: the old calculator instance was left pointing at a
    // detached node — Desmos itself flags this as isOffscreen: true).
    // So: always destroy whatever we had, then create fresh against
    // whatever node exists right now, after giving layout a moment to settle.
    const timer = setTimeout(() => {
      if (!graphRef.current) return;

      destroyCalculator();

      const create = () => {
        if (!graphRef.current) return; // dialog may have closed during script load
        calculatorInst.current = window.Desmos.GraphingCalculator(graphRef.current, {
          keypad: true,
          expressions: false,
          settingsMenu: false,
          zoomButtons: true,
        });
        calculatorInst.current.setExpression({ id: "eq1", latex: equation });
      };

      if (window.Desmos) {
        create();
      } else if (!document.getElementById("desmos-script")) {
        const script = document.createElement("script");
        script.id = "desmos-script";
        script.src =
          "https://www.desmos.com/api/v1.8/calculator.js?apiKey=b7f43827f4544c6ca4861c278c3727a8";
        script.async = true;
        script.onload = create;
        document.body.appendChild(script);
      } else {
        document.getElementById("desmos-script").addEventListener("load", create, { once: true });
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      destroyCalculator();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  const handleOpenChange = (open) => {
    if (!open && calculatorInst.current) {
      try {
        const dataUrl = calculatorInst.current.screenshot({
          width: 400,
          height: 400,
          targetPixelRatio: 2,
        });
        setPreviewImage(dataUrl);
      } catch (e) {
        console.error("Failed to capture Desmos snapshot:", e);
      }
    }
    setIsDialogOpen(open);
  };

  const handleEquationChange = (newLatex) => {
    setEquation(newLatex);
    calculatorInst.current?.setExpression({ id: "eq1", latex: newLatex });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, overflow: "hidden" }}>
        {previewImage ? (
          <img
            src={previewImage}
            alt="Your graph"
            style={{ maxWidth: "100px", maxHeight: "100%", objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        ) : (
          <span style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
            Click the expand icon below to start graphing
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={() => handleOpenChange(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
            border: "1px solid #e5e7eb", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#4441c4",
          }}
          title="Maximize Graph"
        >
          <Maximize2 size={16} />
        </button>

        <button
          onClick={() => onAddToAIChat?.(previewImage)}
          disabled={!previewImage}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            border: "1px solid #e5e7eb", borderRadius: 8, background: "transparent",
            cursor: previewImage ? "pointer" : "not-allowed", opacity: previewImage ? 1 : 0.5,
            fontSize: 12, fontWeight: 600, color: "#4441c4",
          }}
          title="Send to Chat Workspace"
        >
          <Bot size={14} />
          <ArrowRight size={14} />
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="!w-[80vw] !max-w-7xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Graph Toolboard</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#4338ca", background: "#ede9ff", padding: "8px", borderRadius: "8px" }}>
                <FunctionSquare size={18} />
              </div>
              <div style={{ flex: 1, maxWidth: "400px" }}>
                <MathQuillInput value={equation} onChange={handleEquationChange} />
              </div>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Use the keypad or type e.g. x^2, sqrt, /
              </span>
            </div>
          </div>

          <div
            ref={graphRef}
            style={{ flex: 1, minHeight: 400, width: "100%", overflow: "hidden", background: "#ffffff" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GraphTool;