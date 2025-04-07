"use client"

import { useState } from "react"
import Link from "next/link"
import { StarIcon, ShieldIcon, ZapIcon, GiftIcon, PercentIcon, ClockIcon, ExternalLinkIcon } from "lucide-react"
import type { Casino } from "@/lib/content"
import { CasinoCard } from "./casino-card"

interface CasinoListProps {
  casinos: Casino[]
  title?: string
  description?: string
}

export function CasinoList({ casinos, title, description }: CasinoListProps) {
  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {description && <p className="text-muted-foreground">{description}</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {casinos.map((casino) => (
          <CasinoCard key={casino.id} casino={casino} />
        ))}
      </div>
    </div>
  )
}

