// Añadir directiva 'server-only' para asegurar que este módulo solo se use en el servidor
import "server-only"

import fs from "fs"
import path from "path"

// Types
export interface SEOMetadata {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  ogImage?: string
  noIndex?: boolean
  canonicalUrl?: string
}

export interface Casino {
  id: string
  name: string
  slug?: string // Nuevo campo para el slug
  logo?: string // Nuevo campo para el logo
  minimumDeposit: number
  rating: number
  affiliateLink: string
  bonus: string
  paymentMethods: string[]
  pros: string[]
  cons: string[]
  review?: string
  seo?: SEOMetadata
}

export interface PageSection {
  type: string
  title?: string
  content?: string
  casinoIds?: string[]
  expertName?: string
  expertImage?: string
  expertContent?: string
}

export interface Page {
  id: string
  title: string
  slug: string
  isHomepage?: boolean
  sections?: PageSection[]
  seo?: SEOMetadata
}

// Helper functions
const contentDirectory = path.join(process.cwd(), "content")

// Ensure directory exists
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Check if path is a file
function isFile(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch (error) {
    return false
  }
}

// Casino functions
export function getAllCasinos(): Casino[] {
  try {
    const casinosDir = path.join(contentDirectory, "casinos")
    ensureDirectoryExists(casinosDir)

    const filePath = path.join(casinosDir, "index.json")

    // If the index file doesn't exist or is not a file, create it with an empty array
    if (!isFile(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8")
      return []
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading casinos:", error)
    return []
  }
}

// Actualizar la función getCasinoById para que también pueda buscar por slug
export function getCasinoById(id: string): Casino | null {
  try {
    // Primero intentamos buscar directamente por ID
    const filePath = path.join(contentDirectory, "casinos", `${id}.json`)
    if (isFile(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8")
      return JSON.parse(fileContents)
    }

    // Si no encontramos el archivo, buscamos en el índice por slug
    const allCasinos = getAllCasinos()
    const casinoBySlug = allCasinos.find((casino) => casino.slug === id)

    if (casinoBySlug) {
      // Si encontramos por slug, buscamos por ID
      const slugFilePath = path.join(contentDirectory, "casinos", `${casinoBySlug.id}.json`)
      if (isFile(slugFilePath)) {
        const fileContents = fs.readFileSync(slugFilePath, "utf8")
        return JSON.parse(fileContents)
      }
    }

    // Si no encontramos nada, retornamos null
    return null
  } catch (error) {
    // Si el archivo no existe, return null
    console.error(`Error reading casino ${id}:`, error)
    return null
  }
}

export function getCasinosByIds(ids: string[]): Casino[] {
  return ids.map((id) => getCasinoById(id)).filter((casino): casino is Casino => casino !== null)
}

// Page functions
export function getAllPages(): Page[] {
  try {
    const pagesDir = path.join(contentDirectory, "pages")
    ensureDirectoryExists(pagesDir)

    const filePath = path.join(pagesDir, "index.json")

    // If the index file doesn't exist or is not a file, create it with default pages
    if (!isFile(filePath)) {
      const defaultPages = [
        {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
        },
      ]
      fs.writeFileSync(filePath, JSON.stringify(defaultPages, null, 2), "utf8")
      return defaultPages
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading pages:", error)
    // Return a default page if there's an error
    return [
      {
        id: "home",
        title: "Home",
        slug: "home",
        isHomepage: true,
      },
    ]
  }
}

export function getPageBySlug(slug: string): Page | null {
  try {
    const filePath = path.join(contentDirectory, "pages", `${slug}.json`)
    if (!isFile(filePath)) {
      console.log(`Page file not found: ${filePath}`)
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    // If the file doesn't exist, return null
    console.error(`Error reading page ${slug}:`, error)
    return null
  }
}

export function getHomePage(): Page | null {
  const pages = getAllPages()
  const homePage = pages.find((page) => page.isHomepage)
  if (!homePage) return null

  // Try to get the full page data
  const fullHomePage = getPageBySlug(homePage.slug)

  // If the page file doesn't exist, return the basic info from the index
  if (!fullHomePage) {
    return {
      ...homePage,
      sections: [],
    }
  }

  return fullHomePage
}

