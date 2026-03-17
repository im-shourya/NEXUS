"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { scoreColor } from "@/lib/sport-config"

interface SkillBarProps {
  label: string
  score: number
  emoji?: string
  maxScore?: number
  delay?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SkillBar({
  label,
  score,
  emoji,
  maxScore = 100,
  delay = 0,
  size = "md",
  className,
}: SkillBarProps) {
  const [filled, setFilled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pct = Math.min(100, (score / maxScore) * 100)
  const color = scoreColor(score)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setFilled(true), delay)
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const heights = { sm: "h-1.5", md: "h-2", lg: "h-2.5" }
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-sm" }
  const scoreSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" }

  return (
    <div ref={ref} className={cn("flex items-center gap-3", className)}>
      {/* Label */}
      <div className="flex items-center gap-1.5 w-44 shrink-0">
        {emoji && <span className="text-sm">{emoji}</span>}
        <span className={cn("text-[var(--nx-text2)]", textSizes[size])}>{label}</span>
      </div>

      {/* Bar track */}
      <div className={cn("flex-1 rounded-full bg-[var(--nx-bg4)] overflow-hidden", heights[size])}>
        <div
          className="h-full rounded-full transition-all duration-[1200ms] ease-out"
          style={{
            width: filled ? `${pct}%` : "0%",
            background: color,
            boxShadow: filled ? `0 0 8px ${color}50` : "none",
            transitionDelay: filled ? "0ms" : "0ms",
          }}
        />
      </div>

      {/* Score */}
      <span
        className={cn("shrink-0 font-semibold tabular-nums w-8 text-right", scoreSizes[size])}
        style={{ color, fontFamily: "var(--font-display)" }}
      >
        {score}
      </span>
    </div>
  )
}
