import Link from "next/link"
import { StarIcon, ShieldIcon, ZapIcon, GiftIcon, PercentIcon, ClockIcon, ExternalLinkIcon } from "lucide-react"
import type { Casino } from "@/lib/content"

interface CasinoListProps {
  casinos: Casino[]
}

export function CasinoList({ casinos }: CasinoListProps) {
  return (
    <div className="space-y-8">
      {casinos.map((casino, index) => {
        // Asegurarse de que los pros sean un array
        const pros = Array.isArray(casino.pros) ? casino.pros : []

        return (
          <div
            key={casino.id}
            className="bg-white rounded-xl shadow-md border-l-4 border-[#FF4D8D] border-t border-r border-b border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg relative"
          >
            {index === 0 && (
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-[#0f172a] text-white px-4 py-1 rounded-bl-lg font-bold text-sm shadow-md">
                  TOPP VALG
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
              {/* Logo y rating */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-28 h-28 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md">
                    {casino.logo ? (
                      <img
                        src={casino.logo || "/placeholder.svg"}
                        alt={`${casino.name} logo`}
                        className="max-h-20 max-w-20 object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.parentElement!.innerHTML =
                            `<div class="text-xl font-bold text-white text-center p-2">${casino.name}</div>`
                        }}
                      />
                    ) : (
                      <div className="text-xl font-bold text-white text-center p-2">{casino.name}</div>
                    )}
                  </div>
                  <div className="absolute -top-3 -left-3 bg-[#FF4D8D] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(casino.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-lg font-medium">{casino.rating}</div>
              </div>

              {/* Bonus info */}
              <div className="md:col-span-4">
                <div className="flex items-center mb-3">
                  <GiftIcon className="w-5 h-5 text-[#FF4D8D] mr-2" />
                  <h3 className="font-semibold text-[#0f172a]">Velkomstbonus</h3>
                </div>

                <div className="text-xl font-bold text-[#0f172a] mb-3">{casino.bonus}</div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>Min. innskudd: {casino.minimumDeposit}kr</span>
                </div>

                <div className="flex items-center text-sm text-blue-600">
                  <PercentIcon className="w-4 h-4 mr-1" />
                  <span>35x omsetningskrav</span>
                </div>
              </div>

              {/* Features */}
              <div className="md:col-span-3">
                <h3 className="font-semibold text-[#0f172a] mb-3 border-b-2 border-[#FF4D8D] inline-block pb-1">
                  Fordeler
                </h3>
                <ul className="space-y-3">
                  {pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start">
                      <ShieldIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="md:col-span-3 flex flex-col items-center justify-center">
                <a
                  href={casino.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0f172a] hover:bg-[#1a2744] text-white py-3 px-6 rounded-lg font-bold text-center text-base transition-all duration-300 mb-3 shadow-md"
                >
                  SPILL NÅ
                </a>

                <Link
                  href={`/casinos/${casino.slug || casino.id}`}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0f172a] py-2.5 px-6 rounded-lg font-medium text-center text-sm transition-all duration-300 flex items-center justify-center"
                >
                  <ExternalLinkIcon className="w-4 h-4 mr-1" />
                  Les anmeldelse
                </Link>

                <div className="text-xs text-[#FF4D8D] font-medium mt-3 flex items-center">
                  <ZapIcon className="w-3 h-3 mr-1" />
                  Rask registrering
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

