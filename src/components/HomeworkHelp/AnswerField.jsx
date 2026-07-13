import React, { useRef } from 'react'
import { TOKEN } from './HomeWorkSolveProblems'
import { Loader2 } from 'lucide-react'

import MathKeyboardTool from '../solveProblems/MathKeyboardTool'
import MathQuillInput from '../MathQuillInput';


const AnswerField = ({ handleNextOrSubmit, isLastQuestion, latex, setLatex, isSubmitting }) => {
    const insertLatex = (latexStr) => {
        setLatex((prev) => prev + latexStr);
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
                    <MathQuillInput
                        value={latex}
                        onChange={(newLatex) => setLatex(newLatex)}
                    />
                </div>
                <button
                    className="sp-btn-primary"
                    onClick={handleNextOrSubmit}
                    disabled={isSubmitting}
                    style={{ flexShrink: 0, marginTop: 20, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            {isLastQuestion ? "Submitting..." : "Checking..."}
                        </>
                    ) : (
                        <>
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
                        </>
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