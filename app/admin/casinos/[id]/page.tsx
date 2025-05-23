"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SEOFields } from "@/components/seo-fields"
import { ImageUpload } from "@/components/image-upload"
import { updateCasinoAction } from "../actions"
import { getCasinoByIdClient } from "@/lib/content-client"
import type { Casino, SEOMetadata } from "@/lib/content"

export default function CasinoEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const casinoId = params.id
  const [casino, setCasino] = useState<Casino | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCasino() {
      try {
        const loadedCasino = await getCasinoByIdClient(casinoId)
        setCasino(loadedCasino)
      } catch (error) {
        console.error("Error loading casino:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCasino()
  }, [casinoId])

  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    minimumDeposit: 0,
    rating: 0,
    affiliateLink: "",
    bonus: "",
    paymentMethods: "",
    pros: "",
    cons: "",
    review: "",
  })

  const [logo, setLogo] = useState<string | undefined>()
  const [seoData, setSeoData] = useState<SEOMetadata>({})

  // Update form data when casino is loaded
  useEffect(() => {
    if (casino) {
      setFormData({
        name: casino.name || "",
        slug: casino.slug || "",
        minimumDeposit: casino.minimumDeposit || 0,
        rating: casino.rating || 0,
        affiliateLink: casino.affiliateLink || "",
        bonus: casino.bonus || "",
        paymentMethods: casino.paymentMethods?.join(", ") || "",
        pros: casino.pros?.join("\n") || "",
        cons: casino.cons?.join("\n") || "",
        review: casino.review || "",
      })
      setLogo(casino.logo)
      setSeoData(casino.seo || {})
    }
  }, [casino])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUploaded = (imagePath: string) => {
    setLogo(imagePath)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage("")

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, String(value))
      })

      // Add logo if exists
      if (logo) {
        form.append("logo", logo)
      }

      // Add SEO data
      form.append("seo", JSON.stringify(seoData))

      const result = await updateCasinoAction(casinoId, form)

      if (result.success) {
        // Show success message
        alert(result.message)
        router.push("/admin")
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error updating casino:", error)
      setErrorMessage("Failed to update casino")
    } finally {
      setIsSaving(false)
    }
  }

  if (!casino) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8">Casino not found</h1>
        <Button asChild>
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Edit Casino: {casino.name}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Casino Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (leave empty to generate from name)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. royal-casino"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Casino Logo</Label>
              <ImageUpload currentImage={logo} onImageUploaded={handleLogoUploaded} label="Casino Logo" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumDeposit">Minimum Deposit ($)</Label>
                <Input
                  id="minimumDeposit"
                  name="minimumDeposit"
                  type="number"
                  min="0"
                  value={formData.minimumDeposit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus">Bonus</Label>
              <Input id="bonus" name="bonus" value={formData.bonus} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliateLink">Affiliate Link</Label>
              <Input
                id="affiliateLink"
                name="affiliateLink"
                type="url"
                value={formData.affiliateLink}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethods">Payment Methods (comma separated)</Label>
              <Input
                id="paymentMethods"
                name="paymentMethods"
                value={formData.paymentMethods}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <SEOFields seoData={seoData} onChange={setSeoData} defaultTitle={formData.name} />

        <Card>
          <CardHeader>
            <CardTitle>Pros & Cons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pros">Pros (one per line)</Label>
              <Textarea id="pros" name="pros" value={formData.pros} onChange={handleChange} rows={5} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons">Cons (one per line)</Label>
              <Textarea id="cons" name="cons" value={formData.cons} onChange={handleChange} rows={5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="review">Review Content (HTML)</Label>
              <Textarea id="review" name="review" value={formData.review} onChange={handleChange} rows={10} />
            </div>
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

