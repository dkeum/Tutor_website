import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { Button } from "../components/ui/button";
import { set } from "zod";

const SurveyPersonalDetails = () => {
  // progress bar for question completion
  const [progress, setProgress] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // question number
  // simply component that asks questions to

  const questions = [
    {
      question: "What are you subjects are you interested in?",
      options: ["Math", "Science", "Physics", "Chemistry"],
    },
    {
      question: "What is your grade?",
      options: ["grade 1-5", "grade 6-8", "grade 9-12", "University"],
    },
    {
      question: "What is your grade goal?",
      options: ["A- to A+", "B- to B+", "C- to C+"],
    },
    {
      question: "How much time are you willing to commit per week?",
      options: ["0-3 hours", "3-5 hours", "over 5 hours"],
    },
  ];

  const handleClick = () => {
    if (questionNumber < questions.length - 1) {
      setQuestionNumber((prev) => prev + 1);
      setProgress((prev) => prev + (1 / questions.length) * 100);
    } else {
      setProgress(100);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex flex-col gap-y-10">
        <h2 className="text-4xl mx-auto">
          {questionNumber+1}. {" "}{questions[questionNumber].question}
        </h2>

        <div className="mx-auto flex flex-row gap-x-5">
          {questions[questionNumber].options.map((option, index) => (
            <Button
              className="tracking-normal"
              key={index}
              onClick={handleClick}
            >
              {option}
            </Button>
          ))}
        </div>

        <Progress value={progress} className="w-[60%] mx-auto" />

        {progress === 100 && (
          <div className="text-xl flex flex-row mx-auto">
            Creating profile
            <div className="flex flex-row ml-2 tracking-wide">
              <p className="animate-bounce">.</p>
              <p className="animate-bounce delay-75">.</p>
              <p className="animate-bounce delay-150">.</p>
            </div>
          </div>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default SurveyPersonalDetails;
