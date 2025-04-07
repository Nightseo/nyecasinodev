"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"
import type { Casino } from "@/lib/content"

// Componente para la imagen del casino
function CasinoImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="text-xl font-bold text-white text-center p-2">{alt}</div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="max-h-20 max-w-20 object-contain p-1"
      onError={() => setError(true)}
    />
  )
}

interface CasinoCardProps {
  casino: Casino
}

export function CasinoCard({ casino }: CasinoCardProps) {
  // Usar el slug si está disponible, de lo contrario usar el ID
  const casinoUrl = casino.slug ? `/casinos/${casino.slug}` : `/casinos/${casino.id}`

  return (
    <Card className="h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="w-28 h-28 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md mx-auto">
          {casino.logo ? (
            <CasinoImage
              src={casino.logo}
              alt={casino.name}
            />
          ) : (
            <div className="text-xl font-bold text-white text-center p-2">{casino.name}</div>
          )}
        </div>
        <CardTitle className="text-center mt-4">{casino.name}</CardTitle>
        <CardDescription>Min. Deposit: ${casino.minimumDeposit}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${i < Math.floor(casino.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 gap-2">
        <Button variant="outline" asChild className="w-1/2">
          <Link href={casinoUrl}>Read Review</Link>
        </Button>
        <Button asChild className="w-1/2 bg-blue-600 hover:bg-blue-700">
          <a href={casino.affiliateLink} target="_blank" rel="noopener noreferrer">
            Visit Casino
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

