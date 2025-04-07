import type React from "react"
import type { Metadata } from "next"
import { getAllCasinos, getCasinoById } from "@/lib/content"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Buscar el casino por slug o por ID
  const allCasinos = getAllCasinos()
  const casinoBySlug = allCasinos.find((c) => c.slug === params.id)

  // Si encontramos por slug, usamos ese ID, de lo contrario usamos el parámetro como ID
  const casinoId = casinoBySlug ? casinoBySlug.id : params.id
  const casino = getCasinoById(casinoId)

  if (!casino) {
    return {
      title: "Casino Not Found",
      description: "The requested casino could not be found.",
    }
  }

  const seo = casino.seo || {}

  return {
    title: seo.metaTitle || `${casino.name} Review - Rating: ${casino.rating}/5`,
    description:
      seo.metaDescription ||
      `Read our detailed review of ${casino.name}. Minimum deposit: $${casino.minimumDeposit}, Bonus: ${casino.bonus}`,
    keywords: seo.keywords,
    openGraph: seo.ogImage
      ? {
          images: [{ url: seo.ogImage }],
        }
      : undefined,
    robots: seo.noIndex ? { index: false } : undefined,
    alternates: seo.canonicalUrl
      ? {
          canonical: seo.canonicalUrl,
        }
      : undefined,
  }
}

export default function CasinoLayout({ children, params }: Props) {
  // Buscar el casino por slug o por ID
  const allCasinos = getAllCasinos()
  const casinoBySlug = allCasinos.find((c) => c.slug === params.id)

  // Si encontramos por slug, usamos ese ID, de lo contrario usamos el parámetro como ID
  const casinoId = casinoBySlug ? casinoBySlug.id : params.id
  const casino = getCasinoById(casinoId)

  if (!casino) {
    notFound()
  }

  return children
}

