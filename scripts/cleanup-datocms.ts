import fs from "fs"
import path from "path"

// Define the project root
const projectRoot = process.cwd()

// Function to search for DatoCMS references in a file
function searchFileForDatoCMS(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    return (
      content.includes("datocms") ||
      content.includes("DATOCMS") ||
      content.includes("preview") ||
      content.includes("PREVIEW_SECRET")
    )
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively search directories
function searchDirectory(dir: string, results: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    // Skip node_modules and .git directories
    if (file === "node_modules" || file === ".git") {
      continue
    }

    if (stat.isDirectory()) {
      searchDirectory(filePath, results)
    } else if (
      stat.isFile() &&
      (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".jsx"))
    ) {
      if (searchFileForDatoCMS(filePath)) {
        results.push(filePath)
      }
    }
  }

  return results
}

// Main function
function main() {
  console.log("Searching for DatoCMS references...")
  const filesWithDatoCMS = searchDirectory(projectRoot)

  if (filesWithDatoCMS.length === 0) {
    console.log("No DatoCMS references found. Your project is clean!")
  } else {
    console.log("Found DatoCMS references in the following files:")
    filesWithDatoCMS.forEach((file) => {
      console.log(`- ${path.relative(projectRoot, file)}`)
    })
    console.log("\nPlease review these files and remove any DatoCMS-related code.")
  }
}

// Run the script
main()

