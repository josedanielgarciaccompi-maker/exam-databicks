"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import type { Question, QuizResult } from "@/types/quiz"
import Image from "next/image"

interface QuizInterfaceProps {
  questions: Question[]
  onQuizComplete: (result: QuizResult) => void
  onBack: () => void
}

export function QuizInterface({ questions, onQuizComplete, onBack }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeElapsed, setTimeElapsed] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleFinishQuiz = () => {
    const answers = questions.map((question) => {
      const selectedAnswer = selectedAnswers[question.id] || ""
      const isCorrect = selectedAnswer === question.correctAnswer

      return {
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      }
    })

    const correctAnswers = answers.filter((answer) => answer.isCorrect).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      score,
      answers,
    }

    onQuizComplete(result)
  }

  const options = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
    currentQuestion.option5,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header con progreso */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Pregunta */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Imagen de apoyo */}
            {currentQuestion.image && (
              <div className="flex justify-center">
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden">
                  <Image
                    src={currentQuestion.image || "/placeholder.svg"}
                    alt="Imagen de apoyo para la pregunta"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Opciones de respuesta */}
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-card transition-colors"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navegación */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]} className="min-w-[120px]">
                {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
                {currentQuestionIndex < questions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
