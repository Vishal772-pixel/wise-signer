"use client";

import { notFound } from "next/navigation";
import PageRenderer from "@/components/PageRenderer";
import { getQuestionById, getNextQuestionId, getPrevQuestionId } from "@/data/questions";

export default function QuestionPage({ questionId }: { questionId: number }) {
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

    // Check if this is the last question
    const isLastQuestion = nextId === null;

    // Create the props for the PageRenderer component based on question type
    const commonProps = {
        questionNumber: questionId,
        question: question.question,
        feedbackContent: question.feedbackContent,
        questionContext: question.questionContext,
        prevPageUrl,
        nextPageUrl,
        isLastQuestion
    };

    if (question.type === "single" || question.type === "multi") {
        return (
            <PageRenderer
                {...commonProps}
                type={question.type}
                options={question.options}
                correctAnswers={question.correctAnswers}
            />
        );
    } else if (question.type === "signOrReject") {
        return (
            <PageRenderer
                {...commonProps}
                type="signOrReject"
                expectedAction={question.expectedAction}
                fakeWebsiteType={question.fakeWebsiteType}
                questionId={questionId}
                interactionButtonText={question.interactionButtonText}
                walletType={question.walletType}
                transactionOrSignatureDetails={question.transactionOrSignatureData}
                wrongAnswerPopupContent={question.wrongAnswerPopupContent}
            />
        );
    }

    return notFound();
}