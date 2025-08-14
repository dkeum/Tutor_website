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
import normalizeLatex from "../../helperFunctions/normalizeLatex";

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

  // Group all sections (allow duplicates) for LEFT side
  const topicsMap = {};
  data.forEach((item) => {
    const topic = item.topic || "Unknown Topic";
    if (!topicsMap[topic]) topicsMap[topic] = [];
    topicsMap[topic].push(item.section_name || item.section);
  });

  // Group unique sections for RIGHT side
  const topicsMapUnique = {};
  Object.entries(topicsMap).forEach(([topic, sections]) => {
    topicsMapUnique[topic] = Array.from(new Set(sections)).sort();
  });

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

  // Current question and last question flag
  const currentQuestion = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  // Get previous answer for current question
  const previousAnswer = useMemo(() => {
    return (
      data
        .flatMap((item) => item.recordedAnswers || [])
        .find((ans) => ans.questionId === currentQuestion.id)?.answer || ""
    );
  }, [currentQuestion, data]);

  const handleNextOrSubmit = async () => {
    const correctAnswer = currentQuestion?.answer || "";


    console.log(normalizeLatex(latex),  normalizeLatex(correctAnswer))
    const isCorrect = normalizeLatex(latex) === normalizeLatex(correctAnswer);

    // Update wrong answer feedback
    setWrongAnswerFeedback(isCorrect ? "" : `Correct answer: ${correctAnswer}`);

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: latex,
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
    if(isCorrect){
        await axios.post(
            import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
              ? "http://localhost:3000/questions/fixed-mistakes"
              : "https://mathamagic-backend.vercel.app/questions/fixed_mistakes",
            {
              fixed_questions_id: [currentQuestion.id],
            },
            { withCredentials: true }
          );
    }

   if (api) {
      if (isCorrect) {
        api.scrollNext();
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div>
      <NavbarLoggedIn />

      <div className="grid grid-cols-3 max-w-6xl gap-4 min-h-[500px] mt-10">
        {/* LEFT side */}
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
              />
            </div>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap self-start"
              onClick={handleNextOrSubmit}
            >
              {isLastQuestion ? "SUBMIT" : "NEXT"}
            </button>
          </div>

          {showResults && (
            <p className="mt-4 text-green-600">Results submitted!</p>
          )}
        </div>

        {/* RIGHT side */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Topics Summary</h3>
          {Object.keys(topicsMapUnique).length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(topicsMapUnique).map(([topic, sections], idx) => (
                <div key={idx}>
                  <p className="font-semibold">{topic}</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {sections.map((sec, i) => (
                      <li key={i}>{sec}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mistakes;
