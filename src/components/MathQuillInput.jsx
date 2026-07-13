import { useEffect, useRef } from "react";
import $ from "jquery";
import "mathquill/build/mathquill.css"; // CSS is perfectly fine to import normally

export default function MathQuillInput({ value, onChange }) {
  const mathFieldRef = useRef(null);
  const mqInstance = useRef(null);

  useEffect(() => {
    // 1. Inject jQuery into the window FIRST
    window.jQuery = $;
    window.$ = $;

    // 2. Dynamically import the MathQuill JS file SECOND
    // This forces it to evaluate only after jQuery exists
    import("mathquill/build/mathquill.js").then(() => {
      // 3. Now it is safe to grab the interface
      const MQ = window.MathQuill.getInterface(2);

      // Initialize the math field
      if (mathFieldRef.current && !mqInstance.current) {
        mqInstance.current = MQ.MathField(mathFieldRef.current, {
          handlers: {
            edit: function () {
              if (onChange) {
                onChange(mqInstance.current.latex());
              }
            },
          },
        });

        // Set the initial value if one was passed in
        if (value) {
          mqInstance.current.latex(value);
        }
      }
    });
  }, []); // Empty dependency array ensures this setup only runs once

  // 4. Handle external value changes (like clicking your MathKeyboardTool)
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