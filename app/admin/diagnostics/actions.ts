"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"

// Define paths
const contentDirectory = path.join(process.cwd(), "content")
const pagesDirectory = path.join(contentDirectory, "pages")
const casinosDirectory = path.join(contentDirectory, "casinos")
const publicDirectory = path.join(process.cwd(), "public")
const imagesDirectory = path.join(publicDirectory, "images")

// Check if path exists
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    return false
  }
}

// Check if path is a directory
async function isDirectory(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath)
    return stats.isDirectory()
  } catch (error) {
    return false
  }
}

// Check if path is a file
async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath)
    return stats.isFile()
  } catch (error) {
    return false
  }
}

// Ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<{ success: boolean; message: string }> {
  try {
    const exists = await pathExists(dirPath)
    if (!exists) {
      await fs.mkdir(dirPath, { recursive: true })
      return { success: true, message: `Created directory: ${dirPath}` }
    }
    return { success: true, message: `Directory already exists: ${dirPath}` }
  } catch (error) {
    return { success: false, message: `Failed to create directory ${dirPath}: ${error.message}` }
  }
}

// Run diagnostics
export async function runDiagnosticsAction() {
  const results = {
    directories: {},
    files: {},
    issues: [],
  }

  // Check directories
  const directories = [
    { path: contentDirectory, name: "content" },
    { path: pagesDirectory, name: "pages" },
    { path: casinosDirectory, name: "casinos" },
    { path: publicDirectory, name: "public" },
    { path: imagesDirectory, name: "images" },
  ]

  for (const dir of directories) {
    const exists = await pathExists(dir.path)
    const isDir = exists ? await isDirectory(dir.path) : false
    results.directories[dir.name] = { exists, isDirectory: isDir }

    if (!exists) {
      results.issues.push(`Directory does not exist: ${dir.path}`)
    } else if (!isDir) {
      results.issues.push(`Path exists but is not a directory: ${dir.path}`)
    }
  }

  // Check important files
  const files = [
    { path: path.join(pagesDirectory, "index.json"), name: "pages/index.json" },
    { path: path.join(casinosDirectory, "index.json"), name: "casinos/index.json" },
    { path: path.join(contentDirectory, "media-registry.json"), name: "media-registry.json" },
  ]

  for (const file of files) {
    const exists = await pathExists(file.path)
    const isFileType = exists ? await isFile(file.path) : false
    results.files[file.name] = { exists, isFile: isFileType }

    if (!exists) {
      results.issues.push(`File does not exist: ${file.path}`)
    } else if (!isFileType) {
      results.issues.push(`Path exists but is not a file: ${file.path}`)
    }
  }

  // Check for pages directory issues
  if (results.directories.pages.exists && results.directories.pages.isDirectory) {
    try {
      const pagesIndexPath = path.join(pagesDirectory, "index.json")
      if ((await pathExists(pagesIndexPath)) && (await isFile(pagesIndexPath))) {
        const pagesIndexContent = await fs.readFile(pagesIndexPath, "utf8")
        try {
          const pagesIndex = JSON.parse(pagesIndexContent)

          // Check if pages in index have corresponding files
          for (const page of pagesIndex) {
            const pageFilePath = path.join(pagesDirectory, `${page.slug}.json`)
            const pageFileExists = await pathExists(pageFilePath)
            const isPageFile = pageFileExists ? await isFile(pageFilePath) : false

            if (!pageFileExists) {
              results.issues.push(`Page file missing for slug "${page.slug}" (ID: ${page.id})`)
            } else if (!isPageFile) {
              results.issues.push(`Page path exists but is not a file for slug "${page.slug}" (ID: ${page.id})`)
            }
          }
        } catch (error) {
          results.issues.push(`Invalid JSON in pages/index.json: ${error.message}`)
        }
      }
    } catch (error) {
      results.issues.push(`Error checking pages: ${error.message}`)
    }
  }

  return results
}

