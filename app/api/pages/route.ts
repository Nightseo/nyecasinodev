import { getAllPages } from "@/lib/content"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const pages = getAllPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Error in /api/pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
} 