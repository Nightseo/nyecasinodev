import Link from "next/link"
import { notFound } from "next/navigation"
import { getCasinoById, getAllCasinos } from "@/lib/content"
import { CasinoDetails } from "./casino-details"

// Función para generar rutas estáticas
export async function generateStaticParams() {
  const casinos = getAllCasinos()
  const params = casinos.map((casino) => ({
    id: casino.id,
  }))
  return params
}

export default function CasinoPage({ params }: { params: { id: string } }) {
  const casino = getCasinoById(params.id)

  if (!casino) {
    notFound()
  }

  return <CasinoDetails casino={casino} />
}

