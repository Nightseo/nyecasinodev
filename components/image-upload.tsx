"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImageAction } from "@/app/admin/media/actions"
import Image from "next/image"

interface ImageUploadProps {
  currentImage?: string
  onImageUploaded: (imagePath: string) => void
  label?: string
}

export function ImageUpload({ currentImage, onImageUploaded, label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Crear una URL para previsualizar la imagen
    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    // Subir la imagen
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadImageAction(formData)

      if (result.success && result.imagePath) {
        onImageUploaded(result.imagePath)
      } else {
        setError(result.message)
        // Revertir la previsualización si hay un error
        setPreviewImage(currentImage || null)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image")
      // Revertir la previsualización si hay un error
      setPreviewImage(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload">{label}</Label>

        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Choose Image"}
          </Button>

          {currentImage && !previewImage && (
            <span className="text-sm text-muted-foreground">Current: {currentImage.split("/").pop()}</span>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      {previewImage && (
        <div className="relative w-full h-40 border rounded-md overflow-hidden">
          <Image
            src={previewImage || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized={previewImage.startsWith("blob:")}
          />
        </div>
      )}
    </div>
  )
}

