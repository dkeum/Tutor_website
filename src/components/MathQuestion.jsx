import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathQuestion = ({ text }) => {
  if (!text) return null;

  const parts = [];
  // Updated regex to include $$ and $ delimiters
  const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    
    // Check if the match is a block type (either \[ or $$)
    const isBlock = match[0].startsWith("\\[") || match[0].startsWith("$$");
    
    // The actual math content will be in one of the 4 capture groups
    const content = match[1] ?? match[2] ?? match[3] ?? match[4];
    
    parts.push({ type: "math", content: content, block: isBlock });
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