"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteCasinoAction } from "./actions"
import { deletePageAction } from "./pages/actions"
import { getAllCasinosClient, getAllPagesClient } from "@/lib/content-client"
// Añadir el import para el icono de diagnóstico
import { ImageIcon, SettingsIcon } from "lucide-react"
import type { Casino, Page } from "@/lib/content"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("casinos")
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with empty arrays
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [pages, setPages] = useState<Page[]>([])

  // Load data safely
  useEffect(() => {
    async function loadData() {
      try {
        const loadedCasinos = await getAllCasinosClient()
        setCasinos(loadedCasinos)
      } catch (error) {
        console.error("Error loading casinos:", error)
        setErrorMessage("Failed to load casinos. Please check your content directory structure.")
      }

      try {
        const loadedPages = await getAllPagesClient()
        setPages(loadedPages)
      } catch (error) {
        console.error("Error loading pages:", error)
        if (!errorMessage) {
          setErrorMessage("Failed to load pages. Please check your content directory structure.")
        }
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleDeleteCasino = async (id: string) => {
    if (!confirm("Are you sure you want to delete this casino?")) {
      return
    }

    setIsDeleting(true)
    setErrorMessage("")

    try {
      const result = await deleteCasinoAction(id)

      if (result.success) {
        // Update the local state
        setCasinos(casinos.filter((casino) => casino.id !== id))
        alert(result.message)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error deleting casino:", error)
      setErrorMessage("Failed to delete casino")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) {
      return
    }

    setIsDeleting(true)
    setErrorMessage("")

    try {
      const result = await deletePageAction(id)

      if (result.success) {
        // Update the local state
        setPages(pages.filter((page) => page.id !== id))
        alert(result.message)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      setErrorMessage("Failed to delete page")
    } finally {
      setIsDeleting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <p>Loading content...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Modificar la sección de botones en la parte superior para incluir el enlace a diagnósticos */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/media">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media Gallery
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/diagnostics">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Diagnostics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Reload the page to try again
                window.location.reload()
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="casinos" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="casinos">Casinos</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="casinos">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Casinos</h2>
            <Button asChild>
              <Link href="/admin/casinos/new">Add New Casino</Link>
            </Button>
          </div>

          {casinos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No casinos found</p>
              <Button asChild>
                <Link href="/admin/casinos/new">Create Your First Casino</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {casinos.map((casino) => (
                <Card key={casino.id}>
                  <CardHeader>
                    {casino.logo ? (
                      <div className="w-full h-16 bg-blue-600 rounded-md flex items-center justify-center mb-3">
                        <img
                          src={casino.logo || "/placeholder.svg"}
                          alt={`${casino.name} logo`}
                          className="max-h-12 max-w-full object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.parentElement!.innerHTML =
                              `<div class="text-lg font-bold text-white text-center p-2">${casino.name}</div>`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 bg-blue-600 rounded-md flex items-center justify-center mb-3">
                        <div className="text-lg font-bold text-white text-center p-2">{casino.name}</div>
                      </div>
                    )}
                    <CardTitle>{casino.name}</CardTitle>
                    <CardDescription>
                      Rating: {casino.rating}/5
                      {casino.slug && <span className="block text-xs mt-1">Slug: {casino.slug}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Min. Deposit: ${casino.minimumDeposit}</p>
                    <p className="truncate">Affiliate: {casino.affiliateLink}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/admin/casinos/${casino.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteCasino(casino.id)} disabled={isDeleting}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pages">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Pages</h2>
            <Button asChild>
              <Link href="/admin/pages/new">Add New Page</Link>
            </Button>
          </div>

          {pages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No pages found</p>
              <Button asChild>
                <Link href="/admin/pages/new">Create Your First Page</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription>Slug: {page.slug}</CardDescription>
                  </CardHeader>
                  <CardContent>{page.isHomepage && <p className="text-green-500 font-medium">Homepage</p>}</CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/admin/pages/${page.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeletePage(page.id)}
                      disabled={isDeleting || page.isHomepage}
                      title={page.isHomepage ? "Cannot delete homepage" : "Delete page"}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

