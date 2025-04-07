"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { runDiagnosticsAction, fixDirectoryIssuesAction } from "./actions"
import Link from "next/link"

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [fixResults, setFixResults] = useState<any>(null)

  const runDiagnostics = async () => {
    setIsRunning(true)
    try {
      const diagnosticResults = await runDiagnosticsAction()
      setResults(diagnosticResults)
    } catch (error) {
      console.error("Error running diagnostics:", error)
      setResults({ error: "Failed to run diagnostics" })
    } finally {
      setIsRunning(false)
    }
  }

  const fixIssues = async () => {
    setIsFixing(true)
    try {
      const fixResults = await fixDirectoryIssuesAction()
      setFixResults(fixResults)
    } catch (error) {
      console.error("Error fixing issues:", error)
      setFixResults({ error: "Failed to fix issues" })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">CMS Diagnostics</h1>
        <Button asChild>
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Run diagnostics to check for common issues with the CMS file system. This will check for directory
              structure, file permissions, and content integrity.
            </p>
            <Button onClick={runDiagnostics} disabled={isRunning}>
              {isRunning ? "Running Diagnostics..." : "Run Diagnostics"}
            </Button>

            {results && (
              <div className="mt-6 border rounded-md p-4">
                <h3 className="font-bold mb-2">Diagnostic Results:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fix Directory Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will attempt to fix common directory structure issues by creating missing directories and files. Use
              this if you're experiencing problems with saving content.
            </p>
            <Button onClick={fixIssues} disabled={isFixing}>
              {isFixing ? "Fixing Issues..." : "Fix Directory Issues"}
            </Button>

            {fixResults && (
              <div className="mt-6 border rounded-md p-4">
                <h3 className="font-bold mb-2">Fix Results:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(fixResults, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fix Page Slugs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you're having issues with page slugs not updating correctly, use this specialized tool to fix
              slug-related problems.
            </p>
            <Button asChild>
              <Link href="/admin/diagnostics/fix-slugs">Fix Page Slugs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

