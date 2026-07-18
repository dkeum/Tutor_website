import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X, Loader2 } from "lucide-react";
import MathQuillInput from "../MathQuillInput";
import StepToolsPanel from "./StepToolPanel";
import axios from "axios";
import { useDispatch } from "react-redux";
import { supabase } from "../../db/supabaseclient";
import { setCredits } from "../../features/auth/personDetails";

const MAX_HINTS_PER_STEP = 3;
const BRAND = "#4441c4";
const BRAND_BORDER = "#c7c4d6";

const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";


const INITIAL_MESSAGES = [
  {
    role: "system",
    content:
      "You are a helpful math assistant. You will help determine if what I write is correct and suggest advice whenever there's an error. Never give the answer but you can confirm whether the final answer is true.",
  },
  {
    role: "system",
    content: `You must answer in this format: \n 
                Answer: <Yes/No/Correct> \n 
                if the answer is yes, the step is valid but not final,
                if the answer is no, the step is invalid,
                if the answer is correct, the final answer to the question has been reached,
                Explanation: <explain> \n`,
  },
];

const SolveProblems_stepbystep = ({
  question,
  handleNextOrSubmit,
  setIsDialogOpen,
  divRef,
  creditsRemaining,
  videoStreamUrl,
  isVideoLoading,
  onGenerateVideo,
  isLastQuestion,
  setUsedAIChat,
}) => {
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([""]);
  const [stepImages, setStepImages] = useState({}); // { [index]: { dataUrl, sourceLabel } }
  const [loadingStep, setLoadingStep] = useState(null);
  const [stepStatus, setStepStatus] = useState({});
  const [errorSteps, setErrorSteps] = useState(new Set());
  const [pulseSteps, setPulseSteps] = useState(new Set());
  const [aiText, setAiText] = useState("The streamed response will go here");

  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const [activeTool, setActiveTool] = useState(null);
  const [hintsUsed, setHintsUsed] = useState({});
  const [hintLoading, setHintLoading] = useState(false);
  const [toolState, setToolState] = useState({}); // { graph: { equation }, draw: {...}, ... }

  const [isSubmitting, setIsSubmitting] = useState(false); // NEW

  const handleHeaderNext = async () => {
    setIsSubmitting(true);
    try {
      // Check if any step was evaluated as "correct" by the AI
      const isAlreadyCorrect = Object.values(stepStatus).includes("correct");

      if (isLastQuestion) {
        // If it's the last question, grab the current step to submit the final answer
        const lastIdx = steps.length - 1;
        const attachedImage = stepImages[lastIdx];
        const studentAnswerText = steps[lastIdx] || "";

        // Pass the isAlreadyCorrect flag as the third argument
        await handleNextOrSubmit(studentAnswerText, attachedImage?.dataUrl || null, isAlreadyCorrect);
        setIsDialogOpen(false);
      } else {
        // If it's just 'Next Question', move forward, but still pass the correct flag
        await handleNextOrSubmit("", null, isAlreadyCorrect);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!question) return;

    // 1. Reset all local state for the new question
    setSteps([""]);
    setStepImages({});
    setLoadingStep(null);
    setStepStatus({});
    setErrorSteps(new Set());
    setPulseSteps(new Set());
    setAiText("The streamed response will go here");
    setActiveTool(null);
    setHintsUsed({});
    setHintLoading(false);
    setToolState({});

    // 2. Set up the fresh chat messages
    const freshMessages = [...INITIAL_MESSAGES];

    if (question.image_url) {
      freshMessages.push({
        role: "user",
        content: [
          { type: "text", text: question.question },
          { type: "image_url", image_url: { url: question.image_url } },
        ],
      });
    } else {
      freshMessages.push({
        role: "user",
        content: `Here is the question: ${question.question}`,
      });
    }

    setMessages(freshMessages);
  }, [question]);

  const handleStepChange = (index, value) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const addStep = () => setSteps((s) => [...s, ""]);

  // NEW: attach an image (from draw/graph/upload) to the current (last) step
  const handleAttachImage = (dataUrl, sourceLabel = "attachment") => {
    if (!dataUrl) return;
    const index = steps.length - 1;
    setStepImages((prev) => ({ ...prev, [index]: { dataUrl, sourceLabel } }));

    // NEW — surface the attachment in the AI chat feed immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        isAttachment: true, // tag so InlineChatTool knows to render this even though it's a "user" message
        content: [
          { type: "text", text: `Attached ${sourceLabel} for step ${index + 1}` },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ]);

    setActiveTool("chat"); // switch to chat so the attachment is visible right away
  };

  const removeStepImage = (index) => {
    setStepImages((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const checkStep = async (index) => {
    const userStep = steps[index];
    const attachedImage = stepImages[index];
    if ((!userStep && !attachedImage) || loadingStep !== null) return;

    setActiveTool("chat");
    setUsedAIChat?.(true);
    setLoadingStep(index);

    const stepText = `Step ${index + 1}: ${userStep ? userStep : `(see attached ${attachedImage.sourceLabel})`
      }`;

    // Format local UI messages
    const stepContent = attachedImage
      ? [
        { type: "text", text: stepText },
        { type: "image_url", image_url: { url: attachedImage.dataUrl } },
      ]
      : stepText;

    const updatedMessages = [...messages, { role: "user", content: stepContent }];
    setMessages(updatedMessages);

    try {
      // 1. Get the session for backend auth and user folder path
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) throw new Error("User must be logged in to check steps.");

      let uploadedFilePath = null;
      let payloadAttachments = [];

      // 2. Upload attachment to Supabase if it exists
      if (attachedImage?.dataUrl) {
        const response = await fetch(attachedImage.dataUrl);
        const blob = await response.blob();
        const fileExt = blob.type.split("/")[1] || "jpeg";

        uploadedFilePath = `${session.user.id}/image-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("Mathmagick image attachments")
          .upload(uploadedFilePath, blob, {
            contentType: blob.type,
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw new Error("Failed to upload image attachment.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("Mathmagick image attachments")
          .getPublicUrl(uploadedFilePath);

        payloadAttachments.push(publicUrlData.publicUrl);
      }

      // Format history array to match the backend expectation
      const history = messages.map((msg) => {
        let textContent = "";
        if (typeof msg.content === "string") {
          textContent = msg.content;
        } else if (Array.isArray(msg.content)) {
          const textPart = msg.content.find((c) => c.type === "text");
          if (textPart) textContent = textPart.text;
        }
        return {
          role: msg.role === "assistant" ? "ai" : msg.role,
          text: textContent
        };
      });

      // 3. Make the API Request
      const res = await axios.post(
        `${getBaseUrl()}/ai/chat`,
        {
          currentQuestion: question,
          history,
          message: stepText,
          attachments: payloadAttachments,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      // 4. Clean up temporary image right away
      if (uploadedFilePath) {
        const { error: deleteError } = await supabase.storage
          .from("Mathmagick image attachments")
          .remove([uploadedFilePath]);

        if (deleteError) {
          console.error("Failed to clean up temporary image:", deleteError);
        }
      }

      // 5. Update Credit Balance from Headers
      const remainingHeader = res.headers["x-ai-credits-remaining"];
      if (remainingHeader !== undefined) {
        const remaining = Number(remainingHeader);
        if (!Number.isNaN(remaining)) {
          dispatch(setCredits({ ai_credits: remaining }));
        }
      }

      // 6. Parse Response content
      const raw = res.data?.text || "";

      const answerMatch = raw.match(/^\s*Answer\s*:\s*(.+)\s*$/im);
      const expMatch = raw.match(/^\s*(?:Explaination|Explanation)\s*:\s*([\s\S]*)$/im);

      const answer = (answerMatch?.[1] || "").trim();
      const explanation = (expMatch?.[1] || raw).trim();
      const normalized = answer.toLowerCase();

      setStepStatus((prev) => ({ ...prev, [index]: normalized }));

      if (normalized === "no") {
        setErrorSteps((prev) => {
          const nextSet = new Set(prev).add(index);
          setPulseSteps((prevPulse) => new Set(prevPulse).add(index));
          setTimeout(() => {
            setPulseSteps((prevPulse) => {
              const newSet = new Set(prevPulse);
              newSet.delete(index);
              return newSet;
            });
          }, 3000);
          return nextSet;
        });
      } else {
        setErrorSteps((prev) => {
          const nextSet = new Set(prev);
          nextSet.delete(index);
          return nextSet;
        });
      }

      setAiText(explanation);
      setMessages((prev) => [...prev, { role: "assistant", content: `Explanation: ${explanation}` }]);
    } catch (err) {
      console.error("AI Error:", err?.response?.data || err.message);
      setAiText("Sorry, I hit an error while checking that step.");
    } finally {
      setLoadingStep(null);
    }
  };

  const requestHint = async () => {
    const index = steps.length - 1;
    const used = hintsUsed[index] || 0;
    if (used >= MAX_HINTS_PER_STEP || hintLoading) return;

    setActiveTool("chat");
    setUsedAIChat?.(true);
    setHintLoading(true);

    const level = used + 1;
    const levelInstruction =
      level === 1
        ? "Give a gentle nudge about which concept or first move applies. Do not write any part of the step for them."
        : level === 2
          ? "Be more specific about which operation or rule to apply next, still without writing the step for them."
          : "Give the most direct hint possible without writing the final expression for this step.";

    const hintText = `The student is stuck on step ${index + 1}. Current input: "${steps[index] || "(empty)"
      }". ${levelInstruction}`;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) throw new Error("User must be logged in to request a hint.");

      // Same history-shaping as checkStep, built from messages BEFORE this hint request
      const history = messages.map((msg) => {
        let textContent = "";
        if (typeof msg.content === "string") {
          textContent = msg.content;
        } else if (Array.isArray(msg.content)) {
          const textPart = msg.content.find((c) => c.type === "text");
          if (textPart) textContent = textPart.text;
        }
        return {
          role: msg.role === "assistant" ? "ai" : msg.role,
          text: textContent,
        };
      });

      const res = await axios.post(
        `${getBaseUrl()}/ai/chat`,
        {
          currentQuestion: question,
          history,
          message: hintText,
          attachments: [],
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

      const raw = res.data?.text || "Sorry, couldn't get a hint right now.";

      setMessages((prev) => [
        ...prev,
        { role: "user", content: hintText },
        { role: "assistant", content: raw },
      ]);
      setHintsUsed((prev) => ({ ...prev, [index]: used + 1 }));
    } catch (err) {
      console.error("Hint error:", err?.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, couldn't get a hint right now." },
      ]);
    } finally {
      setHintLoading(false);
    }
  };




  const lastIndex = steps.length - 1;
  const lastStatus = stepStatus[lastIndex];

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="text-xl font-medium">Step by Step</div>
          <div className="text-sm text-slate-400">Solve step by step with our AI Assistant</div>
        </div>
        <Button onClick={handleHeaderNext} variant="outline" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              {isLastQuestion ? "Submitting..." : "Loading..."}
            </>
          ) : (
            isLastQuestion ? "Submit" : "Next Question"
          )}
        </Button>
      </div>

      <div className="flex-1 p-4 w-full border rounded-lg flex flex-row justify-between my-2 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 overflow-scroll overflow-x-hidden pb-20 pr-3">
          <div
            className="rounded-lg min-h-[70px] flex items-center px-3 text-left"
            style={{ border: `1px solid ${BRAND_BORDER}`, fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            <b>Question:</b>&nbsp; {question?.question}
          </div>

          {question?.image_url && (
            <div
              className="rounded-lg min-h-[200px] max-h-[250px] flex px-3 text-left overflow-hidden"
              style={{ border: `1px solid ${BRAND_BORDER}` }}
            >
              <img src={question.image_url} className="min-h-[200px] max-h-[250px] object-contain" alt="Question" />
            </div>
          )}

          {steps.map((step, index) => {
            const status = stepStatus[index];
            const isChecking = loadingStep === index;
            const isYes = status === "yes";
            const isCorrect = status === "correct";
            const isError = errorSteps.has(index);
            const isPulsing = pulseSteps.has(index);
            const attachedImage = stepImages[index];

            return (
              <div key={index} className="flex flex-col gap-1">
                <div
                  className={`flex justify-between items-center px-3 min-h-[70px] rounded-lg transition-all ${isPulsing ? "animate-pulse" : ""
                    }`}
                  style={{
                    border: isError
                      ? "1px solid #ef4444"
                      : isYes || isCorrect
                        ? `1px solid ${BRAND}`
                        : `1px solid ${BRAND_BORDER}`,
                    fontFamily: "'Hanken Grotesk', sans-serif",
                  }}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2 py-2">
                    <div className="flex-1 min-w-0">
                      <MathQuillInput
                        value={step}
                        onChange={(newLatex) => handleStepChange(index, newLatex)}
                        disabled={isYes || isCorrect}
                      />
                    </div>

                    {attachedImage && (
                      <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
                        <img
                          src={attachedImage.dataUrl}
                          alt={attachedImage.sourceLabel}
                          className="w-full h-full object-cover rounded-md"
                          style={{ border: `1px solid ${BRAND_BORDER}` }}
                        />
                        {!(isYes || isCorrect) && (
                          <button
                            onClick={() => removeStepImage(index)}
                            className="absolute flex items-center justify-center rounded-full"
                            style={{
                              top: -6,
                              right: -6,
                              width: 18,
                              height: 18,
                              background: "#ef4444",
                              color: "#fff",
                            }}
                            title={`Remove ${attachedImage.sourceLabel}`}
                          >
                            <X size={11} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => checkStep(index)}
                    disabled={isChecking || isYes || isCorrect}
                    className="ml-2 px-4 py-2 rounded-lg font-semibold text-[13px] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
                    style={{
                      border: `1px solid ${BRAND_BORDER}`,
                      color: BRAND,
                      background: "transparent",
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {isChecking ? "Checking..." : isYes ? "✓ Good" : isCorrect ? "✓ Final" : isError ? "Try again" : "Check"}
                  </button>
                </div>
              </div>
            );
          })}
          {lastStatus === "yes" ? (
            <Button onClick={addStep} variant="outline" className="w-fit mt-2">
              + Add Step
            </Button>
          ) : null}

        </div>


        {/* Right column: content always on top, toolbar always pinned bottom */}
        <div className="flex flex-col w-1/3 h-full gap-2">
          <div className="flex-1 min-h-0">
            <StepToolsPanel
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onRequestHint={requestHint}
              hintLoading={hintLoading}
              hintsUsedThisStep={hintsUsed[lastIndex] || 0}
              maxHints={MAX_HINTS_PER_STEP}
              creditsRemaining={creditsRemaining}
              onAttachImage={handleAttachImage}
              question={question}
              messages={messages}
              setMessages={setMessages}
              videoStreamUrl={videoStreamUrl}
              isVideoLoading={isVideoLoading}
              onGenerateVideo={onGenerateVideo}
              toolState={toolState}
              setToolState={setToolState}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblems_stepbystep;