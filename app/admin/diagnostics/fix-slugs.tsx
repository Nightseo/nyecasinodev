"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fixPageSlugsAction } from "./actions"
import Link from "next/link"

export default function FixSlugsPage() {
  const [results, setResults] = useState<any>(null)
  const [isFixing, setIsFixing] = useState(false)

  const fixSlugs = async () => {
    setIsFixing(true)
    try {
      const fixResults = await fixPageSlugsAction()
      setResults(fixResults)
    } catch (error) {
      console.error("Error fixing slugs:", error)
      setResults({ error: "Failed to fix slugs" })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Fix Page Slugs</h1>
        <Button asChild>
          <Link href="/admin/diagnostics">Back to Diagnostics</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fix Page Slug Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This tool will scan your pages directory and fix any issues with page slugs. It will:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Ensure all pages in the index have corresponding JSON files</li>
            <li>Rename files if the slug in the file doesn't match the filename</li>
            <li>Update the index file to match the actual files</li>
          </ul>
          <Button onClick={fixSlugs} disabled={isFixing}>
            {isFixing ? "Fixing Slugs..." : "Fix Page Slugs"}
          </Button>

          {results && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-bold mb-2">Results:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

