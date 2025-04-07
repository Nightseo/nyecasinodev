import { getCasinoById } from "@/lib/content"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const casino = getCasinoById(params.id)
    if (!casino) {
      return NextResponse.json({ error: "Casino not found" }, { status: 404 })
    }
    return NextResponse.json(casino)
  } catch (error) {
    console.error("Error in /api/casinos/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch casino" }, { status: 500 })
  }
} 