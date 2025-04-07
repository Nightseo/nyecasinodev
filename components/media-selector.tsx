"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MediaGallery } from "@/components/media-gallery"
import { ImageIcon } from "lucide-react"

interface MediaSelectorProps {
  onSelect: (url: string) => void
  currentImage?: string
  buttonText?: string
}

export function MediaSelector({ onSelect, currentImage, buttonText = "Select Image" }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageSelected = (url: string) => {
    onSelect(url)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Image from Media Gallery</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          <MediaGallery onSelectImage={handleImageSelected} showUpload={false} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

