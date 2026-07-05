import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import BackgroundWrapper from "../components/BackgroundWrapper";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { Button } from "../components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../db/supabaseclient";
>>>>>>> ae23d0b89324627ab9f33b25b15a9b5c119c4188

import axios from "axios";
import Navbar from "../components/Navbar";

const PROGRESS_LABELS = [
  "Getting started",
  "Nice, keep going",
  "Halfway there",
  "Almost done",
  "Last one",
];

const CLASS_MAP = {
  Math: {
    "grade 1-5": ["Math 1", "Math 2", "Math 3", "Math 4", "Math 5"],
    "grade 6-8": ["Math 6", "Math 7", "Math 8"],
    "grade 9-12": ["Math 9", "Pre-Calculus 10", "Pre-Calculus 11", "Pre-Calculus 12", "Calculus 12", "AP Calculus AB", "AP Calculus BC"],
    University: ["Calculus I", "Calculus II", "Linear Algebra", "Diff Eq"],
  },
  Science: {
    "grade 1-5": ["Intro to Science", "Environmental Science"],
    "grade 6-8": ["General Science", "Earth Science", "Life Science"],
    "grade 9-12": ["Science 10", "Physics 11", "Physics 12", "Chemistry 11", "Chemistry 12"],
    University: ["Biochemistry", "Organic Chemistry", "Astrophysics", "Molecular Biology"],
  },
  Physics: {
    "grade 9-12": ["Physics 11", "Physics 12"],
    University: ["Calculus I", "Calculus II", "Linear Algebra"],
  },
  Chemistry: {
    "grade 9-12": ["Chemistry 11", "Chemistry 12"],
    University: ["Organic Chemistry", "Biochemistry"],
  },
};

const STATIC_QUESTIONS = [
  {
    question: "What subjects are you interested in?",
    options: ["Math", "Science", "Physics", "Chemistry"],
  },
  {
    question: "What's your grade level?",
    options: ["grade 1-5", "grade 6-8", "grade 9-12", "University"],
  },
  {
    question: "Select the class you want",
    options: [],
  },
  {
    question: "What grade are you aiming for?",
    options: ["A- to A+", "B- to B+", "C- to C+"],
  },
  {
    question: "How much time can you commit per week?",
    options: ["0-3 hours", "3-5 hours", "Over 5 hours"],
  },
];

const SurveyPersonalDetails = () => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

<<<<<<< HEAD
  const progress = (questionNumber / STATIC_QUESTIONS.length) * 100;

  const getCurrentOptions = () => {
    if (questionNumber !== 2) return STATIC_QUESTIONS[questionNumber].options;
    const subject = answers[0];
    const grade = answers[1];
    return (
      CLASS_MAP[subject]?.[grade] || [
        "No classes available for that combination",
      ]
    );
=======
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleTokenVerification = async () => {
      const token = searchParams.get("token");
      if (!token) return;

      const base = import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";

      try {
        const response = await axios.get(`${base}/verify-email`, {
          params: { token },
          withCredentials: true,
        });

        if (response.data.access_token && response.data.refresh_token) {
          await supabase.auth.setSession({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          });
        }
      } catch (verifyErr) {
        console.error("Email verification failed:", verifyErr);
        navigate("/login?verify_failed=true", { replace: true });
      }
    };

    handleTokenVerification();
  }, [searchParams, navigate]);

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
>>>>>>> ae23d0b89324627ab9f33b25b15a9b5c119c4188
  };

  const handleClick = async (selectedOption) => {
    const updatedAnswers = [...answers, selectedOption];
    setAnswers(updatedAnswers);

    const nextQuestion = questionNumber + 1;

    if (nextQuestion < STATIC_QUESTIONS.length) {
      setQuestionNumber(nextQuestion);
    } else {
      setSubmitting(true);
      try {
        const response = await axios.post(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? "http://localhost:3000/update-user"
            : "https://mathamagic-backend.vercel.app/update-userprofile",
          { answers: updatedAnswers },
          { withCredentials: true }
        );
        if (response.status === 200) {
          navigate("/showpersonaldata");
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (err) {
        console.error("Failed to submit survey:", err);
        setSubmitting(false);
      }
    }
  };

  const currentQuestion = STATIC_QUESTIONS[questionNumber];
  const currentOptions = getCurrentOptions();
  const progressPct = Math.round(progress);

  return (
    <div>
      <Navbar/>
      <BackgroundWrapper className="opacity-10">
        <div className="flex flex-col gap-y-8 w-full max-w-xl mx-auto px-4 py-12">
          {/* Step indicator + question */}
          <div className="flex flex-col gap-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Step {questionNumber + 1} of {STATIC_QUESTIONS.length}
            </p>
            <h2 className="text-2xl font-medium leading-snug">
              {submitting ? "Creating your profile…" : currentQuestion.question}
            </h2>
          </div>

          {/* Option buttons */}
          {!submitting && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {currentOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(option)}
                  className="
            text-left px-4 py-3 rounded-lg text-sm font-normal
            bg-white/80 border border-border
            hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50
            transition-all duration-150 cursor-pointer
          "
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Progress */}
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {submitting
                  ? "Creating your profile…"
                  : PROGRESS_LABELS[questionNumber]}
              </span>
              <span>{submitting ? "100%" : `${progressPct}%`}</span>
            </div>
            <Progress
              value={submitting ? 100 : progress}
              className="h-1 w-full"
            />
          </div>
        </div>
      </BackgroundWrapper>
    </div>
  );
};

export default SurveyPersonalDetails;
