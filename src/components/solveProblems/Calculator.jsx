import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Maximize2, Delete } from "lucide-react";

const TOKEN = {
  primary: "#4441c4",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464554",
  outlineVariant: "#c7c4d6",
  surfaceContainerLow: "#f2f4f6",
};

// ── Calculation engine: immediate execution, no eval() ──
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

const Calculator = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOp, setPendingOp] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [lastResult, setLastResult] = useState(null);
  const [isDegrees, setIsDegrees] = useState(true);

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

  const toggleSign = () => {
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? prev : "-" + prev));
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
    setLastResult(result);
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
  };

  // ── Scientific single-input functions ──
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
      case "pct": result = current / 100; break;
      case "pi": result = Math.PI; break;
      case "e": result = Math.E; break;
      default: result = current;
    }

    setDisplay(String(result));
    setLastResult(result);
    setOverwrite(true);
  };

  const btnStyle = (variant = "default") => ({
    padding: "12px 0",
    borderRadius: 10,
    border: `1px solid ${TOKEN.outlineVariant}`,
    background:
      variant === "op" ? `${TOKEN.primary}1A` :
      variant === "equals" ? TOKEN.primary :
      variant === "fn" ? TOKEN.surfaceContainerLow :
      "#fff",
    color:
      variant === "equals" ? "#fff" :
      variant === "op" ? TOKEN.primary :
      TOKEN.onSurface,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.1s",
  });

  const buttonRows = [
    [{ l: "sin", type: "fn" }, { l: "cos", type: "fn" }, { l: "tan", type: "fn" }, { l: "C", type: "fn", act: clearAll }],
    [{ l: "x²", type: "fn" }, { l: "√", type: "fn" }, { l: "log", type: "fn" }, { l: "⌫", type: "fn", act: backspace }],
    [{ l: "ln", type: "fn" }, { l: "π", type: "fn" }, { l: "e", type: "fn" }, { l: "÷", type: "op" }],
    [{ l: "7" }, { l: "8" }, { l: "9" }, { l: "×", type: "op" }],
    [{ l: "4" }, { l: "5" }, { l: "6" }, { l: "-", type: "op" }],
    [{ l: "1" }, { l: "2" }, { l: "3" }, { l: "+", type: "op" }],
    [{ l: "1/x", type: "fn" }, { l: "0" }, { l: ".", }, { l: "=", type: "equals" }],
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      {/* Preview: last computed result */}
      <div
        onClick={() => setIsDialogOpen(true)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          cursor: "pointer",
        }}
      >
        {lastResult !== null ? (
          <>
            <span style={{ fontSize: 11, color: TOKEN.onSurfaceVariant, fontWeight: 600, textTransform: "uppercase" }}>
              Last Result
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, color: TOKEN.onSurface, marginTop: 4 }}>
              {lastResult}
            </span>
          </>
        ) : (
          <span style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
            Click the expand icon below to calculate
          </span>
        )}
      </div>

      {/* Bottom action row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
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
            color: TOKEN.primary,
          }}
          title="Open Calculator"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Calculator dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!w-[90vw] !max-w-sm p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Calculator</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div style={{ padding: 16 }}>
            {/* Degrees / Radians toggle */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
              <button
                onClick={() => setIsDegrees((d) => !d)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${TOKEN.outlineVariant}`,
                  background: TOKEN.surfaceContainerLow,
                  color: TOKEN.primary,
                  cursor: "pointer",
                }}
              >
                {isDegrees ? "DEG" : "RAD"}
              </button>
            </div>

            {/* Display */}
            <div
              style={{
                background: TOKEN.surfaceContainerLow,
                borderRadius: 10,
                padding: "16px 14px",
                textAlign: "right",
                fontSize: 28,
                fontWeight: 700,
                color: TOKEN.onSurface,
                marginBottom: 14,
                overflowX: "auto",
                whiteSpace: "nowrap",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {display}
            </div>

            {/* Button grid */}
            <div style={{ display: "grid", gridTemplateRows: `repeat(${buttonRows.length}, 1fr)`, gap: 8 }}>
              {buttonRows.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {row.map((btn, j) => (
                    <button key={j} onClick={() => handlePress(btn)} style={btnStyle(btn.type)}>
                      {btn.l}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calculator;