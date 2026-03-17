"use client"

import { cn } from "@/lib/utils"

const sportConfig: Record<string, { emoji: string; color: string; label: string }> = {
  football: { emoji: "⚽", color: "var(--sport-football)", label: "Football" },
  cricket: { emoji: "🏏", color: "var(--sport-cricket)", label: "Cricket" },
  kabaddi: { emoji: "🤼", color: "var(--sport-kabaddi)", label: "Kabaddi" },
  athletics: { emoji: "🏃", color: "var(--sport-athletics)", label: "Athletics" },
  badminton: { emoji: "🏸", color: "var(--sport-badminton)", label: "Badminton" },
  basketball: { emoji: "🏀", color: "var(--sport-basketball)", label: "Basketball" },
  hockey: { emoji: "🏑", color: "var(--sport-hockey)", label: "Hockey" },
  wrestling: { emoji: "🤸", color: "var(--sport-wrestling)", label: "Wrestling" },
  kho: { emoji: "🏃", color: "var(--sport-kho)", label: "Kho-Kho" },
  volleyball: { emoji: "🏐", color: "var(--sport-volleyball)", label: "Volleyball" },
  archery: { emoji: "🎯", color: "var(--sport-archery)", label: "Archery" },
  tabletennis: { emoji: "🏓", color: "var(--sport-tabletennis)", label: "Table Tennis" },
}

interface SportBadgeProps {
  sport: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SportBadge({ sport, size = "md", className }: SportBadgeProps) {
  const config = sportConfig[sport.toLowerCase()] || { 
    emoji: "🎯", 
    color: "var(--nx-green)", 
    label: sport 
  }

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] px-3 py-1 gap-1.5",
    lg: "text-[13px] px-4 py-1.5 gap-2",
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${config.color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${config.color} 25%, transparent)`,
        color: config.color,
      }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  )
}
