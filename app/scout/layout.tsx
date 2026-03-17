"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { LayoutDashboard, Search, Bookmark, Calendar, MessageSquare, Settings, Bell, Menu, X, ChevronRight, LogOut, BarChart3, Star, Shield, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore, useUser } from "@/store/auth-store"

const sidebarLinks = [
  { href: "/scout/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scout/profile", label: "My Profile", icon: Shield },
  { href: "/scout/discover", label: "Discover Athletes", icon: Search, badge: "2847" },
  { href: "/scout/matches", label: "My Matches", icon: Star, badge: "48" },
  { href: "/scout/shortlist", label: "Shortlist", icon: Bookmark, badge: "12" },
  { href: "/scout/tournaments", label: "Tournaments", icon: Calendar },
  { href: "/scout/academies", label: "Academies", icon: Trophy },
  { href: "/scout/messages", label: "Messages", icon: MessageSquare, badge: "3", badgeColor: "red" },
  { href: "/scout/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/scout/alerts", label: "Alerts", icon: Bell, badge: "3", badgeColor: "red" },
]

export default function ScoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const signOut = useAuthStore(s => s.signOut)
  const user = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile/me')
      .then(res => res.json())
      .then(data => { if (data.profile) setProfile(data.profile) })
      .catch(console.error)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-72 bg-[var(--nx-bg2)] border-r border-[var(--nx-border)] z-50 transition-transform lg:translate-x-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--nx-border)]">
          <Link href="/" className="flex items-center gap-3">
            <NexusLogo size="md" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--nx-text3)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scout Card */}
        <div className="p-4 border-b border-[var(--nx-border)]">
          <div className="p-4 rounded-xl border" style={{ background: "rgba(155,93,255,0.05)", borderColor: "rgba(155,93,255,0.2)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: "rgba(155,93,255,0.15)", border: "2px solid rgba(155,93,255,0.3)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>
                {user?.fullName ? user.fullName.charAt(0) : "S"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[var(--nx-text1)] truncate text-sm">{user?.fullName || "Loading..."}</span>
                  {profile?.is_credential_verified && <Shield className="w-3.5 h-3.5 text-[var(--nx-cyan)] shrink-0" />}
                </div>
                <div className="text-xs text-[var(--nx-text3)]">Scout</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--nx-text3)]">{profile?.org_name || "Independent"}</span>
              {profile?.org_tier && (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold"
                  style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>
                  {profile.org_tier}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive ? "bg-[rgba(155,93,255,0.08)] text-[var(--nx-purple)] border-l-2 border-[var(--nx-purple)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)]"
                )}>
                <link.icon className={cn("w-5 h-5", isActive ? "text-[var(--nx-purple)]" : "text-[var(--nx-text3)] group-hover:text-[var(--nx-text1)]")} />
                <span className="font-medium flex-1">{link.label}</span>
                {link.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: link.badgeColor === "red" ? "var(--nx-red)" : "rgba(155,93,255,0.2)", color: link.badgeColor === "red" ? "white" : "var(--nx-purple)" }}>
                    {link.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[var(--nx-border)]">
          <Link href="/scout/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)] transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--nx-red)] hover:bg-[var(--nx-red)]/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--nx-bg)]/90 backdrop-blur-xl border-b border-[var(--nx-border)]">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[var(--nx-text3)]">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                <input type="text" placeholder="Search athletes, academies, tournaments..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-sm focus:border-[var(--nx-purple)]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[var(--nx-border)]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(155,93,255,0.15)", border: "2px solid rgba(155,93,255,0.3)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>
                  {user?.fullName ? user.fullName.charAt(0) : "S"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
