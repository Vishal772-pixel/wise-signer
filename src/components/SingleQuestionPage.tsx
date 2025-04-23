"use client";

import { FaChevronLeft, FaChevronRight, FaLightbulb } from "react-icons/fa";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QuestionComponent from "./QuestionComponent";
import WalletPopupComponent from "./WalletPopupComponent";
import SimulatedWebsite from "./SimulatedWebsite";
import { WalletType, FakeWebsiteType } from "@/types";

// Props for the SingleQuestionPage component
interface SingleQuestionPageProps {
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
    transactionDetails?: {
        fromAccount: string;
        toAccount: string;
        amount: string;
        estimatedFee: {
            usd: string;
            eth: string;
        };
        functionName: string;
        data: string;
        safeThreshold?: number;
        safeConfirmations?: number;
        safeRequiresAdditionalConfirmation?: boolean;
        safeAdditionalWalletType?: WalletType;
    };
}

// Forward ref to allow parent components to call methods on QuestionComponent
import React, { forwardRef, useImperativeHandle } from "react";

const SingleQuestionPage = forwardRef((props: SingleQuestionPageProps, ref) => {
    const [showWalletPopup, setShowWalletPopup] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const router = useRouter();

    // Extract common props
    const {
        questionNumber,
        question,
        type,
        feedbackContent,
        prevPageUrl,
        nextPageUrl
    } = props;

    // Extract type-specific props
    const options = type === 'single' || type === 'multi' ? props.options : [];
    const correctAnswers = type === 'single' || type === 'multi' ? props.correctAnswers : [];
    const expectedAction = type === 'signOrReject' ? props.expectedAction : undefined;
    const walletType = type === 'signOrReject' ? props.walletType : undefined;
    const transactionDetails = type === 'signOrReject' ? props.transactionDetails : undefined;
    const fakeWebsiteType = 'fakeWebsiteType' in props ? props.fakeWebsiteType : undefined;
    const fakeWebsiteEdition = 'fakeWebsiteEdition' in props ? props.fakeWebsiteEdition : undefined;

    // Reference to the actual question component for multi-choice questions
    const questionComponentRef = useRef(null);

    // Forward the handleWalletInteractionResult method to parent components
    useImperativeHandle(ref, () => ({
        handleWalletInteractionResult: (action: "sign" | "reject") => {
            if (type === "signOrReject") {
                handleWalletAction(action);
            } else if (questionComponentRef.current) {
                // @ts-ignore
                questionComponentRef.current.handleWalletInteractionResult(action);
            }
        }
    }));

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
            setIsCorrect(action === expectedAction);
            setShowFeedback(true);
            setFeedbackPage(1);
            setHasAnswered(true);
        }
    };

    // Navigation for feedback pages
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

    console.log("Fake website type:", fakeWebsiteType);
    console.log("Fake website edition:", fakeWebsiteEdition);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Main content container - not affected by wallet popup */}
            <div className="w-full">
                {/* For sign/reject questions, just show a simple header area */}
                {type === "signOrReject" ? (
                    <div className="bg-gray-50 py-8 px-4 sm:px-8 md:px-20">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-2xl font-bold mb-6 text-gray-900">{questionNumber}. {question}</h1>

                            <p className="mb-4 text-gray-700">
                                This question requires you to interact with a wallet. Review the scenario below and decide whether to sign or reject the transaction.
                            </p>

                            {/* Navigation buttons */}
                            <div className="flex justify-between">
                                {prevPageUrl && (
                                    <button
                                        onClick={handlePrevQuestion}
                                        className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
                                    >
                                        <FaChevronLeft className="mr-2" />
                                        Previous
                                    </button>
                                )}

                                {/* Only show next button after answering */}
                                {hasAnswered && nextPageUrl && (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                    >
                                        Next
                                        <FaChevronRight className="ml-2" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // For multi-choice questions, use the normal QuestionComponent
                    <QuestionComponent
                        ref={questionComponentRef}
                        question={`${questionNumber}. ${question}`}
                        options={options}
                        correctAnswers={correctAnswers}
                        type={type}
                        feedbackContent={feedbackContent}
                        onPrevQuestion={prevPageUrl ? handlePrevQuestion : undefined}
                        onNextQuestion={nextPageUrl ? handleNextQuestion : undefined}
                    />
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

                {/* Feedback displayed for sign/reject questions */}
                {type === "signOrReject" && showFeedback && (
                    <div className="max-w-6xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
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

            {/* Wallet Popup Component for sign/reject questions */}
            {showWalletPopup && type === "signOrReject" && transactionDetails && (
                <WalletPopupComponent
                    isOpen={showWalletPopup}
                    walletType={walletType!}
                    onClose={() => setShowWalletPopup(false)}
                    fromAccount={transactionDetails.fromAccount}
                    toAccount={transactionDetails.toAccount}
                    amount={transactionDetails.amount}
                    estimatedFee={transactionDetails.estimatedFee}
                    functionName={transactionDetails.functionName}
                    transactionData={transactionDetails.data}
                    onConfirm={() => handleWalletAction("sign")}
                    onReject={() => handleWalletAction("reject")}
                    safeThreshold={transactionDetails.safeThreshold}
                    safeConfirmations={transactionDetails.safeConfirmations}
                    safeRequiresAdditionalConfirmation={transactionDetails.safeRequiresAdditionalConfirmation}
                    safeAdditionalWalletType={transactionDetails.safeAdditionalWalletType}
                />
            )}
            {/* TODO- remove the below, merge with the above */}
            {/* Default Wallet Popup for non-sign/reject questions */}
            {showWalletPopup && type !== "signOrReject" && (
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
                    fromAccount="0x03FdC65e...25dEA"
                    toAccount="0x6b175474...71d0f"
                    amount="0 ETH"
                    estimatedFee={{ usd: "$3.1902", eth: "0.00127608ETH" }}
                />
            )}
        </div>
    );
});

// Add display name for debugging
SingleQuestionPage.displayName = "SingleQuestionPage";

export default SingleQuestionPage;