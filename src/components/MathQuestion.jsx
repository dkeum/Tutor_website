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

const MathQuestion = ({ text }) => {
  if (!text) return null;

  const parts = [];
  // Regex to match existing LaTeX block and inline math delimiters
  const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let lastIndex = 0;
  let match;

  // --- PASS 1: Separate explicit math blocks and plain text ---
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    const isBlock = match[0].startsWith("\\[") || match[0].startsWith("$$");
    let content = match[1] ?? match[2] ?? match[3] ?? match[4];

    // Replace slashes inside explicit math blocks with \frac{}{}
    // This captures elements like a^{-4}, 5^6, w^{(5x)} on either side of the slash
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

  // --- PASS 2: Process plain text parts to catch unformatted ^ and / ---
  const finalParts = [];

  parts.forEach((part) => {
    if (part.type === "math") {
      finalParts.push(part);
    } else {
      let subText = part.content;
      // Match unformatted powers (e.g., 2^32) or fractions (e.g., bytes/sec) in plain text
      const inlineMathRegex = /([a-zA-Z0-9_]+)\^([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*\/\s*([a-zA-Z0-9_]+)/g;

      let subLastIndex = 0;
      let subMatch;

      while ((subMatch = inlineMathRegex.exec(subText)) !== null) {
        if (subMatch.index > subLastIndex) {
          finalParts.push({ type: "text", content: subText.slice(subLastIndex, subMatch.index) });
        }

        if (subMatch[1] && subMatch[2]) {
          // Render raw text "a^b" as an inline math power
          finalParts.push({ type: "math", content: `${subMatch[1]}^${subMatch[2]}`, block: false });
        } else if (subMatch[3] && subMatch[4]) {
          // Render raw text "a/b" as an inline math fraction
          finalParts.push({ type: "math", content: `\\frac{${subMatch[3]}}{${subMatch[4]}}`, block: false });
        }

        subLastIndex = subMatch.index + subMatch[0].length;
      }

      if (subLastIndex < subText.length) {
        finalParts.push({ type: "text", content: subText.slice(subLastIndex) });
      }
    }
  });

  return (
    <span>
      {finalParts.map((part, i) =>
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