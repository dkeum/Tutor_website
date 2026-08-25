import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const InlineMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const BlockMath = ({ math }) => {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const ENGLISH_CONNECTOR_WORDS = /\b(to|per|for|of|and|or|is|are|the|a|an|in|on|at|with|from|by|as|you|your|will|would|need)\b/i;

const looksLikeMath = (content) => {
  const trimmed = content.trim();
  if (!trimmed) return false;

  if (/\\[a-zA-Z]+/.test(trimmed)) return true;

  const MATH_OPERATOR_PATTERN = /[a-zA-Z0-9]\s*[\^*/]\s*[a-zA-Z0-9]/;
  if (MATH_OPERATOR_PATTERN.test(trimmed) && trimmed.length <= 40) {
    if (/\.\s/.test(trimmed)) return false;
    if (/[a-zA-Z]{4,}\s+[a-zA-Z]{4,}\s+[a-zA-Z]{4,}/.test(trimmed)) return false;
    return true;
  }

  if (ENGLISH_CONNECTOR_WORDS.test(trimmed)) return false;
  if (/\.\s/.test(trimmed)) return false;
  if (/[a-zA-Z]{4,}\s+[a-zA-Z]{4,}\s+[a-zA-Z]{4,}/.test(trimmed)) return false;
  if (trimmed.length > 40) return false;
  return true;
};

const parseMathParts = (text) => {
  if (!text) return [];

  const parts = [];
  const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    const isSingleDollar = match[4] !== undefined;
    const isBlock = match[0].startsWith("\\[") || match[0].startsWith("$$");
    let content = match[1] ?? match[2] ?? match[3] ?? match[4];

    if (isSingleDollar && !looksLikeMath(content)) {
      parts.push({ type: "text", content: match[0] });
      lastIndex = match.index + match[0].length;
      continue;
    }

    content = content.replace(
      /([a-zA-Z0-9_^{}()\.\+\-]+)\s*\/\s*([a-zA-Z0-9_^{}()\.\+\-]+)/g,
      '\\frac{$1}{$2}'
    );

    parts.push({ type: "math", content, block: isBlock });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  const finalParts = [];
  parts.forEach((part) => {
    if (part.type === "math") {
      finalParts.push(part);
      return;
    }

    let subText = part.content;
    const inlineMathRegex = /([a-zA-Z0-9_]+)\^([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*\/\s*([a-zA-Z0-9_]+)/g;
    let subLastIndex = 0;
    let subMatch;

    while ((subMatch = inlineMathRegex.exec(subText)) !== null) {
      if (subMatch.index > subLastIndex) {
        finalParts.push({ type: "text", content: subText.slice(subLastIndex, subMatch.index) });
      }

      if (subMatch[1] && subMatch[2]) {
        finalParts.push({ type: "math", content: `${subMatch[1]}^${subMatch[2]}`, block: false });
      } else if (subMatch[3] && subMatch[4]) {
        finalParts.push({ type: "math", content: `\\frac{${subMatch[3]}}{${subMatch[4]}}`, block: false });
      }

      subLastIndex = subMatch.index + subMatch[0].length;
    }

    if (subLastIndex < subText.length) {
      finalParts.push({ type: "text", content: subText.slice(subLastIndex) });
    }
  });

  return finalParts;
};

const MathText = ({ text }) => (
  <span>
    {parseMathParts(text).map((part, i) =>
      part.type === "text" ? (
        <span key={i}>{part.content}</span>
      ) : part.block ? (
        <BlockMath key={i} math={part.content} />
      ) : (
        <InlineMath key={i} math={part.content} />
      )
    )}
  </span>
);

// NEW — brand purple, matches TOKEN.primary in SolveProblems.jsx.
// Hardcoded here rather than imported to keep this component standalone;
// pass an `accentColor` prop instead if you want it to track TOKEN centrally.
const ACCENT = "#4441c4";

// options: the jsonb array from `question.options`, shape
// [{ label: "A", text: "..." }, ...]. onSelect/selected are optional,
// pass them if you want the buttons to track the student's pick.
const MathQuestion = ({ text, multiplechoice, options, onSelect, selected, accentColor = ACCENT }) => {

  if (!text) return null;

  return (
    <div>
      <MathText text={text} />

      {multiplechoice && Array.isArray(options) && options.length > 0 && (
        // NEW — pointer-events-auto: the parent Carousel sets
        // pointer-events-none (so drag/swipe works), which was silently
        // eating every click on these buttons. This overrides it locally
        // so the options are actually clickable.
        <div className="mt-4 flex flex-col gap-2 pointer-events-auto">
          {options.map((opt) => {
            const isSelected = selected === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSelect?.(opt.label)}
                className="text-left px-3 py-2 rounded-md border transition-colors"
                style={{
                  borderColor: isSelected ? accentColor : "#e5e7eb",
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: isSelected ? `${accentColor}0D` : "transparent", // ~5% tint
                  boxShadow: isSelected ? `0 0 0 2px ${accentColor}26` : "none", // ~15% ring
                }}
              >
                <span className="font-semibold mr-2" style={{ color: isSelected ? accentColor : undefined }}>
                  {opt.label}.
                </span>
                <MathText text={opt.text} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MathQuestion;