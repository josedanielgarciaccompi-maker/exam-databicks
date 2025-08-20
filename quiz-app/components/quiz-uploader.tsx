"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet } from "lucide-react"
import type { Question } from "@/types/quiz"
import * as XLSX from "xlsx"

interface QuizUploaderProps {
  onQuestionsLoaded: (questions: Question[]) => void
}

export function QuizUploader({ onQuestionsLoaded }: QuizUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          if (jsonData.length < 2) {
            throw new Error("El archivo debe tener al menos una fila de encabezados y una fila de datos")
          }

          const questions: Question[] = []
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[]

            if (row.length < 7) {
              console.warn(`Fila ${i + 1} omitida: no tiene suficientes columnas`)
              continue
            }

            if (!row[0] || row[0].toString().trim() === "") {
              console.warn(`Fila ${i + 1} omitida: pregunta vacía`)
              continue
            }

            const question: Question = {
              id: i,
              question: row[0].toString().trim(),
              option1: row[1]?.toString().trim() || "",
              option2: row[2]?.toString().trim() || "",
              option3: row[3]?.toString().trim() || "",
              option4: row[4]?.toString().trim() || "",
              option5: row[5]?.toString().trim() || "",
              image: row[6]?.toString().trim() || undefined,
              correctAnswer: row[7]?.toString().trim() || "",
            }

            const options = [question.option1, question.option2, question.option3, question.option4, question.option5]
            if (!options.includes(question.correctAnswer)) {
              console.warn(
                `Fila ${i + 1}: La respuesta correcta "${question.correctAnswer}" no coincide con ninguna opción`,
              )
            }

            questions.push(question)
          }

          if (questions.length === 0) {
            throw new Error("No se encontraron preguntas válidas en el archivo")
          }

          console.log(`Se cargaron ${questions.length} preguntas exitosamente`)
          onQuestionsLoaded(questions)
          setIsLoading(false)
        } catch (parseError) {
          console.error("Error al procesar el archivo:", parseError)
          setError(parseError instanceof Error ? parseError.message : "Error al procesar el archivo")
          setIsLoading(false)
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error("Error al leer el archivo:", error)
      setError("Error al leer el archivo. Asegúrate de que sea un archivo Excel válido.")
      setIsLoading(false)
    }
  }

  const loadSampleQuiz = () => {
    const sampleQuestions: Question[] = [
      {
        id: 1,
        question: "¿Cuál es la capital de España?",
        option1: "Madrid",
        option2: "Barcelona",
        option3: "Valencia",
        option4: "Sevilla",
        option5: "Bilbao",
        correctAnswer: "Madrid",
        image: "/mapa-de-espana.png",
      },
      {
        id: 2,
        question: "¿En qué año se descubrió América?",
        option1: "1490",
        option2: "1491",
        option3: "1492",
        option4: "1493",
        option5: "1494",
        correctAnswer: "1492",
      },
      {
        id: 3,
        question: "¿Cuál es el planeta más grande del sistema solar?",
        option1: "Tierra",
        option2: "Marte",
        option3: "Júpiter",
        option4: "Saturno",
        option5: "Neptuno",
        correctAnswer: "Júpiter",
        image: "/planeta-jupiter.png",
      },
      {
        id: 4,
        question: "¿Cuál es la fórmula química del agua?",
        option1: "H2O",
        option2: "CO2",
        option3: "NaCl",
        option4: "CH4",
        option5: "O2",
        correctAnswer: "H2O",
      },
      {
        id: 5,
        question: "¿Quién escribió 'Don Quijote de la Mancha'?",
        option1: "Lope de Vega",
        option2: "Miguel de Cervantes",
        option3: "Federico García Lorca",
        option4: "Calderón de la Barca",
        option5: "Tirso de Molina",
        correctAnswer: "Miguel de Cervantes",
      },
    ]

    onQuestionsLoaded(sampleQuestions)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Quiz App</CardTitle>
          <CardDescription>
            Sube tu archivo Excel con preguntas y respuestas para comenzar el test
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              Formato: Pregunta | Opción1 | Opción2 | Opción3 | Opción4 | Opción5 | Imagen | Respuesta
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-muted-foreground">
                Arrastra tu archivo Excel aquí o{" "}
                <span className="text-primary hover:underline">selecciona un archivo</span>
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>

          {error && (
            <div className="text-center p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">o</p>
            <Button onClick={loadSampleQuiz} variant="outline" className="w-full bg-transparent" disabled={isLoading}>
              <Upload className="mr-2 h-4 w-4" />
              Usar preguntas de ejemplo
            </Button>
          </div>

          {isLoading && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Procesando archivo...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
