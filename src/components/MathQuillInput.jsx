import { useEffect, useRef } from "react";
import $ from "jquery";
import "mathquill/build/mathquill.css";

// Load MathQuill (+ its jQuery global requirement) exactly once for the whole app,
// no matter how many MathQuillInput instances mount/unmount.
let mqLoadPromise = null;

function loadMathQuill() {
  if (mqLoadPromise) return mqLoadPromise;

  // MathQuill's UMD build reads window.jQuery / window.$ at the moment its
  // top-level code evaluates — which happens as soon as the dynamic import
  // resolves the module, BEFORE any .then() callback runs. So these must be
  // set synchronously, before calling import(), not inside the .then().
  const hadJQuery = "jQuery" in window;
  const prevJQuery = window.jQuery;
  const prevDollar = window.$;

  window.jQuery = $;
  window.$ = $;

  mqLoadPromise = import("mathquill/build/mathquill.js").then(() => {
    const MQ = window.MathQuill.getInterface(2);

    // Now that MathQuill has grabbed what it needs, put the globals back
    // the way they were so nothing else on the page is affected.
    if (hadJQuery) {
      window.jQuery = prevJQuery;
      window.$ = prevDollar;
    } else {
      delete window.jQuery;
      delete window.$;
    }

    return MQ;
  });

  return mqLoadPromise;
}

export default function MathQuillInput({ value, onChange }) {
  const mathFieldRef = useRef(null);
  const mqInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadMathQuill().then((MQ) => {
      if (cancelled || !mathFieldRef.current || mqInstance.current) return;

      mqInstance.current = MQ.MathField(mathFieldRef.current, {
        // Typing these words auto-converts them into their symbol/command
        // (e.g. typing "sqrt" produces an actual radical, not literal text)
        autoCommands: "pi theta sqrt sum prod alpha beta gamma infinity",
        // Typing these words auto-converts into non-italicized operator names
        autoOperatorNames: "sin cos tan sec csc cot ln log lim min max",
        handlers: {
          edit: function () {
            if (onChange) {
              onChange(mqInstance.current.latex());
            }
          },
        },
      });

      if (value) {
        mqInstance.current.latex(value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle external value changes (like clicking a MathKeyboardTool button)
  useEffect(() => {
    if (mqInstance.current && value !== mqInstance.current.latex()) {
      mqInstance.current.latex(value || "");
    }
  }, [value]);

  return (
    <div
      ref={mathFieldRef}
      style={{
        display: "block",
        width: "100%",
        minWidth: "150px",
        padding: "8px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
}