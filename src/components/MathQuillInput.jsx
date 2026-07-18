// import { useEffect, useRef } from "react";
// import $ from "jquery";
// import "mathquill/build/mathquill.css";

// // Load MathQuill (+ its jQuery global requirement) exactly once for the whole app,
// // no matter how many MathQuillInput instances mount/unmount.
// let mqLoadPromise = null;

// function loadMathQuill() {
//   if (mqLoadPromise) return mqLoadPromise;

//   // MathQuill's UMD build reads window.jQuery / window.$ at the moment its
//   // top-level code evaluates — which happens as soon as the dynamic import
//   // resolves the module, BEFORE any .then() callback runs. So these must be
//   // set synchronously, before calling import(), not inside the .then().
//   const hadJQuery = "jQuery" in window;
//   const prevJQuery = window.jQuery;
//   const prevDollar = window.$;

//   window.jQuery = $;
//   window.$ = $;

//   mqLoadPromise = import("mathquill/build/mathquill.js").then(() => {
//     const MQ = window.MathQuill.getInterface(2);

//     // Now that MathQuill has grabbed what it needs, put the globals back
//     // the way they were so nothing else on the page is affected.
//     if (hadJQuery) {
//       window.jQuery = prevJQuery;
//       window.$ = prevDollar;
//     } else {
//       delete window.jQuery;
//       delete window.$;
//     }

//     return MQ;
//   });

//   return mqLoadPromise;
// }

// export default function MathQuillInput({ value, onChange }) {
//   const mathFieldRef = useRef(null);
//   const mqInstance = useRef(null);

//   useEffect(() => {
//     let cancelled = false;

//     loadMathQuill().then((MQ) => {
//       if (cancelled || !mathFieldRef.current || mqInstance.current) return;

//       mqInstance.current = MQ.MathField(mathFieldRef.current, {
//         // Typing these words auto-converts them into their symbol/command
//         // (e.g. typing "sqrt" produces an actual radical, not literal text)
//         autoCommands: "pi theta sqrt sum prod alpha beta gamma infinity",
//         // Typing these words auto-converts into non-italicized operator names
//         autoOperatorNames: "sin cos tan sec csc cot ln log lim min max",
//         handlers: {
//           edit: function () {
//             if (onChange) {
//               onChange(mqInstance.current.latex());
//             }
//           },
//         },
//       });

//       if (value) {
//         mqInstance.current.latex(value);
//       }
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // Handle external value changes (like clicking a MathKeyboardTool button)
//   useEffect(() => {
//     if (mqInstance.current && value !== mqInstance.current.latex()) {
//       mqInstance.current.latex(value || "");
//     }
//   }, [value]);

//   return (
//     <div
//       ref={mathFieldRef}
//       style={{
//         display: "block",
//         width: "100%",
//         minWidth: "150px",
//         padding: "8px",
//         background: "#fff",
//         border: "1px solid #ccc",
//         borderRadius: "4px",
//       }}
//     />
//   );
// }
import { useEffect, useRef } from "react";
import $ from "jquery";
import "mathquill/build/mathquill.css";

let mqLoadPromise = null;

function loadMathQuill() {
  if (mqLoadPromise) return mqLoadPromise;

  const hadJQuery = "jQuery" in window;
  const prevJQuery = window.jQuery;
  const prevDollar = window.$;

  window.jQuery = $;
  window.$ = $;

  mqLoadPromise = import("mathquill/build/mathquill.js").then(() => {
    const MQ = window.MathQuill.getInterface(2);
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

  // Always call the LATEST onChange, even though the MathField's
  // `edit` handler is registered only once at mount.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Tracks the last latex string WE emitted via onChange, so the
  // external-sync effect below can tell "this value prop update is
  // just an echo of what the user typed" apart from "this value prop
  // update came from somewhere else (e.g. a keypad button)".
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    let cancelled = false;

    loadMathQuill().then((MQ) => {
      if (cancelled || !mathFieldRef.current || mqInstance.current) return;

      mqInstance.current = MQ.MathField(mathFieldRef.current, {
        autoCommands: "pi theta sqrt sum prod alpha beta gamma infinity",
        autoOperatorNames: "sin cos tan sec csc cot ln log lim min max",
        handlers: {
          edit: function () {
            const latex = mqInstance.current.latex();
            lastEmittedRef.current = latex;
            onChangeRef.current?.(latex);
          },
        },
      });

      if (value) {
        mqInstance.current.latex(value);
        lastEmittedRef.current = value;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Only push an external value into MathQuill when it DIDN'T
  // originate from this component's own `edit` handler — otherwise
  // we're fighting the user's own typing every keystroke.
  useEffect(() => {
    if (!mqInstance.current) return;
    if (value === lastEmittedRef.current) return;
    if (value !== mqInstance.current.latex()) {
      mqInstance.current.latex(value || "");
      lastEmittedRef.current = value;
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