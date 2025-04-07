"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadImageAction } from "./actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Función para convertir una URL a File
async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

export default function UploadExperts() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 3 })

  const expertImages = [
    {
      name: "Lars-Hansen.jpg",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lars-Hansen.jpg-rqHrWcx0RHGLU1mf2tO7ykq3uxSJWz.jpeg",
      description: "Casino expert Lars Hansen",
    },
    {
      name: "Ole-Johansen.jpg",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ole-Johansen.jpg-SzklRJbLG5cBrqSpxV8FqaXpBr3lz7.jpeg",
      description: "Casino expert Ole Johansen",
    },
    {
      name: "Ingrid-Dahl.jpg",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ingrid-Dahl.jpg-GgnKMsNZwML4FtoWgKT6qjqPvaScvL.jpeg",
      description: "Casino expert Ingrid Dahl",
    },
  ]

  const uploadAllImages = async () => {
    setIsUploading(true)
    setProgress({ current: 0, total: expertImages.length })

    for (let i = 0; i < expertImages.length; i++) {
      const expert = expertImages[i]
      try {
        // Convertir URL a File
        const file = await urlToFile(expert.url, expert.name)

        // Crear FormData y añadir el archivo
        const formData = new FormData()
        formData.append("file", file)

        // Subir la imagen
        const result = await uploadImageAction(formData)

        if (result.success) {
          toast({
            title: `Uploaded ${expert.name}`,
            description: `${expert.description} image uploaded successfully`,
          })
        } else {
          toast({
            title: `Failed to upload ${expert.name}`,
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error(`Error uploading ${expert.name}:`, error)
        toast({
          title: `Error uploading ${expert.name}`,
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }

      // Actualizar progreso
      setProgress({ current: i + 1, total: expertImages.length })
    }

    setIsUploading(false)

    // Redirigir a la galería de medios después de completar
    setTimeout(() => {
      router.push("/admin/media")
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Expert Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expertImages.map((expert) => (
                <div key={expert.name} className="border rounded-md p-4">
                  <div className="aspect-square relative mb-2">
                    <img
                      src={expert.url || "/placeholder.svg"}
                      alt={expert.description}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  <p className="font-medium">{expert.name}</p>
                  <p className="text-sm text-gray-500">{expert.description}</p>
                </div>
              ))}
            </div>

            {isUploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center">
                  Uploading {progress.current} of {progress.total} images...
                </p>
              </div>
            ) : (
              <Button onClick={uploadAllImages} className="w-full">
                Upload All Expert Images
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

