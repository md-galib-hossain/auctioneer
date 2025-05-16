"use client"

import { useTheme } from "next-themes"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { useMobile } from "@/hooks/use-mobile"
import { authClient } from "@/lib/auth-client"

import { Menu } from "lucide-react"
import { MobileMenu } from "./mobile-nav"
import { Logo } from "./logo"
import { DesktopNav } from "./desktop-nav"
import { UserMenu } from "./user-menu"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session, isPending } = authClient.useSession()
  // const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (isPending) return <div className="p-4">Loading...</div>
console.log(session)
  return (
    <header className="px-4 sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        
        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileMenu setMobileMenuOpen={setMobileMenuOpen} theme={theme} setTheme={setTheme} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* User Menu */}
        <UserMenu session={session} theme={theme} setTheme={setTheme} />
      </div>
    </header>
  )
}
