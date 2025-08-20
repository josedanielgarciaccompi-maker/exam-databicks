export interface Question {
  id: number
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  image?: string
  correctAnswer: string
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  score: number
  answers: {
    questionId: number
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }[]
}
