"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllCasinos, getAllPages } from "@/lib/content"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("casinos")

  // Get data directly from the content library
  const casinos = getAllCasinos()
  const pages = getAllPages()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </div>

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
                    <CardTitle>{casino.name}</CardTitle>
                    <CardDescription>Rating: {casino.rating}/5</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Min. Deposit: ${casino.minimumDeposit}</p>
                    <p className="truncate">Affiliate: {casino.affiliateLink}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/admin/casinos/${casino.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this casino?")) {
                          // In a real implementation, we would call a server action here
                          alert("Delete functionality will be implemented with server actions")
                        }
                      }}
                    >
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
            <Button>Add New Page</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>Slug: {page.slug}</CardDescription>
                </CardHeader>
                <CardContent>{page.isHomepage && <p className="text-green-500 font-medium">Homepage</p>}</CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

