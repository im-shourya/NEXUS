"use client"
import Link from "next/link"
import { MapPin, Bookmark, MessageSquare, Eye, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSportEmoji, getSportColor, scoreColor, SCOUT_TIER_BADGES } from "@/lib/sport-config"

export interface AthleteCardData {
  id: string
  username: string
  fullName: string
  sport: string
  position: string
  city: string
  state: string
  age: number
  profilePhoto?: string
  initials: string
  aiMatchScore?: number  // 0-100, scout match %
  nexusScore: number     // 0-100 overall AI score
  topSkills: { label: string; score: number }[]
  isAvailable: boolean
  injuryRisk?: "LOW" | "MODERATE" | "HIGH"
  planTier: "FREE" | "PRO"
  scoutTier?: string     // tier of scout viewing (affects what's visible)
  isShortlisted?: boolean
  profileStrength: number
  recentActivity?: string
}

interface AthleteCardProps {
  athlete: AthleteCardData
  variant?: "grid" | "list"
  onShortlist?: (id: string) => void
  onMessage?: (id: string) => void
  showMatchScore?: boolean
  className?: string
}

export function AthleteCard({
  athlete,
  variant = "grid",
  onShortlist,
  onMessage,
  showMatchScore = false,
  className,
}: AthleteCardProps) {
  const sportColor = getSportColor(athlete.sport)
  const sportEmoji = getSportEmoji(athlete.sport)

  if (variant === "list") {
    return (
      <div className={cn(
        "flex items-center gap-4 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] transition-all hover:border-[var(--nx-border2)] hover:shadow-[var(--nx-shadow-card)]",
        className
      )}>
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 text-black"
          style={{ background: `linear-gradient(135deg, ${sportColor}50, ${sportColor}30)`, border: `1.5px solid ${sportColor}40` }}>
          {athlete.profilePhoto
            ? <img src={athlete.profilePhoto} alt={athlete.fullName} className="w-full h-full object-cover rounded-xl" />
            : <span style={{ color: sportColor, fontFamily: "var(--font-display)", fontSize: "16px" }}>{athlete.initials}</span>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[var(--nx-text1)]">{athlete.fullName}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${sportColor}12`, color: sportColor, border: `1px solid ${sportColor}25` }}>
              {sportEmoji} {athlete.sport}
            </span>
            {athlete.planTier === "FREE" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--nx-bg5)] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>FREE</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--nx-text3)]">
            <span>{athlete.position}</span>
            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{athlete.city}</span>
            <span>Age {athlete.age}</span>
          </div>
        </div>

        {/* Score */}
        {showMatchScore && athlete.aiMatchScore !== undefined ? (
          <div className="text-center shrink-0">
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{athlete.aiMatchScore}%</div>
            <div className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>AI MATCH</div>
          </div>
        ) : (
          <div className="text-center shrink-0">
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor(athlete.nexusScore) }}>{athlete.nexusScore}</div>
            <div className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>NexusScore™</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onShortlist?.(athlete.id)}
            className={cn("p-2 rounded-xl border transition-all", athlete.isShortlisted ? "bg-[var(--nx-green-dim)] border-[var(--nx-green-border)] text-[var(--nx-green)]" : "bg-[var(--nx-bg4)] border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-green)] hover:border-[var(--nx-green-border)]")}>
            <Bookmark className="w-4 h-4" fill={athlete.isShortlisted ? "currentColor" : "none"} />
          </button>
          <button onClick={() => onMessage?.(athlete.id)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-purple)] hover:border-[rgba(155,93,255,0.3)] transition-all">
            <MessageSquare className="w-4 h-4" />
          </button>
          <Link href={`/athlete/${athlete.username}`} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Grid variant
  return (
    <div className={cn(
      "flex flex-col p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] transition-all hover:border-[var(--nx-border2)] hover:shadow-[var(--nx-shadow-card)] hover:-translate-y-0.5",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${sportColor}40, ${sportColor}20)`, border: `1.5px solid ${sportColor}35` }}>
            <span style={{ color: sportColor, fontFamily: "var(--font-display)", fontSize: "14px" }}>{athlete.initials}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--nx-text1)] leading-tight">{athlete.fullName}</p>
            <p className="text-xs text-[var(--nx-text3)]">{athlete.position} · Age {athlete.age}</p>
          </div>
        </div>

        {/* Match / NexusScore */}
        {showMatchScore && athlete.aiMatchScore !== undefined ? (
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{athlete.aiMatchScore}%</div>
            <div className="text-[8px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>MATCH</div>
          </div>
        ) : (
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-display)", color: scoreColor(athlete.nexusScore) }}>{athlete.nexusScore}</div>
            <div className="text-[8px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>SCORE</div>
          </div>
        )}
      </div>

      {/* Sport + Location */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${sportColor}10`, color: sportColor, border: `1px solid ${sportColor}22` }}>
          {sportEmoji} {athlete.sport}
        </span>
        <span className="text-[10px] text-[var(--nx-text3)] flex items-center gap-0.5">
          <MapPin className="w-2.5 h-2.5" />{athlete.city}
        </span>
        {athlete.isAvailable && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--nx-green-dim)] text-[var(--nx-green)] border border-[var(--nx-green-border)]" style={{ fontFamily: "var(--font-mono)" }}>
            <Zap className="w-2.5 h-2.5 inline mr-0.5" />AVAILABLE
          </span>
        )}
      </div>

      {/* Skill pills */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {athlete.topSkills.slice(0, 3).map((skill, i) => (
          <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
            <span className="text-[10px] text-[var(--nx-text3)]">{skill.label}</span>
            <span className="text-[10px] font-semibold" style={{ color: scoreColor(skill.score), fontFamily: "var(--font-display)", fontSize: "12px" }}>{skill.score}</span>
          </div>
        ))}
      </div>

      {/* Profile strength bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Profile</span>
          <span className="text-[9px] text-[var(--nx-text3)]">{athlete.profileStrength}%</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${athlete.profileStrength}%`, background: athlete.profileStrength >= 80 ? "var(--nx-green)" : athlete.profileStrength >= 60 ? "var(--nx-gold)" : "var(--nx-amber)" }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onShortlist?.(athlete.id)}
          className={cn("p-2 rounded-xl border transition-all", athlete.isShortlisted ? "bg-[var(--nx-green-dim)] border-[var(--nx-green-border)] text-[var(--nx-green)]" : "bg-[var(--nx-bg4)] border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-green)] hover:border-[var(--nx-green-border)]")}>
          <Bookmark className="w-3.5 h-3.5" fill={athlete.isShortlisted ? "currentColor" : "none"} />
        </button>
        <Link href={`/athlete/${athlete.username}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-xs text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
          <Eye className="w-3.5 h-3.5" />View
        </Link>
        <button onClick={() => onMessage?.(athlete.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
          style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
          <MessageSquare className="w-3.5 h-3.5" />Message
        </button>
      </div>
    </div>
  )
}
