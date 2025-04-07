"use client"

import { useState } from "react"

interface ExpertOpinionProps {
  name: string
  image: string
  content: string
  title?: string
}

// Componente para la imagen del experto
function ExpertImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <img
        src="/placeholder.svg"
        alt={alt}
        className="w-16 h-16 rounded-full object-cover"
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-16 rounded-full object-cover"
      onError={() => setError(true)}
    />
  )
}

export function ExpertOpinion({ name, image, content, title }: ExpertOpinionProps) {
  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      <div className="bg-gray-50 border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <ExpertImage
            src={image}
            alt={name}
          />
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">Expert Opinion</p>
          </div>
        </div>

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || "" }} />

        <div className="mt-4 text-sm text-gray-500 italic">
          Expert opinions are based on extensive industry experience and research.
        </div>
      </div>
    </div>
  )
}

