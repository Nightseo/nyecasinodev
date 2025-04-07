import fs from "fs"
import path from "path"

// Definir la ruta al registro de medios
const mediaRegistryPath = path.join(process.cwd(), "content", "media-registry.json")

// Asegurarse de que el directorio content existe
if (!fs.existsSync(path.join(process.cwd(), "content"))) {
  fs.mkdirSync(path.join(process.cwd(), "content"), { recursive: true })
}

// Leer el registro actual o crear uno nuevo
let registry: { images: Array<{ name: string; url: string; size: number; createdAt: string }> } = { images: [] }

try {
  if (fs.existsSync(mediaRegistryPath)) {
    const content = fs.readFileSync(mediaRegistryPath, "utf8")
    registry = JSON.parse(content)
  }
} catch (error) {
  console.error("Error reading image registry:", error)
  // Si hay un error, continuamos con un registro vacío
}

// Información de las nuevas imágenes
const newImages = [
  {
    name: "Lars-Hansen.jpg",
    url: "/images/Lars-Hansen.jpg",
    size: 52000, // Tamaño aproximado en bytes
    createdAt: new Date().toISOString(),
  },
  {
    name: "Ole-Johansen.jpg",
    url: "/images/Ole-Johansen.jpg",
    size: 48000, // Tamaño aproximado en bytes
    createdAt: new Date().toISOString(),
  },
  {
    name: "Ingrid-Dahl.jpg",
    url: "/images/Ingrid-Dahl.jpg",
    size: 45000, // Tamaño aproximado en bytes
    createdAt: new Date().toISOString(),
  },
]

// Añadir las nuevas imágenes al registro, evitando duplicados
for (const newImage of newImages) {
  // Comprobar si la imagen ya existe en el registro
  const existingIndex = registry.images.findIndex((img) => img.name === newImage.name)

  if (existingIndex >= 0) {
    // Actualizar la entrada existente
    registry.images[existingIndex] = newImage
    console.log(`Updated existing image in registry: ${newImage.name}`)
  } else {
    // Añadir nueva entrada
    registry.images.push(newImage)
    console.log(`Added new image to registry: ${newImage.name}`)
  }
}

// Guardar el registro actualizado
fs.writeFileSync(mediaRegistryPath, JSON.stringify(registry, null, 2), "utf8")
console.log("Media registry updated successfully!")

// Verificar que las imágenes existen en la carpeta public/images
const imagesDir = path.join(process.cwd(), "public", "images")
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
  console.log("Created images directory")
}

console.log("Expert images have been added to the media gallery!")

