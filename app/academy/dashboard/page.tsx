"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { BarChart, Bar, ResponsiveContainer } from "recharts"
import { ArrowRight, AlertTriangle, ChevronRight, Plus, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

const trendData = [
  { m: "Sep", score: 61 }, { m: "Oct", score: 63 }, { m: "Nov", score: 65 },
  { m: "Dec", score: 68 }, { m: "Jan", score: 70 }, { m: "Feb", score: 71 }, { m: "Mar", score: 72 },
]
const SQUAD_HEALTH = [
  { label: "Complete", pct: 42, color: "var(--nx-green)" },
  { label: "Good", pct: 27, color: "var(--nx-gold)" },
  { label: "Building", pct: 19, color: "var(--nx-amber)" },
  { label: "Incomplete", pct: 8, color: "var(--nx-red)" },
  { label: "Started", pct: 4, color: "var(--nx-border2)" },
]
const POSITIONS = [
  { id: "GK", x: 50, y: 88, count: 0, warn: true },
  { id: "CB", x: 35, y: 72, count: 3 }, { id: "CB", x: 55, y: 72, count: 2 },
  { id: "LB", x: 18, y: 72, count: 2 }, { id: "RB", x: 72, y: 72, count: 1 },
  { id: "CDM", x: 50, y: 58, count: 2 }, { id: "CM", x: 32, y: 46, count: 3 },
  { id: "CAM", x: 68, y: 46, count: 2 }, { id: "LW", x: 15, y: 30, count: 2 },
  { id: "RW", x: 78, y: 30, count: 2 }, { id: "ST", x: 50, y: 15, count: 6 },
]
const scoutInquiries = [
  { scout: "Rahul Verma", org: "Mumbai City FC", tier: "ISL", athlete: "Arjun Sharma", status: "New", time: "2h ago" },
  { scout: "K. Balaji", org: "Bengaluru FC", tier: "ISL", athlete: "Vikram Singh", status: "Pending", time: "6h ago" },
  { scout: "Priya Singh", org: "Kerala Blasters", tier: "ISL", athlete: "Priya Patel", status: "Responded", time: "1d ago" },
]
const statusColor: Record<string, string> = { New: "var(--nx-green)", Pending: "var(--nx-amber)", Responded: "var(--nx-cyan)" }

function useCounter(target: number, delay = 0) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setTimeout(() => {
        let f = 0
        const t = setInterval(() => { f++; setVal(Math.round(target * (1 - Math.pow(1 - f / 40, 3)))); if (f >= 40) { clearInterval(t); setVal(target) } }, 18)
      }, delay)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, delay])
  return { val, ref }
}

