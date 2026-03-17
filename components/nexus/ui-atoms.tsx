"use client"
import { Sparkles, CircleDot, CheckCircle2, X, AlertTriangle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { RISK_COLORS } from "@/lib/sport-config"

// ─── AI LABEL ──────────────────────────────────────────────────────────────
interface AiLabelProps {
  text?: string
  size?: "xs" | "sm"
  className?: string
}
export function AiLabel({ text = "AI", size = "sm", className }: AiLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold",
        size === "xs" ? "text-[9px]" : "text-[10px]",
        className
      )}
      style={{
        background: "rgba(0,212,255,0.1)",
        border: "1px solid rgba(0,212,255,0.25)",
        color: "var(--nx-cyan)",
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      <Sparkles className={size === "xs" ? "w-2 h-2" : "w-2.5 h-2.5"} />
      🤖 {text}
    </span>
  )
}

// ─── LIVE BADGE ──────────────────────────────────────────────────────────────
interface LiveBadgeProps {
  label?: string
  className?: string
}
export function LiveBadge({ label = "LIVE", className }: LiveBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold", className)}
      style={{
        background: "var(--nx-orange-dim)",
        border: "1px solid var(--nx-orange-border)",
        color: "var(--nx-orange)",
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--nx-orange)] animate-pulse shrink-0" />
      {label}
    </span>
  )
}

// ─── TRIAL INVITE CARD ───────────────────────────────────────────────────────
interface TrialInviteCardProps {
  clubName: string
  category: string
  dates: string
  city: string
  scoutName: string
  scoutTitle: string
  onAccept?: () => void
  onDecline?: () => void
  status?: "PENDING" | "ACCEPTED" | "DECLINED"
  className?: string
}
export function TrialInviteCard({
  clubName, category, dates, city, scoutName, scoutTitle,
  onAccept, onDecline, status = "PENDING", className,
}: TrialInviteCardProps) {
  return (
    <div
      className={cn("w-full text-center p-4 rounded-2xl", className)}
      style={{
        background: "rgba(0,212,255,0.04)",
        border: "1px solid rgba(0,212,255,0.2)",
      }}
    >
      <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--nx-cyan)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
        🎯 Trial Invitation
      </div>
      <p className="font-bold text-[var(--nx-text1)] text-sm">{clubName} · {category}</p>
      <p className="text-xs text-[var(--nx-text2)] mt-1">{dates} · {city}</p>
      <p className="text-xs text-[var(--nx-text3)] mt-0.5">Invited by {scoutName} — {scoutTitle}</p>

      {status === "PENDING" && (
        <div className="flex gap-2 mt-3 justify-center">
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black transition-all hover:brightness-110"
            style={{ background: "var(--nx-green)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />Accept
          </button>
          <button
            onClick={onDecline}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text2)" }}
          >
            <X className="w-3.5 h-3.5" />Decline
          </button>
        </div>
      )}
      {status === "ACCEPTED" && (
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-[var(--nx-green)]">
          <CheckCircle2 className="w-4 h-4" />Trial Accepted — Good luck!
        </div>
      )}
      {status === "DECLINED" && (
        <p className="mt-3 text-xs text-[var(--nx-text3)]">You declined this invitation</p>
      )}
    </div>
  )
}

// ─── INJURY RISK CARD ────────────────────────────────────────────────────────
interface InjuryRiskCardProps {
  level: "LOW" | "MODERATE" | "HIGH"
  bodyParts?: { label: string; pct: number }[]
  recommendation?: string
  compact?: boolean
  className?: string
}
export function InjuryRiskCard({ level, bodyParts, recommendation, compact = false, className }: InjuryRiskCardProps) {
  const colors = RISK_COLORS[level]
  const icons = { LOW: "✅", MODERATE: "⚠️", HIGH: "🚨" }

  return (
    <div className={cn("p-4 rounded-2xl", className)} style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>
          Injury Risk
        </span>
        <Shield className="w-3.5 h-3.5" style={{ color: colors.text }} />
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl">{icons[level]}</span>
        <span className="font-bold" style={{ fontFamily: "var(--font-display)", fontSize: compact ? "28px" : "36px", color: colors.text }}>{level}</span>
      </div>

      {!compact && bodyParts && bodyParts.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {bodyParts.map((bp, i) => (
            <div key={i} className="text-center p-1.5 rounded-lg" style={{ background: "var(--nx-bg4)" }}>
              <div className="text-xs font-bold" style={{ color: RISK_COLORS[bp.pct > 40 ? "HIGH" : bp.pct > 20 ? "MODERATE" : "LOW"].text, fontFamily: "var(--font-display)", fontSize: "16px" }}>
                {bp.pct}%
              </div>
              <div className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {bp.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendation && (
        <div className="flex items-start gap-2 text-xs" style={{ color: "var(--nx-text2)" }}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: colors.text }} />
          {recommendation}
        </div>
      )}
    </div>
  )
}

// ─── MATCH REASON ROW ────────────────────────────────────────────────────────
interface MatchReasonRowProps {
  criterion: string
  score: number
  maxScore: number
  label?: string
  highlight?: boolean
}
export function MatchReasonRow({ criterion, score, maxScore, label, highlight = false }: MatchReasonRowProps) {
  const pct = Math.round((score / maxScore) * 100)
  const color = pct >= 80 ? "var(--nx-green)" : pct >= 60 ? "var(--nx-gold)" : pct >= 40 ? "var(--nx-amber)" : "var(--nx-text3)"

  return (
    <div className={cn("flex items-center gap-3 py-2 border-b border-[var(--nx-border)] last:border-0", highlight ? "opacity-100" : "opacity-80")}>
      <span className="text-xs text-[var(--nx-text2)] w-40 shrink-0">{criterion}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-16 text-right tabular-nums" style={{ color, fontFamily: "var(--font-display)", fontSize: "14px" }}>
        {score}/{maxScore}
      </span>
      {label && (
        <span className="text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: `${color}15`, color, fontFamily: "var(--font-mono)" }}>{label}</span>
      )}
    </div>
  )
}

// ─── UPLOAD ZONE ────────────────────────────────────────────────────────────
interface UploadZoneProps {
  onSelect: (files: FileList) => void
  accept?: string
  maxSizeMB?: number
  hint?: string
  className?: string
  uploading?: boolean
  progress?: number
}
export function UploadZone({
  onSelect, accept = "video/mp4,video/mov,video/avi",
  maxSizeMB = 500, hint, className, uploading = false, progress = 0,
}: UploadZoneProps) {
  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
        uploading ? "pointer-events-none" : "hover:border-[var(--nx-green)] hover:bg-[var(--nx-green-dim)]",
        className
      )}
      style={{ borderColor: "var(--nx-border2)", background: "var(--nx-bg4)" }}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => e.target.files && onSelect(e.target.files)}
        disabled={uploading}
      />

      {uploading ? (
        <div className="w-full text-center">
          <div className="text-2xl mb-2">⬆️</div>
          <p className="text-sm font-semibold text-[var(--nx-text1)] mb-3">Uploading... {Math.round(progress)}%</p>
          <div className="h-2 rounded-full bg-[var(--nx-bg5)] overflow-hidden w-full">
            <div className="h-full rounded-full bg-[var(--nx-green)] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3">📹</div>
          <p className="text-base font-semibold text-[var(--nx-text2)] mb-1">Drag videos here or click to browse</p>
          <p className="text-xs text-[var(--nx-text3)]">{hint || `MP4, MOV, AVI · Up to ${maxSizeMB}MB`}</p>
        </>
      )}
    </label>
  )
}
