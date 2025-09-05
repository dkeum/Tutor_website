import React, { useEffect, useState, useMemo } from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
import { useSelector } from "react-redux";
import axios from "axios";
import { addStyles, EditableMathField } from "react-mathquill";
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
import normalizeLatex from "../../helperFunctions/normalizeLatex";
import { motion } from "framer-motion";
import SolveProblems_stepbystep from "../solveProblems/SolveProblems_stepbystep";
import useDog_standalone from "../../hook/useDog_standalone";

addStyles();

const Mistakes = () => {
  const data = useSelector((state) => state.personDetail.marks_section) || [];
  const [api, setApi] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [latex, setLatex] = useState("");
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswerFeedback, setWrongAnswerFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    divRef,
    playAnimation,
    handlePlayAudio,
    muted,
    toggleMute,
  } = useDog_standalone();

  // Get only wrong unique question IDs
  const wrongUniqueQuestionIds = useMemo(
    () =>
      Array.from(
        new Set(
          data.flatMap(
            (item) =>
              item.recordedAnswers
                ?.filter((ans) => ans.isCorrect === false)
                .map((ans) => ans.questionId) || []
          )
        )
      ),
    [data]
  );

  // Fetch wrong questions from backend
  useEffect(() => {
    if (!wrongUniqueQuestionIds.length) return;

    const getQuestions = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/questions/fix-questions"
            : "https://mathamagic-backend.vercel.app/questions/fix-questions",
          { questions_id: wrongUniqueQuestionIds },
          { withCredentials: true }
        );

        setQuestions(response.data.question || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    getQuestions();
  }, [wrongUniqueQuestionIds]);

  const currentQuestion = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  const previousAnswer = useMemo(() => {
    return (
      data
        .flatMap((item) => item.recordedAnswers || [])
        .find((ans) => ans.questionId === currentQuestion.id)?.answer || ""
    );
  }, [currentQuestion, data]);

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answer || "";
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    setWrongAnswerFeedback(isCorrect ? "" : `Correct answer: ${correctAnswer}`);

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: latex,
      isCorrect,
    };

    setRecordedAnswers((prev) => [...prev, newAnswer]);
    setAnswerResults((prev) => [
      ...prev,
      { questionId: currentQuestion.id, isCorrect },
    ]);
    setLatex("");

    if (isCorrect) {
      await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/questions/fixed-mistakes"
          : "https://mathamagic-backend.vercel.app/questions/fixed_mistakes",
        { fixed_questions_id: [currentQuestion.id] },
        { withCredentials: true }
      );

      if (api) {
        api.scrollNext();
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div>
      <NavbarLoggedIn />

      <div className="grid grid-cols-3 max-w-6xl gap-4 min-h-[500px] mt-10">
        {/* LEFT side (carousel, no animation) */}
        <div className="col-span-2 border rounded-lg p-4 overflow-y-auto space-y-4 flex flex-col justify-between">
          <Carousel
            className="w-full pointer-events-none"
            setApi={setApi}
            opts={{ loop: false }}
          >
            <CarouselContent>
              {questions.map((q, index) => (
                <CarouselItem key={index}>
                  <div className="border rounded-lg p-4 w-[95%] mx-auto bg-white shadow flex-grow">
                    <h2 className="mb-2 flex-grow">
                      <b>Question {index + 1}:</b> {q.question}
                    </h2>
                    {q?.image_url && <img src={`${q.image_url}`} className="max-h-[300px]"/>}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mb-2 text-red-600">{wrongAnswerFeedback}</div>

          <div className="flex flex-row justify-between mt-2">
            <div>
              <div className="mb-2">
                The answer you submitted before was:{" "}
                <span className="font-semibold">
                  {previousAnswer || "No previous answer"}
                </span>
              </div>
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
              className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap self-start hover:bg-blue-600 transition"
              onClick={handleNextOrSubmit}
            >
              {isLastQuestion ? "SUBMIT" : "NEXT"}
            </button>
          </div>

          {showResults && (
            <p className="mt-4 text-green-600">Results submitted!</p>
          )}
        </div>

        {/* RIGHT side (animated sidebar) */}
        <motion.div
        
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)",
          }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg p-4 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
          {data.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="space-y-4">
              {Array.from(
                data.reduce((map, item) => {
                  const topic = item.topic;
                  const section = item.section_name || item.section;
                  if (!map.has(topic)) map.set(topic, new Set());
                  if (section) map.get(topic).add(section); // only add if not empty
                  return map;
                }, new Map())
              ).map(([topic, sections], idx) => {
                const isCurrentTopic = topic === currentQuestion.topic;
                const currentSection =
                  currentQuestion.section_name ||
                  currentQuestion.section ||
                  "Multiplying Rational Numbers"; // fallback section

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      isCurrentTopic ? "bg-slate-100" : "bg-white"
                    } transition-colors duration-300`}
                  >
                    <p className="font-semibold">{topic}</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {Array.from(sections)
                        .filter((sec) => sec && sec.trim() !== "") // filter out empty sections
                        .map((sec, i) => {
                          const isCurrentSection = sec === currentSection;
                          return (
                            <div
                              key={i}
                              className={`p-1 rounded ${
                                isCurrentSection
                                  ? "bg-slate-100 font-semibold"
                                  : ""
                              } transition-colors duration-300`}
                            >
                              {sec}
                            </div>
                          );
                        })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}</div>
          <div className="flex min-h-[100px] items-center justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Step by Step</Button>
              </DialogTrigger>
              <DialogContent className="min-w-6xl max-h-[700px] sm:h-[400px] lg:h-[600px]">
                <DialogHeader className="hidden">
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <SolveProblems_stepbystep
                  playAnimation={playAnimation}
                  handlePlayAudio={handlePlayAudio}
                  handleNextOrSubmit={handleNextOrSubmit}
                  question={currentQuestion}
                  setIsDialogOpen={setIsDialogOpen}
                  muted={muted}
                  toggleMute={toggleMute}
                  dogRef={divRef}
                />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Mistakes;
