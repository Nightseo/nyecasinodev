"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"

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

    // Devolver la ruta relativa para usar en la aplicación
    const relativePath = `/images/${uniqueFilename}`

    // Añadir un console.log para depurar la ruta de la imagen:
    console.log("Image uploaded to:", relativePath)

    // Revalidar las rutas que podrían usar esta imagen
    revalidatePath("/admin")

    return {
      success: true,
      message: "Image uploaded successfully",
      imagePath: relativePath,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, message: "Failed to upload image" }
  }
}

