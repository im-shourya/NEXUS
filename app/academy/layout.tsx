"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { LayoutDashboard, Users, Video, BarChart3, Trophy, MessageSquare, Settings, Bell, Menu, X, ChevronRight, LogOut, Building2, Target, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore, useUser } from "@/store/auth-store"

const sidebarLinks = [
  { href: "/academy/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/academy/athletes", label: "Athlete Roster", icon: Users, badge: "48" },
  { href: "/academy/videos", label: "Video Library", icon: Video },
  { href: "/academy/performance", label: "Performance", icon: BarChart3 },
  { href: "/academy/scouts", label: "Scout Relations", icon: Target, badge: "3", badgeColor: "orange" },
  { href: "/academy/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/academy/academies", label: "Academies", icon: Building2 },
  { href: "/academy/messages", label: "Messages", icon: MessageSquare, badge: "5", badgeColor: "red" },
  { href: "/academy/alerts", label: "Alerts", icon: Bell, badge: "4", badgeColor: "red" },
  { href: "/academy/profile", label: "Academy Profile", icon: Building2 },
]

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
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

        {/* Academy Card */}
        <div className="p-4 border-b border-[var(--nx-border)]">
          <div className="p-4 rounded-xl border" style={{ background: "rgba(255,184,0,0.05)", borderColor: "rgba(255,184,0,0.2)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: "rgba(255,184,0,0.15)", border: "2px solid rgba(255,184,0,0.3)", color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>
                {user?.fullName ? user.fullName.charAt(0) : "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--nx-text1)] text-sm truncate">{user?.fullName || "Loading..."}</div>
                <div className="text-xs text-[var(--nx-text3)]">{profile?.sports_offered?.[0] || "Sports"}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--nx-text3)]">Reputation Score</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)" }}>{profile?.reputation_score || 0}</span>
              </div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
              <div className="h-full rounded-full bg-[var(--nx-gold)]" style={{ width: `${profile?.reputation_score || 0}%` }} />
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
                  isActive
                    ? "text-[var(--nx-gold)] border-l-2 border-[var(--nx-gold)]"
                    : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)]"
                )}
                style={isActive ? { background: "rgba(255,184,0,0.08)" } : {}}>
                <link.icon className={cn("w-5 h-5", isActive ? "text-[var(--nx-gold)]" : "text-[var(--nx-text3)] group-hover:text-[var(--nx-text1)]")} />
                <span className="font-medium flex-1">{link.label}</span>
                {link.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: link.badgeColor === "red" ? "var(--nx-red)" : link.badgeColor === "orange" ? "var(--nx-orange)" : "rgba(255,184,0,0.2)",
                      color: (link.badgeColor === "red" || link.badgeColor === "orange") ? "white" : "var(--nx-gold)"
                    }}>
                    {link.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            )
          })}

          <div className="pt-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--nx-gold)] text-black font-semibold hover:brightness-110 transition-all">
              <Plus className="w-5 h-5" />
              Create Tournament
            </button>
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[var(--nx-border)]">
          <Link href="/academy/settings"
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
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--nx-text1)]">{user?.fullName || "Academy"}</p>
                <p className="text-xs text-[var(--nx-gold)]">{user?.plan || "FREE"}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>
                {user?.plan || "FREE"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-sm font-bold"
                style={{ background: "rgba(255,184,0,0.15)", border: "2px solid rgba(255,184,0,0.3)", color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>
                {user?.fullName ? user.fullName.charAt(0) : "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
