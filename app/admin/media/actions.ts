"use server"

import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"

// Función para asegurar que el directorio existe
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

// Función para generar un nombre de archivo único
function generateUniqueFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename)
  const basename = path.basename(originalFilename, extension)
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `${basename}-${timestamp}-${randomString}${extension}`.toLowerCase()
}

// Función para verificar si un archivo existe
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    return false
  }
}

// Función para mantener un registro de imágenes
async function updateImageRegistry(
  action: "add" | "remove",
  imageData?: { name: string; url: string; size: number; createdAt: string },
): Promise<void> {
  const registryPath = path.join(process.cwd(), "content", "media-registry.json")

  // Asegurarse de que el directorio content existe
  await ensureDirectoryExists(path.join(process.cwd(), "content"))

  // Leer el registro actual o crear uno nuevo
  let registry: { images: Array<{ name: string; url: string; size: number; createdAt: string }> } = { images: [] }

  try {
    const exists = await fileExists(registryPath)
    if (exists) {
      const content = await fs.readFile(registryPath, "utf8")
      registry = JSON.parse(content)
    }
  } catch (error) {
    console.error("Error reading image registry:", error)
    // Si hay un error, continuamos con un registro vacío
  }

  if (action === "add" && imageData) {
    // Añadir nueva imagen al registro
    registry.images.push(imageData)
  } else if (action === "remove" && imageData) {
    // Eliminar imagen del registro
    registry.images = registry.images.filter((img) => img.name !== imageData.name)
  }

  // Guardar el registro actualizado
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2), "utf8")
}

// Acción del servidor para subir una imagen
export async function uploadImageAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; imagePath?: string }> {
  try {
    const file = formData.get("file") as File

    if (!file || file.size === 0) {
      return { success: false, message: "No file provided" }
    }

    // Verificar que es una imagen
    if (!file.type.startsWith("image/")) {
      return { success: false, message: "File must be an image" }
    }

    // Limitar el tamaño del archivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File size must be less than 5MB" }
    }

    // Crear el directorio si no existe
    const uploadDir = path.join(process.cwd(), "public", "images")
    await ensureDirectoryExists(uploadDir)

    // Generar un nombre de archivo único
    const uniqueFilename = generateUniqueFilename(file.name)
    const filePath = path.join(uploadDir, uniqueFilename)

    // Leer el archivo como un ArrayBuffer
    const buffer = await file.arrayBuffer()

    // Escribir el archivo en el sistema de archivos
    await fs.writeFile(filePath, Buffer.from(buffer))

    // Verificar que el archivo se haya creado correctamente
    const fileCreated = await fileExists(filePath)
    if (!fileCreated) {
      return { success: false, message: "Failed to create image file" }
    }

    // Devolver la ruta relativa para usar en la aplicación
    const relativePath = `/images/${uniqueFilename}`

    // Actualizar el registro de imágenes
    await updateImageRegistry("add", {
      name: uniqueFilename,
      url: relativePath,
      size: file.size,
      createdAt: new Date().toISOString(),
    })

    // Revalidar las rutas que podrían usar esta imagen
    revalidatePath("/admin/media")

    return {
      success: true,
      message: "Image uploaded successfully",
      imagePath: relativePath,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, message: `Failed to upload image: ${error.message}` }
  }
}

// Acción del servidor para obtener todas las imágenes
export async function getImagesAction(): Promise<{
  success: boolean
  message: string
  images?: { name: string; url: string; size: number; createdAt: string }[]
}> {
  try {
    // Leer el registro de imágenes
    const registryPath = path.join(process.cwd(), "content", "media-registry.json")

    // Verificar si el registro existe
    const registryExists = await fileExists(registryPath)
    if (!registryExists) {
      // Si no existe, crear un registro vacío
      await updateImageRegistry("add")
      return {
        success: true,
        message: "No images found",
        images: [],
      }
    }

    // Leer el registro
    const content = await fs.readFile(registryPath, "utf8")
    const registry = JSON.parse(content)

    // Verificar que las imágenes existen físicamente
    const uploadDir = path.join(process.cwd(), "public")
    const verifiedImages = []

    for (const image of registry.images) {
      const imagePath = path.join(uploadDir, image.url)
      try {
        await fs.access(imagePath)
        verifiedImages.push(image)
      } catch (error) {
        console.warn(`Image ${image.name} not found on disk, removing from registry`)
        // No hacemos nada, simplemente no la incluimos en verifiedImages
      }
    }

    // Actualizar el registro si hay discrepancias
    if (verifiedImages.length !== registry.images.length) {
      registry.images = verifiedImages
      await fs.writeFile(registryPath, JSON.stringify(registry, null, 2), "utf8")
    }

    return {
      success: true,
      message: "Images retrieved successfully",
      images: verifiedImages,
    }
  } catch (error) {
    console.error("Error getting images:", error)
    return { success: false, message: `Failed to get images: ${error.message}` }
  }
}

// Acción del servidor para eliminar una imagen
export async function deleteImageAction(filename: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validar el nombre del archivo para evitar ataques de path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return { success: false, message: "Invalid filename" }
    }

    const filePath = path.join(process.cwd(), "public", "images", filename)

    // Verificar que el archivo existe
    const exists = await fileExists(filePath)
    if (!exists) {
      // Actualizar el registro aunque el archivo no exista
      await updateImageRegistry("remove", { name: filename, url: `/images/${filename}`, size: 0, createdAt: "" })
      return { success: false, message: "File not found" }
    }

    // Eliminar el archivo
    await fs.unlink(filePath)

    // Actualizar el registro de imágenes
    await updateImageRegistry("remove", { name: filename, url: `/images/${filename}`, size: 0, createdAt: "" })

    // Revalidar las rutas
    revalidatePath("/admin/media")

    return {
      success: true,
      message: "Image deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, message: `Failed to delete image: ${error.message}` }
  }
}

