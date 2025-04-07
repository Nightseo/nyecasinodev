"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SEOMetadata } from "@/lib/content"

interface SEOFieldsProps {
  seoData: SEOMetadata
  onChange: (data: SEOMetadata) => void
  defaultTitle?: string
}

export function SEOFields({ seoData, onChange, defaultTitle = "" }: SEOFieldsProps) {
  const [isOpen, setIsOpen] = useState(true) // Set to true by default to show content

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ ...seoData, [name]: value })
  }

  const handleSwitchChange = (checked: boolean) => {
    onChange({ ...seoData, noIndex: checked })
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center cursor-pointer">
              <CardTitle>SEO & Metadata</CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title (if left empty, page title will be used)</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={seoData.metaTitle || ""}
                onChange={handleChange}
                placeholder={defaultTitle}
              />
              <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={seoData.metaDescription || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description for search results"
              />
              <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                name="keywords"
                value={seoData.keywords || ""}
                onChange={handleChange}
                placeholder="casino, bonuses, games, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">Social Media Image URL (Open Graph)</Label>
              <Input
                id="ogImage"
                name="ogImage"
                value={seoData.ogImage || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
              <Input
                id="canonicalUrl"
                name="canonicalUrl"
                value={seoData.canonicalUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/main-page"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="noIndex" checked={seoData.noIndex || false} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="noIndex">Don't index this page (noindex)</Label>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

