"use client"
import { useState } from "react"
import { MessageSquare, Trophy, Download, X, ChevronUp, ChevronDown, Send } from "lucide-react"
import { cn } from "@/lib/utils"

function scoreColor(s: number) { return s >= 80 ? "var(--nx-cyan)" : s >= 65 ? "var(--nx-gold)" : "var(--nx-green)" }

const SHORTLISTED = [
  { id: 1, name: "Arjun Sharma", sport: "Football", position: "Striker", city: "Nagpur", age: 17, matchPct: 85, nexusScore: 74, topSkill: 82, lastActive: "2d ago", injuryRisk: "LOW", availability: true, trialOutcome: 67, initials: "AS", assessment: { potential: 5, coachability: 4, physical: 4, technical: 5, timeline: "Ready Now", notes: "Strong free-kick technique. Recommend fast-track." } },
  { id: 2, name: "Vikram Singh", sport: "Football", position: "Midfielder", city: "Pune", age: 19, matchPct: 78, nexusScore: 71, topSkill: 84, lastActive: "Today", injuryRisk: "LOW", availability: true, trialOutcome: 72, initials: "VS", assessment: { potential: 4, coachability: 5, physical: 3, technical: 4, timeline: "3 Months", notes: "" } },
  { id: 3, name: "Karan Mehta", sport: "Football", position: "LW", city: "Mumbai", age: 16, matchPct: 74, nexusScore: 68, topSkill: 86, lastActive: "1w ago", injuryRisk: "LOW", availability: true, trialOutcome: 58, initials: "KM", assessment: { potential: 3, coachability: 3, physical: 5, technical: 3, timeline: "6 Months", notes: "" } },
  { id: 4, name: "Sneha Patel", sport: "Football", position: "CF", city: "Nagpur", age: 16, matchPct: 82, nexusScore: 78, topSkill: 85, lastActive: "Today", injuryRisk: "LOW", availability: false, trialOutcome: 74, initials: "SP", assessment: { potential: 4, coachability: 4, physical: 4, technical: 5, timeline: "Ready Now", notes: "Scoring form exceptional this month." } },
]

const COLUMNS = [
  { key: "matchPct", label: "Match %", color: "var(--nx-cyan)" },
  { key: "nexusScore", label: "NexusScore™", color: "var(--nx-green)" },
  { key: "topSkill", label: "Top Skill", color: "var(--nx-gold)" },
  { key: "trialOutcome", label: "Trial Prediction", color: "var(--nx-purple)" },
  { key: "age", label: "Age", color: "var(--nx-text2)" },
]

