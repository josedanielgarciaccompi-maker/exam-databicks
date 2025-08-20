"use client"

import { useState } from "react"
import { QuizUploader } from "@/components/quiz-uploader"
import { QuizInterface } from "@/components/quiz-interface"
import { QuizResults } from "@/components/quiz-results"
import type { Question, QuizResult } from "@/types/quiz"

type AppState = "upload" | "quiz" | "results"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions)
    setAppState("quiz")
  }

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result)
    setAppState("results")
  }

  const handleRestart = () => {
    setAppState("quiz")
    setQuizResult(null)
  }

  const handleBackToHome = () => {
    setAppState("upload")
    setQuestions([])
    setQuizResult(null)
  }

  switch (appState) {
    case "upload":
      return <QuizUploader onQuestionsLoaded={handleQuestionsLoaded} />

    case "quiz":
      return <QuizInterface questions={questions} onQuizComplete={handleQuizComplete} onBack={handleBackToHome} />

    case "results":
      return quizResult ? (
        <QuizResults result={quizResult} questions={questions} onRestart={handleRestart} onHome={handleBackToHome} />
      ) : null

    default:
      return <QuizUploader onQuestionsLoaded={handleQuestionsLoaded} />
  }
}
