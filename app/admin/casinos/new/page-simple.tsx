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

export default function NewCasino() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    minimumDeposit: 0,
    rating: 3.0,
    affiliateLink: "",
    bonus: "",
    paymentMethods: "",
    pros: "",
    cons: "",
    review: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, we would call a server action here
    alert("Create functionality will be implemented with server actions")
    router.push("/admin")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Add New Casino</h1>
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
              <Textarea
                id="pros"
                name="pros"
                value={formData.pros}
                onChange={handleChange}
                rows={5}
                placeholder="Fast withdrawals&#10;Great customer support&#10;Wide game selection"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons">Cons (one per line)</Label>
              <Textarea
                id="cons"
                name="cons"
                value={formData.cons}
                onChange={handleChange}
                rows={5}
                placeholder="Limited payment options&#10;High wagering requirements&#10;No 24/7 support"
              />
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
              <Textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                rows={10}
                placeholder="<p>Write your detailed casino review here. HTML formatting is supported.</p>"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button type="submit">Create Casino</Button>
        </div>
      </form>
    </div>
  )
}

