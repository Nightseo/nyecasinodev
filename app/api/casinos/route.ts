import { getAllCasinos } from "@/lib/content"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const casinos = getAllCasinos()
    return NextResponse.json(casinos)
  } catch (error) {
    console.error("Error in /api/casinos:", error)
    return NextResponse.json({ error: "Failed to fetch casinos" }, { status: 500 })
  }
} 