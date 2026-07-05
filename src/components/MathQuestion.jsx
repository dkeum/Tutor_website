import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathQuestion = ({ text }) => {
  if (!text) return null;

  const parts = [];
  const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const isBlock = match[0].startsWith("\\[");
    parts.push({ type: "math", content: match[1] ?? match[2], block: isBlock });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return (
    <span>
      {parts.map((part, i) =>
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
};

export default MathQuestion;
