import React from "react";
import "katex/dist/katex.min.css";
import MathQuestion from "../components/MathQuestion";

const sampleQuestions = [
  "Simplify: $\\frac{2x + 6}{x^2 - 9} \\cdot \\frac{x - 3}{2}$",
  "\\(\\frac{x^2 - 9}{x} \\cdot \\frac{2x}{x - 3}\\)",
  "$\\frac{x+5}{6} \\cdot \\frac{12}{x+5}$",
  "\\(\\frac{x^2 - 16}{3x + 12} * \\frac{6}{x - 4}\\)",
  "$\\frac{2x}{3} \\cdot \\frac{6}{x}$",
  "Simplify $ \\frac{a^7b^6c}{35ab^9} $",
  "Simplify $\\frac{54n}{n^2 - 11n + 30} \\cdot \\frac{n^2 - 12n + 35}{n - 7}$",
  "Simplify: $\\frac{x^2 - 2x - 8}{x^2 - 9} \\cdot \\frac{x + 3}{x - 4}$",
  "Simplify: $\\left(\\frac{3x^2}{y^3}\\right) \\times \\left(\\frac{y}{6x}\\right)$",
  "$\\frac{x^2}{y} \\cdot \\frac{y^2}{x}$",
  "Is $\\sqrt{7}$ rational or irrational?",
  "\\fracx+56\\cdot\\frac12x+5", // the known-bad unwrapped one, for comparison
];

const Test = () => {
  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 24 }}>KaTeX Render Test</h1>
      {sampleQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
            Raw: <code>{q}</code>
          </div>
          <div style={{ fontSize: 16 }}>
            <MathQuestion text={q} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Test;