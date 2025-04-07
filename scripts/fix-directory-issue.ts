import fs from "fs"
import path from "path"

// Define paths
const contentDirectory = path.join(process.cwd(), "content")
const pagesDir = path.join(contentDirectory, "pages")
const casinosDir = path.join(contentDirectory, "casinos")
const pagesIndexPath = path.join(pagesDir, "index.json")
const casinosIndexPath = path.join(casinosDir, "index.json")
const mediaRegistryPath = path.join(contentDirectory, "media-registry.json")
const publicDir = path.join(process.cwd(), "public")
const imagesDir = path.join(publicDir, "images")

console.log("Starting directory structure repair...")

// Create content directory if it doesn't exist
if (!fs.existsSync(contentDirectory)) {
  console.log("Creating content directory...")
  fs.mkdirSync(contentDirectory, { recursive: true })
}

// Create pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  console.log("Creating pages directory...")
  fs.mkdirSync(pagesDir, { recursive: true })
}

// Create casinos directory if it doesn't exist
if (!fs.existsSync(casinosDir)) {
  console.log("Creating casinos directory...")
  fs.mkdirSync(casinosDir, { recursive: true })
}

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  console.log("Creating public directory...")
  fs.mkdirSync(publicDir, { recursive: true })
}

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  console.log("Creating images directory...")
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Check if pages/index.json is a directory and fix it
if (fs.existsSync(pagesIndexPath)) {
  const stats = fs.statSync(pagesIndexPath)
  if (stats.isDirectory()) {
    console.log("pages/index.json is a directory. Removing it...")
    fs.rmSync(pagesIndexPath, { recursive: true, force: true })

    // Create the file with default content
    console.log("Creating pages/index.json file...")
    const defaultPages = [
      {
        id: "home",
        title: "Home",
        slug: "home",
        isHomepage: true,
      },
    ]
    fs.writeFileSync(pagesIndexPath, JSON.stringify(defaultPages, null, 2), "utf8")
  }
} else {
  // Create the file with default content
  console.log("Creating pages/index.json file...")
  const defaultPages = [
    {
      id: "home",
      title: "Home",
      slug: "home",
      isHomepage: true,
    },
  ]
  fs.writeFileSync(pagesIndexPath, JSON.stringify(defaultPages, null, 2), "utf8")
}

// Check if casinos/index.json is a directory and fix it
if (fs.existsSync(casinosIndexPath)) {
  const stats = fs.statSync(casinosIndexPath)
  if (stats.isDirectory()) {
    console.log("casinos/index.json is a directory. Removing it...")
    fs.rmSync(casinosIndexPath, { recursive: true, force: true })

    // Create the file with default content
    console.log("Creating casinos/index.json file...")
    fs.writeFileSync(casinosIndexPath, "[]", "utf8")
  }
} else {
  // Create the file with default content
  console.log("Creating casinos/index.json file...")
  fs.writeFileSync(casinosIndexPath, "[]", "utf8")
}

// Create home page file
const homePagePath = path.join(pagesDir, "home.json")
if (fs.existsSync(homePagePath)) {
  const stats = fs.statSync(homePagePath)
  if (stats.isDirectory()) {
    console.log("pages/home.json is a directory. Removing it...")
    fs.rmSync(homePagePath, { recursive: true, force: true })
  }
}

if (!fs.existsSync(homePagePath) || !fs.statSync(homePagePath).isFile()) {
  console.log("Creating home page file...")
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
}

// Create media registry file if it doesn't exist
if (!fs.existsSync(mediaRegistryPath)) {
  console.log("Creating media registry file...")
  const mediaRegistry = {
    images: [],
  }
  fs.writeFileSync(mediaRegistryPath, JSON.stringify(mediaRegistry, null, 2), "utf8")
}

// Create .gitkeep file in images directory
const gitkeepPath = path.join(imagesDir, ".gitkeep")
if (!fs.existsSync(gitkeepPath)) {
  console.log("Creating .gitkeep file in images directory...")
  fs.writeFileSync(
    gitkeepPath,
    "# This file ensures the images directory is created and tracked by git\n# Images uploaded by users will be stored in this directory\n",
    "utf8",
  )
}

console.log("Directory structure repair completed successfully!")

