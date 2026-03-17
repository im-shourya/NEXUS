"use client"
import { useState } from "react"
import { Sparkles, Eye, MessageSquare, Bell, BellOff, TrendingUp, Award, Calendar, Filter, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const ALERTS = [
  { id: 1, type: "new_match", title: "New AI Match — 91% Compatibility", body: "Arjun Reddy (Football Striker, Hyderabad) now matches your criteria. Raid success rate exceeded your 75 threshold. Profile 88% complete.", time: "2 hours ago", read: false, actionLabel: "View Profile", color: "var(--nx-purple)" },
  { id: 2, type: "profile_update", title: "Shortlisted Athlete Updated Profile", body: "Priya Sharma (Athletics, Chennai) uploaded a new sprint video and her AI score increased from 86 to 91. She is now in your top 5 matches.", time: "4 hours ago", read: false, actionLabel: "View Update", color: "var(--nx-cyan)" },
  { id: 3, type: "tournament", title: "Live Match Alert — Goal Scored", body: "Vikram Singh (Kabaddi Raider) achieved a Super Raid in ISL Youth Trials live match. He is in your shortlist. View live performance.", time: "Yesterday", read: false, actionLabel: "View Live", color: "var(--nx-orange)" },
  { id: 4, type: "response", title: "Athlete Responded to Your Message", body: "Ananya Patel (Badminton, Bengaluru) replied to your trial invitation: 'Thank you for reaching out! I am available...'", time: "Yesterday", read: true, actionLabel: "Open Chat", color: "var(--nx-green)" },
  { id: 5, type: "market", title: "Market Intelligence Update", body: "12 new high-quality Football Strikers joined NEXUS this week from Maharashtra. Your AI criteria matched 8 of them. Review new matches.", time: "2 days ago", read: true, actionLabel: "See Matches", color: "var(--nx-purple)" },
  { id: 6, type: "verification", title: "Scout Verification Complete ✓", body: "Your ISL scout badge has been verified and is now visible to athletes. Your response rate should improve significantly.", time: "3 days ago", read: true, color: "var(--nx-cyan)" },
  { id: 7, type: "trial", title: "Trial Invitation Accepted", body: "Rahul Kumar (Football Midfielder) accepted your trial invitation for Jan 5–7 at Mumbai City FC Arena. He will attend.", time: "4 days ago", read: true, actionLabel: "View Details", color: "var(--nx-gold)" },
]

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  new_match: { icon: Sparkles, color: "var(--nx-purple)" },
  profile_update: { icon: TrendingUp, color: "var(--nx-cyan)" },
  tournament: { icon: Bell, color: "var(--nx-orange)" },
  response: { icon: MessageSquare, color: "var(--nx-green)" },
  market: { icon: Eye, color: "var(--nx-purple)" },
  verification: { icon: Award, color: "var(--nx-cyan)" },
  trial: { icon: Calendar, color: "var(--nx-gold)" },
}

const FILTERS = ["All", "AI Matches", "Athlete Activity", "Tournaments", "Messages", "Market Intel"]

export default function ScoutAlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [filter, setFilter] = useState("All")
  const unread = alerts.filter(a => !a.read).length
  const markAllRead = () => setAlerts(p => p.map(a => ({ ...a, read: true })))
  const dismiss = (id: number) => setAlerts(p => p.filter(a => a.id !== id))

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Alerts</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">
            {unread > 0 ? <><span className="text-[var(--nx-purple)] font-semibold">{unread} unread</span> notifications</> : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            <BellOff className="w-4 h-4" />Mark all read
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-[var(--nx-text3)] shrink-0 mt-2" />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0", filter === f ? "bg-[var(--nx-purple)] text-white font-semibold" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {alerts.map(alert => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.new_match
          const Icon = config.icon
          return (
            <div key={alert.id} className="group flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-[var(--nx-shadow-card)]"
              style={{ background: !alert.read ? `${config.color}05` : "var(--nx-bg3)", borderColor: !alert.read ? `${config.color}40` : "var(--nx-border)", borderLeftWidth: !alert.read ? "3px" : "1px" }}
              onClick={() => setAlerts(p => p.map(a => a.id === alert.id ? { ...a, read: true } : a))}>
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: `${config.color}12`, border: `1px solid ${config.color}25` }}>
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm" style={{ color: !alert.read ? "var(--nx-text1)" : "var(--nx-text2)" }}>{alert.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!alert.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: config.color }} />}
                    <button onClick={e => { e.stopPropagation(); dismiss(alert.id) }} className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5 leading-relaxed">{alert.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>{alert.time}</span>
                  {alert.actionLabel && (
                    <button className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: config.color }}>
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
