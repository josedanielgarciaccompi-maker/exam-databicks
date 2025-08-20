"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, Home } from "lucide-react"
import type { QuizResult, Question } from "@/types/quiz"

interface QuizResultsProps {
  result: QuizResult
  questions: Question[]
  onRestart: () => void
  onHome: () => void
}

export function QuizResults({ result, questions, onRestart, onHome }: QuizResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "¡Excelente trabajo!"
    if (score >= 80) return "¡Muy bien!"
    if (score >= 70) return "Buen trabajo"
    if (score >= 60) return "Puedes mejorar"
    return "Necesitas estudiar más"
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Resumen de resultados */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl">¡Quiz Completado!</CardTitle>
            <CardDescription>{getScoreMessage(result.score)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>{result.score}%</div>
              <Progress value={result.score} className="h-3 mb-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-2xl font-bold text-foreground">{result.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total de preguntas</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Respuestas correctas</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</div>
                <div className="text-sm text-muted-foreground">Respuestas incorrectas</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={onRestart} className="min-w-[140px]">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
              <Button variant="outline" onClick={onHome} className="min-w-[140px] bg-transparent">
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revisión detallada */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Revisión de Respuestas</CardTitle>
            <CardDescription>Revisa tus respuestas y las correctas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.answers.map((answer, index) => {
              const question = questions.find((q) => q.id === answer.questionId)
              if (!question) return null

              return (
                <div key={answer.questionId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        {index + 1}. {question.question}
                      </h4>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Tu respuesta:</span>
                          <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                            {answer.selectedAnswer || "Sin respuesta"}
                          </Badge>
                        </div>

                        {!answer.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Respuesta correcta:</span>
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              {answer.correctAnswer}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
