"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { uploadImageAction, getImagesAction, deleteImageAction } from "./actions"
import { CopyIcon, TrashIcon, UploadIcon, CheckIcon, ImageIcon, RefreshCwIcon } from "lucide-react"

interface ImageFile {
  name: string
  url: string
  size: number
  createdAt: string
}

// Componente para la imagen de la galería
function GalleryImage({ src, alt, className, onError }: { src: string; alt: string; className?: string; onError: () => void }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    if (error) {
      onError()
    }
  }, [error, onError])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-gray-300" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

// Componente para la imagen seleccionada
function SelectedImage({ src, alt, className, onError }: { src: string; alt: string; className?: string; onError: () => void }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    if (error) {
      onError()
    }
  }, [error, onError])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-gray-300" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

export default function MediaGallery() {
  const [activeTab, setActiveTab] = useState("gallery")
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({})

  // Función para cargar imágenes
  const loadImages = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const result = await getImagesAction()
      if (result.success) {
        setImages(result.images || [])
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error loading images:", error)
      setErrorMessage("Failed to load images")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar imágenes al montar el componente
  useEffect(() => {
    loadImages()
  }, [loadImages])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("file", files[0])

      const result = await uploadImageAction(formData)

      if (result.success && result.imagePath) {
        // Añadir la nueva imagen a la lista
        const newImage: ImageFile = {
          name: result.imagePath.split("/").pop() || files[0].name,
          url: result.imagePath,
          size: files[0].size,
          createdAt: new Date().toISOString(),
        }
        setImages((prev) => [newImage, ...prev])
        toast({
          title: "Image uploaded",
          description: "The image has been uploaded successfully",
        })
        // Cambiar a la pestaña de galería
        setActiveTab("gallery")
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setErrorMessage("Failed to upload image")
    } finally {
      setIsUploading(false)
      // Limpiar el input
      e.target.value = ""
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
    toast({
      title: "URL copied",
      description: "Image URL has been copied to clipboard",
    })
  }

  const handleDeleteImage = async (imageName: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    setIsDeleting(true)
    setErrorMessage("")

    try {
      const result = await deleteImageAction(imageName)

      if (result.success) {
        // Eliminar la imagen de la lista
        setImages((prev) => prev.filter((img) => img.name !== imageName))
        toast({
          title: "Image deleted",
          description: "The image has been deleted successfully",
        })
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      setErrorMessage("Failed to delete image")
    } finally {
      setIsDeleting(false)
      setSelectedImage(null)
    }
  }

  const handleRefreshGallery = async () => {
    setIsRefreshing(true)
    await loadImages()
    setIsRefreshing(false)
    toast({
      title: "Gallery refreshed",
      description: "The media gallery has been refreshed",
    })
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleImageError = (imageName: string) => {
    console.error("Error loading image:", imageName)
    setImageLoadErrors((prev) => ({ ...prev, [imageName]: true }))
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Media Gallery</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin">Back to Admin</Link>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <Button variant="outline" size="sm" className="ml-4" onClick={handleRefreshGallery}>
            Refresh Gallery
          </Button>
        </div>
      )}

      <Tabs defaultValue="gallery" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Media Library</h2>
              <p className="text-gray-500">All uploaded images are stored here. Click on an image to copy its URL.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefreshGallery}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No images found</p>
              <Button onClick={() => setActiveTab("upload")}>Upload Your First Image</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((image) => (
                <Card
                  key={image.name}
                  className={`overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedImage === image.name ? "ring-2 ring-[#FF4D8D]" : ""
                  }`}
                  onClick={() => setSelectedImage(selectedImage === image.name ? null : image.name)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <GalleryImage
                        src={`${image.url}?t=${Date.now()}`}
                        alt={image.name}
                        className="w-full h-full object-contain p-2"
                        onError={() => handleImageError(image.name)}
                      />
                    </div>
                  </CardContent>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium truncate">{image.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(image.size)}</div>

                    <div className="flex justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyUrl(image.url)
                        }}
                      >
                        {copiedUrl === image.url ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteImage(image.name)
                        }}
                        disabled={isDeleting}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF, SVG. Maximum file size: 5MB.
                    </p>
                  </div>

                  <div
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <UploadIcon className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop your image here, or click to browse</p>
                    <p className="text-xs text-gray-400">Images will be stored in Vercel Blob Storage</p>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={isUploading}
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-4">
                <SelectedImage
                  src={selectedImage}
                  alt="Selected image"
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(selectedImage)}
                />
              </div>
              <div>
                <div className="font-medium">{selectedImage}</div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(images.find((img) => img.name === selectedImage)?.size || 0)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleCopyUrl(images.find((img) => img.name === selectedImage)?.url || "")}
              >
                Copy URL
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteImage(selectedImage)} disabled={isDeleting}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

