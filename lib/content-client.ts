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

// Versiones cliente de las funciones (sin acceso a fs)
// Estas funciones se usarán en componentes cliente
// y devolverán datos estáticos o vacíos

export function getAllCasinosClient(): Casino[] {
  // En el cliente, devolvemos un array vacío
  // Los datos reales se cargarán mediante useEffect
  return []
}

export function getAllPagesClient(): Page[] {
  // En el cliente, devolvemos un array vacío o datos estáticos
  return [
    {
      id: "home",
      title: "Home",
      slug: "home",
      isHomepage: true,
    },
    {
      id: "top-casinos",
      title: "Top Casinos",
      slug: "top-casinos",
      isHomepage: false,
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      slug: "payment-methods",
      isHomepage: false,
    },
  ]
}

