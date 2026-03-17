"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreVertical, MessageSquare, Eye, UserMinus, Star, Sparkles, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const ATHLETES = [
  { id: 1, name: "Rahul Kumar", sport: "Football", position: "Midfielder", age: 17, aiScore: 92, trend: 5, scoutMatches: 8, status: "active", profilePct: 88, injuryRisk: "LOW" },
  { id: 2, name: "Sneha Patel", sport: "Athletics", position: "Sprinter", age: 16, aiScore: 89, trend: 8, scoutMatches: 12, status: "active", profilePct: 95, injuryRisk: "LOW" },
  { id: 3, name: "Amit Singh", sport: "Kabaddi", position: "Raider", age: 19, aiScore: 87, trend: 3, scoutMatches: 6, status: "trial_invite", profilePct: 82, injuryRisk: "MODERATE" },
  { id: 4, name: "Priya Sharma", sport: "Badminton", position: "Singles", age: 15, aiScore: 85, trend: 6, scoutMatches: 4, status: "active", profilePct: 79, injuryRisk: "LOW" },
  { id: 5, name: "Karan Mehta", sport: "Football", position: "Goalkeeper", age: 18, aiScore: 78, trend: -2, scoutMatches: 2, status: "building", profilePct: 60, injuryRisk: "LOW" },
  { id: 6, name: "Deepika Rao", sport: "Athletics", position: "Long Jump", age: 17, aiScore: 83, trend: 4, scoutMatches: 5, status: "active", profilePct: 91, injuryRisk: "LOW" },
  { id: 7, name: "Vijay Nair", sport: "Football", position: "Striker", age: 16, aiScore: 75, trend: 9, scoutMatches: 3, status: "building", profilePct: 58, injuryRisk: "HIGH" },
  { id: 8, name: "Anjali Singh", sport: "Kabaddi", position: "Defender", age: 18, aiScore: 80, trend: 1, scoutMatches: 7, status: "active", profilePct: 85, injuryRisk: "LOW" },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "rgba(0,245,116,0.1)", text: "var(--nx-green)", label: "Active" },
  trial_invite: { bg: "rgba(255,184,0,0.1)", text: "var(--nx-gold)", label: "Trial Invite" },
  building: { bg: "rgba(245,166,35,0.1)", text: "var(--nx-amber)", label: "Building" },
  inactive: { bg: "rgba(255,59,48,0.1)", text: "var(--nx-red)", label: "Inactive" },
}

const riskColor = (r: string) => r === "LOW" ? "var(--nx-green)" : r === "MODERATE" ? "var(--nx-amber)" : "var(--nx-red)"

