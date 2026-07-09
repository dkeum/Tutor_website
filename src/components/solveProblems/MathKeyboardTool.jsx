import React, { useState } from "react";
import { TOKEN } from "../../pages/SolveProblems";
import { Sigma, Divide, Triangle, GitCompare, Infinity as InfinityIcon } from "lucide-react";

// ── Each key: label shown on the button, latex written into the field on click ──
// {} in latex renders as an empty dashed box the student clicks into and fills.
const CATEGORIES = {
  basic: {
    label: "Basic",
    icon: Divide,
    keys: [
      { label: "x²", latex: "x^{2}" },
      { label: "xⁿ", latex: "x^{}" },
      {
        label: (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
            <span>□</span>
            <span style={{ width: 12, height: 1, background: "#000000", margin: "2px 0" }} />
            <span>□</span>
          </span>
        ), latex: "\\frac{}{}"
      },
      { label: "√", latex: "\\sqrt{}" },
      { label: "ⁿ√", latex: "\\sqrt[]{}" },
      { label: "|x|", latex: "\\left|\\right|" },
      { label: "π", latex: "\\pi" },
      { label: "±", latex: "\\pm" },
      { label: "°", latex: "^{\\circ}" },
      { label: "x!", latex: "!" },
      { label: "log", latex: "\\log_{}\\left(\\right)" },
      { label: "ln", latex: "\\ln\\left(\\right)" },
    ],
  },
  trig: {
    label: "Trig",
    icon: Triangle,
    keys: [
      { label: "sin", latex: "\\sin\\left(\\right)" },
      { label: "cos", latex: "\\cos\\left(\\right)" },
      { label: "tan", latex: "\\tan\\left(\\right)" },
      { label: "csc", latex: "\\csc\\left(\\right)" },
      { label: "sec", latex: "\\sec\\left(\\right)" },
      { label: "cot", latex: "\\cot\\left(\\right)" },
      { label: "sin⁻¹", latex: "\\sin^{-1}\\left(\\right)" },
      { label: "cos⁻¹", latex: "\\cos^{-1}\\left(\\right)" },
      { label: "tan⁻¹", latex: "\\tan^{-1}\\left(\\right)" },
      { label: "θ", latex: "\\theta" },
    ],
  },
  calculus: {
    label: "Calc",
    icon: Sigma,
    keys: [
      { label: "d/dx", latex: "\\frac{d}{dx}\\left(\\right)" },
      { label: "∫", latex: "\\int\\left(\\right)dx" },
      { label: "∫ₐᵇ", latex: "\\int_{}^{}\\left(\\right)dx" },
      { label: "lim", latex: "\\lim_{x\\to}\\left(\\right)" },
      { label: "∞", latex: "\\infty" },
      { label: "Σ", latex: "\\sum_{}^{}" },
      { label: "e^x", latex: "e^{}" },
      { label: "f'(x)", latex: "f'\\left(x\\right)" },
    ],
  },
  compare: {
    label: "Compare",
    icon: GitCompare,
    keys: [
      { label: "≤", latex: "\\le" },
      { label: "≥", latex: "\\ge" },
      { label: "≠", latex: "\\ne" },
      { label: "<", latex: "<" },
      { label: ">", latex: ">" },
      { label: "×", latex: "\\times" },
      { label: "÷", latex: "\\div" },
      { label: "→", latex: "\\to" },
    ],
  },
};

const MathKeyboardTool = ({ insertLatex }) => {
  const [activeCategory, setActiveCategory] = useState("basic");
  const category = CATEGORIES[activeCategory];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "8px 10px",
          borderBottom: `1px solid ${TOKEN.outlineVariant}`,
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 6,
                border: `1px solid ${isActive ? TOKEN.primary : TOKEN.outlineVariant}`,
                background: isActive ? `${TOKEN.primary}1A` : "transparent",
                color: isActive ? TOKEN.primary : TOKEN.onSurfaceVariant,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <CatIcon size={12} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Key grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
          gap: 6,
          alignContent: "start",
        }}
      >
        {category.keys.map((key, i) => (
          <button
            key={i}
            onClick={() => insertLatex?.(key.latex)}
            title={key.label}
            style={{
              padding: "8px 4px",
              borderRadius: 8,
              border: `1px solid ${TOKEN.outlineVariant}`,
              background: "#fff",
              color: TOKEN.onSurface,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${TOKEN.primary}0D`;
              e.currentTarget.style.borderColor = TOKEN.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = TOKEN.outlineVariant;
            }}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MathKeyboardTool;