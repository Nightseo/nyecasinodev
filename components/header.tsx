"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SparklesIcon, ChevronDownIcon, SearchIcon, MenuIcon } from "lucide-react"
import { getAllPagesClient } from "@/lib/content-client"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pages, setPages] = useState(getAllPagesClient())

  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 ${isScrolled ? "py-2" : "py-4"}`}>
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center">
            <div className="flex items-center">
              <div className="mr-2 bg-pink rounded-lg p-1.5">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-xl text-white">
                CasinoReviews<span className="text-pink">.com</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 text-white">
            <Link href="/">
              <div className="relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-md hover:bg-white/10">
                Home
              </div>
            </Link>

            <div className="relative group">
              <button className="flex items-center px-4 py-2 font-medium text-sm transition-all duration-300 rounded-md hover:bg-white/10">
                Top Casinos
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
            </div>

            <Link href="/pages/bonuses">
              <div className="relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-md hover:bg-white/10">
                Bonuses
              </div>
            </Link>

            <Link href="/pages/payment-methods">
              <div className="relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-md hover:bg-white/10">
                Payment Methods
              </div>
            </Link>

            <Link href="/pages/about-us">
              <div className="relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-md hover:bg-white/10">
                About Us
              </div>
            </Link>

            <div className="ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-md text-white hover:bg-white/10 transition-colors"
              >
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 lg:hidden rounded-md text-white hover:bg-white/10 transition-colors"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Background with blur effect */}
      <div className="absolute inset-0 backdrop-blur-xs bg-[#0f172a]/90 -z-10"></div>
    </header>
  )
}

