import fs from "fs"
import path from "path"

// Define the content directory
const contentDirectory = path.join(process.cwd(), "content")

// Ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Check if path is a file
function isFile(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch (error) {
    return false
  }
}

// Check if path is a directory
function isDirectory(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  } catch (error) {
    return false
  }
}

// Initialize content structure
function initializeContentStructure() {
  console.log("Initializing content directory structure...")

  // Create main content directory
  ensureDirectoryExists(contentDirectory)

  // Create casinos directory
  const casinosDir = path.join(contentDirectory, "casinos")
  ensureDirectoryExists(casinosDir)

  // Create pages directory
  const pagesDir = path.join(contentDirectory, "pages")
  ensureDirectoryExists(pagesDir)

  // Create public/images directory for uploaded images
  const imagesDir = path.join(process.cwd(), "public", "images")
  ensureDirectoryExists(imagesDir)

  // Handle case where index.json is a directory instead of a file
  const casinosIndexPath = path.join(casinosDir, "index.json")
  if (isDirectory(casinosIndexPath)) {
    console.log("Removing directory at casinos/index.json and creating file instead")
    fs.rmdirSync(casinosIndexPath, { recursive: true })
  }

  // Create default casinos index if it doesn't exist or is not a file
  if (!isFile(casinosIndexPath)) {
    fs.writeFileSync(casinosIndexPath, "[]", "utf8")
    console.log("Created empty casinos index")
  }

  // Handle case where index.json is a directory instead of a file
  const pagesIndexPath = path.join(pagesDir, "index.json")
  if (isDirectory(pagesIndexPath)) {
    console.log("Removing directory at pages/index.json and creating file instead")
    fs.rmdirSync(pagesIndexPath, { recursive: true })
  }

  // Create default pages index if it doesn't exist or is not a file
  if (!isFile(pagesIndexPath)) {
    const defaultPages = [
      {
        id: "home",
        title: "Home",
        slug: "home",
        isHomepage: true,
      },
    ]
    fs.writeFileSync(pagesIndexPath, JSON.stringify(defaultPages, null, 2), "utf8")
    console.log("Created default pages index")
  }

  // Create home page file if it doesn't exist or is not a file
  const homePagePath = path.join(pagesDir, "home.json")
  if (isDirectory(homePagePath)) {
    console.log("Removing directory at pages/home.json and creating file instead")
    fs.rmdirSync(homePagePath, { recursive: true })
  }

  if (!isFile(homePagePath)) {
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
    fs.writeFileSync(homePagePath, JSON.stringify(homePage, null, 2), "utf8")
    console.log("Created default home page")
  }

  console.log("Content directory structure initialized successfully")
}

// Run the initialization
initializeContentStructure()

