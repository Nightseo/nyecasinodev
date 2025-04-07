"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, Trash2Icon, MoveUpIcon, MoveDownIcon } from "lucide-react"
import type { PageSection } from "@/lib/content"
import { getAllCasinos } from "@/lib/content"
import { MediaSelector } from "@/components/media-selector"

interface PageSectionEditorProps {
  sections: PageSection[]
  onChange: (sections: PageSection[]) => void
}

export function PageSectionEditor({ sections, onChange }: PageSectionEditorProps) {
  const casinos = getAllCasinos()

  const addSection = (type: string) => {
    const newSection: PageSection = {
      type,
      title: "",
      content: type === "text" ? "" : undefined,
      casinoIds: type === "casino_list" ? [] : undefined,
      expertName: type === "expert_opinion" ? "" : undefined,
      expertImage: type === "expert_opinion" ? "" : undefined,
      expertContent: type === "expert_opinion" ? "" : undefined,
    }

    onChange([...sections, newSection])
  }

  const updateSection = (index: number, updates: Partial<PageSection>) => {
    const updatedSections = [...sections]
    updatedSections[index] = { ...updatedSections[index], ...updates }
    onChange(updatedSections)
  }

  const removeSection = (index: number) => {
    const updatedSections = [...sections]
    updatedSections.splice(index, 1)
    onChange(updatedSections)
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) {
      return
    }

    const updatedSections = [...sections]
    const newIndex = direction === "up" ? index - 1 : index + 1

    // Swap the sections
    ;[updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]]

    onChange(updatedSections)
  }

  const toggleCasino = (sectionIndex: number, casinoId: string) => {
    const section = sections[sectionIndex]
    if (!section.casinoIds) {
      section.casinoIds = []
    }

    const updatedCasinoIds = section.casinoIds.includes(casinoId)
      ? section.casinoIds.filter((id) => id !== casinoId)
      : [...section.casinoIds, casinoId]

    updateSection(sectionIndex, { casinoIds: updatedCasinoIds })
  }

  return (
    <div className="space-y-6">
      {sections.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No sections added yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add a section to start building your page</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg capitalize">{section.type.replace("_", " ")} Section</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => moveSection(index, "up")} disabled={index === 0}>
                      <MoveUpIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <MoveDownIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSection(index)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-${index}-title`}>Section Title (Optional)</Label>
                  <Input
                    id={`section-${index}-title`}
                    value={section.title || ""}
                    onChange={(e) => updateSection(index, { title: e.target.value })}
                  />
                </div>

                {section.type === "text" && (
                  <div className="space-y-2">
                    <Label htmlFor={`section-${index}-content`}>Content (HTML)</Label>
                    <Textarea
                      id={`section-${index}-content`}
                      value={section.content || ""}
                      onChange={(e) => updateSection(index, { content: e.target.value })}
                      rows={6}
                    />
                  </div>
                )}

                {section.type === "casino_list" && (
                  <div className="space-y-2">
                    <Label>Select Casinos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {casinos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No casinos available. Create some casinos first.
                        </p>
                      ) : (
                        casinos.map((casino) => (
                          <div key={casino.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`section-${index}-casino-${casino.id}`}
                              checked={section.casinoIds?.includes(casino.id) || false}
                              onChange={() => toggleCasino(index, casino.id)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`section-${index}-casino-${casino.id}`} className="text-sm font-normal">
                              {casino.name}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {section.type === "expert_opinion" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`section-${index}-expert-name`}>Expert Name</Label>
                      <Input
                        id={`section-${index}-expert-name`}
                        value={section.expertName || ""}
                        onChange={(e) => updateSection(index, { expertName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`section-${index}-expert-image`}>Expert Photo URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`section-${index}-expert-image`}
                          value={section.expertImage || ""}
                          onChange={(e) => updateSection(index, { expertImage: e.target.value })}
                          placeholder="/images/expert.jpg"
                          className="flex-1"
                        />
                        <MediaSelector
                          onSelect={(url) => updateSection(index, { expertImage: url })}
                          buttonText="Browse Media"
                        />
                      </div>
                      {section.expertImage && (
                        <div className="mt-2 border rounded-md p-2">
                          <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                          <div className="relative w-20 h-20 mx-auto">
                            <img
                              src={section.expertImage || "/placeholder.svg"}
                              alt="Expert preview"
                              className="object-cover rounded-full w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`section-${index}-expert-content`}>Expert Opinion (HTML)</Label>
                      <Textarea
                        id={`section-${index}-expert-content`}
                        value={section.expertContent || ""}
                        onChange={(e) => updateSection(index, { expertContent: e.target.value })}
                        rows={6}
                        placeholder="<p>Expert opinion content goes here...</p>"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            type="button"
            variant="outline"
            onClick={() => addSection("text")}
            className="rounded-l-md rounded-r-none"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Text Section
          </Button>
          <Button type="button" variant="outline" onClick={() => addSection("casino_list")} className="rounded-none">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Casino List
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => addSection("expert_opinion")}
            className="rounded-l-none rounded-r-md"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Expert Opinion
          </Button>
        </div>
      </div>
    </div>
  )
}

