"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn, LogOut, Settings, History, Bell, Sun, Moon } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const profileNavItems = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Auction History", icon: History, href: "/profile/history" },
  { label: "Notifications", icon: Bell, href: "/profile/notifications" },
  { label: "Settings", icon: Settings, href: "/profile/settings" },
]

interface UserMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
  theme: string | undefined
  setTheme: (theme: string) => void
}

export function UserMenu({ session, theme, setTheme }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {session ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {profileNavItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex w-full items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => authClient.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/signin" className="flex w-full items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/signup" className="flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Sign up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark mode</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
