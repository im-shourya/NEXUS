"use client"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, Download, AlertTriangle, CheckCircle2, RefreshCw, ChevronDown, ChevronUp, Target, Zap, Loader2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { generatePerformanceReport } from "@/lib/generatePerformanceReport"

// ── Default data (fallback when no ML analysis available) ──
const DEFAULT_SKILL_BARS = [
  { label: "Sprint Speed", score: 82, weight: 0.15 },
  { label: "Ball Control", score: 78, weight: 0.20 },
  { label: "Shooting Accuracy", score: 71, weight: 0.15 },
  { label: "Passing Range", score: 68, weight: 0.15 },
  { label: "Dribbling", score: 76, weight: 0.20 },
  { label: "Tactical Positioning", score: 65, weight: 0.05 },
  { label: "Stamina / Endurance", score: 72, weight: 0.05 },
  { label: "Defensive Work Rate", score: 58, weight: 0.05 },
]

const scoreColor = (s: number) =>
  s >= 80 ? "var(--nx-cyan)" : s >= 65 ? "var(--nx-gold)" : s >= 50 ? "var(--nx-green)" : s >= 35 ? "var(--nx-amber)" : "var(--nx-red)"

const trendData = [
  { month: "Sep", score: 61 }, { month: "Oct", score: 65 },
  { month: "Nov", score: 67 }, { month: "Dec", score: 70 },
  { month: "Jan", score: 72 }, { month: "Feb", score: 74 },
]

const readiness = [
  { day: "Mon", score: 88, level: "high" },
  { day: "Tue", score: 72, level: "moderate" },
  { day: "Wed", score: 91, level: "high" },
  { day: "Thu", score: 45, level: "low" },
  { day: "Fri", score: 83, level: "high" },
  { day: "Sat", score: 0, level: "rest" },
  { day: "Sun", score: 0, level: "future" },
]

const DEFAULT_FORM_FINDINGS = [
  { status: "good", title: "Shooting Posture — Excellent", detail: "Hip alignment and follow-through optimal on dominant foot" },
  { status: "good", title: "Sprint Mechanics — Good", detail: "Arm drive shows 14° asymmetry (left arm slightly behind)" },
  { status: "warn", title: "Landing Impact — Moderate Risk", detail: "Knee valgus at landing detected — consider physio assessment" },
  { status: "good", title: "Heading Technique — Good", detail: "Neck stability and jump timing above average for age group" },
  { status: "warn", title: "Free-kick Run-up — Watch", detail: "Approach angle 52° (ideal 30-45°) — slightly over-angled" },
]

const injuryParts = [
  { label: "Hamstring", pct: 12, color: "var(--nx-green)" },
  { label: "Knee / ACL", pct: 24, color: "var(--nx-amber)" },
  { label: "Groin", pct: 8, color: "var(--nx-green)" },
  { label: "Ankle", pct: 15, color: "var(--nx-green)" },
]

const peerData = [
  { metric: "Primary Skill", athlete: 78, avg: 62, label: "Top 22%" },
  { metric: "Physical Rating", athlete: 72, avg: 58, label: "Top 31%" },
  { metric: "Overall Score", athlete: 74, avg: 60, label: "Top 28%" },
]

const trajectoryData = [
  ...trendData.map(d => ({ ...d, type: "actual" })),
  { month: "Mar", score: 76, type: "projected" },
  { month: "Apr", score: 78, type: "projected" },
  { month: "May", score: 80, type: "projected" },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-lg p-2 text-xs">
      <p className="text-[var(--nx-text3)]">{label}</p>
      <p className="text-[var(--nx-green)] font-bold">{payload[0]?.value}</p>
    </div>
  )
}

