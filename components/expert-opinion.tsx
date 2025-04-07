interface ExpertOpinionProps {
  name: string
  image: string
  content: string
  title?: string
}

export function ExpertOpinion({ name, image, content, title }: ExpertOpinionProps) {
  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      <div className="bg-gray-50 border rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            {image ? (
              <img
                src={image || "/placeholder.svg"}
                alt={`${name} - Casino Expert`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si la imagen falla, mostrar un placeholder con la inicial del nombre
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                      ${name.charAt(0)}
                    </div>
                  `
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-600">Casino Expert</p>
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

