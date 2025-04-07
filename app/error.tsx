"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Something went wrong!</h1>

      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-800 mb-4">
          There was an error loading the content. This might be due to a problem with the content files.
        </p>

        <div className="text-sm text-red-700 mb-4">
          <p>Error: {error.message}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>

        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>

        <Button asChild variant="secondary">
          <Link href="/admin">Go to admin</Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        If the problem persists, try running <code className="bg-gray-100 px-2 py-1 rounded">npm run fix-content</code>{" "}
        to repair the content structure.
      </p>
    </div>
  )
}

