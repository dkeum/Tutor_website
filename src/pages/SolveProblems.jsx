import React, { useEffect, useState } from "react";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import MathInput from "react-math-keyboard";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function TimerBox({ className }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  return (
    <div
      className={cn(
        className,
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? `http://localhost:3000/questions/${topic}/${section}`
            : `https://mathamagic-backend.vercel.app/questions/${topic}/${section}`,
          { withCredentials: true }
        );
        setQuestions(res.data.questions.map((item) => item.question));
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [topic, section]);

  const keyboardDiv = [
    ...document.querySelectorAll(
      "div.react-math-keyboard-keyboard-container.scrollbar"
    ),
  ].find((div) => div.id.startsWith("mq-keyboard"));

  if (keyboardDiv) {
    keyboardDiv.remove(); // Removes the div completely from the DOM
  }

  useEffect(() => {
    if (api) {
      setCurrentIndex(api.selectedScrollSnap());
      api.on("select", () => {
        setCurrentIndex(api.selectedScrollSnap());
      });
    }
  }, [api]);

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div>
      <NavbarLoggedIn />
      <div className="grid grid-cols-3 min-h-[500px] mt-10 gap-4">
        <div className="flex flex-col border rounded-lg col-span-2 p-4">
          <div className="flex-none h-[20px]">
            <h3>
              {decodeURIComponent(topic)} - {decodeURIComponent(section)}
            </h3>
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
                      <h2 className="mb-2 flex-grow ">
                        <b>Question {index + 1}:</b> {q}
                      </h2>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex flex-row justify-between items-center mt-4 gap-6">
              <MathInput setValue={setLatex} />

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
                onClick={() => {
                  if (isLastQuestion) {
                    console.log("Submit answers"); // Replace with your submit logic
                  } else if (api) {
                    api.scrollNext();
                  }
                }}
              >
                {isLastQuestion ? "SUBMIT" : "NEXT"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-4">
          <TimerBox />
          <div className="border rounded-lg row-span-2">Section 3: AI</div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblems;
