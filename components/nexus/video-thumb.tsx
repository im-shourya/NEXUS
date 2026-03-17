"use client"
import { Play, Eye, Shield, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VideoThumbData {
  id: string
  title: string
  thumbnailUrl?: string
  duration?: string
  totalViews?: number
  scoutViews?: number
  videoType?: string
  sport?: string
  uploadedAt?: string
  status: "UPLOADING" | "PROCESSING" | "READY" | "FAILED"
  isAiReel?: boolean
  isFeatured?: boolean
  visibility?: "PUBLIC" | "SCOUTS_ONLY" | "PRIVATE"
}

interface VideoThumbProps {
  video: VideoThumbData
  onClick?: (id: string) => void
  showScoutViews?: boolean
  className?: string
}

export function VideoThumb({ video, onClick, showScoutViews = false, className }: VideoThumbProps) {
  const isClickable = video.status === "READY"
  const sportGradients: Record<string, string> = {
    football:    "linear-gradient(135deg, #031A08, #0D2B18)",
    cricket:     "linear-gradient(135deg, #021618, #0B2420)",
    kabaddi:     "linear-gradient(135deg, #200A1B, #3A0D2E)",
    athletics:   "linear-gradient(135deg, #08102B, #0D1A40)",
    badminton:   "linear-gradient(135deg, #101B06, #182B09)",
    hockey:      "linear-gradient(135deg, #120A2B, #1E1040)",
    wrestling:   "linear-gradient(135deg, #200A0A, #380D0D)",
  }
  const bg = sportGradients[video.sport?.toLowerCase() || "football"] || sportGradients.football

  return (
    <div
      className={cn(
        "relative rounded-[10px] overflow-hidden cursor-pointer group select-none",
        isClickable ? "hover:ring-2 hover:ring-[var(--nx-green)] hover:scale-[1.02] transition-all duration-200" : "",
        className
      )}
      style={{ aspectRatio: "16/9", background: bg }}
      onClick={() => isClickable && onClick?.(video.id)}
    >
      {/* Thumbnail image */}
      {video.thumbnailUrl && video.status === "READY" && (
        <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,13,8,0.92) 0%, rgba(6,13,8,0.3) 40%, transparent 100%)" }} />

      {/* Status overlays */}
      {video.status === "UPLOADING" && (
        <div className="absolute inset-0 bg-[var(--nx-bg)]/80 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--nx-green)] border-t-transparent animate-spin" />
          <span className="text-xs text-[var(--nx-text2)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Uploading...</span>
        </div>
      )}
      {video.status === "PROCESSING" && (
        <div className="absolute inset-0 bg-[var(--nx-bg)]/80 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--nx-amber)] border-t-transparent animate-spin" />
          <span className="text-xs text-[var(--nx-amber)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Processing...</span>
        </div>
      )}
      {video.status === "FAILED" && (
        <div className="absolute inset-0 bg-[var(--nx-red)]/20 flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">⚠️</span>
          <span className="text-xs text-[var(--nx-red)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Upload Failed</span>
        </div>
      )}

      {/* Play button (hover only on desktop) */}
      {video.status === "READY" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(0,245,116,0.15)", border: "2px solid var(--nx-green)" }}>
            <Play className="w-5 h-5 text-[var(--nx-green)]" fill="currentColor" style={{ marginLeft: "2px" }} />
          </div>
        </div>
      )}

      {/* Top-left chips */}
      <div className="absolute top-2 left-2 flex gap-1.5">
        {video.isFeatured && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--nx-green)] text-black" style={{ fontFamily: "var(--font-mono)" }}>FEATURED</span>
        )}
        {video.isAiReel && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(0,212,255,0.15)", color: "var(--nx-cyan)", border: "1px solid rgba(0,212,255,0.3)", fontFamily: "var(--font-mono)" }}>
            <Sparkles className="w-2.5 h-2.5" />AI REEL
          </span>
        )}
        {video.videoType && (
          <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(6,13,8,0.8)", color: "var(--nx-text2)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{video.videoType}</span>
        )}
      </div>

      {/* Top-right: total views */}
      {video.status === "READY" && video.totalViews !== undefined && (
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(6,13,8,0.85)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>
            <Eye className="w-2.5 h-2.5" />{video.totalViews >= 1000 ? `${(video.totalViews/1000).toFixed(1)}K` : video.totalViews}
          </span>
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-xs font-medium text-[var(--nx-text1)] truncate leading-tight">{video.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-2">
            {video.duration && (
              <span className="text-[10px] text-[var(--nx-text3)]">{video.duration}</span>
            )}
            {showScoutViews && video.scoutViews !== undefined && video.scoutViews > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-[var(--nx-gold)]">
                <Shield className="w-2.5 h-2.5" />{video.scoutViews} scout plays
              </span>
            )}
          </div>
          {video.uploadedAt && (
            <span className="text-[9px] text-[var(--nx-text3)]">{video.uploadedAt}</span>
          )}
        </div>
      </div>
    </div>
  )
}
