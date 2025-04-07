import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"
import type { Casino } from "@/lib/content"

interface CasinoCardProps {
  casino: Casino
}

export function CasinoCard({ casino }: CasinoCardProps) {
  // Usar el slug si está disponible, de lo contrario usar el ID
  const casinoUrl = casino.slug ? `/casinos/${casino.slug}` : `/casinos/${casino.id}`

  return (
    <Card className="h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="w-full h-24 bg-gray-50 flex items-center justify-center rounded-md mb-4">
          {casino.logo ? (
            <img
              src={casino.logo || "/placeholder.svg"}
              alt={`${casino.name} logo`}
              className="max-h-20 max-w-full object-contain p-2"
              onError={(e) => {
                console.error("Error loading image:", casino.logo)
                e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 text-center">No logo</div>'
              }}
            />
          ) : (
            <div className="text-gray-400 text-center">No logo</div>
          )}
        </div>

        <CardTitle className="text-xl">{casino.name}</CardTitle>
        <CardDescription>Min. Deposit: ${casino.minimumDeposit}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${i < Math.round(casino.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{casino.rating}/5</span>
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

