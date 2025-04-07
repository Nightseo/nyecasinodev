import fs from "fs"
import path from "path"

// Define the content directory
const contentDirectory = path.join(process.cwd(), "content")
const pagesDirectory = path.join(contentDirectory, "pages")

// Ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Initialize pages structure
function initializePagesStructure() {
  console.log("Initializing pages directory structure...")

  // Create main content directory
  ensureDirectoryExists(contentDirectory)

  // Create pages directory
  ensureDirectoryExists(pagesDirectory)

  // Create default pages index if it doesn't exist
  const pagesIndexPath = path.join(pagesDirectory, "index.json")
  if (!fs.existsSync(pagesIndexPath)) {
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

  // Create home page file if it doesn't exist
  const homePagePath = path.join(pagesDirectory, "home.json")
  if (!fs.existsSync(homePagePath)) {
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

  console.log("Pages directory structure initialized successfully")
}

// Run the initialization
initializePagesStructure()

