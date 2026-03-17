"use client"

import { useState } from "react"
import { Eye, Sparkles, Trophy, Bell, Target, BarChart2, AlertTriangle, Award, CheckCheck, X, Filter, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Alert = {
  id: number; type: string; title: string; body: string;
  time: string; read: boolean; actionUrl?: string; actionLabel?: string
}

const ALERTS: Alert[] = [
  { id: 1, type: "scout_view", title: "Scout viewed your profile", body: "Rahul Verma from Mumbai City FC (ISL) just viewed your profile and spent 8 minutes on your highlight reel.", time: "2 hours ago", read: false, actionUrl: "/athlete/matches", actionLabel: "View Match" },
  { id: 2, type: "new_match", title: "New AI Match Detected — 91%", body: "You have a new 91% match with K. Balaji (Bengaluru FC). Your sprint speed puts you in the top 10% of strikers.", time: "4 hours ago", read: false, actionUrl: "/athlete/matches", actionLabel: "See Match" },
  { id: 3, type: "trial_invite", title: "Trial Invitation Received 🎯", body: "Priya Singh from Chennaiyin FC has invited you to their U-19 Trials on Jan 5–7, 2026 in Mumbai. Please respond before Dec 28.", time: "Yesterday", read: false, actionUrl: "/athlete/messages", actionLabel: "Respond Now" },
  { id: 4, type: "tournament", title: "Tournament Closing in 3 Days", body: "ISL U-19 Youth Trials 2026 registration closes on Dec 28. 45 spots remaining. You meet all eligibility criteria.", time: "Yesterday", read: true, actionUrl: "/athlete/trials", actionLabel: "Register" },
  { id: 5, type: "performance", title: "AI Analysis Ready ✨", body: "Form analysis for your 'ISL Trial Highlights' video is complete. Sprint mechanics — Good. 1 improvement area flagged.", time: "2 days ago", read: true, actionUrl: "/athlete/performance", actionLabel: "View Analysis" },
  { id: 6, type: "achievement", title: "Top 15% Nationally 🏆", body: "Your sprint speed (82/100) now ranks you in the top 15% of strikers aged 16–18 in India. 3 ISL scouts were automatically notified.", time: "3 days ago", read: true },
  { id: 7, type: "injury", title: "⚠️ Injury Risk: Moderate", body: "Your last form analysis detected moderate knee risk. Recommended: Quad strengthening exercises and rest before next session.", time: "5 days ago", read: true, actionUrl: "/athlete/performance", actionLabel: "View Details" },
  { id: 8, type: "message", title: "New Message from K. Balaji", body: "K. Balaji (Bengaluru FC) sent you a message: 'Saw your free-kick compilation. Impressive technique. I'd love to discuss...'", time: "1 week ago", read: true, actionUrl: "/athlete/messages", actionLabel: "Reply" },
]

const TYPE_CONFIG: Record<string, { icon: any; borderColor: string; bgColor: string; iconColor: string; dotColor: string }> = {
  scout_view:  { icon: Eye, borderColor: "var(--nx-green)", bgColor: "var(--nx-green-dim)", iconColor: "var(--nx-green)", dotColor: "var(--nx-green)" },
  new_match:   { icon: Sparkles, borderColor: "var(--nx-cyan)", bgColor: "rgba(0,212,255,0.06)", iconColor: "var(--nx-cyan)", dotColor: "var(--nx-cyan)" },
  trial_invite:{ icon: Trophy, borderColor: "var(--nx-gold)", bgColor: "rgba(255,184,0,0.06)", iconColor: "var(--nx-gold)", dotColor: "var(--nx-gold)" },
  tournament:  { icon: Bell, borderColor: "var(--nx-amber)", bgColor: "rgba(245,166,35,0.06)", iconColor: "var(--nx-amber)", dotColor: "var(--nx-amber)" },
  performance: { icon: BarChart2, borderColor: "var(--nx-teal)", bgColor: "rgba(0,201,177,0.06)", iconColor: "var(--nx-teal)", dotColor: "var(--nx-teal)" },
  achievement: { icon: Award, borderColor: "var(--nx-gold)", bgColor: "rgba(255,184,0,0.05)", iconColor: "var(--nx-gold)", dotColor: "var(--nx-gold)" },
  injury:      { icon: AlertTriangle, borderColor: "var(--nx-red)", bgColor: "rgba(255,59,48,0.06)", iconColor: "var(--nx-red)", dotColor: "var(--nx-red)" },
  message:     { icon: Target, borderColor: "var(--nx-purple)", bgColor: "rgba(155,93,255,0.05)", iconColor: "var(--nx-purple)", dotColor: "var(--nx-purple)" },
}

const FILTERS = ["All", "Scout Activity", "AI Matches", "Tournaments", "Performance", "Achievements", "Messages"]

export default function AthleteAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS)
  const [filter, setFilter] = useState("All")

  const unread = alerts.filter(a => !a.read).length
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))
  const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const dismiss = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))

  const filterMap: Record<string, string[]> = {
    "Scout Activity": ["scout_view"],
    "AI Matches": ["new_match"],
    "Tournaments": ["tournament", "trial_invite"],
    "Performance": ["performance", "injury"],
    "Achievements": ["achievement"],
    "Messages": ["message"],
  }

  const filtered = filter === "All" ? alerts : alerts.filter(a => filterMap[filter]?.includes(a.type))

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Alerts</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">
            {unread > 0 ? <><span className="text-[var(--nx-green)] font-semibold">{unread} unread</span> notifications</> : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            <CheckCheck className="w-4 h-4" />Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-[var(--nx-text3)] shrink-0 mt-2" />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0",
              filter === f ? "bg-[var(--nx-green)] text-black font-semibold" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]"
            )}>
            {f}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="p-12 text-center text-[var(--nx-text3)]">
            <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No alerts in this category</p>
          </div>
        )}

        {filtered.map(alert => {
          const config = TYPE_CONFIG[alert.type]
          const Icon = config.icon
          return (
            <div key={alert.id}
              className="group flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-[var(--nx-shadow-card)]"
              style={{
                background: !alert.read ? config.bgColor : "var(--nx-bg3)",
                borderColor: !alert.read ? config.borderColor + "40" : "var(--nx-border)",
                borderLeftWidth: !alert.read ? "3px" : "1px",
              }}
              onClick={() => markRead(alert.id)}>

              {/* Icon */}
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                style={{ background: config.bgColor, border: `1px solid ${config.borderColor}30` }}>
                <Icon className="w-4 h-4" style={{ color: config.iconColor }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm" style={{ color: !alert.read ? "var(--nx-text1)" : "var(--nx-text2)" }}>
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: config.dotColor }} />
                    )}
                    <button onClick={e => { e.stopPropagation(); dismiss(alert.id) }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5 leading-relaxed">{alert.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>{alert.time}</span>
                  {alert.actionLabel && (
                    <button className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: config.iconColor }}>
                      {alert.actionLabel} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
