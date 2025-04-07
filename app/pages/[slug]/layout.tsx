import type React from "react"
import type { Metadata } from "next"
import { getPageBySlug } from "@/lib/content"
import { notFound } from "next/navigation"

type Props = {
  params: { slug: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPageBySlug(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    }
  }

  const seo = page.seo || {}

  return {
    title: seo.metaTitle || page.title,
    description: seo.metaDescription,
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

export default function PageLayout({ children, params }: Props) {
  const page = getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return children
}

