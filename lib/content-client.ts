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
import type { Casino, Page } from "./content"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Función para obtener todos los casinos
export async function getAllCasinosClient(): Promise<Casino[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casinos`)
    if (!response.ok) {
      throw new Error("Failed to fetch casinos")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching casinos:", error)
    return []
  }
}

// Función para obtener todas las páginas
export async function getAllPagesClient(): Promise<Page[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages`)
    if (!response.ok) {
      throw new Error("Failed to fetch pages")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

// Función para obtener un casino por ID
export async function getCasinoByIdClient(id: string): Promise<Casino | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casinos/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch casino")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching casino:", error)
    return null
  }
}

// Función para obtener una página por slug
export async function getPageBySlugClient(slug: string): Promise<Page | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages/${slug}`)
    if (!response.ok) {
      throw new Error("Failed to fetch page")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

