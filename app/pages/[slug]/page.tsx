import { notFound } from "next/navigation"
import { getPageBySlug, getCasinosByIds } from "@/lib/content"
import { CasinoList } from "@/components/casino-list"
import { ExpertOpinion } from "@/components/expert-opinion"

export default function PageDetail({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

      <div className="space-y-12">
        {page.sections?.map((section, index) => {
          // Render different section types
          switch (section.type) {
            case "text":
              return (
                <div key={index} className="prose max-w-none">
                  {section.title && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}
                  <div dangerouslySetInnerHTML={{ __html: section.content || "" }} />
                </div>
              )

            case "casino_list":
              const casinos = section.casinoIds ? getCasinosByIds(section.casinoIds) : []
              return (
                <div key={index} className="my-8">
                  {section.title && <h2 className="text-2xl font-bold mb-6">{section.title}</h2>}
                  <CasinoList casinos={casinos} />
                </div>
              )

            case "expert_opinion":
              return (
                <div key={index} className="my-8">
                  {section.expertName && section.expertContent && (
                    <ExpertOpinion
                      name={section.expertName}
                      image={section.expertImage || ""}
                      content={section.expertContent}
                      title={section.title}
                    />
                  )}
                </div>
              )

            default:
              return null
          }
        })}
      </div>
    </main>
  )
}

