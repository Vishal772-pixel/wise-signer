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
    type: "single" | "multi" | "signOrReject";
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

    // Extract common props
    const {
        questionNumber,
        question,
        type,
        feedbackContent,
        prevPageUrl,
        nextPageUrl,
        questionContext,
        isLastQuestion
    } = props;

    // Extract type-specific props
    const options = type === 'single' || type === 'multi' ? props.options : [];
    const correctAnswers = type === 'single' || type === 'multi' ? props.correctAnswers : [];
    const wrongAnswerPopupContent = 'wrongAnswerPopupContent' in props ? props.wrongAnswerPopupContent : undefined;
    const expectedAction = type === 'signOrReject' ? props.expectedAction : undefined;
    const walletType = type === 'signOrReject' ? props.walletType : undefined;
    const transactionOrSignatureDetails = type === 'signOrReject' ? props.transactionOrSignatureDetails : undefined;
    const fakeWebsiteType = 'fakeWebsiteType' in props ? props.fakeWebsiteType : undefined;
    const questionId = 'questionId' in props ? props.questionId : undefined;

    // Reference to the actual question component for multi-choice questions
    const questionComponentRef = useRef(null);

    // Check localStorage on component mount to see if this question has been answered
    useEffect(() => {
        checkQuestionAnsweredStatus();
        // Always reset feedback when navigating to a new question
        setShowFeedback(false);
    }, [questionNumber]);

    // Function to check if the current question has been answered
    const checkQuestionAnsweredStatus = () => {
        try {
            const existingResultsJSON = localStorage.getItem('quizResults');
            if (!existingResultsJSON) return;

            const results: QuestionResult[] = JSON.parse(existingResultsJSON);
            const existingResult = results.find(result => result.id === questionNumber);

            if (existingResult) {
                setHasAnswered(true);
                setIsCorrect(existingResult.isCorrect);
                // Don't automatically show feedback when loading from localStorage
            } else {
                // Reset states if no answer found
                setHasAnswered(false);
                setIsCorrect(false);
                setShowFeedback(false);
            }
        } catch (error) {
            console.error("Error checking question status:", error);
        }
    };

    // Function to reset feedback state
    const resetFeedback = () => {
        setShowFeedback(false);
    };

    const handlePrevQuestion = () => {
        if (prevPageUrl) {
            resetFeedback(); // Reset feedback before navigating
            router.push(prevPageUrl);
        }
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            // Navigate to the dedicated quiz summary page instead of showing the component
            router.push('/simulated/quiz-summary');
        } else if (nextPageUrl) {
            resetFeedback(); // Reset feedback before navigating
            router.push(nextPageUrl);
        }
    };

    const handleSignInClick = () => {
        // Allow interaction even if previously answered
        setShowWalletPopup(true);
    };

    const saveQuestionResult = (questionId: number, correct: boolean) => {
        try {
            // Get existing results from localStorage
            const existingResultsJSON = localStorage.getItem('quizResults');
            let results: QuestionResult[] = existingResultsJSON ? JSON.parse(existingResultsJSON) : [];

            // Check if this question has already been answered
            const existingResultIndex = results.findIndex(result => result.id === questionId);

            if (existingResultIndex >= 0) {
                // Update existing result
                results[existingResultIndex].isCorrect = correct;
            } else {
                // Add new result
                results.push({ id: questionId, isCorrect: correct });
            }

            // Save back to localStorage
            localStorage.setItem('quizResults', JSON.stringify(results));
        } catch (error) {
            console.error("Error saving quiz results to localStorage:", error);
        }
    };

    // Handle wallet action (sign or reject)
    const handleWalletAction = (action: "sign" | "reject") => {
        setShowWalletPopup(false);

        if (type === "signOrReject" && expectedAction) {
            const isActionCorrect = action === expectedAction;
            setIsCorrect(isActionCorrect);
            setShowFeedback(true); // Show feedback after the wallet action
            setHasAnswered(true);
            saveQuestionResult(questionNumber, isActionCorrect);

            // Show wrong answer popup if incorrect and popup content exists
            if (!isActionCorrect && wrongAnswerPopupContent) {
                setShowWrongAnswerPopup(true);
            }
        }
    };

    const handleRetry = () => {
        // Reset feedback and answer status
        setShowFeedback(false);
        setHasAnswered(false);
        setIsCorrect(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Main content container - not affected by wallet popup */}
            <div className="w-full">
                {/* Progress Component */}
                <ProgressComponent currentQuestion={questionNumber} />

                {/* Pass hasAnswered, isCorrect and showFeedback to QuestionComponent */}
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
                    onInteractWithWallet={type === "signOrReject" ? handleSignInClick : undefined}
                    // Pass the states for all question types
                    hasAnswered={hasAnswered}
                    isCorrect={isCorrect}
                    showFeedback={showFeedback}
                    // Add retry handler
                    onRetry={handleRetry}
                    // Add a handler for when an answer is checked
                    onCheckAnswer={(isAnswerCorrect) => {
                        setIsCorrect(isAnswerCorrect);
                        setShowFeedback(true);
                        setHasAnswered(true);
                        saveQuestionResult(questionNumber, isAnswerCorrect);
                    }}
                />

                {/* Using the FeedbackComponent for sign/reject questions */}
                {type === "signOrReject" && showFeedback && (
                    <div className="max-w-6xl mx-auto mt-8">
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
                        primaryButtonText={props.interactionButtonText || "Sign in with Ethereum"}
                        onPrimaryButtonClick={handleSignInClick}
                        buttonDisabled={false} // Always allow interaction
                    />
                )}
            </div>

            {/* Wallet Popup Component for sign/reject questions */}
            {showWalletPopup && type === "signOrReject" && transactionOrSignatureDetails && (
                <WalletPopupComponent
                    isOpen={showWalletPopup}
                    walletType={walletType!}
                    onClose={() => setShowWalletPopup(false)}
                    onConfirm={() => handleWalletAction("sign")}
                    onReject={() => handleWalletAction("reject")}
                    transactionOrSignatureDetails={transactionOrSignatureDetails}
                />
            )}

            {/* Default Wallet Popup for non-sign/reject questions */}
            {showWalletPopup && type !== "signOrReject" && transactionOrSignatureDetails && (
                <WalletPopupComponent
                    isOpen={showWalletPopup}
                    walletType="metamask"
                    onClose={() => setShowWalletPopup(false)}
                    onConfirm={() => {
                        console.log("Transaction confirmed");
                        setShowWalletPopup(false);
                    }}
                    onReject={() => {
                        console.log("Transaction rejected");
                        setShowWalletPopup(false);
                    }}
                    transactionOrSignatureDetails={transactionOrSignatureDetails}
                />
            )}

            {showWrongAnswerPopup && wrongAnswerPopupContent && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setShowWrongAnswerPopup(false)}>
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
                                    <p className="text-red-800 font-medium">You signed something you shouldn't have!</p>
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

// Add display name for debugging
PageRenderer.displayName = "PageRenderer";

export default PageRenderer;