export default function AcademyDashboard() {
  const { val: athleteCount, ref: a1 } = useCounter(48)
  const { val: scoutCount, ref: a2 } = useCounter(23, 100)
  const { val: trialCount, ref: a3 } = useCounter(12, 200)
  const { val: repScore, ref: a4 } = useCounter(82, 300)
  const [healthFilter, setHealthFilter] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Dashboard</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Nagpur FC Youth Academy · Premium Plan</p>
        </div>
        <div className="flex gap-2">
          <Link href="/academy/athletes" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
            <Plus className="w-4 h-4" />Add Athlete
          </Link>
          <Link href="/academy/tournaments/create" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:brightness-110" style={{ background: "var(--nx-orange)", fontFamily: "var(--font-display)", letterSpacing: "0.5px", fontSize: "14px" }}>
            CREATE TOURNAMENT
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Athletes Enrolled", ref: a1, val: athleteCount, suffix: "/50", color: "var(--nx-gold)", sub: "2 slots remaining", pct: 96 },
          { label: "Scout Inquiries", ref: a2, val: scoutCount, suffix: "", color: "var(--nx-cyan)", sub: "This month" },
          { label: "Trials Secured", ref: a3, val: trialCount, suffix: "", color: "var(--nx-green)", sub: "↑ 4 this quarter" },
          { label: "Academy Rating", ref: a4, val: repScore, suffix: "/100", color: "var(--nx-gold)", sub: "#1 in Nagpur · Football" },
        ].map(({ label, ref, val, suffix, color, sub, pct }) => (
          <div key={label} ref={ref} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] transition-all">
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color }}>
              {val}{suffix}
            </p>
            <p className="text-sm font-semibold text-[var(--nx-text1)] mt-1">{label}</p>
            <p className="text-xs text-[var(--nx-text3)] mt-0.5">{sub}</p>
            {pct && (
              <div className="mt-3 h-1 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 90 ? "var(--nx-red)" : color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Academy Reputation Score */}
      <div className="p-5 rounded-2xl border-2" style={{ background: "linear-gradient(135deg, rgba(255,184,0,0.06), var(--nx-bg3))", borderColor: "rgba(255,184,0,0.25)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-gold)] tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-mono)" }}>Academy Reputation Score</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-gold)" }}>82</span>
                <span className="text-lg text-[var(--nx-text3)] mb-1">/100</span>
              </div>
            </div>
            <div className="space-y-1 pl-4 border-l border-[var(--nx-border)]">
              <div className="flex items-center gap-2">
                <Medal className="w-3.5 h-3.5 text-[var(--nx-gold)]" />
                <span className="text-sm font-semibold text-[var(--nx-text1)]">#1 Football Academy in Nagpur</span>
              </div>
              <p className="text-xs text-[var(--nx-text3)]">#3 in Maharashtra · Top 5% nationally</p>
              <div className="flex gap-4 mt-2">
                {[["Athlete Quality", 24, 30],["Scout Engagement", 22, 25],["Trial Conversion", 18, 20],["Profile Completeness", 9, 10],["Video Activity", 9, 15]].map(([l, v, max]) => (
                  <div key={l as string} className="text-center">
                    <p className="text-xs font-bold" style={{ color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>{v}/{max}</p>
                    <p className="text-[8px] text-[var(--nx-text3)]">{(l as string).split(" ")[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--nx-text3)] mb-2">Score trend (6mo)</p>
            <ResponsiveContainer width={120} height={40}>
              <BarChart data={trendData}>
                <Bar dataKey="score" fill="var(--nx-gold)" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Squad Health Segmented Bar */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Squad Profile Health</p>
              <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Click a band to filter the athlete roster</p>
            </div>
            {healthFilter && <button onClick={() => setHealthFilter(null)} className="text-[10px] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]">Clear filter ×</button>}
          </div>
          <div className="flex h-8 rounded-xl overflow-hidden mb-3 gap-0.5">
            {SQUAD_HEALTH.map(s => (
              <button key={s.label} onClick={() => setHealthFilter(healthFilter === s.label ? null : s.label)}
                className="transition-all hover:brightness-125 relative group"
                style={{ width: `${s.pct}%`, background: s.color, opacity: healthFilter && healthFilter !== s.label ? 0.3 : 1 }}
                title={`${s.label}: ${s.pct}%`}>
                {s.pct > 10 && <span className="text-[9px] font-bold text-black/70 absolute inset-0 flex items-center justify-center" style={{ fontFamily: "var(--font-mono)" }}>{s.pct}%</span>}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {SQUAD_HEALTH.map(s => (
              <button key={s.label} onClick={() => setHealthFilter(healthFilter === s.label ? null : s.label)}
                className={cn("flex items-center gap-1.5 text-xs transition-all px-2 py-1 rounded-lg", healthFilter === s.label ? "bg-[var(--nx-bg4)] border border-[var(--nx-border2)]" : "hover:bg-[var(--nx-bg4)]")}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-[var(--nx-text2)]">{s.label}</span>
                <span className="font-bold" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{Math.round(48 * s.pct / 100)}</span>
              </button>
            ))}
          </div>
          {healthFilter && (
            <div className="mt-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
              <p className="text-xs text-[var(--nx-text2)]">Showing roster filtered by: <span className="font-semibold text-[var(--nx-text1)]">{healthFilter}</span> profiles</p>
            </div>
          )}
        </div>

        {/* ISL/IPL Pipeline Tracker */}
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">ISL / IPL Pipeline</p>
          <div className="space-y-3">
            {[["Invited to Trials", 12, "var(--nx-cyan)", "+4 vs last season"], ["Attended Trials", 8, "var(--nx-gold)", "67% attendance rate"], ["Signed Professionally", 3, "var(--nx-green)", "All-time: 11"]].map(([l, v, c, s]) => (
              <div key={l as string} className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--nx-text2)]">{l}</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
                </div>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Formation Depth Chart */}
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Formation Depth Chart</p>
          <div className="relative" style={{ height: "220px" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <rect x="0" y="0" width="100" height="100" fill="rgba(0,245,116,0.04)" rx="4" />
              <rect x="30" y="2" width="40" height="15" fill="none" stroke="rgba(0,245,116,0.12)" strokeWidth="0.5" />
              <rect x="30" y="83" width="40" height="15" fill="none" stroke="rgba(0,245,116,0.12)" strokeWidth="0.5" />
              {POSITIONS.map((pos, i) => (
                <g key={i}>
                  <circle cx={pos.x} cy={pos.y} r="6" fill={pos.warn ? "rgba(255,59,48,0.2)" : pos.count > 3 ? "rgba(0,245,116,0.15)" : "rgba(0,245,116,0.08)"} stroke={pos.warn ? "var(--nx-red)" : "rgba(0,245,116,0.3)"} strokeWidth="0.5" />
                  <text x={pos.x} y={pos.y - 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fill={pos.warn ? "var(--nx-red)" : "var(--nx-green)"} fontFamily="var(--font-mono)" fontWeight="bold">{pos.count}</text>
                  <text x={pos.x} y={pos.y + 4.5} textAnchor="middle" fontSize="2.5" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-mono)">{pos.id}</text>
                  {pos.warn && <text x={pos.x + 6.5} y={pos.y - 4} fontSize="4" fill="var(--nx-red)">!</text>}
                </g>
              ))}
            </svg>
          </div>
          <p className="text-[10px] text-[var(--nx-red)] mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />No Goalkeepers enrolled — critical position gap
          </p>
        </div>

        {/* Live Match Monitor + Scout Inquiries */}
        <div className="space-y-4">
          {/* Live Match Monitor */}
          {isLive && (
            <div className="p-4 rounded-2xl border-2" style={{ background: "rgba(255,91,25,0.04)", borderColor: "var(--nx-orange-border)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--nx-orange)] animate-pulse" />
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">Live Match Now</p>
                </div>
                <button onClick={() => setIsLive(false)} className="text-[10px] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]">×</button>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="text-center">
                  <p className="text-xs font-semibold text-[var(--nx-text1)]">Nagpur FC Youth</p>
                  <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>2</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[var(--nx-text3)]">67'</p>
                  <p className="text-base text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-display)" }}>—</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[var(--nx-text1)]">City FC Academy</p>
                  <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>1</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--nx-border)] flex items-center justify-between">
                <p className="text-[10px] text-[var(--nx-text3)]">Bengaluru FC Youth Trials</p>
                <Link href="/academy/tournaments/live" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", border: "1px solid var(--nx-orange-border)" }}>
                  View Live <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Scout Inquiry Feed */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Scout Inquiries</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--nx-green)] animate-pulse" />
                <span className="text-[10px] text-[var(--nx-text3)]">Live</span>
              </div>
            </div>
            <div className="space-y-2">
              {scoutInquiries.map((inq, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.2)", fontFamily: "var(--font-display)" }}>
                    {inq.scout.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-[var(--nx-text1)]">{inq.scout}</p>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(155,93,255,0.12)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>{inq.tier}</span>
                    </div>
                    <p className="text-[10px] text-[var(--nx-text3)]">{inq.org} → {inq.athlete}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${statusColor[inq.status]}15`, color: statusColor[inq.status], fontFamily: "var(--font-mono)" }}>{inq.status}</span>
                    <p className="text-[9px] text-[var(--nx-text3)] mt-0.5">{inq.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/academy/scouts" className="flex items-center justify-center gap-2 mt-3 py-2 rounded-xl text-xs text-[var(--nx-text3)] hover:text-[var(--nx-text1)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] transition-all">
              View All Scout Relationships <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