// Helper to build form findings from ML analysis
function buildFormFindings(analysis: any): Array<{ status: string; title: string; detail: string }> {
  const report = analysis?.analysis_json
  if (!report) return DEFAULT_FORM_FINDINGS

  const sport = (analysis.sport || "").toLowerCase()
  const findings: Array<{ status: string; title: string; detail: string }> = []

  if (sport === "football") {
    // Football: report has { summary, issues, recommendations }
    const issues = report.issues || []
    const assessment = report.summary?.overall_assessment || ""

    // Add assessment as first finding
    if (assessment) {
      const isGood = assessment.toLowerCase().includes("good") || assessment.toLowerCase().includes("excellent")
      findings.push({
        status: isGood ? "good" : "warn",
        title: `Overall Assessment — ${isGood ? "Good" : "Needs Work"}`,
        detail: assessment
      })
    }

    // Convert issues to findings
    for (const issue of issues.slice(0, 6)) {
      const severity = (issue.severity || "").toLowerCase()
      const isWarn = severity === "high" || severity === "critical" || severity === "medium" || severity === "warning"
      findings.push({
        status: isWarn ? "warn" : "good",
        title: issue.title || issue.id || "Issue",
        detail: `${issue.description || ""} ${issue.time_range_display ? `(${issue.time_range_display})` : ""}`
      })
    }

    // Add recommendations as positive findings if no issues
    if (findings.length < 3) {
      findings.push({
        status: "good",
        title: "Form Quality — No Major Issues",
        detail: `Average quality score: ${report.summary?.average_quality_score ?? "N/A"}`
      })
    }
  } else if (sport === "cricket") {
    // Cricket: report has { overallScore, technicalGrade, uniqueIssues, shots, recommendations, injuryRisks }
    const score = report.overallScore || 0
    const grade = report.technicalGrade || "N/A"

    findings.push({
      status: score >= 60 ? "good" : "warn",
      title: `${report.analysisType === "batting" ? "Batting" : "Bowling"} Score: ${score} (${grade})`,
      detail: `${report.totalShotsDetected || 0} shots/deliveries detected and analyzed`
    })

    // Show unique issues
    const issues = report.uniqueIssues || []
    for (const issue of issues.slice(0, 5)) {
      const severity = (issue.severity || "").toLowerCase()
      const isWarn = severity === "critical" || severity === "high" || severity === "medium"
      findings.push({
        status: isWarn ? "warn" : "good",
        title: issue.type || "Issue",
        detail: issue.description || ""
      })
    }

    // Add shot measurements if available
    const shots = report.shots || []
    if (shots.length > 0 && shots[0].measurements) {
      const m = shots[0].measurements
      if (m.backliftAngle) {
        findings.push({
          status: m.backliftAngle.rating === "poor" ? "warn" : "good",
          title: `Backlift Angle — ${m.backliftAngle.rating || "Measured"}`,
          detail: `${m.backliftAngle.value}° (optimal: 40-50°)`
        })
      }
      if (m.headPosition) {
        findings.push({
          status: m.headPosition.stable ? "good" : "warn",
          title: `Head Position — ${m.headPosition.stable ? "Stable" : "Unstable"}`,
          detail: m.headPosition.description || ""
        })
      }
    }

    if (findings.length === 1) {
      findings.push({
        status: "good",
        title: "Analysis Complete",
        detail: "No major biomechanical issues detected"
      })
    }
  }

  return findings.length > 0 ? findings : DEFAULT_FORM_FINDINGS
}

// Helper to build injury risk data from ML analysis
function buildInjuryData(analysis: any) {
  const report = analysis?.analysis_json
  if (!report) return { risk: "LOW", parts: injuryParts }

  const sport = (analysis.sport || "").toLowerCase()

  if (sport === "cricket" && report.injuryRisks && report.injuryRisks.length > 0) {
    const risks = report.injuryRisks
    const hasHigh = risks.some((r: any) => r.severity === "critical" || r.severity === "high" || r.risk === "high")
    const hasMedium = risks.some((r: any) => r.severity === "medium" || r.risk === "medium")

    const parts = risks.map((r: any) => ({
      label: r.area || r.type || "General",
      pct: r.risk === "high" || r.severity === "high" ? 35 : r.risk === "medium" ? 20 : 10,
      color: r.severity === "high" || r.risk === "high" ? "var(--nx-red)" : r.severity === "medium" || r.risk === "medium" ? "var(--nx-amber)" : "var(--nx-green)"
    }))

    return {
      risk: hasHigh ? "HIGH" : hasMedium ? "MODERATE" : "LOW",
      parts: parts.length > 0 ? parts : injuryParts
    }
  }

  return { risk: "LOW", parts: injuryParts }
}

