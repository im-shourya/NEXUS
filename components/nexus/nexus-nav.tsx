"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NexusLogo } from "./nexus-logo"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { 
    label: "For Athletes", 
    href: "/athletes",
    dropdown: [
      { label: "Create Profile", href: "/onboarding/athlete" },
      { label: "Dashboard", href: "/athlete/dashboard" },
      { label: "Find Trials", href: "/athlete/trials" },
      { label: "Training Programs", href: "/athlete/training" },
    ]
  },
  { 
    label: "For Scouts", 
    href: "/scouts",
    dropdown: [
      { label: "Scout Portal", href: "/scout/dashboard" },
      { label: "Talent Discovery", href: "/scout/discover" },
      { label: "Shortlists", href: "/scout/shortlists" },
    ]
  },
  { 
    label: "For Academies", 
    href: "/academies",
    dropdown: [
      { label: "Academy Portal", href: "/academy/dashboard" },
      { label: "Host Trials", href: "/academy/trials" },
      { label: "Manage Athletes", href: "/academy/athletes" },
    ]
  },
  { label: "Discover", href: "/discover" },
  { label: "Pricing", href: "/pricing" },
]

export function NexusNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[var(--nx-bg)]/90 backdrop-blur-xl border-b border-[var(--nx-border)]" 
          : "bg-transparent"
      )}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <NexusLogo size="lg" showTagline={false} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div 
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors flex items-center gap-1",
                  link.dropdown && "cursor-default"
                )}
              >
                {link.label}
                {link.dropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
              
              {/* Dropdown */}
              {link.dropdown && activeDropdown === link.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                  <div className="bg-[var(--nx-bg3)] border border-[var(--nx-border)] rounded-xl p-2 shadow-xl">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-[var(--nx-text2)] hover:text-[var(--nx-green)] hover:bg-[var(--nx-green-dim)] rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-5 py-2.5 text-sm font-medium text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2.5 text-sm font-semibold bg-[var(--nx-green)] text-black rounded-full hover:brightness-110 transition-all hover:shadow-[var(--nx-green-shadow)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[var(--nx-text2)]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-[var(--nx-bg)]/98 backdrop-blur-xl z-40">
          <div className="p-6 space-y-2">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-[var(--nx-text1)] hover:text-[var(--nx-green)] transition-colors"
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pl-4 space-y-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-[var(--nx-text3)] hover:text-[var(--nx-green)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 space-y-3">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-medium border border-[var(--nx-border2)] rounded-full text-[var(--nx-text1)]"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-semibold bg-[var(--nx-green)] text-black rounded-full"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
