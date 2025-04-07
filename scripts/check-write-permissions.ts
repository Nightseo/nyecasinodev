import fs from "fs"
import path from "path"

// Define paths to check
const contentDirectory = path.join(process.cwd(), "content")
const pagesDirectory = path.join(contentDirectory, "pages")
const casinosDirectory = path.join(contentDirectory, "casinos")
const publicDirectory = path.join(process.cwd(), "public")
const imagesDirectory = path.join(publicDirectory, "images")

// Function to check if a directory exists and is writable
function checkDirectoryPermissions(dirPath: string): boolean {
  try {
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`)
      // Try to create it
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`Created directory: ${dirPath}`)
    }

    // Check write permissions by creating a test file
    const testFilePath = path.join(dirPath, ".write-test")
    fs.writeFileSync(testFilePath, "test")
    fs.unlinkSync(testFilePath)

    console.log(`✅ Directory is writable: ${dirPath}`)
    return true
  } catch (error) {
    console.error(`❌ Error with directory ${dirPath}:`, error)
    return false
  }
}

// Function to check if a file exists and is writable
function checkFilePermissions(filePath: string, createIfNotExists = true): boolean {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      if (createIfNotExists) {
        console.log(`File does not exist: ${filePath}`)
        // Create parent directory if needed
        const dirPath = path.dirname(filePath)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }

        // Create empty file or with default content
        const extension = path.extname(filePath)
        let defaultContent = ""

        if (extension === ".json") {
          if (filePath.endsWith("index.json")) {
            if (filePath.includes("pages")) {
              defaultContent = JSON.stringify(
                [
                  {
                    id: "home",
                    title: "Home",
                    slug: "home",
                    isHomepage: true,
                  },
                ],
                null,
                2,
              )
            } else {
              defaultContent = "[]"
            }
          } else {
            defaultContent = "{}"
          }
        }

        fs.writeFileSync(filePath, defaultContent)
        console.log(`Created file: ${filePath}`)
      } else {
        console.log(`File does not exist and was not created: ${filePath}`)
        return false
      }
    }

    // Check write permissions by updating the file
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      console.log(`Path is a directory, not a file: ${filePath}`)
      return false
    }

    const currentContent = fs.readFileSync(filePath, "utf8")
    fs.writeFileSync(filePath, currentContent)

    console.log(`✅ File is writable: ${filePath}`)
    return true
  } catch (error) {
    console.error(`❌ Error with file ${filePath}:`, error)
    return false
  }
}

// Main function to check all permissions
function checkAllPermissions() {
  console.log("Checking directory and file permissions...")

  // Check directories
  const directories = [contentDirectory, pagesDirectory, casinosDirectory, publicDirectory, imagesDirectory]

  let allDirectoriesOk = true
  for (const dir of directories) {
    if (!checkDirectoryPermissions(dir)) {
      allDirectoriesOk = false
    }
  }

  // Check important files
  const files = [
    path.join(pagesDirectory, "index.json"),
    path.join(casinosDirectory, "index.json"),
    path.join(contentDirectory, "media-registry.json"),
  ]

  let allFilesOk = true
  for (const file of files) {
    if (!checkFilePermissions(file)) {
      allFilesOk = false
    }
  }

  // Summary
  console.log("\nPermissions Check Summary:")
  if (allDirectoriesOk && allFilesOk) {
    console.log("✅ All directories and files are writable.")
  } else {
    console.log("❌ Some directories or files have permission issues.")
    console.log("Please check the logs above for details.")
  }
}

// Run the check
checkAllPermissions()

