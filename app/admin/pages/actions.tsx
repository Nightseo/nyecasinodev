"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import type { Page, PageSection, SEOMetadata } from "@/lib/content"

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
function generateId(title: string): string {
  return `page-${generateSlug(title)}-${Date.now().toString().slice(-4)}`
}

// Ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

// Get all pages
export async function getAllPagesAction(): Promise<Page[]> {
  try {
    const pagesDir = path.join(contentDirectory, "pages")
    await ensureDirectoryExists(pagesDir)

    const filePath = path.join(pagesDir, "index.json")

    try {
      await fs.access(filePath)
    } catch (error) {
      // Create default index if it doesn't exist
      const defaultPages = [
        {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
        },
      ]
      await fs.writeFile(filePath, JSON.stringify(defaultPages, null, 2), "utf8")
      return defaultPages
    }

    const fileContents = await fs.readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading pages:", error)
    return []
  }
}

// Get a page by slug
export async function getPageBySlugAction(slug: string): Promise<Page | null> {
  try {
    const filePath = path.join(contentDirectory, "pages", `${slug}.json`)

    try {
      await fs.access(filePath)
    } catch (error) {
      console.log(`Page file not found: ${filePath}`)
      return null
    }

    const fileContents = await fs.readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error)
    return null
  }
}

// Get a page by ID
export async function getPageByIdAction(id: string): Promise<{ page: Page | null; slug: string | null }> {
  try {
    // Get all pages from index
    const pages = await getAllPagesAction()
    const pageInfo = pages.find((p) => p.id === id)

    if (!pageInfo) {
      return { page: null, slug: null }
    }

    // Try to get the full page data
    const page = await getPageBySlugAction(pageInfo.slug)

    // If the page file doesn't exist, return the basic info from the index
    if (!page) {
      return {
        page: {
          ...pageInfo,
          sections: [],
        },
        slug: pageInfo.slug,
      }
    }

    return { page, slug: pageInfo.slug }
  } catch (error) {
    console.error(`Error getting page by ID ${id}:`, error)
    return { page: null, slug: null }
  }
}

