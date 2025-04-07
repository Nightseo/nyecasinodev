"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CopyIcon, CheckIcon, ImageIcon, RefreshCwIcon } from "lucide-react"
import { getImagesAction } from "@/app/admin/media/actions"

interface MediaGalleryProps {
  onSelectImage?: (url: string) => void
  showUpload?: boolean
}

interface ImageFile {
  name: string
  url: string
  size: number
  createdAt: string
}

export function MediaGallery({ onSelectImage, showUpload = false }: MediaGalleryProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
    toast({
      title: "URL copied",
      description: "Image URL has been copied to clipboard",
    })
  }

  const handleSelectImage = (url: string) => {
    if (onSelectImage) {
      onSelectImage(url)
    } else {
      handleCopyUrl(url)
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
    <div className="w-full">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <Button variant="outline" size="sm" className="ml-4" onClick={handleRefreshGallery}>
            Refresh Gallery
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Media Gallery</h3>
        <Button
          variant="outline"
          size="sm"
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
        <div className="text-center py-8 border border-dashed rounded-lg">
          <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground mb-4">No images found</p>
          {showUpload && (
            <Button asChild>
              <a href="/admin/media">Upload Images</a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <Card
              key={image.name}
              className="overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[#FF4D8D]"
              onClick={() => handleSelectImage(image.url)}
            >
              <div className="relative aspect-square bg-gray-100">
                {imageLoadErrors[image.name] ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                ) : (
                  <img
                    src={`${image.url}?t=${Date.now()}`}
                    alt={image.name}
                    className="w-full h-full object-contain p-2"
                    onError={() => handleImageError(image.name)}
                  />
                )}
              </div>
              <CardContent className="p-3">
                <div className="text-sm font-medium truncate">{image.name}</div>
                <div className="text-xs text-gray-500">{formatFileSize(image.size)}</div>

                <div className="flex justify-end mt-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

