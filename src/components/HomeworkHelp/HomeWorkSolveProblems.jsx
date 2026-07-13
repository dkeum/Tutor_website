"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SolveProblems_stepbystep from "../solveProblems/SolveProblems_stepbystep";
import { Loader2, X } from "lucide-react";
import LoggedInLayout from "../LoggedInLayout";
import MathQuestion from "../MathQuestion";
import AISidebar from "./AISidebar";
import DropDownTool from "../solveProblems/DropDownTool";
import { TOOL_REGISTRY } from "../solveProblems/toolRegistry";
import AnswerField from "./AnswerField";
import { useDispatch } from "react-redux";
import { supabase } from "../../db/supabaseclient";
import { setCredits } from "../../features/auth/personDetails";
import axios from "axios";

const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

const STORAGE_BUCKET = "Mathmagick image attachments";

// Upload a Blob/File to Supabase Storage and return its public URL + path (for later cleanup)
const uploadImageToStorage = async (blob, userId, extHint = "jpeg") => {
  const fileExt = (blob.type && blob.type.split("/")[1]) || extHint;
  const filePath = `${userId}/image-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blob, { contentType: blob.type || "image/jpeg" });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throw new Error("Failed to upload image.");
  }

  const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return { publicUrl: publicUrlData.publicUrl, filePath };
};

const deleteImageFromStorage = async (filePath) => {
  if (!filePath) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  if (error) console.error("Failed to clean up temporary image:", error);
};

// ─── Design tokens ────────────────────────────────────────────────────────────
export const TOKEN = {
  primary: "#4441c4",
  primaryContainer: "#5d5cde",
  onPrimary: "#ffffff",
  tertiary: "#632ecd",
  tertiaryContainer: "#7c4ce6",
  onTertiary: "#ffffff",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464554",
  outlineVariant: "#c7c4d6",
  outline: "#777585",
  secondary: "#974800",
  secondaryContainer: "#fc8f40",
};

export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');

  .sp-root { font-family: 'Work Sans', sans-serif; color: ${TOKEN.onSurface}; }
  .sp-headline { font-family: 'Hanken Grotesk', sans-serif; }
  .sp-mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.05em; font-weight: 500; }

  .sp-card { box-shadow: 0 4px 24px rgba(0,0,0,0.04); }

  .sp-btn-primary {
    background: ${TOKEN.primary}; color: ${TOKEN.onPrimary};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 700; font-size: 14px;
    padding: 12px 28px; border-radius: 12px;
    box-shadow: 0 4px 16px rgba(68,65,196,0.18);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;
  }
  .sp-btn-primary:hover { opacity: 0.92; transform: scale(1.02); }
  .sp-btn-primary:active { transform: scale(0.97); }

  .sp-btn-outline {
    background: transparent; color: ${TOKEN.primary};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 13px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid ${TOKEN.outlineVariant};
    cursor: pointer; transition: background 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .sp-btn-outline:hover { background: rgba(68,65,196,0.05); }
  .sp-btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }

  .mq-editable-field { min-height: 44px !important; padding: 8px 12px !important; border-radius: 10px !important; border: 1px solid ${TOKEN.outlineVariant} !important; font-size: 15px !important; }
  .mq-editable-field.mq-focused { border-color: ${TOKEN.primary} !important; box-shadow: 0 0 0 2px rgba(68,65,196,0.15) !important; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-icon { animation: spin 0.8s linear infinite; }

  @media (max-width: 768px) {
    .sp-ai-sidebar { display: none; }
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
const HomeWorkSolveProblems = ({ file }) => {
  const dispatch = useDispatch();

  const [latex, setLatex] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingMain, setIsSubmittingMain] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isReadingQuestion, setIsReadingQuestion] = useState(true);
  const [readError, setReadError] = useState(null);

  const [chatAttachments, setChatAttachments] = useState([]);

  const MAX_ACTIVE_TOOLS = 1;
  const [activeTools, setActiveTools] = useState([]);

  const toggleTool = (toolId) => {
    setActiveTools((prev) => {
      if (prev.includes(toolId)) return prev.filter((t) => t !== toolId);
      if (prev.length >= MAX_ACTIVE_TOOLS) {
        const [, ...rest] = prev;
        return [...rest, toolId];
      }
      return [...prev, toolId];
    });
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (!file) return;

    const readQuestionFromImage = async () => {
      // Local dataURL is only used for the on-screen preview — never sent to the backend
      const localPreviewUrl = await fileToDataUrl(file);

      setIsReadingQuestion(true);
      setReadError(null);

      let uploadedPath = null;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) throw new Error("User must be logged in to read a question.");

        const { publicUrl, filePath } = await uploadImageToStorage(file, session.user.id);
        uploadedPath = filePath;

        const res = await axios.post(
          `${getBaseUrl()}/ai/read-question`,
          { imageUrl: publicUrl },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );

        const remainingHeader = res.headers["x-ai-credits-remaining"];
        if (remainingHeader !== undefined) {
          const remaining = Number(remainingHeader);
          if (!Number.isNaN(remaining)) {
            dispatch(setCredits({ ai_credits: remaining }));
          }
        }

        const questionText = (res.data?.question || "").trim();

        setCurrentQuestion({
          id: `homework-${Date.now()}`,
          question: questionText,
          image_url: localPreviewUrl,
        });
      } catch (err) {
        console.error(err?.response?.data || err.message);
        setReadError("Something went wrong.");
      } finally {
        if (uploadedPath) await deleteImageFromStorage(uploadedPath);
        setIsReadingQuestion(false);
      }
    };

    readQuestionFromImage();

    return () => {};
  }, [file]);

  const handleNextOrSubmit_solvetab = async (
    studentAnswerText = "",
    attachedImageUrl = null, // a local dataURL from the step tool (draw/graph/upload)
    isAlreadyCorrect = false
  ) => {
    let isCorrect = isAlreadyCorrect;
    const hasAnswerContent = !!(studentAnswerText?.trim() || attachedImageUrl);

    if (!isAlreadyCorrect) {
      if (!hasAnswerContent) {
        isCorrect = false;
      } else {
        let uploadedPath = null;

        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.user) throw new Error("User must be logged in to verify an answer.");

          let publicImageUrl = null;
          if (attachedImageUrl) {
            const blobResponse = await fetch(attachedImageUrl);
            const blob = await blobResponse.blob();
            const uploaded = await uploadImageToStorage(blob, session.user.id);
            publicImageUrl = uploaded.publicUrl;
            uploadedPath = uploaded.filePath;
          }

          const res = await axios.post(
            `${getBaseUrl()}/ai/verify-answer`,
            {
              question: currentQuestion?.question || "",
              studentAnswerText,
              attachedImageUrl: publicImageUrl,
            },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${session.access_token}` },
            }
          );

          const remainingHeader = res.headers["x-ai-credits-remaining"];
          if (remainingHeader !== undefined) {
            const remaining = Number(remainingHeader);
            if (!Number.isNaN(remaining)) {
              dispatch(setCredits({ ai_credits: remaining }));
            }
          }

          isCorrect = !!res.data.is_correct;
        } catch (err) {
          console.error("Answer verification failed:", err?.response?.data || err.message);
          isCorrect = false;
        } finally {
          if (uploadedPath) await deleteImageFromStorage(uploadedPath);
        }
      }
    }

    setIsDialogOpen(false);
    return isCorrect;
  };

  const handleNextOrSubmit = async () => {
    setIsSubmittingMain(true);
    try {
      await handleNextOrSubmit_solvetab(latex, null);
      setLatex("");
    } finally {
      setIsSubmittingMain(false);
    }
  };

  return (
    <div className="sp-root overflow-y-hidden">
      <style>{styles}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {/* ── Solve Area ── */}
          <section
            style={{
              flex: 1,
              padding: "4px 24px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* Step by Step dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="sp-btn-outline" disabled={isReadingQuestion}>
                    Step by Step
                  </button>
                </DialogTrigger>
                <DialogContent className="min-w-6xl max-h-[700px] sm:h-[400px] lg:h-[600px]">
                  <DialogHeader className="hidden">
                    <DialogTitle>Step by Step</DialogTitle>
                    <DialogDescription />
                  </DialogHeader>
                  <SolveProblems_stepbystep
                    question={currentQuestion}
                    handleNextOrSubmit={handleNextOrSubmit_solvetab}
                    setIsDialogOpen={setIsDialogOpen}
                    isLastQuestion={true}
                    videoStreamUrl={null}
                    isVideoLoading={false}
                    onGenerateVideo={() => {}}
                  />
                </DialogContent>
              </Dialog>

              <DropDownTool
                activeTools={activeTools}
                onToggleTool={toggleTool}
                onOpenAIChat={() => {
                  // if AISidebar exposes a ref/prop to scroll-into-view or focus its chat input, call it here
                }}
              />
            </div>

            {/* Question card */}
            <div
              className="sp-card"
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: 20,
                border: `1px solid ${TOKEN.outlineVariant}`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 4,
                  height: "100%",
                  background: TOKEN.primary,
                  borderRadius: "20px 0 0 20px",
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px 24px 24px 32px",
                  overflow: "hidden",
                }}
              >
                {isReadingQuestion ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: TOKEN.onSurfaceVariant,
                      fontSize: 14,
                    }}
                  >
                    <Loader2 size={18} className="spin-icon" />
                    Reading your question…
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    {readError && (
                      <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 10 }}>
                        {readError}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: TOKEN.onSurface,
                        fontWeight: 500,
                        margin: 0,
                      }}
                    >
                      <MathQuestion text={currentQuestion?.question || ""} />
                    </div>
                    {currentQuestion?.image_url && (
                      <img
                        src={currentQuestion.image_url}
                        alt="Uploaded question"
                        style={{
                          maxHeight: 260,
                          marginTop: 16,
                          borderRadius: 10,
                          border: `1px solid ${TOKEN.outlineVariant}`,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Answer area */}
              <AnswerField
                handleNextOrSubmit={handleNextOrSubmit}
                isLastQuestion={true}
                latex={latex}
                setLatex={setLatex}
                isSubmitting={isSubmittingMain}
              />
            </div>
          </section>

          {/* ── Right Panel: Tools (top) + AI Sidebar (bottom) ── */}
          <div
            className="sp-ai-sidebar"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {activeTools.length > 0 && (
              <div
                style={{
                  flex: "0 0 25%",
                  display: "flex",
                  overflow: "hidden",
                  borderBottom: `1px solid ${TOKEN.outlineVariant}`,
                }}
              >
                {activeTools.map((toolId) => {
                  const tool = TOOL_REGISTRY[toolId];
                  if (!tool) return null;
                  const ToolComponent = tool.component;
                  const ToolIcon = tool.icon;
                  return (
                    <div
                      key={toolId}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRight:
                          activeTools.length > 1 ? `1px solid ${TOKEN.outlineVariant}` : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderBottom: `1px solid ${TOKEN.outlineVariant}`,
                          fontSize: 12,
                          fontWeight: 700,
                          color: TOKEN.onSurfaceVariant,
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <ToolIcon size={14} />
                          {tool.label}
                        </span>
                        <button
                          onClick={() => toggleTool(toolId)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: TOKEN.onSurfaceVariant,
                            display: "flex",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                        <ToolComponent
                          onAddToAIChat={(imageDataUrl) => {
                            setChatAttachments((prev) => {
                              if (prev.includes(imageDataUrl)) return prev;
                              return [...prev, imageDataUrl];
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ flex: activeTools.length > 0 ? "0 0 75%" : "1 1 auto", overflow: "hidden", minHeight: 0 }}>
              <AISidebar
                currentQuestion={currentQuestion}
                onOpenStepByStep={() => setIsDialogOpen(true)}
                compact={activeTools.length > 0}
                attachments={chatAttachments}
                onRemoveAttachment={(indexToRemove) => {
                  setChatAttachments((prev) => prev.filter((_, i) => i !== indexToRemove));
                }}
                onClearAttachments={() => setChatAttachments([])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeWorkSolveProblems;