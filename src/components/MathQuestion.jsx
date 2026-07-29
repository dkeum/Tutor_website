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
  const regex =
    /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    const isBlock = match[0].startsWith("\\[") || match[0].startsWith("$$");
    const content = match[1] ?? match[2] ?? match[3] ?? match[4];

    parts.push({ type: "math", content, block: isBlock });
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