"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCasinoById } from "@/lib/content"

export default function CasinoEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const casinoId = params.id

  // Get casino data directly
  const casino = getCasinoById(casinoId)

  const [formData, setFormData] = useState({
    name: casino?.name || "",
    minimumDeposit: casino?.minimumDeposit || 0,
    rating: casino?.rating || 0,
    affiliateLink: casino?.affiliateLink || "",
    bonus: casino?.bonus || "",
    paymentMethods: casino?.paymentMethods?.join(", ") || "",
    pros: casino?.pros?.join("\n") || "",
    cons: casino?.cons?.join("\n") || "",
    review: casino?.review || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, we would call a server action here
    alert("Save functionality will be implemented with server actions")
    router.push("/admin")
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="bonus">Bonus</Label>
                <Input id="bonus" name="bonus" value={formData.bonus} onChange={handleChange} />
              </div>
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
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}

