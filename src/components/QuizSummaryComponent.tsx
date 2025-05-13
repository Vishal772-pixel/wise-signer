"use client";

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FaTwitter } from 'react-icons/fa';

interface QuizResult {
    id: number;
    isCorrect: boolean;
}

interface QuizSummaryProps {
    onRestartQuiz: () => void;
}

const QuizSummaryComponent = ({ onRestartQuiz }: QuizSummaryProps) => {
    const [summary, setSummary] = useState({ total: 0, correct: 0 });

    useEffect(() => {
        // Trigger confetti when component mounts
        fireConfetti();

        // Import the total number of questions from the questions array
        import('@/data/questions').then(module => {
            const totalQuestions = module.questions.length;

            // Load quiz results from localStorage
            try {
                const resultsJSON = localStorage.getItem('quizResults');
                if (resultsJSON) {
                    const results: QuizResult[] = JSON.parse(resultsJSON);
                    const correctAnswers = results.filter(result => result.isCorrect).length;
                    setSummary({ total: totalQuestions, correct: correctAnswers });
                } else {
                    setSummary({ total: totalQuestions, correct: 0 });
                }
            } catch (error) {
                console.error("Error retrieving quiz results:", error);
                setSummary({ total: totalQuestions, correct: 0 });
            }
        });
    }, []);

    const fireConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        // Run the confetti multiple times with different settings
        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#1DA1F2', '#17BF63', '#F45D22', '#794BC4', '#FFAD1F']
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#1DA1F2', '#17BF63', '#F45D22', '#794BC4', '#FFAD1F']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const handleRestartQuiz = () => {
        // Clear the localStorage results 
        localStorage.removeItem('quizResults');
        onRestartQuiz();
    };

    // Generate tweet text based on score
    const tweetText = `I scored ${summary.correct} out of ${summary.total} on the @cyfrinaudits wise-signer!\n\nTest your knowledge of crypto wallet security.\n\nhttps://wise-signer.cyfrin.io/`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    const getScoreMessage = () => {
        const percentage = (summary.correct / summary.total) * 100;

        if (percentage === 100) return "Perfect! You're a Web3 security expert!";
        if (percentage >= 80) return "Great job! You've got solid Web3 security knowledge!";
        if (percentage >= 60) return "Good work! You've got the basics down.";
        return "Keep learning! Web3 security is an ongoing journey.";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
                <h2 className="text-xl text-gray-600 mb-6">{getScoreMessage()}</h2>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                        {summary.correct} / {summary.total}
                    </p>
                    <p className="text-gray-700">
                        Correct answers
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <a
                        href={tweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1DA1F2] text-white font-medium transition hover:bg-[#1a94df]"
                    >
                        <FaTwitter size={20} />
                        Share on Twitter
                    </a>

                    <button
                        onClick={handleRestartQuiz}
                        className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-medium transition hover:bg-gray-200 cursor-pointer"
                    >
                        Restart Quiz
                    </button>
                </div>

                <div className="mt-8 text-gray-500 text-sm">
                    <p className="mb-2">Want to learn more about Web3 security?</p>
                    <a
                        href="https://updraft.cyfrin.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                        Continue learning about signing and security at Cyfrin Updraft
                    </a>
                </div>
            </div>
        </div>
    );
};

export default QuizSummaryComponent;