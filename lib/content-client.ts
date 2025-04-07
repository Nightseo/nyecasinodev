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
  slug?: string
  logo?: string
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

// Versión del cliente de las funciones de content.ts
// Importamos los tipos desde el mismo archivo para evitar conflictos
// import type { Casino, Page } from "./content"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Función para manejar errores de fetch
async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

// Función para obtener todos los casinos
export async function getAllCasinosClient(): Promise<Casino[]> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/casinos`)
  return data || []
}

// Función para obtener todas las páginas
export async function getAllPagesClient(): Promise<Page[]> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/pages`)
  return data || []
}

// Función para obtener un casino por ID
export async function getCasinoByIdClient(id: string): Promise<Casino | null> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/casinos/${id}`)
}

// Función para obtener una página por slug
export async function getPageBySlugClient(slug: string): Promise<Page | null> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/api/pages/${slug}`)
}