export default function AcademyAthletesPage() {
  const [search, setSearch] = useState("")
  const [sportFilter, setSportFilter] = useState("all")
  const [selected, setSelected] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  const sports = ["all", "Football", "Cricket", "Kabaddi", "Athletics", "Badminton"]
  const filtered = ATHLETES.filter(a => {
    const sportMatch = sportFilter === "all" || a.sport === sportFilter
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase())
    return sportMatch && searchMatch
  })

  const toggleSelect = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(a => a.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Athlete Roster</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">48 / 50 athlete slots used</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-cyan)]/10 border border-[var(--nx-cyan)]/25 text-[var(--nx-cyan)] text-sm hover:brightness-110 transition-all">
                <Sparkles className="w-4 h-4" />
                Generate Reels ({selected.length})
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
                <MessageSquare className="w-4 h-4" />
                Broadcast
              </button>
            </>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            <Download className="w-4 h-4" />CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all">
            <Plus className="w-4 h-4" />
            Add Athlete
          </button>
        </div>
      </div>

      {/* Slot Usage */}
      <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--nx-text1)]">Athlete Slots: 48 / 50</span>
            <span className="text-xs text-[var(--nx-amber)]">2 slots remaining</span>
          </div>
          <div className="h-2 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[var(--nx-amber)]" style={{ width: "96%" }} />
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[var(--nx-gold)]/10 border border-[var(--nx-gold)]/25 text-[var(--nx-gold)] text-sm font-medium hover:brightness-110 transition-all whitespace-nowrap">
          Upgrade to Elite (100 slots)
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search athletes..." className="pl-10 rounded-xl text-sm py-2.5" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {sports.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all shrink-0",
                sportFilter === s
                  ? "bg-[var(--nx-gold)] text-black font-semibold"
                  : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]"
              )}>
              {s === "all" ? "All Sports" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Squad Health */}
      <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <p className="text-xs font-semibold text-[var(--nx-text3)] mb-3" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>SQUAD HEALTH OVERVIEW</p>
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
          {[
            { pct: 40, color: "var(--nx-green)", label: "Complete" },
            { pct: 25, color: "var(--nx-gold)", label: "Good" },
            { pct: 20, color: "var(--nx-amber)", label: "Building" },
            { pct: 10, color: "var(--nx-red)", label: "Incomplete" },
            { pct: 5, color: "var(--nx-bg5)", label: "Started" },
          ].map((seg, i) => (
            <div key={i} className="h-full rounded-sm" style={{ width: `${seg.pct}%`, background: seg.color }} title={`${seg.label}: ${seg.pct}%`} />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {[
            { color: "var(--nx-green)", label: "Complete >80%: 19" },
            { color: "var(--nx-gold)", label: "Good 60-80%: 12" },
            { color: "var(--nx-amber)", label: "Building 40-60%: 10" },
            { color: "var(--nx-red)", label: "Incomplete: 5" },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-[10px] text-[var(--nx-text3)]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--nx-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--nx-border)]" style={{ background: "var(--nx-bg3)" }}>
                <th className="w-10 p-4">
                  <input type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="accent-[var(--nx-gold)] rounded" />
                </th>
                {["Athlete", "Sport", "Age", "NexusScore™", "Scout Matches", "Injury Risk", "Status", "Profile", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-[var(--nx-text3)] whitespace-nowrap"
                    style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((athlete, idx) => (
                <tr key={athlete.id}
                  className={cn(
                    "border-b border-[var(--nx-border)] transition-colors hover:bg-[var(--nx-bg4)] cursor-pointer",
                    selected.includes(athlete.id) && "bg-[rgba(255,184,0,0.04)]"
                  )}>
                  <td className="p-4" onClick={e => { e.stopPropagation(); toggleSelect(athlete.id) }}>
                    <input type="checkbox" checked={selected.includes(athlete.id)} onChange={() => toggleSelect(athlete.id)} className="accent-[var(--nx-gold)] rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>
                        {athlete.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[var(--nx-text1)]">{athlete.name}</p>
                        <p className="text-xs text-[var(--nx-text3)]">{athlete.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--nx-text2)]">{athlete.sport}</td>
                  <td className="px-4 py-3 text-sm text-[var(--nx-text2)]">{athlete.age}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: athlete.aiScore >= 85 ? "var(--nx-green)" : athlete.aiScore >= 75 ? "var(--nx-gold)" : "var(--nx-amber)" }}>
                        {athlete.aiScore}
                      </span>
                      <span className="flex items-center text-xs" style={{ color: athlete.trend >= 0 ? "var(--nx-green)" : "var(--nx-red)" }}>
                        {athlete.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(athlete.trend)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold" style={{ color: "var(--nx-cyan)", fontFamily: "var(--font-display)" }}>{athlete.scoutMatches}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold"
                      style={{ background: `${riskColor(athlete.injuryRisk)}10`, color: riskColor(athlete.injuryRisk), fontFamily: "var(--font-mono)" }}>
                      {athlete.injuryRisk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold"
                      style={{ background: STATUS_STYLES[athlete.status].bg, color: STATUS_STYLES[athlete.status].text }}>
                      {STATUS_STYLES[athlete.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--nx-gold)]" style={{ width: `${athlete.profilePct}%` }} />
                      </div>
                      <span className="text-xs text-[var(--nx-text3)]">{athlete.profilePct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg5)] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg5)] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === athlete.id ? null : athlete.id) }}
                        className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg5)] transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === athlete.id && (
                        <div className="absolute right-0 top-8 w-40 bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-xl shadow-xl z-10 py-1">
                          {[
                            { icon: Sparkles, label: "Generate Reel" },
                            { icon: Star, label: "View Assessment" },
                            { icon: UserMinus, label: "Remove from Roster", danger: true },
                          ].map(item => (
                            <button key={item.label} onClick={() => setMenuOpen(null)}
                              className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--nx-bg4)] transition-colors",
                                item.danger ? "text-[var(--nx-red)]" : "text-[var(--nx-text2)]")}>
                              <item.icon className="w-3.5 h-3.5" />{item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
