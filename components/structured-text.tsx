interface StructuredTextProps {
  content: any
}

export function StructuredText({ content }: StructuredTextProps) {
  if (!content || !Array.isArray(content)) {
    return null
  }

  // This is a simplified renderer for structured text
  // In a production app, you might want to use a library like 'react-datocms'
  return (
    <div className="prose max-w-none">
      {content.map((block: any, blockIndex: number) => {
        if (!block.children) return null

        switch (block.type) {
          case "heading":
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements
            return (
              <HeadingTag key={blockIndex}>
                {block.children.map((child: any, childIndex: number) => (
                  <span key={childIndex}>{child.text}</span>
                ))}
              </HeadingTag>
            )

          case "paragraph":
            return (
              <p key={blockIndex}>
                {block.children.map((child: any, childIndex: number) => (
                  <span
                    key={childIndex}
                    className={`
                      ${child.bold ? "font-bold" : ""}
                      ${child.italic ? "italic" : ""}
                      ${child.underline ? "underline" : ""}
                    `}
                  >
                    {child.text}
                  </span>
                ))}
              </p>
            )

          case "list":
            const ListTag = block.style === "numbered" ? "ol" : "ul"
            return (
              <ListTag key={blockIndex}>
                {block.children.map((item: any, itemIndex: number) => (
                  <li key={itemIndex}>
                    {item.children.map((child: any, childIndex: number) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </li>
                ))}
              </ListTag>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