export default function AthletePerformancePage() {
  const [analysisOpen, setAnalysisOpen] = useState(true)
  const [peerOpen, setPeerOpen] = useState(true)
  const [trajectoryOpen, setTrajectoryOpen] = useState(true)
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(true)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    setLoadingAnalysis(true)
    fetch("/api/analysis/latest")
      .then(res => res.json())
      .then(data => {
        if (data.analysis) setLatestAnalysis(data.analysis)
      })
      .catch(console.error)
      .finally(() => setLoadingAnalysis(false))
  }, [])

  const skillBars = DEFAULT_SKILL_BARS
  const formFindings = buildFormFindings(latestAnalysis)
  const injuryData = buildInjuryData(latestAnalysis)

  const radarData = skillBars.map(s => ({ subject: s.label.split(" ")[0], A: s.score, fullMark: 100 }))
  const overallScore = latestAnalysis?.overall_score
    ? Math.round(latestAnalysis.overall_score)
    : Math.round(skillBars.reduce((acc, s) => acc + s.score * s.weight, 0))

  const analysisDate = latestAnalysis?.completed_at
    ? new Date(latestAnalysis.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null
  const analysisVideoTitle = latestAnalysis?.videos?.title || "Unknown Video"
  const analysisSport = (latestAnalysis?.sport || "").toLowerCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Performance Analytics</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">AI-powered analysis from your uploaded videos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={generatingPdf}
            onClick={async () => {
              setGeneratingPdf(true)
              try {
                await new Promise(r => setTimeout(r, 100)) // let UI update
                generatePerformanceReport({
                  overallScore,
                  speedRating: "82",
                  technique: latestAnalysis?.grade || "78",
                  injuryRisk: injuryData.risk,
                  skillBars,
                  formFindings,
                  injuryParts: injuryData.parts,
                  peerData,
                  trajectoryData,
                  analysisSport,
                  analysisDate,
                  analysisVideoTitle,
                  hasAnalysis: !!latestAnalysis,
                })
              } catch (e) {
                console.error("PDF generation failed:", e)
              } finally {
                setGeneratingPdf(false)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] text-sm transition-colors disabled:opacity-50"
          >
            {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {generatingPdf ? "Generating..." : "PDF Report"}
          </button>
          <Link href="/athlete/highlights" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-cyan)] text-black font-semibold text-sm hover:brightness-110 transition-all">
            <Sparkles className="w-4 h-4" />Upload & Analyze
          </Link>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "NexusScore™", value: overallScore + "/100", color: "var(--nx-green)", sub: latestAnalysis ? `From ML analysis` : "↑ 3 pts this month" },
          { label: "Speed Rating", value: "82", color: "var(--nx-cyan)", sub: "Top 15% · Age 17" },
          { label: "Technique", value: latestAnalysis?.grade || "78", color: "var(--nx-gold)", sub: latestAnalysis ? `${analysisSport === "cricket" ? "Cricket" : "Football"} analysis` : "↑ 5 pts this month" },
          { label: "Injury Risk", value: injuryData.risk, color: injuryData.risk === "LOW" ? "var(--nx-green)" : injuryData.risk === "MODERATE" ? "var(--nx-amber)" : "var(--nx-red)", sub: injuryData.risk === "LOW" ? "All clear" : "Review recommended" },
        ].map((k, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="text-xs mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>{k.label}</div>
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--nx-text3)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Skills + Charts */}
        <div className="lg:col-span-2 space-y-6">

          {/* Skill Bars */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-[var(--nx-text1)]">Skill Breakdown</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">Football · Striker position weights</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--nx-cyan)]/10 text-[var(--nx-cyan)] border border-[var(--nx-cyan)]/20">
                🤖 AI SCORED
              </span>
            </div>
            <div className="space-y-4">
              {skillBars.map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--nx-text1)] font-medium">{skill.label}</span>
                    <span className="font-bold" style={{ color: scoreColor(skill.score), fontFamily: "var(--font-display)", fontSize: "16px" }}>
                      {skill.score}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${skill.score}%`,
                        background: scoreColor(skill.score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Season Trend */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">NexusScore™ Trend</h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nx-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--nx-text3)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 85]} tick={{ fill: "var(--nx-text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="var(--nx-green)" strokeWidth={2.5} dot={{ fill: "var(--nx-green)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Skills Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--nx-border2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--nx-text3)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <Radar name="You" dataKey="A" stroke="var(--nx-green)" fill="var(--nx-green)" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Readiness */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[var(--nx-text1)]">Weekly Readiness</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">Training load × recovery × momentum</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-[var(--nx-green-dim)] text-[var(--nx-green)] border border-[var(--nx-green-border)]">
                Today: HIGH 88%
              </span>
            </div>
            <div className="flex items-end gap-3 h-20">
              {readiness.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg relative" style={{ height: "100%", background: "var(--nx-bg4)" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all"
                      style={{
                        height: d.score > 0 ? `${d.score}%` : "0%",
                        background: d.level === "high" ? "var(--nx-green)" : d.level === "moderate" ? "var(--nx-amber)" : d.level === "low" ? "var(--nx-red)" : "var(--nx-border2)"
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: i === 4 ? "var(--nx-green)" : "var(--nx-text3)" }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: CV Analysis + Injury + Peer + Trajectory */}
        <div className="space-y-5">

          {/* CV Form Analysis — Now AI-powered */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setAnalysisOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--nx-cyan)]" />
                <span className="font-semibold text-[var(--nx-text1)]">CV Form Analysis</span>
              </div>
              {analysisOpen ? <ChevronUp className="w-4 h-4 text-[var(--nx-text3)]" /> : <ChevronDown className="w-4 h-4 text-[var(--nx-text3)]" />}
            </button>

            {latestAnalysis ? (
              <p className="text-xs text-[var(--nx-text3)] mt-1">
                Last run on: {analysisVideoTitle} · {analysisDate} ·
                <span className="text-[var(--nx-cyan)]"> {analysisSport === "cricket" ? "🏏 Cricket" : "⚽ Football"}</span>
              </p>
            ) : (
              <p className="text-xs text-[var(--nx-text3)] mt-1">
                {loadingAnalysis ? "Loading..." : "No analysis data yet — upload a video to get started"}
              </p>
            )}

            {analysisOpen && (
              <div className="mt-4 space-y-3">
                {loadingAnalysis ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-[var(--nx-text3)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading analysis...</span>
                  </div>
                ) : (
                  <>
                    {/* Overall Score Banner */}
                    {latestAnalysis && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-[rgba(0,212,255,0.08)] to-[rgba(0,245,116,0.08)] border border-[rgba(0,212,255,0.15)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-[var(--nx-cyan)]" />
                            <span className="text-sm font-medium text-[var(--nx-text1)]">ML Score</span>
                          </div>
                          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor(latestAnalysis.overall_score || 0) }}>
                            {Math.round(latestAnalysis.overall_score || 0)}/100
                          </span>
                        </div>
                        {latestAnalysis.grade && (
                          <p className="text-xs text-[var(--nx-text3)] mt-1">{latestAnalysis.grade}</p>
                        )}
                      </div>
                    )}

                    {/* Findings */}
                    {formFindings.map((f, i) => (
                      <div key={i} className="flex gap-3">
                        {f.status === "good"
                          ? <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)] mt-0.5 shrink-0" />
                          : <AlertTriangle className="w-4 h-4 text-[var(--nx-amber)] mt-0.5 shrink-0" />}
                        <div>
                          <p className="text-sm font-medium" style={{ color: f.status === "good" ? "var(--nx-text1)" : "var(--nx-amber)" }}>{f.title}</p>
                          <p className="text-xs text-[var(--nx-text3)] mt-0.5">{f.detail}</p>
                        </div>
                      </div>
                    ))}

                    <Link
                      href="/athlete/highlights"
                      className="flex items-center gap-2 w-full mt-3 px-3 py-2 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-xs text-[var(--nx-cyan)] hover:border-[var(--nx-cyan)]/40 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />Run on New Video
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Injury Risk */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--nx-green)]" />
                <span className="font-semibold text-[var(--nx-text1)]">Injury Risk</span>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-semibold border",
                injuryData.risk === "LOW" ? "bg-[var(--nx-green-dim)] text-[var(--nx-green)] border-[var(--nx-green-border)]" :
                injuryData.risk === "MODERATE" ? "bg-[var(--nx-amber)]/10 text-[var(--nx-amber)] border-[var(--nx-amber)]/20" :
                "bg-[var(--nx-red)]/10 text-[var(--nx-red)] border-[var(--nx-red)]/20"
              )}>{injuryData.risk}</span>
            </div>
            <div className="text-center mb-4">
              <span className={cn(
                "text-5xl font-bold",
                injuryData.risk === "LOW" ? "text-[var(--nx-green)]" : injuryData.risk === "MODERATE" ? "text-[var(--nx-amber)]" : "text-[var(--nx-red)]"
              )} style={{ fontFamily: "var(--font-display)" }}>{injuryData.risk}</span>
              <p className="text-xs text-[var(--nx-text3)] mt-1">
                {latestAnalysis ? "Based on ML analysis" : "Overall risk assessment"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {injuryData.parts.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--nx-bg4)] text-center">
                  <div className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: p.color }}>{p.pct}%</div>
                  <div className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Comparison */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <button className="flex items-center justify-between w-full" onClick={() => setPeerOpen(o => !o)}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--nx-gold)]" />
                <span className="font-semibold text-[var(--nx-text1)]">Peer Comparison</span>
              </div>
              {peerOpen ? <ChevronUp className="w-4 h-4 text-[var(--nx-text3)]" /> : <ChevronDown className="w-4 h-4 text-[var(--nx-text3)]" />}
            </button>
            <p className="text-xs text-[var(--nx-text3)] mt-1">Football · Striker · Age 16-17 · India</p>
            {peerOpen && (
              <div className="mt-4 space-y-4">
                {peerData.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--nx-text2)]">{p.metric}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--nx-green-dim)] text-[var(--nx-green)] border border-[var(--nx-green-border)]">{p.label}</span>
                    </div>
                    <div className="relative h-2 bg-[var(--nx-bg4)] rounded-full">
                      <div className="h-full bg-[var(--nx-green)] rounded-full" style={{ width: `${p.athlete}%` }} />
                      <div className="absolute h-full top-0 border-r-2 border-[var(--nx-amber)] border-dashed" style={{ left: `${p.avg}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-[var(--nx-green)]">You: {p.athlete}</span>
                      <span className="text-[10px] text-[var(--nx-amber)]">Avg: {p.avg}</span>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-[var(--nx-text3)]">Based on 1,247 athletes in your cohort</p>
              </div>
            )}
          </div>

          {/* Career Trajectory */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <button className="flex items-center justify-between w-full" onClick={() => setTrajectoryOpen(o => !o)}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--nx-purple)]" />
                <span className="font-semibold text-[var(--nx-text1)]">Career Trajectory</span>
              </div>
              {trajectoryOpen ? <ChevronUp className="w-4 h-4 text-[var(--nx-text3)]" /> : <ChevronDown className="w-4 h-4 text-[var(--nx-text3)]" />}
            </button>
            {trajectoryOpen && (
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={trajectoryData}>
                    <XAxis dataKey="month" tick={{ fill: "var(--nx-text3)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[55, 90]} tick={{ fill: "var(--nx-text3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone" dataKey="score" stroke="var(--nx-green)" strokeWidth={2}
                      dot={{ fill: "var(--nx-green)", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-0.5 bg-[var(--nx-green)]" />
                    <span className="text-[var(--nx-text3)]">Actual performance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-0.5 border-t-2 border-dashed border-[var(--nx-green)]" />
                    <span className="text-[var(--nx-text3)]">Projected trajectory</span>
                  </div>
                  <p className="text-xs text-[var(--nx-text2)] mt-2 p-2 rounded-lg bg-[var(--nx-bg4)]">
                    💡 At your current rate, you'll hit <strong className="text-[var(--nx-green)]">80/100</strong> by May — ISL U-21 trial-ready threshold.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
