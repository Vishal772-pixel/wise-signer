"use client";

import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QuestionComponent from "./QuestionComponent";
import WalletPopupComponent from "./WalletPopupComponent";
import SimulatedWebsite from "./SimulatedWebsite";
import FeedbackComponent from "./FeedbackComponent";
import { WalletType, FakeWebsiteType, TransactionDetails, SignatureDetails } from "@/types";

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
    fakeWebsiteEdition?: number;
    // SignOrReject specific props
    onInteractWithWallet?: () => void;
    interactionButtonText?: string;
    expectedAction?: "sign" | "reject";
    walletType?: "metamask" | "safeWallet" | "trezor";
    // Transaction details for sign/reject questions
    transactionOrSignatureDetails?: TransactionDetails | SignatureDetails;
    wrongAnswerPopupContent?: string;
    questionContext?: string;
}

// Forward ref to allow parent components to call methods on QuestionComponent
import React, { forwardRef, useImperativeHandle } from "react";

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
        questionContext
    } = props;

    // Extract type-specific props
    const options = type === 'single' || type === 'multi' ? props.options : [];
    const correctAnswers = type === 'single' || type === 'multi' ? props.correctAnswers : [];
    const wrongAnswerPopupContent = 'wrongAnswerPopupContent' in props ? props.wrongAnswerPopupContent : undefined;
    const expectedAction = type === 'signOrReject' ? props.expectedAction : undefined;
    const walletType = type === 'signOrReject' ? props.walletType : undefined;
    const transactionOrSignatureDetails = type === 'signOrReject' ? props.transactionOrSignatureDetails : undefined;
    const fakeWebsiteType = 'fakeWebsiteType' in props ? props.fakeWebsiteType : undefined;
    const fakeWebsiteEdition = 'fakeWebsiteEdition' in props ? props.fakeWebsiteEdition : undefined;

    // Reference to the actual question component for multi-choice questions
    const questionComponentRef = useRef(null);

    const handlePrevQuestion = () => {
        if (prevPageUrl) {
            router.push(prevPageUrl);
        }
    };

    const handleNextQuestion = () => {
        if (nextPageUrl) {
            router.push(nextPageUrl);
        }
    };

    const handleSignInClick = () => {
        setShowWalletPopup(true);
    };

    // Handle wallet action (sign or reject)
    const handleWalletAction = (action: "sign" | "reject") => {
        setShowWalletPopup(false);

        if (type === "signOrReject" && expectedAction) {
            const isActionCorrect = action === expectedAction;
            setIsCorrect(isActionCorrect);
            setShowFeedback(true);
            setHasAnswered(true); // This is where we set hasAnswered for sign/reject questions

            // Show wrong answer popup if incorrect and popup content exists
            if (!isActionCorrect && wrongAnswerPopupContent) {
                setShowWrongAnswerPopup(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Main content container - not affected by wallet popup */}
            <div className="w-full">
                {/* Pass hasAnswered and isCorrect to QuestionComponent for signOrReject type */}
                <QuestionComponent
                    ref={questionComponentRef}
                    question={`${questionNumber}. ${question}`}
                    options={options}
                    correctAnswers={correctAnswers}
                    type={type}
                    feedbackContent={feedbackContent}
                    onPrevQuestion={prevPageUrl ? handlePrevQuestion : undefined}
                    onNextQuestion={nextPageUrl ? handleNextQuestion : undefined}
                    questionContext={questionContext}
                    onInteractWithWallet={type === "signOrReject" ? handleSignInClick : undefined}
                    // Pass the states for all question types
                    hasAnswered={hasAnswered}
                    isCorrect={isCorrect}
                    // Add a handler for when an answer is checked
                    onCheckAnswer={(isAnswerCorrect) => {
                        setIsCorrect(isAnswerCorrect);
                        setShowFeedback(true);
                        setHasAnswered(true);
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

                {fakeWebsiteType && fakeWebsiteEdition && (
                    <SimulatedWebsite
                        fakeWebsiteType={fakeWebsiteType}
                        fakeWebsiteEdition={fakeWebsiteEdition}
                        primaryButtonText={props.interactionButtonText || "Sign in with Ethereum"}
                        onPrimaryButtonClick={handleSignInClick}
                        buttonDisabled={hasAnswered}
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
                            className="w-full mt-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
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