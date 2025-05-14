
import Link from "next/link"

export function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/auction-rooms" className="text-sm font-medium transition-colors hover:text-primary">
        Auctions
      </Link>
      <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
        How It Works
      </Link>
    </nav>
  )
}
