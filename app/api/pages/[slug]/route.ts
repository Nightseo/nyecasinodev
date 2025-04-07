import { getPageBySlug } from "@/lib/content"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const page = getPageBySlug(params.slug)
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    return NextResponse.json(page)
  } catch (error) {
    console.error("Error in /api/pages/[slug]:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
} 