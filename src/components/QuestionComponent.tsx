"use client";

import { useState } from "react";
import Link from "next/link";
import { FaLightbulb, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface Option {
    id: string;
    text: string;
}

interface FeedbackContent {
    pages: string[];
}

interface QuestionProps {
    question: string;
    options?: Option[]; // Now optional since signOrReject won't have options
    correctAnswers?: string[]; // Optional for signOrReject type
    type: "single" | "multi" | "signOrReject";
    feedbackContent: FeedbackContent;
    onNextQuestion?: () => void;
    onPrevQuestion?: () => void;
    showNavigationButtons?: boolean;
    // For signOrReject type
    onInteractWithWallet?: () => void;
    interactionButtonText?: string;
    expectedAction?: "sign" | "reject";
    wrongAnswerPopupContent?: string;
}

import React, { forwardRef, useImperativeHandle } from "react";

const QuestionComponent = forwardRef(({
    question,
    options = [],
    correctAnswers = [],
    type,
    feedbackContent,
    onNextQuestion,
    onPrevQuestion,
    showNavigationButtons = true,
    onInteractWithWallet,
    interactionButtonText,
    expectedAction,
    wrongAnswerPopupContent,
}: QuestionProps, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    // New state for wrong answer popup
    const [showWrongAnswerPopup, setShowWrongAnswerPopup] = useState(false);

    const toggleOption = (optionId: string) => {
        if (hasAnswered) return;

        if (type === "single") {
            setSelectedOptions([optionId]);
            return;
        }

        // For multi-select
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions(selectedOptions.filter(id => id !== optionId));
        } else {
            setSelectedOptions([...selectedOptions, optionId]);
        }
    };

    const checkAnswer = () => {
        if (type === "signOrReject") {
            if (onInteractWithWallet) {
                onInteractWithWallet();
            }
            return;
        }

        // For single/multi question types, check the answer
        if (!correctAnswers) return;

        // Simple check for equality of arrays (ignoring order)
        const isEqual =
            selectedOptions.length === correctAnswers.length &&
            correctAnswers.every(item => selectedOptions.includes(item));

        setIsCorrect(isEqual);
        setShowFeedback(true);
        setFeedbackPage(1);
        setHasAnswered(true);
    };

    const nextFeedbackPage = () => {
        if (feedbackPage < feedbackContent.pages.length) {
            setFeedbackPage(feedbackPage + 1);
        }
    };

    const prevFeedbackPage = () => {
        if (feedbackPage > 1) {
            setFeedbackPage(feedbackPage - 1);
        }
    };

    const getOptionClass = (optionId: string) => {
        if (!hasAnswered) {
            return selectedOptions.includes(optionId)
                ? 'bg-green-100 border-green-500 text-gray-900'
                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900';
        }

        // After answering, color depends on correctness
        const isCorrectOption = correctAnswers.includes(optionId);
        const isSelectedOption = selectedOptions.includes(optionId);

        if (isCorrectOption && isSelectedOption) {
            return 'bg-green-100 border-green-500 text-gray-900'; // Correct and selected
        } else if (isCorrectOption && !isSelectedOption) {
            return 'bg-green-50 border-green-500 text-gray-900'; // Correct but not selected
        } else if (!isCorrectOption && isSelectedOption) {
            return 'bg-red-100 border-red-500 text-gray-900'; // Incorrect and selected
        } else {
            return 'bg-white border-gray-300 text-gray-900'; // Incorrect and not selected
        }
    };

    return (
        <div className="bg-gray-50 py-8 px-4 sm:px-8 md:px-20">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">{question}</h1>

                {/* Different UI based on question type */}
                {type !== "signOrReject" ? (
                    <>
                        <p className="mb-4 text-gray-700">
                            Please select <span className="font-bold">
                                {type === "single" ? "one option" : "one or many options"}
                            </span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {options && options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleOption(option.id)}
                                    disabled={hasAnswered}
                                    className={`p-4 text-left rounded-md shadow-sm border transition duration-150 ${getOptionClass(option.id)}`}
                                >
                                    {option.id}) {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="mb-8">
                        <p className="mb-4 text-gray-700">
                            This question requires you to interact with a wallet. Review the scenario below and decide whether to sign or reject the transaction.
                        </p>
                        {!hasAnswered && (
                            <button
                                onClick={checkAnswer}
                                className="inline-flex items-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-600"
                            >
                                {interactionButtonText || "Interact with Wallet"}
                            </button>
                        )}
                    </div>
                )}

                {showNavigationButtons && (
                    <div className="flex justify-between">
                        {onPrevQuestion && (
                            <button
                                onClick={onPrevQuestion}
                                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
                            >
                                <FaChevronLeft className="mr-2" />
                                Previous
                            </button>
                        )}

                        {!hasAnswered ? (
                            type !== "signOrReject" && (
                                <button
                                    onClick={checkAnswer}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                    disabled={selectedOptions.length === 0}
                                >
                                    Check Answer
                                </button>
                            )
                        ) : (
                            onNextQuestion && (
                                <button
                                    onClick={onNextQuestion}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Next
                                    <FaChevronRight className="ml-2" />
                                </button>
                            )
                        )}
                    </div>
                )}

                {/* Feedback displayed directly below (not as a popup) */}
                {showFeedback && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <FaLightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    That's {isCorrect ? "correct" : "incorrect"}. Let's see why:
                                </h3>

                                <div className="mt-2 text-gray-700">
                                    <p>{feedbackContent.pages[feedbackPage - 1]}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Page {feedbackPage} of {feedbackContent.pages.length}
                            </span>

                            <div className="flex space-x-2">
                                {feedbackPage > 1 && (
                                    <button
                                        onClick={prevFeedbackPage}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                )}

                                {feedbackPage < feedbackContent.pages.length && (
                                    <button
                                        onClick={nextFeedbackPage}
                                        className="px-3 py-1 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700"
                                    >
                                        <FaChevronRight />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

// Add display name for debugging
QuestionComponent.displayName = "QuestionComponent";

export default QuestionComponent;