// Fix directory issues
export async function fixDirectoryIssuesAction() {
  const results = {
    actions: [],
    success: true,
  }

  try {
    // Ensure directories exist
    const directories = [contentDirectory, pagesDirectory, casinosDirectory, publicDirectory, imagesDirectory]

    for (const dir of directories) {
      const result = await ensureDirectoryExists(dir)
      results.actions.push(result)
      if (!result.success) {
        results.success = false
      }
    }

    // Ensure pages index.json exists
    const pagesIndexPath = path.join(pagesDirectory, "index.json")
    if (!(await pathExists(pagesIndexPath)) || !(await isFile(pagesIndexPath))) {
      try {
        const defaultPages = [
          {
            id: "home",
            title: "Home",
            slug: "home",
            isHomepage: true,
          },
        ]
        await fs.writeFile(pagesIndexPath, JSON.stringify(defaultPages, null, 2), "utf8")
        results.actions.push({ success: true, message: `Created pages/index.json` })
      } catch (error) {
        results.actions.push({ success: false, message: `Failed to create pages/index.json: ${error.message}` })
        results.success = false
      }
    }

    // Ensure casinos index.json exists
    const casinosIndexPath = path.join(casinosDirectory, "index.json")
    if (!(await pathExists(casinosIndexPath)) || !(await isFile(casinosIndexPath))) {
      try {
        await fs.writeFile(casinosIndexPath, "[]", "utf8")
        results.actions.push({ success: true, message: `Created casinos/index.json` })
      } catch (error) {
        results.actions.push({ success: false, message: `Failed to create casinos/index.json: ${error.message}` })
        results.success = false
      }
    }

    // Ensure media-registry.json exists
    const mediaRegistryPath = path.join(contentDirectory, "media-registry.json")
    if (!(await pathExists(mediaRegistryPath)) || !(await isFile(mediaRegistryPath))) {
      try {
        const mediaRegistry = { images: [] }
        await fs.writeFile(mediaRegistryPath, JSON.stringify(mediaRegistry, null, 2), "utf8")
        results.actions.push({ success: true, message: `Created media-registry.json` })
      } catch (error) {
        results.actions.push({ success: false, message: `Failed to create media-registry.json: ${error.message}` })
        results.success = false
      }
    }

    // Ensure home page exists
    const homePagePath = path.join(pagesDirectory, "home.json")
    if (!(await pathExists(homePagePath)) || !(await isFile(homePagePath))) {
      try {
        const homePage = {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
          sections: [
            {
              type: "text",
              title: "Welcome to Casino Reviews",
              content: "<p>Find the best online casinos with detailed reviews, ratings, and comparisons.</p>",
            },
          ],
        }
        await fs.writeFile(homePagePath, JSON.stringify(homePage, null, 2), "utf8")
        results.actions.push({ success: true, message: `Created home.json` })
      } catch (error) {
        results.actions.push({ success: false, message: `Failed to create home.json: ${error.message}` })
        results.success = false
      }
    }

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")

    return results
  } catch (error) {
    return {
      actions: [...(results.actions || []), { success: false, message: `Unexpected error: ${error.message}` }],
      success: false,
    }
  }
}

