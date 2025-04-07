import { execSync } from "child_process"
import path from "path"
import fs from "fs"

// Check if content directory structure is initialized
const contentDirectory = path.join(process.cwd(), "content")
const casinosDir = path.join(contentDirectory, "casinos")
const pagesDir = path.join(contentDirectory, "pages")
const casinosIndexPath = path.join(casinosDir, "index.json")
const pagesIndexPath = path.join(pagesDir, "index.json")

// Function to check if path is a file
function isFile(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch (error) {
    return false
  }
}

// Check if content structure is valid
const isContentStructureValid =
  fs.existsSync(contentDirectory) &&
  fs.existsSync(casinosDir) &&
  fs.existsSync(pagesDir) &&
  isFile(casinosIndexPath) &&
  isFile(pagesIndexPath)

// If content structure is not valid, run initialization script
if (!isContentStructureValid) {
  console.log("Content directory structure is not valid. Running initialization script...")
  try {
    execSync("npx tsx scripts/init-content.ts", { stdio: "inherit" })
  } catch (error) {
    console.error("Error running initialization script:", error)
    process.exit(1)
  }
} else {
  console.log("Content directory structure is valid.")
}

