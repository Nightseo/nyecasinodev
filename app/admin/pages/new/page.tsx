"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PageSectionEditor } from "../components/page-section-editor"
import { SEOFields } from "@/components/seo-fields"
import { createPageAction } from "../actions"
import type { PageSection, SEOMetadata } from "@/lib/content"

export default function NewPage() {
  const router = useRouter()

  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isHomepage: false,
  })

  const [sections, setSections] = useState<PageSection[]>([])
  const [seoData, setSeoData] = useState<SEOMetadata>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isHomepage: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage("")

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("slug", formData.slug)
      form.append("isHomepage", String(formData.isHomepage))
      form.append("sections", JSON.stringify(sections))
      form.append("seo", JSON.stringify(seoData))

      const result = await createPageAction(form)

      if (result.success) {
        alert(result.message)
        router.push("/admin")
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error creating page:", error)
      setErrorMessage("Failed to create page")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Add New Page</h1>
        <Button asChild>
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (leave empty to generate from title)</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. about-us" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isHomepage" checked={formData.isHomepage} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isHomepage">Set as Homepage</Label>
            </div>
          </CardContent>
        </Card>

        <SEOFields seoData={seoData} onChange={setSeoData} defaultTitle={formData.title} />

        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
          </CardHeader>
          <CardContent>
            <PageSectionEditor sections={sections} onChange={setSections} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Creating..." : "Create Page"}
          </Button>
        </div>
      </form>
    </div>
  )
}

