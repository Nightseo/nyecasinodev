"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import type { Casino } from "@/lib/content"

const contentDirectory = path.join(process.cwd(), "content")

// Helper function to generate a slug from a string
function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Helper function to generate a unique ID
function generateId(name: string): string {
  return `casino-${generateSlug(name)}-${Date.now().toString().slice(-4)}`
}

// Get all casinos
export async function getAllCasinosAction(): Promise<Casino[]> {
  try {
    const filePath = path.join(contentDirectory, "casinos", "index.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading casinos:", error)
    return []
  }
}

// Get a casino by ID
export async function getCasinoByIdAction(id: string): Promise<Casino | null> {
  try {
    const filePath = path.join(contentDirectory, "casinos", `${id}.json`)
    const fileContents = await fs.readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error reading casino ${id}:`, error)
    return null
  }
}

// Create a new casino
export async function createCasinoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const minimumDeposit = Number.parseFloat(formData.get("minimumDeposit") as string)
    const rating = Number.parseFloat(formData.get("rating") as string)
    const affiliateLink = formData.get("affiliateLink") as string
    const bonus = formData.get("bonus") as string
    const paymentMethodsStr = formData.get("paymentMethods") as string
    const prosStr = formData.get("pros") as string
    const consStr = formData.get("cons") as string
    const review = formData.get("review") as string

    // Validate required fields
    if (!name || !affiliateLink) {
      return { success: false, message: "Name and affiliate link are required" }
    }

    // Process arrays
    const paymentMethods = paymentMethodsStr
      .split(",")
      .map((method) => method.trim())
      .filter(Boolean)
    const pros = prosStr
      .split("\n")
      .map((pro) => pro.trim())
      .filter(Boolean)
    const cons = consStr
      .split("\n")
      .map((con) => con.trim())
      .filter(Boolean)

    // Generate ID
    const id = generateId(name)

    // Create casino object
    const casino: Casino = {
      id,
      name,
      minimumDeposit: isNaN(minimumDeposit) ? 0 : minimumDeposit,
      rating: isNaN(rating) ? 0 : Math.min(Math.max(rating, 0), 5),
      affiliateLink,
      bonus,
      paymentMethods,
      pros,
      cons,
      review,
    }

    // Save individual casino file
    const casinoFilePath = path.join(contentDirectory, "casinos", `${id}.json`)
    await fs.writeFile(casinoFilePath, JSON.stringify(casino, null, 2), "utf8")

    // Update index file
    const allCasinos = await getAllCasinosAction()
    const indexData = [
      ...allCasinos,
      {
        id,
        name,
        minimumDeposit: casino.minimumDeposit,
        rating: casino.rating,
        affiliateLink: casino.affiliateLink,
      },
    ]

    const indexFilePath = path.join(contentDirectory, "casinos", "index.json")
    await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/casinos/${id}`)

    return { success: true, message: "Casino created successfully", id }
  } catch (error) {
    console.error("Error creating casino:", error)
    return { success: false, message: "Failed to create casino" }
  }
}

// Update an existing casino
export async function updateCasinoAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if casino exists
    const existingCasino = await getCasinoByIdAction(id)
    if (!existingCasino) {
      return { success: false, message: "Casino not found" }
    }

    // Extract form data
    const name = formData.get("name") as string
    const minimumDeposit = Number.parseFloat(formData.get("minimumDeposit") as string)
    const rating = Number.parseFloat(formData.get("rating") as string)
    const affiliateLink = formData.get("affiliateLink") as string
    const bonus = formData.get("bonus") as string
    const paymentMethodsStr = formData.get("paymentMethods") as string
    const prosStr = formData.get("pros") as string
    const consStr = formData.get("cons") as string
    const review = formData.get("review") as string

    // Validate required fields
    if (!name || !affiliateLink) {
      return { success: false, message: "Name and affiliate link are required" }
    }

    // Process arrays
    const paymentMethods = paymentMethodsStr
      .split(",")
      .map((method) => method.trim())
      .filter(Boolean)
    const pros = prosStr
      .split("\n")
      .map((pro) => pro.trim())
      .filter(Boolean)
    const cons = consStr
      .split("\n")
      .map((con) => con.trim())
      .filter(Boolean)

    // Update casino object
    const updatedCasino: Casino = {
      ...existingCasino,
      name,
      minimumDeposit: isNaN(minimumDeposit) ? 0 : minimumDeposit,
      rating: isNaN(rating) ? 0 : Math.min(Math.max(rating, 0), 5),
      affiliateLink,
      bonus,
      paymentMethods,
      pros,
      cons,
      review,
    }

    // Save individual casino file
    const casinoFilePath = path.join(contentDirectory, "casinos", `${id}.json`)
    await fs.writeFile(casinoFilePath, JSON.stringify(updatedCasino, null, 2), "utf8")

    // Update index file
    const allCasinos = await getAllCasinosAction()
    const indexData = allCasinos.map((casino) =>
      casino.id === id
        ? {
            id,
            name,
            minimumDeposit: updatedCasino.minimumDeposit,
            rating: updatedCasino.rating,
            affiliateLink: updatedCasino.affiliateLink,
          }
        : casino,
    )

    const indexFilePath = path.join(contentDirectory, "casinos", "index.json")
    await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/casinos/${id}`)

    return { success: true, message: "Casino updated successfully" }
  } catch (error) {
    console.error(`Error updating casino ${id}:`, error)
    return { success: false, message: "Failed to update casino" }
  }
}

// Delete a casino
export async function deleteCasinoAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if casino exists
    const existingCasino = await getCasinoByIdAction(id)
    if (!existingCasino) {
      return { success: false, message: "Casino not found" }
    }

    // Delete individual casino file
    const casinoFilePath = path.join(contentDirectory, "casinos", `${id}.json`)
    await fs.unlink(casinoFilePath)

    // Update index file
    const allCasinos = await getAllCasinosAction()
    const indexData = allCasinos.filter((casino) => casino.id !== id)

    const indexFilePath = path.join(contentDirectory, "casinos", "index.json")
    await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true, message: "Casino deleted successfully" }
  } catch (error) {
    console.error(`Error deleting casino ${id}:`, error)
    return { success: false, message: "Failed to delete casino" }
  }
}

