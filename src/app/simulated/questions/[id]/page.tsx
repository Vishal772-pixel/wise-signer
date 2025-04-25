"use client";

import { useParams, notFound } from "next/navigation";
import PageRenderer from "@/components/PageRenderer";
import { getQuestionById, getNextQuestionId, getPrevQuestionId } from "@/data/questions";

export default function QuestionPage() {
    const params = useParams();
    const questionId = parseInt(params.id as string);

    // Get question data
    const question = getQuestionById(questionId);

    // Handle case where question doesn't exist
    if (!question) {
        return notFound();
    }

    // Get next and previous question IDs for navigation
    const nextId = getNextQuestionId(questionId);
    const prevId = getPrevQuestionId(questionId);

    // Create URLs for navigation
    const nextPageUrl = nextId ? `/simulated/questions/${nextId}` : undefined;
    const prevPageUrl = prevId ? `/simulated/questions/${prevId}` : undefined;

    // Create the props for the PageRenderer component based on question type
    const commonProps = {
        questionNumber: question.id,
        question: question.question,
        feedbackContent: question.feedbackContent,
        questionContext: question.questionContext, // Add context to common props
        prevPageUrl,
        nextPageUrl
    };

    if (question.type === "single" || question.type === "multi") {
        // Multiple choice question
        return (
            <PageRenderer
                {...commonProps}
                type={question.type}
                options={question.options}
                correctAnswers={question.correctAnswers}
            />
        );
    } else if (question.type === "signOrReject") {
        // Sign or Reject question
        return (
            <PageRenderer
                {...commonProps}
                type="signOrReject"
                expectedAction={question.expectedAction}
                fakeWebsiteType={question.fakeWebsiteType}
                fakeWebsiteEdition={question.fakeWebsiteEdition}
                interactionButtonText={question.interactionButtonText}
                walletType={question.walletType}
                transactionOrSignatureDetails={question.transactionOrSignatureData}
                wrongAnswerPopupContent={question.wrongAnswerPopupContent}
            />
        );
    }

    // Fallback - should never reach here
    return notFound();
}