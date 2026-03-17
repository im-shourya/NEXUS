"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  trend?: string
  trendUp?: boolean
  className?: string
  animationDelay?: number
}

export function StatCard({ 
  label, 
  value, 
  suffix = "", 
  trend, 
  trendUp = true, 
  className,
  animationDelay = 0 
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), animationDelay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [animationDelay])

  useEffect(() => {
    if (!isVisible) return

    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  const formatValue = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-[var(--nx-bg3)] border border-[var(--nx-border)] rounded-[14px] p-5 transition-all duration-150",
        "hover:border-[var(--nx-green-border)]",
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[2px] text-[var(--nx-text3)]">
        {label}
      </span>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-[family-name:var(--font-display)] text-[44px] leading-none text-[var(--nx-green)]">
          {formatValue(displayValue)}{suffix}
        </span>
      </div>
      {trend && (
        <span className={cn(
          "text-[11px] font-sans mt-2 block",
          trendUp ? "text-[var(--nx-green)]" : "text-[var(--nx-red)]"
        )}>
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      )}
    </div>
  )
}
