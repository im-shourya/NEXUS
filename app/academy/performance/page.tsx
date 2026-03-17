"use client"
import { useState } from "react"
import { AlertTriangle, TrendingUp, TrendingDown, Bell, Clock, Zap, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"
import { cn } from "@/lib/utils"

const ATHLETES = [
  { id: 1, name: "Arjun Sharma", position: "Striker", speed: 82, dribbling: 76, shooting: 71, passing: 68, defensive: 58, iq: 65, overall: 74, injuryRisk: "LOW", trend: +11, coach: "Ramesh Kumar" },
  { id: 2, name: "Vikram Singh", position: "Midfielder", speed: 71, dribbling: 68, shooting: 60, passing: 84, defensive: 72, iq: 79, overall: 71, injuryRisk: "LOW", trend: +3 },
  { id: 3, name: "Priya Desai", position: "Striker", speed: 75, dribbling: 70, shooting: 68, passing: 62, defensive: 55, iq: 60, overall: 67, injuryRisk: "MODERATE", trend: -2 },
  { id: 4, name: "Karan Mehta", position: "LW", speed: 88, dribbling: 79, shooting: 65, passing: 63, defensive: 50, iq: 62, overall: 68, injuryRisk: "LOW", trend: +8 },
  { id: 5, name: "Ravi Kumar", position: "LB", speed: 74, dribbling: 65, shooting: 52, passing: 70, defensive: 77, iq: 68, overall: 65, injuryRisk: "HIGH", trend: -5, injuryNote: "Knee valgus at landing — HIGH risk. Hamstring mechanics — MODERATE.", coach: "Amit Shah" },
  { id: 6, name: "Sneha Patel", position: "CF", speed: 77, dribbling: 81, shooting: 85, passing: 71, defensive: 54, iq: 74, overall: 78, injuryRisk: "LOW", trend: +12 },
]
const METRICS = ["speed","dribbling","shooting","passing","defensive","iq"]
const METRIC_LABELS: Record<string,string> = { speed:"Speed",dribbling:"Dribbling",shooting:"Shooting",passing:"Passing",defensive:"Defensive",iq:"Game IQ" }
const ANOMALIES = [
  { type: "breakthrough", icon: "🚀", athlete: "Arjun Sharma", message: "AI score +12pts in 30 days. Scout matches jumped from 3 → 11.", action: "Generate New Reel", color: "var(--nx-green)" },
  { type: "breakthrough", icon: "⭐", athlete: "Sneha Patel", message: "Season's fastest improver. Scoring 85/100 — above ISL U-19 threshold.", action: "Generate New Reel", color: "var(--nx-cyan)" },
  { type: "injury_cluster", icon: "⚠️", athlete: "Multiple Athletes", message: "2 athletes show HIGH/MODERATE injury risk this week. Possible training load issue.", action: "Review Training", color: "var(--nx-red)" },
  { type: "regression", icon: "📉", athlete: "Priya Desai", message: "AI score declined 5pts over 60 days. No injury flag. Consider 1-on-1 coaching review.", action: "Schedule Review", color: "var(--nx-amber)" },
  { type: "inactivity", icon: "😴", athlete: "3 athletes", message: "No video uploaded in 45+ days: Ravi Kumar, Mohan Das, Suresh Nair.", action: "Schedule Session", color: "var(--nx-text3)" },
]
const positionData = ["Striker","Midfielder","Defender","Winger","Goalkeeper"].map(pos => ({
  pos,
  avg: Math.round(ATHLETES.filter(a => a.position.includes(pos.slice(0,3))).reduce((s,a) => s + a.overall, 0) / Math.max(1, ATHLETES.filter(a => a.position.includes(pos.slice(0,3))).length)),
  count: ATHLETES.filter(a => a.position.includes(pos.slice(0,3))).length,
}))

function scoreColor(s: number) {
  if (s >= 80) return "var(--nx-cyan)"
  if (s >= 65) return "var(--nx-gold)"
  if (s >= 50) return "var(--nx-green)"
  if (s >= 35) return "var(--nx-amber)"
  return "var(--nx-red)"
}

export default function AcademyPerformancePage() {
  const [sortCol, setSortCol] = useState("overall")
  const [expandedAnomaly, setExpandedAnomaly] = useState<number | null>(null)
  const [restScheduled, setRestScheduled] = useState<number[]>([])
  const [notifiedCoach, setNotifiedCoach] = useState<number[]>([])
  const sorted = [...ATHLETES].sort((a, b) => (b as any)[sortCol] - (a as any)[sortCol])
  const highRisk = ATHLETES.filter(a => a.injuryRisk === "HIGH")
  const moderateRisk = ATHLETES.filter(a => a.injuryRisk === "MODERATE")
  const radarData = METRICS.map(m => ({ metric: METRIC_LABELS[m], avg: Math.round(ATHLETES.reduce((s,a) => s + (a as any)[m], 0) / ATHLETES.length) }))

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Squad Performance</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">AI performance intelligence · injury monitoring · anomaly detection</p>
      </div>

      {/* Injury Risk Monitoring Panel */}
      {(highRisk.length > 0 || moderateRisk.length > 0) && (
        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,59,48,0.04)", border: "2px solid rgba(255,59,48,0.25)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[var(--nx-red)]" />
            <p className="font-semibold text-sm text-[var(--nx-text1)]">Injury Risk Monitoring</p>
            <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(255,59,48,0.12)", color: "var(--nx-red)", fontFamily: "var(--font-mono)" }}>
              {highRisk.length} HIGH · {moderateRisk.length} MODERATE
            </span>
          </div>
          <div className="space-y-3">
            {[...highRisk, ...moderateRisk].map(a => (
              <div key={a.id} className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[var(--nx-text1)]">{a.name}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: a.injuryRisk === "HIGH" ? "rgba(255,59,48,0.15)" : "rgba(245,166,35,0.15)", color: a.injuryRisk === "HIGH" ? "var(--nx-red)" : "var(--nx-amber)", fontFamily: "var(--font-mono)" }}>
                        {a.injuryRisk} RISK
                      </span>
                    </div>
                    {a.injuryNote && <p className="text-xs text-[var(--nx-text3)] mt-1">{a.injuryNote}</p>}
                    {a.coach && <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Assigned coach: {a.coach}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setNotifiedCoach(p => p.includes(a.id) ? p : [...p, a.id])}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all", notifiedCoach.includes(a.id) ? "bg-[var(--nx-cyan)]/10 text-[var(--nx-cyan)] border border-[var(--nx-cyan)]/25" : "bg-[var(--nx-bg5)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)]")}>
                      {notifiedCoach.includes(a.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                      {notifiedCoach.includes(a.id) ? "Coach Notified" : "Notify Coach"}
                    </button>
                    <button
                      onClick={() => setRestScheduled(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all", restScheduled.includes(a.id) ? "bg-[var(--nx-amber)]/10 text-[var(--nx-amber)] border border-[var(--nx-amber)]/25" : "bg-[var(--nx-bg5)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)]")}>
                      <Clock className="w-3.5 h-3.5" />
                      {restScheduled.includes(a.id) ? "Rest Scheduled" : "Schedule Rest"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Squad Anomaly Detector */}
      <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[var(--nx-gold)]" />
          <p className="font-semibold text-sm text-[var(--nx-text1)]">Squad Anomaly Detector</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>5 ALERTS</span>
        </div>
        <div className="space-y-2">
          {ANOMALIES.map((a, i) => (
            <div key={i} className={cn("rounded-xl border overflow-hidden transition-all", expandedAnomaly === i ? "border-[var(--nx-border2)]" : "border-[var(--nx-border)]")} style={{ background: expandedAnomaly === i ? "var(--nx-bg4)" : "var(--nx-bg)" }}>
              <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpandedAnomaly(expandedAnomaly === i ? null : i)}>
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[var(--nx-text1)]">{a.athlete}</p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: `${a.color}15`, color: a.color, fontFamily: "var(--font-mono)" }}>{a.type.replace("_"," ")}</span>
                  </div>
                  <p className="text-[10px] text-[var(--nx-text3)] truncate">{a.message}</p>
                </div>
                {expandedAnomaly === i ? <ChevronUp className="w-3.5 h-3.5 text-[var(--nx-text3)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--nx-text3)]" />}
              </button>
              {expandedAnomaly === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-xs text-[var(--nx-text2)] mb-3">{a.message}</p>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold hover:brightness-110 transition-all" style={{ background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30` }}>
                    <Zap className="w-3 h-3" />{a.action}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Position Average AI Score Chart */}
      <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Average AI Score by Position</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={positionData} barSize={32}>
            <XAxis dataKey="pos" tick={{ fontSize: 11, fill: "var(--nx-text3)" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
            <Tooltip formatter={(v: any) => [v, "Avg Score"]} contentStyle={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border2)", borderRadius: "12px", fontSize: "11px" }} />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]} fill="var(--nx-green)" label={{ position: "top", fontSize: 10, fill: "var(--nx-text2)", fontFamily: "var(--font-display)" }} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-[var(--nx-text3)] mt-2">Goalkeeper avg: 0 (no enrolled GKs — critical gap)</p>
      </div>

      {/* Squad Heatmap */}
      <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-sm text-[var(--nx-text1)]">Squad Performance Heatmap</p>
          <div className="flex gap-2">
            {METRICS.map(m => (
              <button key={m} onClick={() => setSortCol(m)} className={cn("px-2 py-1 rounded-lg text-[10px] transition-all", sortCol === m ? "bg-[var(--nx-green)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                {METRIC_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--nx-border)]">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Athlete</th>
                {METRICS.map(m => (
                  <th key={m} className="px-2 py-2 text-center cursor-pointer" onClick={() => setSortCol(m)}>
                    <span className={cn("text-[10px] font-semibold tracking-widest uppercase", sortCol === m ? "text-[var(--nx-green)]" : "text-[var(--nx-text3)]")} style={{fontFamily:"var(--font-mono)"}}>{METRIC_LABELS[m]}</span>
                  </th>
                ))}
                <th className="px-2 py-2 text-center text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Overall</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(a => (
                <tr key={a.id} className="border-b border-[var(--nx-border)] hover:bg-[var(--nx-bg4)]/50 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--nx-text1)]">{a.name}</p>
                      <span className="text-[9px] text-[var(--nx-text3)]">{a.position}</span>
                      {a.trend > 0 ? <TrendingUp className="w-3 h-3 text-[var(--nx-green)]" /> : a.trend < 0 ? <TrendingDown className="w-3 h-3 text-[var(--nx-red)]" /> : null}
                    </div>
                  </td>
                  {METRICS.map(m => (
                    <td key={m} className="px-2 py-3 text-center">
                      <div className="w-9 h-9 rounded-lg mx-auto flex items-center justify-center font-bold text-xs" style={{ background: `${scoreColor((a as any)[m])}18`, color: scoreColor((a as any)[m]), fontFamily: "var(--font-display)", fontSize: "14px" }}>
                        {(a as any)[m]}
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-3 text-center">
                    <span className="font-bold text-sm" style={{ color: scoreColor(a.overall), fontFamily: "var(--font-display)" }}>{a.overall}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Squad Skill Profile (Average)</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--nx-border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
              <Radar dataKey="avg" stroke="var(--nx-green)" fill="var(--nx-green)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Ready for Trial</p>
          <div className="space-y-2">
            {ATHLETES.filter(a => a.overall >= 70 && a.injuryRisk === "LOW" && a.trend >= 0).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)] shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--nx-text1)]">{a.name}</p>
                  <p className="text-[10px] text-[var(--nx-text3)]">{a.position} · Score {a.overall}/100</p>
                </div>
                <span className="text-[10px] font-bold text-[var(--nx-green)]">+{a.trend}pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