// Create a new page
export async function createPageAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Extract form data
    const title = formData.get("title") as string
    const slug = generateSlug((formData.get("slug") as string) || title)
    const isHomepage = formData.get("isHomepage") === "true"
    const sectionsJson = formData.get("sections") as string
    const seoJson = formData.get("seo") as string

    // Validate required fields
    if (!title) {
      return { success: false, message: "Title is required" }
    }

    // Parse sections
    let sections: PageSection[] = []
    try {
      if (sectionsJson) {
        sections = JSON.parse(sectionsJson)
      }
    } catch (error) {
      return { success: false, message: "Invalid sections data" }
    }

    // Parse SEO data
    let seo: SEOMetadata = {}
    try {
      if (seoJson) {
        seo = JSON.parse(seoJson)
      }
    } catch (error) {
      return { success: false, message: "Invalid SEO data" }
    }

    // Generate ID
    const id = generateId(title)

    // Create page object
    const page: Page = {
      id,
      title,
      slug,
      isHomepage,
      sections,
      seo,
    }

    // Ensure directories exist
    const pagesDir = path.join(contentDirectory, "pages")
    await ensureDirectoryExists(pagesDir)

    // If this is set as homepage, update other pages
    if (isHomepage) {
      const allPages = await getAllPagesAction()
      for (const existingPage of allPages) {
        if (existingPage.id !== id && existingPage.isHomepage) {
          // Update the existing homepage in index
          existingPage.isHomepage = false

          // Update the individual page file if it exists
          try {
            const pageFilePath = path.join(contentDirectory, "pages", `${existingPage.slug}.json`)
            try {
              await fs.access(pageFilePath)
              const pageContent = await fs.readFile(pageFilePath, "utf8")
              const pageData = JSON.parse(pageContent)
              pageData.isHomepage = false
              await fs.writeFile(pageFilePath, JSON.stringify(pageData, null, 2), "utf8")
            } catch (error) {
              // File doesn't exist, skip updating it
            }
          } catch (error) {
            console.error(`Error updating homepage status for ${existingPage.id}:`, error)
          }
        }
      }
    }

    // Save individual page file
    const pageFilePath = path.join(contentDirectory, "pages", `${slug}.json`)
    await fs.writeFile(pageFilePath, JSON.stringify(page, null, 2), "utf8")

    // Update index file
    const allPages = await getAllPagesAction()
    const indexData = [
      ...allPages.filter((p) => p.slug !== slug), // Remove any existing page with same slug
      {
        id,
        title,
        slug,
        isHomepage,
      },
    ]

    const indexFilePath = path.join(contentDirectory, "pages", "index.json")
    await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/pages/${slug}`)

    return { success: true, message: "Page created successfully", id }
  } catch (error) {
    console.error("Error creating page:", error)
    return { success: false, message: `Failed to create page: ${error.message}` }
  }
}

// Update an existing page
export async function updatePageAction(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Extract form data
    const title = formData.get("title") as string
    const newSlug = generateSlug((formData.get("slug") as string) || title)
    const isHomepage = formData.get("isHomepage") === "true"
    const sectionsJson = formData.get("sections") as string
    const seoJson = formData.get("seo") as string
    const originalSlug = formData.get("originalSlug") as string

    console.log(`Updating page ${id} with title: ${title}, slug: ${newSlug}, originalSlug: ${originalSlug}`)

    // Validate required fields
    if (!title) {
      return { success: false, message: "Title is required" }
    }

    // Parse sections
    let sections: PageSection[] = []
    try {
      if (sectionsJson) {
        sections = JSON.parse(sectionsJson)
        console.log(`Parsed ${sections.length} sections`)
      }
    } catch (error) {
      console.error("Error parsing sections:", error)
      return { success: false, message: "Invalid sections data" }
    }

    // Parse SEO data
    let seo: SEOMetadata = {}
    try {
      if (seoJson) {
        seo = JSON.parse(seoJson)
      }
    } catch (error) {
      console.error("Error parsing SEO data:", error)
      return { success: false, message: "Invalid SEO data" }
    }

    // Get all pages to update index
    const allPages = await getAllPagesAction()
    const existingPage = allPages.find((p) => p.id === id)

    if (!existingPage) {
      console.error(`Page with ID ${id} not found in index`)
      return { success: false, message: "Page not found" }
    }

    console.log(`Found existing page in index: ${existingPage.title} (${existingPage.slug})`)

    // Ensure directories exist
    const pagesDir = path.join(contentDirectory, "pages")
    await ensureDirectoryExists(pagesDir)

    // If this is set as homepage, update other pages
    if (isHomepage) {
      for (const page of allPages) {
        if (page.id !== id && page.isHomepage) {
          // Update the existing homepage in index
          page.isHomepage = false

          // Update the individual page file if it exists
          try {
            const pageFilePath = path.join(contentDirectory, "pages", `${page.slug}.json`)
            try {
              await fs.access(pageFilePath)
              const pageContent = await fs.readFile(pageFilePath, "utf8")
              const pageData = JSON.parse(pageContent)
              pageData.isHomepage = false
              await fs.writeFile(pageFilePath, JSON.stringify(pageData, null, 2), "utf8")
            } catch (error) {
              // File doesn't exist, skip updating it
            }
          } catch (error) {
            console.error(`Error updating homepage status for ${page.id}:`, error)
          }
        }
      }
    }

    // Create updated page object
    const updatedPage: Page = {
      id,
      title,
      slug: newSlug,
      isHomepage,
      sections,
      seo,
    }

    // Handle slug change
    if (originalSlug && originalSlug !== newSlug) {
      console.log(`Slug changed from ${originalSlug} to ${newSlug}`)

      // First, save the new file
      const newFilePath = path.join(contentDirectory, "pages", `${newSlug}.json`)
      console.log(`Creating new file at: ${newFilePath}`)

      try {
        await fs.writeFile(newFilePath, JSON.stringify(updatedPage, null, 2), "utf8")
        console.log(`Successfully created new file: ${newFilePath}`)
      } catch (error) {
        console.error(`Error creating new file ${newFilePath}:`, error)
        return { success: false, message: `Failed to create new file: ${error.message}` }
      }

      // Then, delete the old file
      try {
        const oldFilePath = path.join(contentDirectory, "pages", `${originalSlug}.json`)
        console.log(`Attempting to delete old file: ${oldFilePath}`)

        try {
          await fs.access(oldFilePath)
          await fs.unlink(oldFilePath)
          console.log(`Successfully deleted old file: ${oldFilePath}`)
        } catch (error) {
          console.log(`Old file doesn't exist or couldn't be deleted: ${oldFilePath}`)
          console.error(error)
        }
      } catch (error) {
        console.error(`Error handling old file deletion for ${originalSlug}:`, error)
        // Continue even if deletion fails
      }
    } else {
      // No slug change, just update the existing file
      const pageFilePath = path.join(contentDirectory, "pages", `${newSlug}.json`)
      console.log(`Updating existing file: ${pageFilePath}`)

      try {
        await fs.writeFile(pageFilePath, JSON.stringify(updatedPage, null, 2), "utf8")
        console.log(`Successfully updated file: ${pageFilePath}`)
      } catch (error) {
        console.error(`Error writing to file ${pageFilePath}:`, error)
        return { success: false, message: `Failed to update file: ${error.message}` }
      }
    }

    // Update index file
    const indexData = allPages.map((page) =>
      page.id === id
        ? {
            id,
            title,
            slug: newSlug,
            isHomepage,
          }
        : page,
    )

    const indexFilePath = path.join(contentDirectory, "pages", "index.json")
    console.log(`Updating index file: ${indexFilePath}`)

    try {
      await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")
      console.log(`Successfully updated index file: ${indexFilePath}`)
    } catch (error) {
      console.error(`Error writing index file ${indexFilePath}:`, error)
      return { success: false, message: `Failed to update index file: ${error.message}` }
    }

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")
    if (originalSlug) revalidatePath(`/pages/${originalSlug}`)
    revalidatePath(`/pages/${newSlug}`)

    return { success: true, message: "Page updated successfully" }
  } catch (error) {
    console.error("Error updating page:", error)
    return { success: false, message: `Failed to update page: ${error.message}` }
  }
}

// Delete a page
export async function deletePageAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get all pages
    const allPages = await getAllPagesAction()
    const pageToDelete = allPages.find((p) => p.id === id)

    if (!pageToDelete) {
      return { success: false, message: "Page not found" }
    }

    // Check if this is the homepage
    if (pageToDelete.isHomepage) {
      return { success: false, message: "Cannot delete the homepage. Set another page as homepage first." }
    }

    // Delete individual page file
    try {
      const filePath = path.join(contentDirectory, "pages", `${pageToDelete.slug}.json`)
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
      } catch (error) {
        // File doesn't exist, no need to delete
      }
    } catch (error) {
      console.error(`Error deleting page file ${pageToDelete.slug}:`, error)
    }

    // Update index file
    const indexData = allPages.filter((page) => page.id !== id)

    const indexFilePath = path.join(contentDirectory, "pages", "index.json")
    await fs.writeFile(indexFilePath, JSON.stringify(indexData, null, 2), "utf8")

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/pages/${pageToDelete.slug}`)

    return { success: true, message: "Page deleted successfully" }
  } catch (error) {
    console.error("Error deleting page:", error)
    return { success: false, message: "Failed to delete page" }
  }
}

