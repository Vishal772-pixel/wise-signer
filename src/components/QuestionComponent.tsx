"use client";

import { useState } from "react";
import Link from "next/link";
import { FaLightbulb, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import FeedbackComponent from "./FeedbackComponent";
import ReactMarkdown from 'react-markdown';

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
    expectedAction?: "sign" | "reject";
    wrongAnswerPopupContent?: string;
    questionContext?: string; // Added back for context display
    // State props passed from parent 
    hasAnswered?: boolean;
    isCorrect?: boolean;
    // Callback for when an answer is checked
    onCheckAnswer?: (isCorrect: boolean) => void;
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
    questionContext,
    // Accept the states from parent
    hasAnswered: externalHasAnswered,
    isCorrect: externalIsCorrect,
    onCheckAnswer // Properly destructured here
}: QuestionProps, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    // For non-signOrReject types, we'll use internal state
    // For signOrReject type, we'll use the props passed from parent
    // We'll use the external states passed as props if provided,
    // otherwise default to false (for backward compatibility)
    const effectiveHasAnswered = externalHasAnswered ?? false;
    const effectiveIsCorrect = externalIsCorrect ?? false;

    const toggleOption = (optionId: string) => {
        if (effectiveHasAnswered) return;

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

        // Call the parent's onCheckAnswer handler with the result
        if (onCheckAnswer) {
            onCheckAnswer(isEqual);
        }

        setShowFeedback(true);
    };

    const getOptionClass = (optionId: string) => {
        if (!effectiveHasAnswered) {
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

                {/* Question context display */}
                {questionContext && (
                    <div className="mb-4 text-gray-700">
                        <ReactMarkdown>{questionContext}</ReactMarkdown>
                    </div>
                )}

                {type !== "signOrReject" && (
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
                                    disabled={effectiveHasAnswered}
                                    className={`p-4 text-left rounded-md shadow-sm border transition duration-150 ${getOptionClass(option.id)}`}
                                >
                                    {option.id}) {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {showNavigationButtons && (
                    <div className="flex justify-between">
                        {onPrevQuestion && (
                            <button
                                onClick={onPrevQuestion}
                                className="cursor-pointer inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
                            >
                                <FaChevronLeft className="mr-2" />
                                Previous
                            </button>
                        )}

                        {!effectiveHasAnswered ? (
                            type !== "signOrReject" && (
                                <button
                                    onClick={checkAnswer}
                                    className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                    disabled={selectedOptions.length === 0}
                                >
                                    Check Answer
                                </button>
                            )
                        ) : (
                            onNextQuestion && (
                                <button
                                    onClick={onNextQuestion}
                                    className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Next
                                    <FaChevronRight className="ml-2" />
                                </button>
                            )
                        )}
                    </div>
                )}

                {/* Show feedback for multi/single question types */}
                {type !== "signOrReject" && showFeedback && (
                    <div className="mt-8">
                        <FeedbackComponent
                            isCorrect={effectiveIsCorrect}
                            feedbackContent={feedbackContent}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

// Add display name for debugging
QuestionComponent.displayName = "QuestionComponent";

export default QuestionComponent;