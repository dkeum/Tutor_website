import React, { useRef } from 'react'
import { TOKEN } from '../../pages/SolveProblems'
import { EditableMathField } from 'react-mathquill'
import MathKeyboardTool from './MathKeyboardTool'

const AnswerField = ({ handleNextOrSubmit, isLastQuestion, latex, setLatex }) => {
    const mathFieldRef = useRef(null);

    const insertLatex = (latexStr) => {
        if (!mathFieldRef.current) return;
        mathFieldRef.current.write(latexStr);
        mathFieldRef.current.focus();
    };

    return (
        <div
            style={{
                borderTop: `1px solid ${TOKEN.outlineVariant}`,
                background: TOKEN.surfaceContainerLow,
            }}
        >
            <div
                style={{
                    padding: "16px 24px 12px 32px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <div style={{ flex: 1 }}>
                    <label
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: TOKEN.onSurfaceVariant,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            display: "block",
                            marginBottom: 6,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        Your Answer
                    </label>
                    <EditableMathField
                        latex={latex}
                        onChange={(mf) => setLatex(mf.latex())}
                        mathquillDidMount={(mathField) => {
                            mathFieldRef.current = mathField;
                        }}
                        style={{
                            minWidth: 280,
                            minHeight: 44,
                            textAlign: "left",
                        }}
                    />
                </div>
                <button
                    className="sp-btn-primary"
                    onClick={handleNextOrSubmit}
                    style={{ flexShrink: 0, marginTop: 20 }}
                >
                    {isLastQuestion ? "Submit" : "Next"}
                    {!isLastQuestion && (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    )}
                </button>
            </div>

            <div
                style={{
                    borderTop: `1px solid ${TOKEN.outlineVariant}`,
                    maxHeight: 160,
                    padding: "0 24px 12px 32px",
                }}
            >
                <MathKeyboardTool insertLatex={insertLatex} />
            </div>
        </div>
    )
}

export default AnswerField