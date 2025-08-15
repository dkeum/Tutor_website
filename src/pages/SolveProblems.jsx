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
import Dog from "../components/AI/Dog";

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

  const [questions, setQuestions] = useState([]);
  const [latex, setLatex] = useState("");
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Recorded answers state
  const [recordedAnswers, setRecordedAnswers] = useState([]);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [answerResults, setAnswerResults] = useState([]); // stores correct/incorrect info

  const [showResults, setShowResults] = useState(false);

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
      api.on("select", () => {
        setCurrentIndex(api.selectedScrollSnap());
      });
    }
  }, [api]);

  // Timer effect
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
      // Calculate grade
      const total = updatedResults.length;
      const correctCount = updatedResults.filter((r) => r.isCorrect).length;
      const grade = ((correctCount / total) * 100).toFixed(2); // percent with 2 decimal places

      // console.log("Grade:", grade, "%");

      // Send to backend
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
        {
          withCredentials: true,
        }
      );

      setShowResults(true);
    } else if (api) {
      api.scrollNext();
    }
  };

  return (
    <div>
      <NavbarLoggedIn />
      <div className="grid grid-cols-3 min-h-[500px] mt-10 gap-4">
        {showResults === false && (
          <div className="flex flex-col border rounded-lg col-span-2 p-4">
            <div className="flex-none h-[20px] flex flex-row justify-between">
              <h3>
                {decodeURIComponent(topic)} - {decodeURIComponent(section)}
              </h3>
              <div className="flex flex-row gap-x-2">
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <Button variant="outline text-white bg- flex flex-wrap items-center gap-2 md:flex-row">
                        Formula
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Formula</DialogTitle>
                        <DialogDescription>{currentFormula}</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild></DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <Button variant="outline text-white bg- flex flex-wrap items-center gap-2 md:flex-row">
                        Hint
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Hint</DialogTitle>
                        <DialogDescription>{currentHint}</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild></DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </div>
            </div>

            <div className="flex-grow mt-6 flex flex-col justify-between">
              <Carousel
                className="w-full pointer-events-none"
                setApi={setApi}
                opts={{
                  loop: false,
                }}
              >
                <CarouselContent>
                  {questions.map((q, index) => (
                    <CarouselItem key={index}>
                      <div className="border rounded-lg p-4 w-[95%] mx-auto bg-white shadow flex-grow">
                        <h2 className="mb-2 flex-grow">
                          <b>Question {index + 1}:</b> {q.question}
                        </h2>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div className="flex flex-row justify-around items-center mt-4 gap-6">
                <div>
                  <EditableMathField
                    latex={latex}
                    onChange={(mathField) => {
                      setLatex(mathField.latex());
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
          </div>
        )}

        <div className="grid grid-rows-3 gap-4 " >
          <TimerBox secondsElapsed={secondsElapsed} />
          <div className="border rounded-lg row-span-2">
            <Dog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblems;