export default function ScoutShortlistPage() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [shortlisted, setShortlisted] = useState(SHORTLISTED)
  const [sortBy, setSortBy] = useState("matchPct")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [showTrialModal, setShowTrialModal] = useState<number | null>(null)
  const [trialForm, setTrialForm] = useState({ club: "Mumbai City FC", category: "U-19", dates: "", city: "Mumbai", accommodation: false, format: "Group Trial" })

  const sorted = [...shortlisted].sort((a, b) => {
    const av = (a as any)[sortBy], bv = (b as any)[sortBy]
    return sortDir === "desc" ? bv - av : av - bv
  })

  const toggleSort = (col: string) => { if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortBy(col); setSortDir("desc") } }
  const remove = (id: number) => setShortlisted(p => p.filter(a => a.id !== id))

  const exportCSV = () => {
    const header = "Name,Sport,Position,City,Age,Match %,NexusScore,Top Skill,Trial Prediction\n"
    const rows = shortlisted.map(a => `${a.name},${a.sport},${a.position},${a.city},${a.age},${a.matchPct}%,${a.nexusScore},${a.topSkill},${a.trialOutcome}%`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "nexus-shortlist.csv"; a.click()
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Shortlist</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">{shortlisted.length} athletes saved · manage your pipeline</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl overflow-hidden border border-[var(--nx-border)]">
            {["cards","table"].map(m => (
              <button key={m} onClick={() => setViewMode(m as any)} className={cn("px-4 py-2 text-xs font-semibold transition-all capitalize", viewMode === m ? "bg-[var(--nx-purple)] text-white" : "bg-[var(--nx-bg3)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>{m}</button>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-xs text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
            <Download className="w-3.5 h-3.5" />CSV
          </button>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(a => (
            <div key={a.id} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "2px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>{a.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-[var(--nx-text1)]">{a.name}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}>⚽ {a.sport}</span>
                    {!a.availability && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--nx-bg5)] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>UNAVAIL</span>}
                  </div>
                  <p className="text-xs text-[var(--nx-text3)] mt-0.5">{a.position} · Age {a.age} · {a.city}</p>
                </div>
                <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-red)] hover:bg-[var(--nx-red)]/10 transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[["Match", a.matchPct + "%", "var(--nx-cyan)"], ["Score", a.nexusScore, scoreColor(a.nexusScore)], ["Top Skill", a.topSkill, "var(--nx-gold)"], ["Injury", a.injuryRisk, a.injuryRisk === "LOW" ? "var(--nx-green)" : a.injuryRisk === "MODERATE" ? "var(--nx-amber)" : "var(--nx-red)"]].map(([l, v, c]) => (
                  <div key={l as string} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-center">
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
                    <p className="text-[8px] text-[var(--nx-text3)] mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Trial Outcome Prediction chip */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: "rgba(155,93,255,0.06)", border: "1px solid rgba(155,93,255,0.2)" }}>
                <Trophy className="w-3.5 h-3.5 text-[var(--nx-purple)] shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Trial Outcome Prediction</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${a.trialOutcome}%`, background: "var(--nx-purple)" }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--nx-purple)", fontFamily: "var(--font-display)" }}>{a.trialOutcome}%</span>
                  </div>
                </div>
              </div>

              {/* Private assessment summary */}
              {a.assessment.notes && (
                <div className="mb-4 px-3 py-2 rounded-xl" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
                  <p className="text-[10px] text-[var(--nx-text3)] mb-1 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>My Notes</p>
                  <p className="text-xs text-[var(--nx-text2)] italic">"{a.assessment.notes}"</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
                  <MessageSquare className="w-3.5 h-3.5" />Message
                </button>
                <button onClick={() => setShowTrialModal(a.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-green)", color: "black" }}>
                  <Send className="w-3.5 h-3.5" />Invite to Trial
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="rounded-2xl overflow-hidden border border-[var(--nx-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--nx-bg4)] border-b border-[var(--nx-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Athlete</th>
                {COLUMNS.map(c => (
                  <th key={c.key} className="px-3 py-3 text-left cursor-pointer group" onClick={() => toggleSort(c.key)}>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>{c.label}</span>
                      {sortBy === c.key ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3 text-[var(--nx-purple)]" /> : <ChevronUp className="w-3 h-3 text-[var(--nx-purple)]" />) : <ChevronDown className="w-3 h-3 text-[var(--nx-border2)] group-hover:text-[var(--nx-text3)]" />}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a, i) => (
                <tr key={a.id} className={cn("border-b border-[var(--nx-border)] hover:bg-[var(--nx-bg4)]/50 transition-colors", i % 2 === 0 ? "bg-[var(--nx-bg3)]" : "bg-[var(--nx-bg2)]")}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>{a.initials}</div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--nx-text1)]">{a.name}</p>
                        <p className="text-[10px] text-[var(--nx-text3)]">{a.position} · {a.city} · Age {a.age}</p>
                      </div>
                    </div>
                  </td>
                  {COLUMNS.map(c => (
                    <td key={c.key} className="px-3 py-3">
                      {c.key === "trialOutcome" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(a as any)[c.key]}%`, background: "var(--nx-purple)" }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: "var(--nx-purple)", fontFamily: "var(--font-display)" }}>{(a as any)[c.key]}%</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: c.key === "matchPct" ? "var(--nx-cyan)" : c.key === "nexusScore" ? scoreColor((a as any)[c.key]) : c.key === "topSkill" ? "var(--nx-gold)" : "var(--nx-text2)" }}>
                          {(a as any)[c.key]}{c.key === "matchPct" ? "%" : ""}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>Msg</button>
                      <button onClick={() => setShowTrialModal(a.id)} className="px-2 py-1 rounded-lg text-[10px] font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-green)", color: "black" }}>Invite</button>
                      <button onClick={() => remove(a.id)} className="p-1 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-red)] hover:bg-[var(--nx-red)]/10 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trial Invitation Modal */}
      {showTrialModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTrialModal(null)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-[var(--nx-text1)]">Send Trial Invitation</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">To: {shortlisted.find(a => a.id === showTrialModal)?.name}</p>
              </div>
              <button onClick={() => setShowTrialModal(null)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: "rgba(0,245,116,0.04)", border: "1px solid var(--nx-green-border)" }}>
                <p className="text-[10px] font-semibold text-[var(--nx-green)] mb-3 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Trial Details</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Organisation / Club</label>
                    <input value={trialForm.club} onChange={e => setTrialForm(p => ({...p, club: e.target.value}))} className="text-sm rounded-xl w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Category</label>
                      <select value={trialForm.category} onChange={e => setTrialForm(p => ({...p, category: e.target.value}))} className="text-sm rounded-xl w-full py-2">
                        {["U-14","U-17","U-19","U-21","Senior"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Format</label>
                      <select value={trialForm.format} onChange={e => setTrialForm(p => ({...p, format: e.target.value}))} className="text-sm rounded-xl w-full py-2">
                        {["Group Trial","Individual Assessment","Residential Camp","1-Day Trial"].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Trial Dates</label>
                    <input type="text" value={trialForm.dates} onChange={e => setTrialForm(p => ({...p, dates: e.target.value}))} placeholder="e.g. 18–20 January 2026" className="text-sm rounded-xl w-full" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>City</label>
                    <input value={trialForm.city} onChange={e => setTrialForm(p => ({...p, city: e.target.value}))} className="text-sm rounded-xl w-full" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={trialForm.accommodation} onChange={e => setTrialForm(p => ({...p, accommodation: e.target.checked}))} className="accent-[var(--nx-green)]" />
                    <span className="text-xs text-[var(--nx-text2)]">Accommodation provided</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowTrialModal(null)} className="flex-1 py-2.5 rounded-xl text-sm border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowTrialModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ background: "var(--nx-green)", color: "black" }}>
                  <Send className="w-4 h-4" />Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
