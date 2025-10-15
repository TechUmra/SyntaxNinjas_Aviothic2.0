import Link from "next/link"
import { Shield, ChevronDown, HandHeart } from "lucide-react"

export default function Navbar() {
  return (
    <header className="w-full border-b border-[var(--color-border)]">
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Left cluster: Urgent + left links */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-destructive)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] shadow-sm"
          >
            <span>Charity</span>
            <Shield className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* Hide text links on very small screens */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/donaters"
              className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors"
            >
              Donaters
            </Link>
          </div>
        </div>

        {/* Center: brand/logo */}
        <div className="flex min-w-0 flex-1 justify-center">
          {/* You can swap this text for an <Image> if you have a logo */}
          <Link
            href="/"
            className="select-none font-semibold tracking-wider text-[var(--brand-dark)]"
            aria-label="Pephands Foundation home"
          >
            <span className="sr-only">BhojanGo Foundation</span>
            <span aria-hidden className="text-lg md:text-xl lg:text-2xl">
              BhojanGo
            </span>
            <span
              aria-hidden
              className="ml-2 text-xs md:text-sm tracking-[0.28em] align-middle text-[color:oklch(0.398_0.07_227.392)]"
            >
              FOUNDATION
            </span>
          </Link>
        </div>

        {/* Right cluster: right links + Donate */}
        <div className="flex items-center gap-4 md:gap-8 justify-end">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors"
            >
              About Us
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-[1px]" />
            </Link>
            <Link
              href="/contact-us"
              className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)] transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-red-400 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm"
          >
            <span>Login/Register</span>
            <HandHeart className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  )
}
