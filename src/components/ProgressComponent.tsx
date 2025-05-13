"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";

interface ProgressComponentProps {
  currentQuestion: number;
}

interface QuestionResult {
  id: number;
  isCorrect: boolean;
}

const ProgressComponent = ({ currentQuestion }: ProgressComponentProps) => {
  const totalQuestions = questions.length;
  const [quizResults, setQuizResults] = useState<QuestionResult[]>([]);

  // Load quiz results from localStorage
  useEffect(() => {
    try {
      const resultsJSON = localStorage.getItem("quizResults");
      if (resultsJSON) {
        const results: QuestionResult[] = JSON.parse(resultsJSON);
        setQuizResults(results);
      }
    } catch (error) {
      console.error("Error loading quiz results:", error);
    }
  }, [currentQuestion]); // Re-check whenever currentQuestion changes

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (currentQuestion / totalQuestions) * 100,
  );

  // Generate segments for each question
  const renderProgressSegments = () => {
    return questions.map((_, index) => {
      const questionId = index + 1;
      const result = quizResults.find((r) => r.id === questionId);

      // Determine segment color
      let bgColor = "bg-gray-200"; // Default/unanswered
      if (result) {
        bgColor = result.isCorrect ? "bg-green-500" : "bg-red-500";
      } else if (questionId === currentQuestion) {
        bgColor = "bg-blue-500"; // Current question
      }

      return (
        <div
          key={questionId}
          className={`h-2.5 ${bgColor} ${index === 0 ? "rounded-l-full" : ""} ${
            index === questions.length - 1 ? "rounded-r-full" : ""
          }`}
          style={{ width: `${100 / totalQuestions}%` }}
        />
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 font-medium">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {progressPercentage}% Complete
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="w-full flex">{renderProgressSegments()}</div>
    </div>
  );
};

export default ProgressComponent;
