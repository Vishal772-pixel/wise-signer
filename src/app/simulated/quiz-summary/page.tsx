
"use client";

import QuizSummaryComponent from "@/components/QuizSummaryComponent";
import { useRouter } from "next/navigation";

export default function QuizSummaryPage() {
    const router = useRouter();

    const handleRestartQuiz = () => {
        // Clear the localStorage results
        localStorage.removeItem('quizResults');
        // Redirect to the first question
        router.push('/simulated/questions/1');
    };

    return <QuizSummaryComponent onRestartQuiz={handleRestartQuiz} />;
}