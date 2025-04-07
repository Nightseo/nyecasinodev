import Link from "next/link"
import { notFound } from "next/navigation"
import { getCasinoById, getAllCasinos } from "@/lib/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon, CheckIcon, XIcon, ArrowLeftIcon } from "lucide-react"

// Función para generar rutas estáticas
export async function generateStaticParams() {
  const casinos = getAllCasinos()

  // Generar rutas para IDs y slugs
  const params = []

  for (const casino of casinos) {
    // Añadir ID
    params.push({ id: casino.id })

    // Añadir slug si existe y es diferente del ID
    if (casino.slug && casino.slug !== casino.id) {
      params.push({ id: casino.slug })
    }
  }

  return params
}

export default function CasinoPage({ params }: { params: { id: string } }) {
  // Buscar el casino por slug o por ID
  const allCasinos = getAllCasinos()
  const casinoBySlug = allCasinos.find((c) => c.slug === params.id)

  // Si encontramos por slug, usamos ese ID, de lo contrario usamos el parámetro como ID
  const casinoId = casinoBySlug ? casinoBySlug.id : params.id
  const casino = getCasinoById(casinoId)

  if (!casino) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center text-[#FF4D8D] hover:text-[#d93a73] mb-6 transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        <span>Tilbake til alle kasinoer</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            {casino.logo ? (
              <div className="w-32 h-32 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md mr-6">
                <img
                  src={casino.logo || "/placeholder.svg"}
                  alt={`${casino.name} logo`}
                  className="max-h-24 max-w-24 object-contain p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement!.innerHTML =
                      `<div class="text-2xl font-bold text-white text-center p-4">${casino.name}</div>`
                  }}
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md mr-6">
                <div className="text-2xl font-bold text-white text-center p-4">{casino.name}</div>
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold text-[#0f172a] mb-2">{casino.name}</h1>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(casino.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-lg font-medium">{casino.rating}/5</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: casino.review || "" }} />
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-[#0f172a] text-white">
              <CardTitle>Rask Informasjon</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Minimum Innskudd</h3>
                  <p className="text-xl font-bold text-[#0f172a]">{casino.minimumDeposit}kr</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Bonus</h3>
                  <p className="text-lg text-[#0f172a]">{casino.bonus}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500 mb-2">Betalingsmetoder</h3>
                  <div className="flex flex-wrap gap-2">
                    {casino.paymentMethods?.map((method, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={casino.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#0f172a] hover:bg-[#1a2744] text-white py-3 px-6 rounded-lg font-bold text-center text-base transition-all duration-300 shadow-md mt-4"
                >
                  SPILL NÅ
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-[#0f172a] text-white">
              <CardTitle>Fordeler og Ulemper</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium flex items-center text-green-600 mb-3">
                    <CheckIcon className="w-5 h-5 mr-2" /> Fordeler
                  </h3>
                  <ul className="space-y-2">
                    {casino.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium flex items-center text-red-600 mb-3">
                    <XIcon className="w-5 h-5 mr-2" /> Ulemper
                  </h3>
                  <ul className="space-y-2">
                    {casino.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <XIcon className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

