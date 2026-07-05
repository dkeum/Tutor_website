import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const Test = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>LaTeX Rendering Test</h2>
      <hr />

      <h3>1. Inline Math Test</h3>
      <p>
        The famous mass-energy equivalence formula is written as <InlineMath math="E = mc^2" /> within a normal sentence.
      </p>

      <hr />

      <h3>2. Block Math (Standalone) Test</h3>
      <p>Below is a standalone quadratic formula equation:</p>
      <BlockMath math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
    </div>
  );
};

export default Test;