"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { LayoutDashboard, User, Trophy, Calendar, Video, MessageSquare, Settings, Bell, Search, Menu, X, LogOut, Target, TrendingUp, Dumbbell, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore, useUser } from "@/store/auth-store"

const sidebarSections = [
  {
    section: "CAREER", links: [
      { href: "/athlete/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/athlete/profile", label: "My Profile", icon: User },
      { href: "/athlete/highlights", label: "My Highlights", icon: Video },
      { href: "/athlete/performance", label: "Performance", icon: TrendingUp },
    ]
  },
  {
    section: "DISCOVER", links: [
      { href: "/athlete/matches", label: "Scout Matches", icon: Target, badge: "12", bc: "cyan" },
      { href: "/athlete/tournaments", label: "Trials & Events", icon: Calendar },
      { href: "/athlete/academies", label: "Academies", icon: MapPin },
    ]
  },
  {
    section: "CONNECT", links: [
      { href: "/athlete/messages", label: "Messages", icon: MessageSquare, badge: "2", bc: "green" },
      { href: "/athlete/alerts", label: "Alerts", icon: Bell, badge: "3", bc: "red" },
    ]
  },
  {
    section: "IMPROVE", links: [
      { href: "/athlete/training", label: "Training", icon: Dumbbell },
      { href: "/athlete/achievements", label: "Achievements", icon: Trophy },
    ]
  },
]

export default function AthleteLayout({ children }: { children: React.ReactNode }) {
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
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn("fixed top-0 left-0 bottom-0 w-72 bg-[var(--nx-bg2)] border-r border-[var(--nx-border)] z-50 transition-transform lg:translate-x-0 flex flex-col overflow-y-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--nx-border)] shrink-0">
          <Link href="/"><NexusLogo size="md" /></Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--nx-text3)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b border-[var(--nx-border)] shrink-0">
          <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--nx-green)] to-[var(--nx-cyan)] flex items-center justify-center text-lg font-bold text-black shrink-0">
                {user?.fullName ? user.fullName.charAt(0) : "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user?.fullName || "Loading..."}</div>
                <div className="text-xs text-[var(--nx-text3)]">{profile?.sport || "Sport"} · {profile?.position_role || "Position"}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-semibold bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] text-[var(--nx-green)]" style={{ fontFamily: 'var(--font-mono)' }}>{user?.plan || "FREE"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--nx-text3)]">NexusScore™</span>
              <span className="text-lg font-bold text-[var(--nx-green)]" style={{ fontFamily: 'var(--font-display)' }}>{profile?.nexus_score || 0}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--nx-bg4)] overflow-hidden"><div className="h-full rounded-full bg-[var(--nx-green)]" style={{ width: `${profile?.nexus_score || 0}%` }} /></div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {sidebarSections.map(section => (
            <div key={section.section} className="mb-2">
              <p className="px-3 py-2 text-[9px] font-semibold text-[var(--nx-text3)] tracking-widest" style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{section.section}</p>
              {section.links.map((link) => {
                const isActive = pathname === link.href
                const bc = (link as any).bc
                return (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all group",
                      isActive ? "bg-[var(--nx-green-dim)] border-l-2 border-[var(--nx-green)] text-[var(--nx-green)] font-semibold pl-2.5" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)]")}>
                    <link.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{link.label}</span>
                    {(link as any).badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{
                        background: bc === 'red' ? 'var(--nx-red)' : bc === 'cyan' ? 'rgba(0,212,255,0.2)' : 'rgba(0,245,116,0.2)',
                        color: bc === 'red' ? 'white' : bc === 'cyan' ? 'var(--nx-cyan)' : 'var(--nx-green)'
                      }}>{(link as any).badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--nx-border)] shrink-0">
          <Link href="/athlete/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)] text-sm transition-all"><Settings className="w-4 h-4" /><span>Settings</span></Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--nx-red)] hover:bg-[var(--nx-red)]/10 text-sm transition-all"><LogOut className="w-4 h-4" /><span>Log Out</span></button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 h-16 bg-[var(--nx-bg)]/90 backdrop-blur-xl border-b border-[var(--nx-border)]">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[var(--nx-text3)]"><Menu className="w-6 h-6" /></button>
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" /><input type="text" placeholder="Search trials, academies, scouts..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-sm focus:border-[var(--nx-green)]" /></div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/athlete/alerts" className="relative p-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
              <Link href="/athlete/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--nx-green)] to-[var(--nx-cyan)] flex items-center justify-center text-sm font-bold text-black">
                {user?.fullName ? user.fullName.charAt(0) : "A"}
              </Link>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
