import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setDogDetails } from "../../features/dog/dogSlice";

//https://docs.puter.com/FS/upload/

const SolveProblems_stepbystep = ({
  dogRef,
  handlePlayAudio,
  question,
  handleNextOrSubmit,
  setIsDialogOpen,
  muted,
  toggleMute,
  divRef,
}) => {
  const [steps, setSteps] = useState([""]);

  // 🔹 Per-step control
  const [loadingStep, setLoadingStep] = useState(null); // number | null
  const [stepStatus, setStepStatus] = useState({}); // { [index]: "yes" | "no" | "correct" }
  const [errorSteps, setErrorSteps] = useState(new Set()); // steps that are "no"
  const [pulseSteps, setPulseSteps] = useState(new Set()); // steps that should animate

  // Side panel (global)
  const [aiText, setAiText] = useState("The streamed response will go here");

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a helpful math assistant. You will help determine if what I write is correct and suggest advice whenever there's an error. Never give the answer but you can confirm whether the final answer is true.",
    },
    {
      role: "system",
      content: `You must answer in this format: \n 
                Answer: <Yes/No/Correct> \n 
                Dog_animation: <dog_animation> \n 
                if the answer is yes (step is valid but not final), the dog animation is shake,
                if the answer is no, the dog animation is play_dead,
                if the answer is correct to question provided then the dog animation is rollover,
                Explanation: <explain> \n`,
    },
  ]);

  useEffect(() => {
    if (!question) return;
  
    if (question.image_url) {
      setMessages(prev => [
        ...prev,
        {
          role: "user",
          content: [
            { type: "text", text: question.question },
            { type: "image_url", image_url: { url: question.image_url } },
          ],
        },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { role: "user", content: `Here is the question: ${question.question}` },
      ]);
    }
  }, [question]);

  const handleStepChange = (index, value) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const addStep = () => setSteps((s) => [...s, ""]);

  const checkStep = async (index) => {
    const userStep = steps[index];
    if (!userStep || loadingStep !== null) return; // prevent concurrent checks

    setLoadingStep(index); // ✅ only this step shows "Checking..."
    const updatedMessages = [
      ...messages,
      { role: "user", content: `Step ${index + 1}: ${userStep}` },
    ];
    setMessages(updatedMessages);

    try {
      const resp = await puter.ai.chat(updatedMessages, {
        model: "gpt-5",
        stream: true,
      });

      let raw = "";
      for await (const part of resp) raw += part?.text || "";

      const answerMatch = raw.match(/^\s*Answer\s*:\s*(.+)\s*$/im);
      const animMatch = raw.match(/^\s*Dog[_ -]?animation\s*:\s*(.+)\s*$/im);
      const expMatch = raw.match(
        /^\s*(?:Explaination|Explanation)\s*:\s*([\s\S]*)$/im
      );

      const answer = (answerMatch?.[1] || "").trim();
      const dogAnimation = (animMatch?.[1] || "").trim();
      const explanation = (expMatch?.[1] || raw).trim();

      let feedbackText = "";
      if (answer === "Yes") feedbackText = "Woof, that step is right!";
      else if (answer === "No") feedbackText = "Try again";
      else if (answer === "Correct") feedbackText = "Your Answer is Correct!";
      feedbackText += `. Explanation: ${explanation}`;

      // play audio once
      handlePlayAudio(feedbackText);
      // normalize
      const normalized = answer.toLowerCase(); // "yes" | "no" | "correct"

      // store per-step status
      setStepStatus((prev) => ({ ...prev, [index]: normalized }));
      if (normalized === "no") {
        setErrorSteps((prev) => {
          const nextSet = new Set(prev).add(index);
          setPulseSteps((prevPulse) => new Set(prevPulse).add(index)); // start pulse

          // stop pulse after 3 seconds
          setTimeout(() => {
            setPulseSteps((prevPulse) => {
              const newSet = new Set(prevPulse);
              newSet.delete(index);
              return newSet;
            });
          }, 3000);

          return nextSet;
        });
      }

      // dog stuff
      dispatch(setDogDetails({ dog_animation: dogAnimation }));
      if (dogRef?.current?.playAnimation && dogAnimation) {
        dogRef.current.playAnimation(dogAnimation);
      }

      // side panel text
      setAiText(explanation);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Explanation: ${explanation}` },
      ]);
    } catch (err) {
      console.error("AI Error:", err);
      setAiText("Sorry, I hit an error while checking that step.");
    } finally {
      setLoadingStep(null);
    }
  };

  // 🔸 Gate “Add Step / Next” by the LAST step only
  const lastIndex = steps.length - 1;
  const lastStatus = stepStatus[lastIndex]; // "yes" | "no" | "correct" | undefined

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div>
        <div className="text-xl font-medium">Step by Step</div>
        <div className="text-sm text-slate-400">
          Solve step by step with our AI Assistant
        </div>
      </div>

      <div className="flex-1 p-4 w-full border flex flex-row justify-between my-2 overflow-hidden">
        {/* Steps */}
        <div className="flex-1 flex flex-col gap-3 overflow-scroll overflow-x-hidden pb-20 pr-3">
          <div className="border rounded-md min-h-[70px] flex px-3 text-left">
            <b>Question:</b>&nbsp; {question?.question}
          </div>
          {question?.image_url && (
            <div className="border rounded-md min-h-[200px] max-h-[250px] flex px-3 text-left overflow-hidden">
              <img src={question.image_url} className="min-h-[200px] max-h-[250px]" />
            </div>
          )}

          {steps.map((step, index) => {
            const status = stepStatus[index];
            const isChecking = loadingStep === index;
            const isYes = status === "yes";
            const isCorrect = status === "correct";
            const isError = errorSteps.has(index);
            const isPulsing = pulseSteps.has(index);

            return (
              <div
                key={index}
                className={`border rounded-md min-h-[70px] flex justify-between items-center px-3 transition-all ${
                  isError
                    ? isPulsing
                      ? "border-red-500 animate-pulse"
                      : "border-red-500"
                    : isYes
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  className="flex-1 outline-none"
                  placeholder={`Step ${index + 1}...`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  disabled={isYes || isCorrect}
                />
                <Button
                  onClick={() => {
                    checkStep(index);
                  }}
                  disabled={isChecking || isYes || isCorrect}
                  className="ml-2"
                >
                  {isChecking
                    ? "Checking..."
                    : isYes
                    ? "✓ Good"
                    : isCorrect
                    ? "✓ Final"
                    : "Check"}
                </Button>
              </div>
            );
          })}

          {/* Only the LAST step’s status controls what the user can do next */}
          {lastStatus === "correct" ? (
            <Button
              onClick={() => {
                handleNextOrSubmit();
                setIsDialogOpen(false);
              }}
              variant="default"
              className="w-fit mt-2"
            >
              Next
            </Button>
          ) : lastStatus === "yes" ? (
            <Button onClick={addStep} variant="outline" className="w-fit mt-2">
              + Add Step
            </Button>
          ) : null}
        </div>

        {/* Dog + AI Response */}
        <div className="flex flex-col justify-around mt-10 ml-4 w-1/3 relative">
          {/* {divRef && <div ref={divRef}  className="w-full h-64 border rounded-lg"/>} */}
          <div
            id="dog-dialog"
            className="h-40 w-full border rounded-lg flex justify-center items-center"
          />
          <Button
            type="button"
            onClick={() => toggleMute && toggleMute()}
            aria-pressed={!!muted}
            title={muted ? "Unmute" : "Mute"}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
          >
            {muted ? "🔇" : "🔊"}
          </Button>
          <div
            id="ai-response"
            className="mt-3 h-[50%] text-sm text-gray-700 w-full min-h-[60px] border rounded-md p-2"
          >
            {aiText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblems_stepbystep;
