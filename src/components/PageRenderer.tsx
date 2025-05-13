"use client";

import { FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionComponent from "./QuestionComponent";
import WalletPopupComponent from "./WalletPopupComponent";
import SimulatedWebsite from "./SimulatedWebsite";
import FeedbackComponent from "./FeedbackComponent";
import ProgressComponent from "./ProgressComponent";
import { FakeWebsiteType, TransactionDetails, SignatureDetails } from "@/types";
import React, { forwardRef } from "react";

interface QuestionResult {
  id: number;
  isCorrect: boolean;
}

// Props for the PageRenderer component
interface PageRendererProps {
  questionNumber: number;
  question: string;
  options?: { id: string; text: string }[]; // Optional for signOrReject type
  correctAnswers?: string[]; // Optional for signOrReject type
  type: "multi" | "signOrReject";
  feedbackContent: {
    pages: string[];
  };
  nextPageUrl?: string;
  prevPageUrl?: string;
  // Optional props for simulated website
  fakeWebsiteType?: FakeWebsiteType;
  questionId?: number;
  // SignOrReject specific props
  onInteractWithWallet?: () => void;
  interactionButtonText?: string;
  expectedAction?: "sign" | "reject";
  walletType?: "metamask" | "safeWallet" | "trezor";
  // Transaction details for sign/reject questions
  transactionOrSignatureDetails?: TransactionDetails | SignatureDetails;
  wrongAnswerPopupContent?: string;
  questionContext?: string;
  // Indicate if this is the last question
  isLastQuestion?: boolean;
}

const PageRenderer = forwardRef((props: PageRendererProps, ref) => {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showWrongAnswerPopup, setShowWrongAnswerPopup] = useState(false);
  const router = useRouter();

  // Refs for scrolling to feedback
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const questionComponentRef = useRef(null);

  // Extract common props
  const {
    questionNumber,
    question,
    type,
    feedbackContent,
    prevPageUrl,
    nextPageUrl,
    questionContext,
    isLastQuestion,
  } = props;

  // Extract type-specific props
  const options = type === "multi" ? props.options : [];
  const correctAnswers = type === "multi" ? props.correctAnswers : [];
  const wrongAnswerPopupContent =
    "wrongAnswerPopupContent" in props
      ? props.wrongAnswerPopupContent
      : undefined;
  const expectedAction =
    type === "signOrReject" ? props.expectedAction : undefined;
  const walletType = type === "signOrReject" ? props.walletType : undefined;
  const transactionOrSignatureDetails =
    type === "signOrReject" ? props.transactionOrSignatureDetails : undefined;
  const fakeWebsiteType =
    "fakeWebsiteType" in props ? props.fakeWebsiteType : undefined;
  const questionId = "questionId" in props ? props.questionId : undefined;

  // Check localStorage and reset feedback when questionNumber changes
  useEffect(() => {
    checkQuestionAnsweredStatus();
    // Always reset feedback visibility when navigating to a new question.
    // This ensures that feedback from a previous question isn't shown
    // when loading a new question or returning to an already answered one.
    // Feedback is only shown after an explicit user action (e.g., answering).
    setShowFeedback(false);
  }, [questionNumber]);

  // Scroll to feedback when it appears
  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showFeedback]);

  // Function to check if the current question has been answered
  const checkQuestionAnsweredStatus = () => {
    try {
      const existingResultsJSON = localStorage.getItem("quizResults");
      if (!existingResultsJSON) {
        // If no results yet, ensure states are reset for a fresh question
        setHasAnswered(false);
        setIsCorrect(false);
        return;
      }

      const results: QuestionResult[] = JSON.parse(existingResultsJSON);
      const existingResult = results.find(
        (result) => result.id === questionNumber,
      );

      if (existingResult) {
        setHasAnswered(true);
        setIsCorrect(existingResult.isCorrect);
        // Feedback visibility is handled by the useEffect hook
      } else {
        // Reset states if no answer found for this specific question
        setHasAnswered(false);
        setIsCorrect(false);
      }
    } catch (error) {
      console.error("Error checking question status:", error);
    }
  };

  const handlePrevQuestion = () => {
    if (prevPageUrl) {
      // No longer reset feedback here
      router.push(prevPageUrl);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      router.push("/simulated/quiz-summary");
    } else if (nextPageUrl) {
      // No longer reset feedback here
      router.push(nextPageUrl);
    }
  };

  const handleSignInClick = () => {
    setShowWalletPopup(true);
  };

  const saveQuestionResult = (id: number, correct: boolean) => {
    // Renamed parameter to avoid shadowing
    try {
      const existingResultsJSON = localStorage.getItem("quizResults");
      let results: QuestionResult[] = existingResultsJSON
        ? JSON.parse(existingResultsJSON)
        : [];
      const existingResultIndex = results.findIndex(
        (result) => result.id === id,
      );

      if (existingResultIndex >= 0) {
        results[existingResultIndex].isCorrect = correct;
      } else {
        results.push({ id, isCorrect: correct });
      }
      localStorage.setItem("quizResults", JSON.stringify(results));
    } catch (error) {
      console.error("Error saving quiz results to localStorage:", error);
    }
  };

  const handleWalletAction = (action: "sign" | "reject") => {
    setShowWalletPopup(false);

    if (type === "signOrReject" && expectedAction) {
      const isActionCorrect = action === expectedAction;
      setIsCorrect(isActionCorrect);
      setShowFeedback(true); // Show feedback after the wallet action
      setHasAnswered(true);
      saveQuestionResult(questionNumber, isActionCorrect);

      if (!isActionCorrect && wrongAnswerPopupContent) {
        setShowWrongAnswerPopup(true);
      }
    }
  };

  const handleRetry = () => {
    setShowFeedback(false);
    setHasAnswered(false);
    setIsCorrect(false);
    // Note: This does not clear the localStorage result, allowing users to retry for UI feedback
    // but their last saved answer remains unless they answer correctly again.
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <div className="w-full">
        <ProgressComponent currentQuestion={questionNumber} />

        <QuestionComponent
          ref={questionComponentRef}
          question={`${questionNumber}. ${question}`}
          options={options}
          correctAnswers={correctAnswers}
          type={type}
          feedbackContent={feedbackContent}
          onPrevQuestion={prevPageUrl ? handlePrevQuestion : undefined}
          onNextQuestion={handleNextQuestion}
          questionContext={questionContext}
          onInteractWithWallet={
            type === "signOrReject" ? handleSignInClick : undefined
          }
          hasAnswered={hasAnswered}
          isCorrect={isCorrect}
          showFeedback={showFeedback}
          onRetry={handleRetry}
          onCheckAnswer={(isAnswerCorrect) => {
            setIsCorrect(isAnswerCorrect);
            setShowFeedback(true);
            setHasAnswered(true);
            saveQuestionResult(questionNumber, isAnswerCorrect);
          }}
          feedbackRef={feedbackRef}
        />

        {type === "signOrReject" && showFeedback && (
          <div ref={feedbackRef} className="max-w-6xl mx-auto mt-8">
            <FeedbackComponent
              isCorrect={isCorrect}
              feedbackContent={feedbackContent}
            />
          </div>
        )}

        {fakeWebsiteType && questionId && (
          <SimulatedWebsite
            fakeWebsiteType={fakeWebsiteType}
            questionId={questionId}
            primaryButtonText={
              props.interactionButtonText || "Sign in with Ethereum"
            }
            onPrimaryButtonClick={handleSignInClick}
            buttonDisabled={false}
          />
        )}
      </div>

      {showWalletPopup &&
        type === "signOrReject" &&
        transactionOrSignatureDetails && (
          <WalletPopupComponent
            isOpen={showWalletPopup}
            walletType={walletType!}
            onClose={() => setShowWalletPopup(false)}
            onConfirm={() => handleWalletAction("sign")}
            onReject={() => handleWalletAction("reject")}
            transactionOrSignatureDetails={transactionOrSignatureDetails}
          />
        )}

      {showWalletPopup &&
        type !== "signOrReject" &&
        transactionOrSignatureDetails && (
          <WalletPopupComponent
            isOpen={showWalletPopup}
            walletType="metamask" // Default or pass as prop if needed for non-signOrReject
            onClose={() => setShowWalletPopup(false)}
            onConfirm={() => {
              console.log("Transaction confirmed for non-signOrReject");
              setShowWalletPopup(false);
            }}
            onReject={() => {
              console.log("Transaction rejected for non-signOrReject");
              setShowWalletPopup(false);
            }}
            transactionOrSignatureDetails={transactionOrSignatureDetails}
          />
        )}

      {showWrongAnswerPopup && wrongAnswerPopupContent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowWrongAnswerPopup(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWrongAnswerPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-red-800 font-medium">
                    You signed something you shouldn't have!
                  </p>
                  <p className="text-red-700 mt-1">{wrongAnswerPopupContent}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWrongAnswerPopup(false)}
              className="cursor-pointer w-full mt-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PageRenderer.displayName = "PageRenderer";

export default PageRenderer;
