"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

interface MobileMenuProps {
  setMobileMenuOpen: (open: boolean) => void
  theme: string | undefined
  setTheme: (theme: string) => void
}

export function MobileMenu({ setMobileMenuOpen, theme, setTheme }: MobileMenuProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
        Home
      </Link>
      <Link href="/auction-rooms" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
        Auctions
      </Link>
      <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
        How It Works
      </Link>
      <div className="flex items-center gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </div>
    </div>
  )
}
