"use client"

import { useState } from "react"
import { MessageSquare, Filter, ArrowUpDown, Eye, Lock, Sparkles, ChevronDown, ChevronUp, Star, MapPin, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const MATCHES = [
  {
    id: 1, name: "Rahul Verma", initials: "RV", org: "Mumbai City FC",
    title: "Head of Talent Scouting", tier: "ISL", tierColor: "var(--nx-purple)",
    score: 85, sport: "Football", region: "West India",
    ageGroup: "U-19 & U-21", viewed: true, viewedTime: "2h ago",
    reasons: [
      { label: "Position: Striker (LWF)", pts: "28/30", icon: "⚽" },
      { label: "Age: 17 (U-19 range)", pts: "15/15", icon: "📅" },
      { label: "Region: Maharashtra", pts: "8/10", icon: "📍" },
      { label: "Speed: 82/100 (>75 threshold)", pts: "9/10", icon: "⚡" },
      { label: "Profile: 68% complete", pts: "3/5", icon: "📊" },
    ],
    invited: false, isTop: true
  },
  {
    id: 2, name: "K. Balaji", initials: "KB", org: "Bengaluru FC",
    title: "Academy Scout", tier: "ISL", tierColor: "var(--nx-purple)",
    score: 72, sport: "Football", region: "South India",
    ageGroup: "U-17 & U-19", viewed: false, viewedTime: null,
    reasons: [
      { label: "Position: Striker match", pts: "24/30", icon: "⚽" },
      { label: "Age: 17 (range)", pts: "15/15", icon: "📅" },
      { label: "Region: Adjacent zone", pts: "5/10", icon: "📍" },
    ],
    invited: false, isTop: false
  },
  {
    id: 3, name: "Priya Singh", initials: "PS", org: "Chennaiyin FC",
    title: "Talent Coordinator", tier: "ISL", tierColor: "var(--nx-purple)",
    score: 68, sport: "Football", region: "South India",
    ageGroup: "U-19", viewed: true, viewedTime: "1d ago",
    reasons: [
      { label: "Position: Winger match", pts: "18/30", icon: "⚽" },
      { label: "Age: 17 (range)", pts: "15/15", icon: "📅" },
      { label: "Region: Different zone", pts: "2/10", icon: "📍" },
    ],
    invited: true, isTop: false
  },
  {
    id: 4, name: "Suresh Nair", initials: "SN", org: "Khelo India Programme",
    title: "State Scout - Maharashtra", tier: "KHELO", tierColor: "var(--nx-gold)",
    score: 61, sport: "Football", region: "West India",
    ageGroup: "U-18", viewed: false, viewedTime: null,
    reasons: [
      { label: "Position: Forward match", pts: "24/30", icon: "⚽" },
      { label: "Age: 17 (range)", pts: "15/15", icon: "📅" },
    ],
    invited: false, isTop: false
  },
]

export default function AthleteMatchesPage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [isPro] = useState(true)

  const kpis = [
    { label: "Total Matches", value: "12", color: "var(--nx-green)" },
    { label: "Scouts Viewed You", value: "4", color: "var(--nx-cyan)" },
    { label: "Trial Invitations", value: "1", color: "var(--nx-gold)" },
    { label: "Avg Match Score", value: "71%", color: "var(--nx-purple)" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Scout Matches</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">Scouts whose criteria match your profile — updated nightly</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            <Filter className="w-4 h-4" />Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
            <ArrowUpDown className="w-4 h-4" />Sort: Best Match
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: k.color }}>{k.value}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Free tier lock */}
      {!isPro && (
        <div className="p-4 rounded-2xl bg-[var(--nx-orange-dim)] border border-[var(--nx-orange-border)] flex items-center gap-4">
          <Lock className="w-8 h-8 text-[var(--nx-orange)] shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-[var(--nx-text1)]">Unlock All Scout Matches</p>
            <p className="text-sm text-[var(--nx-text2)]">You're seeing 3 of 12 matches. Pro Athletes see all matches.</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-[var(--nx-orange)] text-white font-semibold text-sm hover:brightness-110 transition-all shrink-0">
            Upgrade ₹99/mo
          </button>
        </div>
      )}

      {/* Match Cards */}
      <div className="space-y-4">
        {MATCHES.map((match, idx) => (
          <div
            key={match.id}
            className={cn(
              "rounded-2xl border transition-all overflow-hidden",
              match.isTop
                ? "border-[var(--nx-cyan)] bg-[rgba(0,212,255,0.03)]"
                : "border-[var(--nx-border)] bg-[var(--nx-bg3)]",
              !isPro && idx >= 3 && "opacity-40 pointer-events-none"
            )}
          >
            {/* Main Row */}
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{
                      background: `${match.tierColor}15`,
                      border: `2px solid ${match.tierColor}40`,
                      color: match.tierColor,
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    {match.initials}
                  </div>
                  {match.viewed && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--nx-green)] flex items-center justify-center">
                      <Eye className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[var(--nx-text1)]">{match.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${match.tierColor}15`, border: `1px solid ${match.tierColor}40`, color: match.tierColor, fontFamily: "var(--font-mono)" }}>
                      {match.tier}
                    </span>
                    {match.viewed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--nx-amber)]/10 text-[var(--nx-amber)] border border-[var(--nx-amber)]/25">
                        Viewed {match.viewedTime}
                      </span>
                    )}
                    {match.invited && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--nx-gold)]/10 text-[var(--nx-gold)] border border-[var(--nx-gold)]/25">
                        🎯 Trial Invitation
                      </span>
                    )}
                    {match.isTop && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(0,212,255,0.1)] text-[var(--nx-cyan)] border border-[rgba(0,212,255,0.25)]">
                        ⭐ Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--nx-text2)] mt-0.5">{match.title} · {match.org}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-[var(--nx-text3)]"><MapPin className="w-3 h-3" />{match.region}</span>
                    <span className="flex items-center gap-1 text-xs text-[var(--nx-text3)]">⚽ {match.sport}</span>
                    <span className="flex items-center gap-1 text-xs text-[var(--nx-text3)]"><Trophy className="w-3 h-3" />{match.ageGroup}</span>
                  </div>
                </div>

                {/* Score + Actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{match.score}%</div>
                    <div className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase" }}>AI MATCH</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--nx-green)] text-black font-semibold text-xs hover:brightness-110 transition-all">
                      <MessageSquare className="w-3 h-3" />Message
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-xs hover:border-[var(--nx-border2)] transition-colors">
                      <Eye className="w-3 h-3" />Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Match reasons (top match always expanded, others toggle) */}
              {match.isTop && (
                <div className="mt-4 pt-4 border-t border-[var(--nx-border)]">
                  <div className="flex items-center gap-1 mb-3">
                    <Sparkles className="w-3 h-3 text-[var(--nx-cyan)]" />
                    <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>WHY THIS MATCH</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.reasons.map((r, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border2)] text-[var(--nx-text2)]">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                        <span className="text-[var(--nx-green)] font-semibold">{r.pts}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggle for non-top matches */}
              {!match.isTop && (
                <button
                  onClick={() => setExpanded(expanded === match.id ? null : match.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-[var(--nx-text3)] hover:text-[var(--nx-green)] transition-colors"
                >
                  {expanded === match.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {expanded === match.id ? "Hide" : "Show"} match reasons
                </button>
              )}
            </div>

            {/* Expanded reasons for non-top */}
            {!match.isTop && expanded === match.id && (
              <div className="px-5 pb-5 pt-0">
                <div className="pt-4 border-t border-[var(--nx-border)]">
                  <div className="flex flex-wrap gap-2">
                    {match.reasons.map((r, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border2)] text-[var(--nx-text2)]">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                        <span className="text-[var(--nx-green)] font-semibold">{r.pts}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trial Invitation card in messages reminder */}
      <div className="p-5 rounded-2xl bg-[var(--nx-gold)]/5 border border-[var(--nx-gold)]/25">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--nx-gold)]/15 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-[var(--nx-gold)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--nx-text1)]">Trial Invitation Pending</p>
            <p className="text-sm text-[var(--nx-text2)] mt-0.5">Priya Singh from Chennaiyin FC has sent a trial invitation. <strong className="text-[var(--nx-gold)]">Check your messages to respond.</strong></p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all shrink-0">
            View →
          </button>
        </div>
      </div>
    </div>
  )
}
