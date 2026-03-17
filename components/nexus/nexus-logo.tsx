"use client"

import { cn } from "@/lib/utils"

interface NexusLogoProps {
  className?: string
  showTagline?: boolean
  size?: number | "sm" | "md" | "lg"
}

export function NexusLogo({ className, showTagline = false, size = "md" }: NexusLogoProps) {
  const sizeClasses = typeof size === "number" ? "" : {
    sm: "text-xl tracking-[3px]",
    md: "text-2xl tracking-[3px]",
    lg: "text-3xl tracking-[4px]",
  }[size]

  return (
    <div className={cn("flex flex-col", className)}>
      <span 
        className={cn(
          "font-[family-name:var(--font-display)] text-[var(--nx-green)] drop-shadow-[0_0_20px_rgba(0,245,116,0.35)]",
          sizeClasses
        )}
        style={typeof size === "number" ? { fontSize: size * 0.6 } : undefined}
      >
        NEXUS
      </span>
      {showTagline && (
        <span className="font-mono text-[8px] text-[var(--nx-text3)] tracking-[2.5px] uppercase mt-0.5">
          SPORTS INTELLIGENCE
        </span>
      )}
    </div>
  )
}
