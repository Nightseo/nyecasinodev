import { getAllCasinos, getHomePage, getPageBySlug } from "@/lib/content"
import { CasinoList } from "@/components/casino-list"

export default function Home() {
  // Get all casinos
  const casinos = getAllCasinos()

  // Get homepage content or fallback to top-casinos page
  const homePage = getHomePage() || getPageBySlug("top-casinos")

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Top Rated Casinos</h1>

      <CasinoList casinos={casinos} />
    </main>
  )
}

