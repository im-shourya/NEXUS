"use client"
import { useState } from "react"
import { Search, Bell, Lock, CreditCard, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "discovery", label: "Discovery", icon: Search },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]
const SPORTS = ["Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey", "Wrestling", "Multi-Sport"]
const AGE_GROUPS = ["U-14", "U-17", "U-19", "U-21", "Senior", "All Ages"]
const REGIONS = ["North India", "South India", "East India", "West India", "Northeast India", "Pan-India"]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={cn("relative w-11 h-6 rounded-full transition-all shrink-0", on ? "bg-[var(--nx-purple)]" : "bg-[var(--nx-bg5)]")}>
      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform", on ? "left-6" : "left-1")} />
    </button>
  )
}

export default function ScoutSettingsPage() {
  const [tab, setTab] = useState("discovery")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sports, setSports] = useState(["Football"])
  const [ages, setAges] = useState(["U-17", "U-19", "U-21"])
  const [region, setRegion] = useState(["Pan-India"])
  const [prefs, setPrefs] = useState({ minScore: 60, minCompleteness: 70, available: true, injuryFree: false })
  const [notifs, setNotifs] = useState({ newMatch: true, profileUpdate: true, trialAccepted: true, trialDeclined: true, message: true, tournament: true, market: true })
  const [privacy, setPrivacy] = useState({ showOrg: true, showBadge: true, showViewed: true })

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val])

  const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 1000)); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Settings</h1><p className="text-sm text-[var(--nx-text3)] mt-0.5">Manage your scout account and discovery preferences</p></div>
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--nx-border)]">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
            tab === t.id ? t.id === "danger" ? "bg-[var(--nx-red)]/10 text-[var(--nx-red)] border border-[var(--nx-red)]/20" : "bg-[rgba(155,93,255,0.08)] text-[var(--nx-purple)] border border-[rgba(155,93,255,0.25)]"
              : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]")}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "discovery" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Sports Coverage</h2>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(s => (
                <button key={s} onClick={() => toggleArr(sports, setSports, s)}
                  className={cn("px-3 py-1.5 rounded-xl text-sm transition-all", sports.includes(s) ? "bg-[var(--nx-purple)] text-white font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Age Groups</h2>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(ag => (
                <button key={ag} onClick={() => toggleArr(ages, setAges, ag)}
                  className={cn("px-3 py-1.5 rounded-xl text-sm transition-all", ages.includes(ag) ? "bg-[var(--nx-purple)] text-white font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>{ag}</button>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Geographic Focus</h2>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => toggleArr(region, setRegion, r)}
                  className={cn("px-3 py-1.5 rounded-xl text-sm transition-all", region.includes(r) ? "bg-[var(--nx-purple)] text-white font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>{r}</button>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-5">
            <h2 className="font-semibold text-[var(--nx-text1)]">Discovery Thresholds</h2>
            <div>
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Min AI Score: {prefs.minScore}
              </label>
              <input type="range" min={40} max={95} value={prefs.minScore} onChange={e => setPrefs(p => ({ ...p, minScore: +e.target.value }))} className="w-full mt-2 accent-[var(--nx-purple)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Min Profile Completeness: {prefs.minCompleteness}%
              </label>
              <input type="range" min={40} max={100} value={prefs.minCompleteness} onChange={e => setPrefs(p => ({ ...p, minCompleteness: +e.target.value }))} className="w-full mt-2 accent-[var(--nx-purple)]" />
            </div>
            {[["available", "Available for Trials Only", "Only show athletes seeking trial opportunities"], ["injuryFree", "Injury-Free Athletes Only", "Exclude athletes with MODERATE or HIGH injury risk"]].map(([k, l, d]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
                <div><p className="font-medium text-sm text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
                <Toggle on={(prefs as any)[k]} onChange={v => setPrefs(p => ({ ...p, [k]: v }))} />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70" style={{ background: "var(--nx-purple)", color: "white" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
            </button>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
          <h2 className="font-semibold text-[var(--nx-text1)]">Notification Preferences</h2>
          {[
            ["newMatch", "New AI Match Detected", "When a new athlete matches your criteria"],
            ["profileUpdate", "Shortlisted Athlete Updated", "When an athlete in your shortlist improves their profile"],
            ["trialAccepted", "Trial Invitation Accepted", "When an athlete accepts your trial invitation"],
            ["trialDeclined", "Trial Invitation Declined", "When an athlete declines (includes 'Find Similar' link)"],
            ["message", "New Message", "When an athlete responds to you"],
            ["tournament", "Tournament Milestones", "Goals/wickets from bookmarked tournaments"],
            ["market", "Market Intelligence Report", "Weekly talent pipeline updates for your sport"],
          ].map(([k, l, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
              <div><p className="font-medium text-sm text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
              <Toggle on={(notifs as any)[k]} onChange={v => setNotifs(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
        </div>
      )}

      {tab === "privacy" && (
        <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
          <h2 className="font-semibold text-[var(--nx-text1)]">Privacy Settings</h2>
          {[
            ["showOrg", "Show my organisation name to athletes", "Athletes see your club name before first contact — builds trust and increases response rate"],
            ["showBadge", "Show verification badge details publicly", "Display ISL/PKL/SAI tier badge on all communications"],
            ["showViewed", "Allow athletes to see when I viewed their profile", "Part of NEXUS transparency commitment — scouts who show interest get 2x more responses"],
          ].map(([k, l, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
              <div><p className="font-medium text-sm text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
              <Toggle on={(privacy as any)[k]} onChange={v => setPrivacy(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
        </div>
      )}

      {tab === "subscription" && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl border" style={{ background: "rgba(155,93,255,0.04)", borderColor: "rgba(155,93,255,0.25)" }}>
            <div className="flex items-center justify-between mb-4">
              <div><p className="text-xl font-bold text-[var(--nx-purple)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>SCOUT PRO</p>
                <p className="text-sm text-[var(--nx-text2)]">₹499/month · Renews April 1, 2026</p></div>
              <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>ACTIVE</span>
            </div>
            {[["Athlete Discovery", "Unlimited"], ["Shortlist", "Unlimited"], ["Trial Invitations", "Unlimited"], ["Market Intelligence", "Included"]].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between py-2 border-b border-[var(--nx-border)] last:border-0 text-sm">
                <span className="text-[var(--nx-text3)]">{l}</span>
                <span className="font-semibold text-[var(--nx-purple)]">{v}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3">Payment History</h3>
            <div className="space-y-2">
              {[["Mar 1, 2026", "₹589"], ["Feb 1, 2026", "₹589"], ["Jan 1, 2026", "₹589"]].map(([d, a], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div><p className="text-sm font-medium text-[var(--nx-text1)]">Scout Pro Monthly</p><p className="text-xs text-[var(--nx-text3)]">{d}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--nx-purple)]">{a}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--nx-green-dim)] text-[var(--nx-green)]">Paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "danger" && (
        <div className="space-y-4">
          {[
            { title: "Pause Account", desc: "Hide your scout profile. Athletes can't see you, but your shortlist and data are preserved.", action: "Pause Account", color: "var(--nx-amber)" },
            { title: "Export Scout Data", desc: "Download all your shortlists, assessments, and conversation history as JSON.", action: "Export Data", color: "var(--nx-cyan)" },
            { title: "Delete Account", desc: "Permanently delete your account. This cannot be undone after a 30-day grace period.", action: "Delete Account", color: "var(--nx-red)" },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ borderColor: `${item.color}25`, background: `${item.color}05` }}>
              <div className="flex items-start justify-between gap-4">
                <div><h3 className="font-semibold text-[var(--nx-text1)]">{item.title}</h3><p className="text-sm text-[var(--nx-text3)] mt-1">{item.desc}</p></div>
                <button className="px-4 py-2 rounded-xl font-semibold text-sm transition-all shrink-0" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>{item.action}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
