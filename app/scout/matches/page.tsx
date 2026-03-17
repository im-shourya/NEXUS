"use client"
import { useState } from "react"
import { Eye, MessageSquare, Bookmark, Filter, TrendingUp, Shield, ChevronDown, ChevronUp, Download, CheckSquare, Square, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const MATCHES = [
  { id: 1, name: "Arjun Reddy", age: 17, sport: "Football", position: "Striker (LWF)", location: "Hyderabad, TG", nexusScore: 87, matchPct: 94, verified: true, trending: true, isNew: true, hiddenGem: false, hotStreak: true, scoreDelta: 9, injuryRisk: "LOW", highlights: ["23 goals this season", "State Champion", "Sprint: 82/100"], reasons: ["Position: Striker exact match", "Age: U-19 criteria", "Speed threshold exceeded", "Region: South India"] },
  { id: 2, name: "Priya Sharma", age: 16, sport: "Football", position: "Left Wing Forward", location: "Chennai, TN", nexusScore: 91, matchPct: 91, verified: true, trending: true, isNew: true, hiddenGem: false, hotStreak: false, scoreDelta: 3, injuryRisk: "LOW", highlights: ["State Athletic gold", "SAI residential camp", "Pace: Top 8%"], reasons: ["Position: LWF compatible", "Age: U-17 criteria", "Profile 95% complete", "Rising AI score +8 pts"] },
  { id: 3, name: "Vikas Patel", age: 17, sport: "Football", position: "Striker", location: "Surat, GJ", nexusScore: 73, matchPct: 88, verified: false, trending: false, isNew: false, hiddenGem: true, hotStreak: false, scoreDelta: 0, injuryRisk: "LOW", highlights: ["High AI score, low scout visits", "Profile 82% complete", "Regional standout"], reasons: ["Position match", "Age range", "High potential, undiscovered"] },
  { id: 4, name: "Karan Mehta", age: 18, sport: "Football", position: "Advanced Forward", location: "Pune, MH", nexusScore: 82, matchPct: 87, verified: true, trending: false, isNew: false, hiddenGem: false, hotStreak: false, scoreDelta: 0, injuryRisk: "LOW", highlights: ["14 assists", "I-League U-18", "Dribble: 84/100"], reasons: ["Position: Forward coverage", "Age: U-19 criteria", "Technical score >80"] },
  { id: 5, name: "Rahul Kumar", age: 17, sport: "Football", position: "Second Striker", location: "Kolkata, WB", nexusScore: 79, matchPct: 83, verified: false, trending: false, isNew: false, hiddenGem: false, hotStreak: false, scoreDelta: 0, injuryRisk: "MODERATE", highlights: ["11 goals", "I-League U-18", "Vision: 82/100"], reasons: ["Position: Forward coverage", "Age range match", "Technical ability"] },
]

const riskColor = (r: string) => r === "LOW" ? "var(--nx-green)" : r === "MODERATE" ? "var(--nx-amber)" : "var(--nx-red)"

export default function ScoutMatchesPage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [shortlisted, setShortlisted] = useState<number[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [activeFilter, setActiveFilter] = useState("All")

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])
  const selectAll = () => setSelected(MATCHES.map(m => m.id))
  const clearAll = () => setSelected([])

  const hiddenGems = MATCHES.filter(m => m.hiddenGem)
  const hotStreaks = MATCHES.filter(m => m.hotStreak)
  const newMatches = MATCHES.filter(m => m.isNew)
  const filtered = activeFilter === "New" ? MATCHES.filter(m => m.isNew)
    : activeFilter === "Hidden Gems" ? MATCHES.filter(m => m.hiddenGem)
    : activeFilter === "Hot Streak" ? MATCHES.filter(m => m.hotStreak)
    : MATCHES

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">My AI Matches</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Athletes the AI recommends — refreshed nightly · <span style={{ color: "var(--nx-cyan)" }}>{newMatches.length} new since last login</span></p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <button onClick={() => setShortlisted(p => [...new Set([...p, ...selected])])} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-purple)", color: "white" }}>
                <Bookmark className="w-4 h-4" />Add {selected.length} to Shortlist
              </button>
              <button onClick={clearAll} className="px-3 py-2 rounded-xl text-xs text-[var(--nx-text3)] border border-[var(--nx-border)]">Clear</button>
            </>
          )}
          {selected.length === 0 && (
            <button onClick={selectAll} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
              <Users className="w-4 h-4" />Select All
            </button>
          )}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border border-[var(--nx-border)] text-[var(--nx-text2)]">
            <Download className="w-4 h-4" />Export CSV
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "New", "Hidden Gems", "Hot Streak"].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", activeFilter === f ? "text-white" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}
            style={activeFilter === f ? { background: f === "Hidden Gems" ? "var(--nx-gold)" : f === "Hot Streak" ? "var(--nx-orange)" : "var(--nx-purple)" } : {}}>
            {f === "Hidden Gems" && "💎 "}
            {f === "Hot Streak" && "🔥 "}
            {f === "New" && `✨ `}
            {f} {f !== "All" && `(${f === "New" ? newMatches.length : f === "Hidden Gems" ? hiddenGems.length : hotStreaks.length})`}
          </button>
        ))}
      </div>

      {/* Hidden Gem Detector Banner */}
      {(activeFilter === "All" || activeFilter === "Hidden Gems") && hiddenGems.length > 0 && (
        <div className="p-4 rounded-2xl border" style={{ background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💎</span>
            <p className="font-semibold text-sm" style={{ color: "var(--nx-gold)" }}>Hidden Gem Detector</p>
            <span className="text-[9px] px-2 py-0.5 rounded font-bold ml-auto" style={{ background: "rgba(255,184,0,0.12)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>AI POWERED</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--nx-text2)" }}>
            High-quality athletes with low current scouting attention — AI score above 65, profile complete above 75%, but fewer than 50 scout views. Act before others discover them.
          </p>
          <div className="flex gap-2 flex-wrap">
            {hiddenGems.map(gem => (
              <div key={gem.id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.2)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--nx-text1)" }}>{gem.name}</span>
                <span className="text-xs" style={{ color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>{gem.matchPct}%</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>UNDISCOVERED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Streak Section */}
      {(activeFilter === "All" || activeFilter === "Hot Streak") && hotStreaks.length > 0 && (
        <div className="p-4 rounded-2xl border" style={{ background: "rgba(255,91,25,0.04)", borderColor: "rgba(255,91,25,0.25)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🔥</span>
            <p className="font-semibold text-sm" style={{ color: "var(--nx-orange)" }}>Hot Right Now</p>
          </div>
          <p className="text-xs" style={{ color: "var(--nx-text2)" }}>
            Athletes whose last 3 performances are significantly above their career average — currently in exceptional form. Ideal trial timing.
          </p>
        </div>
      )}

      {/* Match Cards */}
      <div className="space-y-4">
        {filtered.map(match => (
          <div key={match.id}
            className={cn("rounded-2xl border overflow-hidden transition-all", expanded === match.id && "shadow-[var(--nx-shadow-hover)]")}
            style={{ background: "var(--nx-bg3)", borderColor: match.isNew ? "rgba(0,212,255,0.3)" : match.hiddenGem ? "rgba(255,184,0,0.25)" : match.hotStreak ? "rgba(255,91,25,0.25)" : "var(--nx-border)" }}>
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button onClick={() => toggleSelect(match.id)} className="mt-0.5 text-[var(--nx-text3)] hover:text-[var(--nx-purple)] transition-colors shrink-0">
                  {selected.includes(match.id) ? <CheckSquare className="w-4 h-4 text-[var(--nx-purple)]" /> : <Square className="w-4 h-4" />}
                </button>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: match.verified ? "rgba(155,93,255,0.1)" : "var(--nx-bg5)", border: `2px solid ${match.verified ? "rgba(155,93,255,0.3)" : "var(--nx-border)"}`, color: match.verified ? "var(--nx-purple)" : "var(--nx-text3)", fontFamily: "var(--font-display)", fontSize: "18px" }}>
                  {match.name.split(" ").map(n => n[0]).join("")}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-[var(--nx-text1)]">{match.name}</span>
                    {match.isNew && <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.12)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>NEW</span>}
                    {match.hotStreak && <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(255,91,25,0.12)", color: "var(--nx-orange)", fontFamily: "var(--font-mono)" }}>🔥 HOT STREAK</span>}
                    {match.hiddenGem && <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(255,184,0,0.12)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>💎 HIDDEN GEM</span>}
                    {match.verified && <Shield className="w-3.5 h-3.5" style={{ color: "var(--nx-purple)" }} />}
                  </div>
                  <p className="text-xs text-[var(--nx-text2)] mb-2">{match.position} · Age {match.age} · 📍 {match.location}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>{match.sport}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--nx-bg5)", color: "var(--nx-text3)", border: "1px solid var(--nx-border)" }}>NexusScore™ {match.nexusScore}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${riskColor(match.injuryRisk)}12`, color: riskColor(match.injuryRisk), border: `1px solid ${riskColor(match.injuryRisk)}30` }}>
                      Risk: {match.injuryRisk}
                    </span>
                    {match.scoreDelta > 5 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(0,212,255,0.08)", color: "var(--nx-cyan)", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <TrendingUp className="w-2.5 h-2.5" />+{match.scoreDelta}pts
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{match.matchPct}%</div>
                  <div className="text-[9px] tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)" }}>AI MATCH</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--nx-border)]">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-purple)", color: "white" }}>
                  <MessageSquare className="w-3.5 h-3.5" />Message
                </button>
                <button onClick={() => setShortlisted(p => p.includes(match.id) ? p.filter(i => i !== match.id) : [...p, match.id])}
                  className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border", shortlisted.includes(match.id) ? "" : "")}
                  style={shortlisted.includes(match.id) ? { background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)", color: "var(--nx-gold)" } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text2)" }}>
                  <Bookmark className="w-3.5 h-3.5" />{shortlisted.includes(match.id) ? "Shortlisted" : "Shortlist"}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
                  <Eye className="w-3.5 h-3.5" />View Profile
                </button>
                <button onClick={() => setExpanded(expanded === match.id ? null : match.id)} className="ml-auto p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                  {expanded === match.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded match reasons */}
            {expanded === match.id && (
              <div className="px-5 pb-5 pt-1 border-t border-[var(--nx-border)]">
                <p className="text-[10px] font-semibold mb-3 tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase" }}>Why This Match</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {match.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)", color: "var(--nx-text1)" }}>
                      <span className="text-[var(--nx-green)]">✓</span>{r}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-semibold mb-2 tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase" }}>Performance Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {match.highlights.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-xs" style={{ background: "var(--nx-bg5)", color: "var(--nx-text2)", border: "1px solid var(--nx-border)" }}>{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
