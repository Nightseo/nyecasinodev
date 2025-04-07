"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ExpertsAdded() {
  const router = useRouter()

  // Redirigir automáticamente después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/admin/media")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Expert Images Added Successfully!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              The following expert images have been added to your media gallery:
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <img src="/images/Lars-Hansen.jpg" alt="Lars Hansen" className="w-full h-auto rounded-md mb-2" />
                <p className="text-sm font-medium">Lars Hansen</p>
              </div>
              <div className="text-center">
                <img src="/images/Ole-Johansen.jpg" alt="Ole Johansen" className="w-full h-auto rounded-md mb-2" />
                <p className="text-sm font-medium">Ole Johansen</p>
              </div>
              <div className="text-center">
                <img src="/images/Ingrid-Dahl.jpg" alt="Ingrid Dahl" className="w-full h-auto rounded-md mb-2" />
                <p className="text-sm font-medium">Ingrid Dahl</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">Redirecting to media gallery in 5 seconds...</p>

            <Button asChild className="w-full">
              <Link href="/admin/media">Go to Media Gallery</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

