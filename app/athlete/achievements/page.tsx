"use client"
import { useState } from "react"
import { Trophy, Star, Award, Lock, Plus, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ACHIEVEMENTS = [
  { id: 1, title: "State Championship Winner", sport: "Football", date: "Dec 2024", org: "Jharkhand Football Association", verified: true, emoji: "🏆" },
  { id: 2, title: "Top Scorer — District League", sport: "Football", date: "Oct 2024", org: "Dhanbad District Football", verified: true, emoji: "⚽" },
  { id: 3, title: "Man of the Match × 5", sport: "Football", date: "2024 Season", org: "Multiple Organisations", verified: false, emoji: "🌟" },
  { id: 4, title: "Khelo India State Selections", sport: "Football", date: "Aug 2024", org: "Sports Authority of India", verified: true, emoji: "🇮🇳" },
  { id: 5, title: "U-17 Regional Champions", sport: "Football", date: "Jun 2024", org: "AIFF East Zone", verified: true, emoji: "🥇" },
]

const PLATFORM_BADGES = [
  { id: 1, title: "Profile 80% Complete", desc: "Unlocks 8x scout visibility", earned: true, color: "var(--nx-green)" },
  { id: 2, title: "First AI Reel Generated", desc: "30-second highlight reel created", earned: true, color: "var(--nx-cyan)" },
  { id: 3, title: "Top 25% in Cohort", desc: "Strikers · Age 16–18 · India", earned: true, color: "var(--nx-gold)" },
  { id: 4, title: "5 Scout Matches", desc: "Reached 5 quality AI matches", earned: true, color: "var(--nx-purple)" },
  { id: 5, title: "First Trial Invitation", desc: "Received a formal trial invite", earned: true, color: "var(--nx-orange)" },
  { id: 6, title: "100 Profile Views", desc: "Hit 100 total profile views", earned: false, color: "var(--nx-teal)" },
  { id: 7, title: "Video Analyst", desc: "Ran AI form analysis 3+ times", earned: false, color: "var(--nx-blue)" },
  { id: 8, title: "Tournament Veteran", desc: "Registered for 3+ tournaments", earned: false, color: "var(--nx-amber)" },
]

export default function AthleteAchievementsPage() {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Achievements</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Trophies, certifications and platform milestones</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-sm hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />Add Achievement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { val: "5", label: "Achievements", color: "var(--nx-gold)" },
          { val: "4", label: "Verified", color: "var(--nx-green)" },
          { val: "5", label: "Platform Badges", color: "var(--nx-cyan)" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.val}</div>
            <div className="text-xs text-[var(--nx-text3)] mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Career Achievements */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--nx-text1)] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[var(--nx-gold)]" />Career Achievements
        </h2>
        {ACHIEVEMENTS.map(a => (
          <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.2)" }}>
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--nx-text1)] text-sm">{a.title}</p>
              <p className="text-xs text-[var(--nx-text3)] mt-0.5">{a.org} · {a.date}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-1 rounded text-[10px] font-semibold"
                style={{ background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>
                {a.sport}
              </span>
              {a.verified
                ? <span className="flex items-center gap-1 text-[10px] text-[var(--nx-cyan)]"><CheckCircle2 className="w-3 h-3" />Verified</span>
                : <span className="text-[10px] text-[var(--nx-amber)]">Pending</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Platform Badges */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--nx-text1)] flex items-center gap-2">
          <Star className="w-4 h-4 text-[var(--nx-cyan)]" />Platform Badges
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {PLATFORM_BADGES.map(b => (
            <div key={b.id} className={cn(
              "p-4 rounded-2xl border transition-all",
              b.earned ? "bg-[var(--nx-bg3)] border-[var(--nx-border)]" : "bg-[var(--nx-bg4)] border-[var(--nx-border)] opacity-50"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${b.color}15`, border: `1px solid ${b.color}30` }}>
                  {b.earned
                    ? <Award className="w-5 h-5" style={{ color: b.color }} />
                    : <Lock className="w-4 h-4 text-[var(--nx-text3)]" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">{b.title}</p>
                  <p className="text-xs text-[var(--nx-text3)]">{b.desc}</p>
                </div>
                {b.earned && (
                  <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: b.color }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Achievement Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-2xl p-6 w-full max-w-md shadow-[var(--nx-shadow-float)]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[var(--nx-text1)] text-lg mb-5">Add Achievement</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Title</label>
                <input placeholder="e.g. State Championship Winner" className="w-full rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Organisation</label>
                <input placeholder="e.g. Jharkhand Football Association" className="w-full rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Date</label>
                  <input type="date" className="w-full rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Sport</label>
                  <select className="w-full rounded-xl text-sm">
                    <option>Football</option><option>Cricket</option><option>Kabaddi</option>
                    <option>Athletics</option><option>Badminton</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">Cancel</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-sm hover:brightness-110 transition-all">Add Achievement</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
