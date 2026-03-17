"use client"
import { useState } from "react"
import { AlertTriangle, Users, Bell, TrendingUp, CreditCard, Trophy, Star, X, ChevronRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const ALERTS = [
  { id: 1, type: "scout_inquiry", title: "Institutional Scout Interest Detected", body: "Rahul Verma (Mumbai City FC) has viewed 4 athletes from your academy this week — an 8x increase. This suggests systematic scouting interest. Consider formalising a partnership.", time: "2 hours ago", read: false, actionLabel: "View Scout", color: "var(--nx-purple)", priority: "HIGH" },
  { id: 2, type: "injury_cluster", title: "⚠️ Injury Cluster Alert", body: "3 athletes currently show HIGH injury risk (Knee: 2, Hamstring: 1). This may indicate over-training or surface issues. Review training programme with physiotherapist immediately.", time: "4 hours ago", read: false, actionLabel: "View Squad", color: "var(--nx-red)", priority: "CRITICAL" },
  { id: 3, type: "breakthrough", title: "Breakthrough Performance Detected", body: "Arjun Kumar's AI score increased from 64 to 76 (+12pts) in the last 30 days. Scout match count increased from 3 to 11. Recommend generating a new highlight reel.", time: "Yesterday", read: false, actionLabel: "Generate Reel", color: "var(--nx-green)", priority: "HIGH" },
  { id: 4, type: "tournament", title: "Tournament Registration Open", body: "ISL Youth Trials 2026 are now open for registration. 6 of your athletes meet the eligibility criteria for this event.", time: "Yesterday", read: true, actionLabel: "Register Athletes", color: "var(--nx-gold)", priority: "MEDIUM" },
  { id: 5, type: "slot_warning", title: "Athlete Slots Running Low", body: "You have used 48 of 50 athlete slots. Upgrade to Elite (100 slots) to continue adding athletes this season.", time: "2 days ago", read: true, actionLabel: "Upgrade Plan", color: "var(--nx-amber)", priority: "MEDIUM" },
  { id: 6, type: "inactivity", title: "Profile Inactivity Alert", body: "7 athletes have not uploaded content in 45+ days. Reduced activity decreases scout match frequency. Consider scheduling a squad video session.", time: "3 days ago", read: true, actionLabel: "View Athletes", color: "var(--nx-amber)", priority: "LOW" },
  { id: 7, type: "billing", title: "Plan Renewed Successfully", body: "Academy Premium plan renewed. ₹1,179 charged (₹999 + 18% GST). 50 athlete slots active for the next billing period.", time: "4 days ago", read: true, actionLabel: "View Receipt", color: "var(--nx-cyan)", priority: "LOW" },
  { id: 8, type: "partnership", title: "Scout Partnership Accepted", body: "K. Balaji (Bengaluru FC) accepted your partnership proposal. You now have a dedicated scout pipeline to Bengaluru FC's U-19 programme.", time: "5 days ago", read: true, actionLabel: "View Partnership", color: "var(--nx-teal)", priority: "HIGH" },
]

const TYPE_CONFIG: Record<string, { icon: any }> = {
  scout_inquiry: { icon: Users },
  injury_cluster: { icon: AlertTriangle },
  breakthrough: { icon: TrendingUp },
  tournament: { icon: Trophy },
  slot_warning: { icon: Users },
  inactivity: { icon: Bell },
  billing: { icon: CreditCard },
  partnership: { icon: Star },
}

const PRIORITY_LABEL: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: "Critical", color: "var(--nx-red)" },
  HIGH: { label: "High", color: "var(--nx-orange)" },
  MEDIUM: { label: "Medium", color: "var(--nx-gold)" },
  LOW: { label: "Low", color: "var(--nx-text3)" },
}

const FILTERS = ["All", "Scout Activity", "Squad Health", "Tournaments", "Billing", "Achievements"]

export default function AcademyAlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [filter, setFilter] = useState("All")
  const unread = alerts.filter(a => !a.read).length

  const dismiss = (id: number) => setAlerts(p => p.filter(a => a.id !== id))
  const markAllRead = () => setAlerts(p => p.map(a => ({ ...a, read: true })))

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Alerts</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">
            {unread > 0 ? <><span className="text-[var(--nx-gold)] font-semibold">{unread} unread</span> — including {alerts.filter(a => !a.read && a.priority === "CRITICAL").length} critical</> : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {/* Critical Alerts Banner */}
      {alerts.some(a => !a.read && a.priority === "CRITICAL") && (
        <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "rgba(255,59,48,0.06)", border: "2px solid rgba(255,59,48,0.3)" }}>
          <AlertTriangle className="w-5 h-5 text-[var(--nx-red)] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-[var(--nx-red)] text-sm">Critical Alert Requires Attention</p>
            <p className="text-xs text-[var(--nx-text2)] mt-0.5">You have critical squad health alerts that need immediate review.</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-[var(--nx-text3)] shrink-0 mt-2" />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0", filter === f ? "bg-[var(--nx-gold)] text-black font-semibold" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.inactivity
          const Icon = config.icon
          const prio = PRIORITY_LABEL[alert.priority]
          return (
            <div key={alert.id} className="group flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer"
              style={{ background: !alert.read ? `${alert.color}05` : "var(--nx-bg3)", borderColor: !alert.read ? `${alert.color}40` : "var(--nx-border)", borderLeftWidth: !alert.read ? "3px" : "1px" }}
              onClick={() => setAlerts(p => p.map(a => a.id === alert.id ? { ...a, read: true } : a))}>
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: `${alert.color}12`, border: `1px solid ${alert.color}25` }}>
                <Icon className="w-4 h-4" style={{ color: alert.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: !alert.read ? "var(--nx-text1)" : "var(--nx-text2)" }}>{alert.title}</p>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${prio.color}15`, color: prio.color, fontFamily: "var(--font-mono)" }}>{prio.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!alert.read && <div className="w-2 h-2 rounded-full" style={{ background: alert.color }} />}
                    <button onClick={e => { e.stopPropagation(); dismiss(alert.id) }} className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5 leading-relaxed">{alert.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>{alert.time}</span>
                  {alert.actionLabel && (
                    <button className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: alert.color }}>
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
