"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLightbulb, FaChevronLeft, FaChevronRight, FaArrowLeft, FaArrowRight, FaLock, FaChevronDown } from "react-icons/fa";

export default function QuestionPage() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showWalletPopup, setShowWalletPopup] = useState(false);
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);

    const options = [
        { id: "A", text: "Interact with the DAI smart contract" },
        { id: "B", text: "Instantly transfer all my funds to an attacker" },
        { id: "C", text: "Approve an attacker to spend all my DAI" },
        { id: "D", text: "Approve an attacker to spend all my ETH" },
    ];

    const toggleOption = (optionId: string) => {
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions(selectedOptions.filter(id => id !== optionId));
        } else {
            setSelectedOptions([...selectedOptions, optionId]);
        }
    };

    const checkAnswer = () => {
        // In this case, correct answers are A and C (based on highlighted options in Image 2)
        const correctAnswers = ["A", "C"];

        // Simple check for equality of arrays (ignoring order)
        const isEqual = selectedOptions.length === correctAnswers.length &&
            correctAnswers.every(item => selectedOptions.includes(item));

        setIsCorrect(isEqual);
        setShowFeedback(true);
        setFeedbackPage(1);
        setHasAnswered(true);
    };

    const nextFeedbackPage = () => {
        if (feedbackPage < 3) {
            setFeedbackPage(feedbackPage + 1);
        }
    };

    const prevFeedbackPage = () => {
        if (feedbackPage > 1) {
            setFeedbackPage(feedbackPage - 1);
        }
    };

    const handleSignInClick = () => {
        setShowWalletPopup(true);
    };

    const getOptionClass = (optionId: string) => {
        if (!hasAnswered) {
            return selectedOptions.includes(optionId)
                ? 'bg-green-100 border-green-500 text-gray-900'
                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900';
        }

        // After answering, color depends on correctness
        const correctAnswers = ["A", "C"];
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
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Main content container - not affected by wallet popup */}
            <div className="w-full">
                {/* Question Section */}
                <div className="bg-gray-50 py-8 px-4 sm:px-8 md:px-20">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900">7. If this is a phishing site, then what's the phishing transaction attempting to do?</h1>

                        <p className="mb-4 text-gray-700">
                            Choose <span className="text-blue-600 font-medium">one or many</span> options
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => !hasAnswered && toggleOption(option.id)}
                                    disabled={hasAnswered}
                                    className={`p-4 text-left rounded-md shadow-sm border transition duration-150 ${getOptionClass(option.id)}`}
                                >
                                    {option.id}) {option.text}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Link
                                href="/"
                                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
                            >
                                <FaChevronLeft className="mr-2" />
                                Previous
                            </Link>

                            {!hasAnswered ? (
                                <button
                                    onClick={checkAnswer}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Next
                                    <FaChevronRight className="ml-2" />
                                </button>
                            )}
                        </div>

                        {/* Feedback displayed directly below (not as a popup) */}
                        {showFeedback && (
                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-start">
                                    <FaLightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            That's {isCorrect ? "correct" : "incorrect"}. Let's see why:
                                        </h3>

                                        {feedbackPage === 1 && (
                                            <div className="mt-2 text-gray-700">
                                                <p>We have to <strong>analyze the transaction's target and details</strong> to understand what it's doing. While experts could do this, most users don't check — or don't understand — <span className="underline">the data field</span> of transactions.</p>
                                            </div>
                                        )}

                                        {feedbackPage === 2 && (
                                            <div className="mt-2 text-gray-700">
                                                <p>So what can you do?</p>
                                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                                    <li>Double-check websites before connecting your wallet.</li>
                                                    <li>Avoid signing transactions on suspicious websites.</li>
                                                    <li>Be aware of the risks of signing transactions you don't fully understand.</li>
                                                    <li>Only use wallets that provide risk alerts and user-friendly messages when sending transactions.</li>
                                                </ul>
                                            </div>
                                        )}

                                        {feedbackPage === 3 && (
                                            <div className="mt-2 text-gray-700">
                                                <p>Always verify the website and transaction before signing. If something looks suspicious, it probably is!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Page {feedbackPage} of 3
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

                                        {feedbackPage < 3 && (
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

                {/* Simulated Website Section */}
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-8 relative">
                    {/* Browser Navigation Bar */}
                    <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-100">
                        <div className="flex items-center space-x-2">
                            <FaArrowLeft className="text-gray-500" />
                            <FaArrowRight className="text-gray-500" />
                        </div>
                        <div className="flex items-center ml-4 flex-1">
                            <FaLock className="text-gray-500 mx-2" />
                            <span className="text-gray-600 text-sm">https://speakers.ethereum-devcon.org</span>
                        </div>
                    </div>

                    {/* Website Content */}
                    <div className="relative">
                        {/* Header Image */}
                        <div className="w-full h-40 bg-gradient-to-r from-purple-400 via-blue-300 to-purple-300 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-4xl font-bold opacity-80">
                                    DCⵖSEA
                                </div>
                            </div>
                        </div>

                        {/* Website Content */}
                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">Welcome back!</h2>

                            <p className="mb-4 text-gray-700">
                                You do not need an account to view the event, or submit feedback, or receive schedule updates. You'll only need an account if you participate in the event as speaker or as an organiser.
                            </p>

                            <p className="mb-8 text-gray-700">
                                If you already created a proposal for a different event on this server, you can re-use your account to log in for this event.
                            </p>

                            <button
                                onClick={handleSignInClick}
                                className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                            >
                                Sign in with Ethereum
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Popup Overlay */}
            {showWalletPopup && (
                <div
                    className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform"
                    style={{
                        animation: 'slideIn 0.3s ease-out forwards'
                    }}
                >
                    <style jsx>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <FaLock className="text-gray-600 text-xs" />
                            </div>
                            <span className="font-medium text-gray-900">Wallet</span>
                        </div>
                        <button onClick={() => setShowWalletPopup(false)} className="text-gray-400 hover:text-gray-500">
                            ✕
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Confirm transaction</h3>
                            <div className="text-sm text-gray-500">Ethereum mainnet</div>
                        </div>

                        <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">From (your account)</div>
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mr-2"></div>
                                <span className="text-sm font-mono text-gray-800">0x03FdC65e...25dEA</span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">To</div>
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm font-mono text-gray-800">0x6b175474...71d0f</span>
                            </div>
                        </div>

                        <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-700">Amount</span>
                            <span className="text-sm font-medium text-gray-900">0 ETH</span>
                        </div>

                        <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-700">Estimated fee</span>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">$3.1902</div>
                                <div className="text-xs text-gray-500">0.00127608ETH</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <button
                                onClick={() => setShowTransactionDetails(!showTransactionDetails)}
                                className="w-full text-blue-600 text-sm border border-blue-600 rounded-md px-3 py-1 flex items-center justify-center"
                            >
                                View details <FaChevronDown className={`ml-1 text-xs transition-transform duration-200 ${showTransactionDetails ? 'transform rotate-180' : ''}`} />
                            </button>

                            {showTransactionDetails && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500">Function:</span>
                                        <span className="text-xs font-mono ml-2 text-gray-800">approve(address,uint256)</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">Data:</span>
                                        <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs text-gray-800 break-all">
                                            0x095ea7b3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Reject
                            </button>
                            <button
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}