// Fix page slugs
export async function fixPageSlugsAction() {
  const results = {
    actions: [],
    success: true,
  }

  try {
    // Ensure pages directory exists
    const pagesDir = path.join(contentDirectory, "pages")
    await ensureDirectoryExists(pagesDir)

    // Read the index file
    const indexPath = path.join(pagesDir, "index.json")
    const indexExists = await pathExists(indexPath)
    const indexIsFile = indexExists ? await isFile(indexPath) : false

    if (!indexExists || !indexIsFile) {
      // Create default index if it doesn't exist
      const defaultPages = [
        {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
        },
      ]
      await fs.writeFile(indexPath, JSON.stringify(defaultPages, null, 2), "utf8")
      results.actions.push({ success: true, message: "Created default pages/index.json" })

      // Also create home.json if it doesn't exist
      const homePath = path.join(pagesDir, "home.json")
      if (!(await pathExists(homePath))) {
        const homePage = {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
          sections: [
            {
              type: "text",
              title: "Welcome to Casino Reviews",
              content: "<p>Find the best online casinos with detailed reviews, ratings, and comparisons.</p>",
            },
          ],
        }
        await fs.writeFile(homePath, JSON.stringify(homePage, null, 2), "utf8")
        results.actions.push({ success: true, message: "Created default home.json" })
      }

      return results
    }

    // Read the index content
    const indexContent = await fs.readFile(indexPath, "utf8")
    let pagesIndex = []

    try {
      pagesIndex = JSON.parse(indexContent)
    } catch (error) {
      results.actions.push({ success: false, message: `Invalid JSON in index file: ${error.message}` })

      // Try to repair the index file
      const backupPath = path.join(pagesDir, "index.json.bak")
      await fs.writeFile(backupPath, indexContent, "utf8")
      results.actions.push({ success: true, message: `Backed up corrupted index to index.json.bak` })

      // Create a new index with default content
      const defaultPages = [
        {
          id: "home",
          title: "Home",
          slug: "home",
          isHomepage: true,
        },
      ]
      await fs.writeFile(indexPath, JSON.stringify(defaultPages, null, 2), "utf8")
      pagesIndex = defaultPages
      results.actions.push({ success: true, message: `Created new index file with default content` })
    }

    // Get all JSON files in the pages directory
    const files = await fs.readdir(pagesDir)
    const jsonFiles = files.filter((file) => file.endsWith(".json") && file !== "index.json")

    // Check each page in the index
    for (const page of pagesIndex) {
      const pageFilePath = path.join(pagesDir, `${page.slug}.json`)
      const pageFileExists = await pathExists(pageFilePath)

      if (!pageFileExists) {
        results.actions.push({ success: false, message: `Page file missing for slug "${page.slug}" (ID: ${page.id})` })

        // Try to find a file with the page ID in the name
        const possibleFile = jsonFiles.find((file) => file.includes(page.id))
        if (possibleFile) {
          // Read the file and update the slug
          const filePath = path.join(pagesDir, possibleFile)
          try {
            const fileContent = await fs.readFile(filePath, "utf8")
            const pageData = JSON.parse(fileContent)

            // Update the slug in the file
            pageData.slug = page.slug
            await fs.writeFile(filePath, JSON.stringify(pageData, null, 2), "utf8")

            // Rename the file if needed
            if (possibleFile !== `${page.slug}.json`) {
              await fs.rename(filePath, pageFilePath)
              results.actions.push({
                success: true,
                message: `Renamed file ${possibleFile} to ${page.slug}.json and updated slug`,
              })
            } else {
              results.actions.push({
                success: true,
                message: `Updated slug in ${possibleFile}`,
              })
            }
          } catch (error) {
            results.actions.push({
              success: false,
              message: `Error updating file ${possibleFile}: ${error.message}`,
            })
          }
        } else {
          // Create a new file for this page
          const newPage = {
            id: page.id,
            title: page.title,
            slug: page.slug,
            isHomepage: page.isHomepage || false,
            sections: [],
          }
          await fs.writeFile(pageFilePath, JSON.stringify(newPage, null, 2), "utf8")
          results.actions.push({
            success: true,
            message: `Created missing file for page "${page.slug}" (ID: ${page.id})`,
          })
        }
      } else {
        // File exists, check if the slug in the file matches the filename
        try {
          const fileContent = await fs.readFile(pageFilePath, "utf8")
          const pageData = JSON.parse(fileContent)

          if (pageData.slug !== page.slug) {
            // Update the slug in the file
            pageData.slug = page.slug
            await fs.writeFile(pageFilePath, JSON.stringify(pageData, null, 2), "utf8")
            results.actions.push({
              success: true,
              message: `Updated slug in ${page.slug}.json to match filename`,
            })
          }
        } catch (error) {
          results.actions.push({
            success: false,
            message: `Error checking file ${page.slug}.json: ${error.message}`,
          })
        }
      }
    }

    // Check for JSON files that aren't in the index
    for (const file of jsonFiles) {
      const slug = file.replace(".json", "")
      const pageInIndex = pagesIndex.find((p) => p.slug === slug)

      if (!pageInIndex) {
        // Read the file to get the page data
        try {
          const filePath = path.join(pagesDir, file)
          const fileContent = await fs.readFile(filePath, "utf8")
          const pageData = JSON.parse(fileContent)

          // Add this page to the index
          const pageForIndex = {
            id: pageData.id || `page-${slug}-${Date.now().toString().slice(-4)}`,
            title: pageData.title || slug,
            slug: slug,
            isHomepage: pageData.isHomepage || false,
          }

          pagesIndex.push(pageForIndex)
          results.actions.push({
            success: true,
            message: `Added missing page "${slug}" to index`,
          })

          // Update the slug in the file if needed
          if (pageData.slug !== slug) {
            pageData.slug = slug
            await fs.writeFile(filePath, JSON.stringify(pageData, null, 2), "utf8")
            results.actions.push({
              success: true,
              message: `Updated slug in ${file} to match filename`,
            })
          }
        } catch (error) {
          results.actions.push({
            success: false,
            message: `Error processing file ${file}: ${error.message}`,
          })
        }
      }
    }

    // Update the index file with any changes
    await fs.writeFile(indexPath, JSON.stringify(pagesIndex, null, 2), "utf8")
    results.actions.push({ success: true, message: "Updated index file with all changes" })

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/")

    return results
  } catch (error) {
    return {
      actions: [...(results.actions || []), { success: false, message: `Unexpected error: ${error.message}` }],
      success: false,
    }
  }
}

