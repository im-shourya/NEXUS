"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { scoreColor } from "@/lib/sport-config"

interface NexusScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  className?: string
  animationDelay?: number
}

export function NexusScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  className,
  animationDelay = 0,
}: NexusScoreRingProps) {
  const [animated, setAnimated] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const ref = useRef<SVGSVGElement>(null)

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const color = scoreColor(score)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), animationDelay)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animationDelay])

  useEffect(() => {
    if (!animated) return
    let frame = 0
    const totalFrames = 40
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(score * eased))
      if (frame >= totalFrames) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [animated, score])

  const dashOffset = animated
    ? circumference - (score / 100) * circumference
    : circumference

  const cx = size / 2
  const cy = size / 2

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="var(--nx-bg5)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: animated ? "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
        {/* Glow ring */}
        {animated && score >= 70 && (
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            opacity={0.08}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.3,
            color,
          }}
        >
          {displayScore}
        </span>
        {label && (
          <span
            className="text-center leading-tight"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: size * 0.085,
              color: "var(--nx-text3)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="text-center mt-0.5"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: size * 0.08,
              color: "var(--nx-text3)",
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
