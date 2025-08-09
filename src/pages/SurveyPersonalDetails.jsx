import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const SurveyPersonalDetails = () => {
  const [progress, setProgress] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const staticQuestions = [
    {
      question: "What subjects are you interested in?",
      options: ["Math", "Science", "Physics", "Chemistry"],
    },
    {
      question: "What is your grade?",
      options: ["grade 1-5", "grade 6-8", "grade 9-12", "University"],
    },
    {
      question: "Select the class you want",
      options: [], // dynamic
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

  const getCurrentQuestion = () => {
    const current = staticQuestions[questionNumber];

    if (questionNumber === 2) {
      const subject = answers[0];
      const grade = answers[1];

      // MATH
      if (subject === "Math") {
        if (grade === "grade 1-5") {
          return {
            ...current,
            options: ["Math 1", "Math 2", "Math 3", "Math 4", "Math 5"],
          };
        } else if (grade === "grade 6-8") {
          return {
            ...current,
            options: ["Math 6", "Math 7", "Math 8"],
          };
        } else if (grade === "grade 9-12") {
          return {
            ...current,
            options: [
              "Math 9",
              "Precal 10",
              "Precal 11",
              "Precal 12",
              "Calc 12",
              "AP Calc",
            ],
          };
        } else if (grade === "University") {
          return {
            ...current,
            options: ["Calc I", "Calc II", "Linear Algebra", "Diff Eq"],
          };
        }
      }

      // SCIENCE
      if (subject === "Science") {
        if (grade === "grade 1-5") {
          return {
            ...current,
            options: ["Intro to Science", "Environmental Science"],
          };
        } else if (grade === "grade 6-8") {
          return {
            ...current,
            options: ["General Science", "Earth Science", "Life Science"],
          };
        } else if (grade === "grade 9-12") {
          return {
            ...current,
            options: ["Biology 10", "Chemistry 10", "Physics 10", "Science 10"],
          };
        } else if (grade === "University") {
          return {
            ...current,
            options: [
              "Biochemistry",
              "Organic Chemistry",
              "Astrophysics",
              "Molecular Biology",
            ],
          };
        }
      }

      // PHYSICS
      if (subject === "Physics") {
        if (grade === "grade 9-12") {
          return {
            ...current,
            options: ["Physics 11", "Physics 12", "AP Physics"],
          };
        } else if (grade === "University") {
          return {
            ...current,
            options: ["Mechanics", "Electromagnetism", "Thermodynamics"],
          };
        } else {
          return {
            ...current,
            options: ["Not available for selected grade level."],
          };
        }
      }

      // CHEMISTRY
      if (subject === "Chemistry") {
        if (grade === "grade 9-12") {
          return {
            ...current,
            options: ["Chem 11", "Chem 12", "AP Chemistry"],
          };
        } else if (grade === "University") {
          return {
            ...current,
            options: ["Organic Chemistry", "Analytical Chem", "Biochemistry"],
          };
        } else {
          return {
            ...current,
            options: ["Not available for selected grade level."],
          };
        }
      }

      // fallback
      return {
        ...current,
        options: ["No available classes for selected subject and grade"],
      };
    }

    return current;
  };

  const handleClick = async (selectedOption) => {
    const nextQuestion = questionNumber + 1;
    setAnswers((prev) => [...prev, selectedOption]);

    if (nextQuestion < staticQuestions.length) {
      setQuestionNumber(nextQuestion);
      setProgress((nextQuestion / staticQuestions.length) * 100);
    } else {
      setProgress(100);
      // console.log("All answers:", [...answers, selectedOption]);

      // send a put method to the backend sending all the answers
      // updating the user profiel with background info

      const response = await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/update-user"
          : "https://mathamagic-backend.vercel.app/update-userprofile",
        {
          answers: [...answers, selectedOption],
        },
        {
          withCredentials: true, // ⬅️ very important!
        }
      );

      if (response.status === 200) {
        navigate("/showpersonaldata");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    }
  };

  const current = getCurrentQuestion();

  return (
    <BackgroundWrapper>
      <div className="flex flex-col gap-y-10">
        <h2 className="text-4xl mx-auto">
          {questionNumber + 1}. {current.question}
        </h2>

        <div className="mx-auto flex flex-row gap-x-5 flex-wrap justify-center">
          {current.options.map((option, index) => (
            <Button
              className="tracking-normal"
              key={index}
              onClick={() => handleClick(option)}
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
