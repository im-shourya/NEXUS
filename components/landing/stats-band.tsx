"use client"
import { useEffect, useRef, useState } from "react"

function AnimatedNum({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let f = 0
      const t = setInterval(() => {
        f++; setVal(Math.round(target * (1 - Math.pow(1 - f / 50, 3))))
        if (f >= 50) { clearInterval(t); setVal(target) }
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <div ref={ref}>{val > 1000 ? (val / 1000).toFixed(1) + "K" : val}{suffix}</div>
}

export default function StatsBand() {
  const stats = [
    { label: "Athletes in India", value: 50, suffix: "M+", static: true },
    { label: "Athletes on NEXUS", value: 2400, suffix: "" },
    { label: "Scout Matches Made", value: 847, suffix: "" },
    { label: "AI Match Accuracy", value: 85, suffix: "%", static: true },
  ]
  return (
    <div className="border-y" style={{ background: "var(--nx-bg2)", borderColor: "var(--nx-border)" }}>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="px-6 py-6 text-center" style={{ borderRight: i < 3 ? "1px solid var(--nx-border)" : "none" }}>
            <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-green)", lineHeight: 1 }}>
              {s.static ? `${s.value}${s.suffix}` : <AnimatedNum target={s.value} suffix={s.suffix} />}
            </div>
            <p className="text-xs mt-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
