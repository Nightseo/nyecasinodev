"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PageSectionEditor } from "../components/page-section-editor"
import { SEOFields } from "@/components/seo-fields"
import { getPageByIdAction, updatePageAction } from "../actions"
import type { PageSection, SEOMetadata } from "@/lib/content"
import { toast } from "@/components/ui/use-toast"

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const pageId = params.id

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isHomepage: false,
    originalSlug: "",
  })

  const [sections, setSections] = useState<PageSection[]>([])
  const [seoData, setSeoData] = useState<SEOMetadata>({})

  // Load page data
  useEffect(() => {
    const loadPage = async () => {
      try {
        // Get page by ID
        const { page, slug } = await getPageByIdAction(pageId)

        if (!page) {
          setErrorMessage("Page not found")
          setIsLoading(false)
          return
        }

        setFormData({
          title: page.title,
          slug: page.slug,
          isHomepage: page.isHomepage || false,
          originalSlug: page.slug,
        })

        setSections(page.sections || [])
        setSeoData(page.seo || {})
      } catch (error) {
        console.error("Error loading page:", error)
        setErrorMessage("Failed to load page data")
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [pageId])

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
      form.append("originalSlug", formData.originalSlug)
      form.append("seo", JSON.stringify(seoData))

      console.log("Submitting form data:", {
        title: formData.title,
        slug: formData.slug,
        isHomepage: formData.isHomepage,
        sectionsCount: sections.length,
        originalSlug: formData.originalSlug,
        seo: Object.keys(seoData).length > 0 ? "present" : "empty",
      })

      const result = await updatePageAction(pageId, form)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Update the originalSlug in case the slug changed
        if (formData.slug !== formData.originalSlug) {
          setFormData((prev) => ({
            ...prev,
            originalSlug: formData.slug,
          }))
        }
      } else {
        setErrorMessage(result.message)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating page:", error)
      setErrorMessage("Failed to update page")
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving the page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading page data...</p>
      </div>
    )
  }

  if (errorMessage && !formData.title) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
        <Button asChild>
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Edit Page: {formData.title}</h1>
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

