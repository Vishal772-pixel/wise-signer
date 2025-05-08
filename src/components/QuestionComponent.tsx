"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaLightbulb, FaChevronLeft, FaChevronRight, FaTimes, FaRedo } from "react-icons/fa";
import FeedbackComponent from "./FeedbackComponent";
import ReactMarkdown from 'react-markdown';
import markdownComponents from "@/components/MarkdownComponents";

interface Option {
    id: string;
    text: string;
}

interface FeedbackContent {
    pages: string[];
}

interface QuestionProps {
    question: string;
    options?: Option[];
    correctAnswers?: string[];
    type: "single" | "multi" | "signOrReject";
    feedbackContent: FeedbackContent;
    onNextQuestion?: () => void;
    onPrevQuestion?: () => void;
    showNavigationButtons?: boolean;
    onInteractWithWallet?: () => void;
    expectedAction?: "sign" | "reject";
    wrongAnswerPopupContent?: string;
    questionContext?: string;
    // State props passed from parent 
    hasAnswered?: boolean;
    isCorrect?: boolean;
    // Callback for when an answer is checked
    onCheckAnswer?: (isCorrect: boolean) => void;
    // Added prop to control feedback visibility from parent
    showFeedback?: boolean;
    // Callback for when a user wants to retry a question
    onRetry?: () => void;
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
    hasAnswered: externalHasAnswered,
    isCorrect: externalIsCorrect,
    onCheckAnswer,
    showFeedback: externalShowFeedback,
    onRetry,
}: QuestionProps, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [internalShowFeedback, setInternalShowFeedback] = useState(false);
    const effectiveHasAnswered = externalHasAnswered ?? false;
    const effectiveIsCorrect = externalIsCorrect ?? false;

    // Use external feedback control if provided, otherwise use internal state
    const showFeedback = externalShowFeedback !== undefined ? externalShowFeedback : internalShowFeedback;

    // Reset selected options when question changes
    useEffect(() => {
        setSelectedOptions([]);
        setInternalShowFeedback(false);
    }, [question]);

    const toggleOption = (optionId: string) => {
        if (effectiveHasAnswered && !onRetry) return; // Only prevent if no retry function

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

        // Only control internal feedback state
        setInternalShowFeedback(true);
    };

    const handleRetry = () => {
        // Clear selected options
        setSelectedOptions([]);
        // Call parent's retry handler if provided
        if (onRetry) {
            onRetry();
        }
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
                        <ReactMarkdown
                            components={markdownComponents}
                        >{questionContext}</ReactMarkdown>
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
                                    disabled={effectiveHasAnswered && !onRetry} // Only disable if no retry function
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

                        <div className="flex space-x-4">
                            {/* Show "Try Again" when question has been answered */}
                            {effectiveHasAnswered && onRetry && type !== "signOrReject" && (
                                <button
                                    onClick={handleRetry}
                                    className="cursor-pointer inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
                                >
                                    <FaRedo className="mr-2" />
                                    Try Again
                                </button>
                            )}

                            {/* Show "Check Answer" only when not answered or in retry mode with the hasAnswered flag reset */}
                            {!effectiveHasAnswered && type !== "signOrReject" && (
                                <button
                                    onClick={checkAnswer}
                                    className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                    disabled={selectedOptions.length === 0}
                                >
                                    Check Answer
                                </button>
                            )}

                            {/* Show "Next" when question has been answered */}
                            {effectiveHasAnswered && onNextQuestion && (
                                <button
                                    onClick={onNextQuestion}
                                    className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Next
                                    <FaChevronRight className="ml-2" />
                                </button>
                            )}
                        </div>
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