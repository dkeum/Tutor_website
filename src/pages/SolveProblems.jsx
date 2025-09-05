"use client";
import React, { useEffect, useState } from "react";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { addStyles, EditableMathField } from "react-mathquill";
import normalizeLatex from "../helperFunctions/normalizeLatex";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

import SolveProblems_stepbystep from "../components/solveProblems/SolveProblems_stepbystep";
import useDog from "../hook/useDog";
import DogPortal from "../components/AI/DogPortal";

import Desmos from "desmos";

addStyles();

function TimerBox({ secondsElapsed }) {
  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  return (
    <div
      className={cn(
        "h-full border rounded-lg p-4 flex flex-col justify-center gap-4"
      )}
    >
      <h2>Time Elapsed</h2>
      <div className="flex flex-row gap-4 mx-auto">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{hours}</span>
          <span className="text-sm">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{minutes}</span>
          <span className="text-sm">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{seconds}</span>
          <span className="text-sm">Seconds</span>
        </div>
      </div>
    </div>
  );
}

const SolveProblems = () => {
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [latex, setLatex] = useState("");
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [answerResults, setAnswerResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDesmos, setShowDesmos] = useState(false);

  const {
    canvasRef: mountRef,
    playAnimation,
    handlePlayAudio,
    muted,
    toggleMute,
  } = useDog();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? `http://localhost:3000/questions/${topic}/${section}`
            : `https://mathamagic-backend.vercel.app/questions/${topic}/${section}`,
          { withCredentials: true }
        );
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, [topic, section]);

  useEffect(() => {
    if (api) {
      setCurrentIndex(api.selectedScrollSnap());
      api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    }
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQuestion = questions[currentIndex] || {};
  const currentFormula = currentQuestion.formula || "No formula available.";
  const currentHint = currentQuestion.hint || "No hint available.";

  // useEffect(() => {
  //   if (!currentQuestion?.question) return;

  //   const askAI = async () => {
  //     try {
  //       const initilize_message = [
  //         {
  //           role: "system",
  //           content:
  //             "You are a helpful math assistant. You will define if I need to use Desmos graph or not",
  //         },
  //         {
  //           role: "system",
  //           content: `You must answer in this format:\nYes or No\nI don't want any text before or after that.`,
  //         },
  //         {
  //           role: "user",
  //           content: `Here is the question: ${currentQuestion.question}`,
  //         },
  //       ];

  //       const resp = await puter.ai.chat(initilize_message, {
  //         model: "gpt-5",
  //       });

  //       console.log("This is the answer", resp?.message?.content?.trim());

  //       const aiAnswer = resp?.message?.content?.trim();
  //       // setShowDesmos(aiAnswer === "Yes"); // ✅ only show if "Yes"
  //       setShowDesmos(true); // ✅ only show if "Yes"
  //     } catch (err) {
  //       console.error("AI check for Desmos failed:", err);
  //     }
  //   };

  //   askAI();
  // }, []);

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: latex,
      timeTaken: secondsElapsed,
      isCorrect,
    };

    const updatedAnswers = [...recordedAnswers, newAnswer];
    const updatedResults = [
      ...answerResults,
      { questionId: currentQuestion.id, isCorrect },
    ];

    setRecordedAnswers(updatedAnswers);
    setAnswerResults(updatedResults);

    setLatex("");
    setSecondsElapsed(0);

    if (isLastQuestion) {
      const total = updatedResults.length;
      const correctCount = updatedResults.filter((r) => r.isCorrect).length;
      const grade = ((correctCount / total) * 100).toFixed(2);

      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/questions/save-marks"
          : "https://mathamagic-backend.vercel.app/questions/save-marks",
        {
          topic: decodeURIComponent(topic),
          recordedAnswers: updatedAnswers,
          grade,
          section_name: decodeURIComponent(section),
        },
        { withCredentials: true }
      );

      setShowResults(true);
    } else if (api) {
      api.scrollNext();
    }
  };

  const handleNextOrSubmit_solvetab = async () => {
    const correctAnswer = currentQuestion?.answers?.[0]?.answer || "";

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: normalizeLatex(correctAnswer),
      timeTaken: secondsElapsed,
      isCorrect: true,
    };

    const updatedAnswers = [...recordedAnswers, newAnswer];
    const updatedResults = [
      ...answerResults,
      { questionId: currentQuestion.id, isCorrect: true },
    ];

    setRecordedAnswers(updatedAnswers);
    setAnswerResults(updatedResults);

    setLatex("");
    setSecondsElapsed(0);

    if (isLastQuestion) {
      const total = updatedResults.length;
      const correctCount = updatedResults.filter((r) => r.isCorrect).length;
      const grade = ((correctCount / total) * 100).toFixed(2);

      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/questions/save-marks"
          : "https://mathamagic-backend.vercel.app/questions/save-marks",
        {
          topic: decodeURIComponent(topic),
          recordedAnswers: updatedAnswers,
          grade,
          section_name: decodeURIComponent(section),
        },
        { withCredentials: true }
      );

      setShowResults(true);
    } else if (api) {
      api.scrollNext();
    }
  };

  // ✅ Render Desmos inside React
  const DesmosGraph = ({ expression }) => {
    const graphRef = React.useRef(null);
    const calculatorRef = React.useRef(null);

    useEffect(() => {
      if (graphRef.current && !calculatorRef.current) {
        // ✅ initialize once
        calculatorRef.current = Desmos.GraphingCalculator(graphRef.current, {
          expressions: true,
        });
      }
    }, []);

    useEffect(() => {
      if (calculatorRef.current && expression) {
        // ✅ update graph instead of refreshing
        calculatorRef.current.setExpression({
          id: "graph1",
          latex: expression,
        });
      }
    }, [expression]);

    return (
      <div
        className="mx-auto"
        ref={graphRef}
        style={{ width: "90%", height: "300px" }}
      />
    );
  };

  return (
    <div>
      <NavbarLoggedIn />
      <div className="grid grid-cols-3 min-h-[500px] mt-10 gap-4">
        {!showResults && (
          <div className="flex flex-col border rounded-lg col-span-2 p-4">
            <div className="flex-none h-[20px] flex flex-row justify-between">
              <h3>
                {decodeURIComponent(topic)} - {decodeURIComponent(section)}
              </h3>
              <div className="flex flex-row gap-x-2">
                {/* Formula Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Formula</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Formula</DialogTitle>
                      <DialogDescription>{currentFormula}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Hint Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Hint</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Hint</DialogTitle>
                      <DialogDescription>{currentHint}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Solution Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Step by Step</Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-6xl max-h-[700px] sm:h-[400px] lg:h-[600px]">
                    <DialogHeader className="hidden">
                      <DialogTitle>Hint</DialogTitle>
                      <DialogDescription>{currentHint}</DialogDescription>
                    </DialogHeader>
                    <SolveProblems_stepbystep
                      playAnimation={playAnimation}
                      handlePlayAudio={handlePlayAudio}
                      handleNextOrSubmit={handleNextOrSubmit_solvetab}
                      question={currentQuestion}
                      setIsDialogOpen={setIsDialogOpen}
                      muted={muted}
                      toggleMute={toggleMute}
                      // setIsDialogOpen(false); // closes dialog
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex-grow mt-6 flex flex-col justify-between">
              <Carousel
                className="w-full pointer-events-none"
                setApi={setApi}
                opts={{ loop: false }}
              >
                <CarouselContent>
                  {questions.map((q, index) => (
                    <CarouselItem key={index}>
                      <div className="border rounded-lg p-4 w-[95%] mx-auto bg-white shadow flex-grow">
                        <h2 className="mb-2 flex-grow text-left">
                          <b>Question {index + 1}:</b> {q.question}
                        </h2>
                        <div>
                          {q?.image_url && (
                            <img
                              src={`${q.image_url}`}
                              className="max-h-[300px]"
                            />
                          )}
                          {/* ✅ Conditionally show Desmos if AI says Yes */}
                          {/* {showDesmos && (
                            <div className="mt-4 border rounded-lg p-2 overflow-hidden min-h-[300px]">
                              <h3 className="mb-2 font-bold">Desmos Graph</h3>
                              <DesmosGraph
                                expression={
                                  currentQuestion?.graphLatex || "y=x^2"
                                }
                              />
                            </div>
                          )} */}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div className="flex flex-row justify-around items-center mt-4 gap-6">
                <div>
                  <EditableMathField
                    latex={latex}
                    onChange={(mathField) => setLatex(mathField.latex())}
                    style={{
                      minWidth: "400px",
                      minHeight: "30px",
                      textAlign: "left",
                    }}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
                  onClick={handleNextOrSubmit}
                >
                  {isLastQuestion ? "SUBMIT" : "NEXT"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <div className="col-span-2 p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-bold">Results</h2>
            {answerResults.map((res, idx) => (
              <div key={res.questionId}>
                Question {idx + 1}: {res.isCorrect ? "✅ Correct" : "❌ Wrong"}
              </div>
            ))}
            <Button
              onClick={() => {
                navigate("/showpersonaldata");
              }}
              className="mt-4"
            >
              Go back to Homepage
            </Button>
          </div>
        )}

        {/* Sidebar (Dog target) */}
        <div className="grid grid-rows-3 gap-4 relative">
          <TimerBox secondsElapsed={secondsElapsed} />
          <div
            id="dog-sidebar"
            className="border rounded-lg row-span-2 relative"
          >
            <div className="absolute bottom-3 font-bold text-xl left-[40%]">
              AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* DogPortal decides where dog renders */}
      <DogPortal
        mountRef={mountRef}
        targetId={isDialogOpen ? "dog-dialog" : "dog-sidebar"}
      />
    </div>
  );
};

export default SolveProblems;
