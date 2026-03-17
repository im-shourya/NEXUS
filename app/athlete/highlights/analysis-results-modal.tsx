"use client"

import { X, AlertTriangle, CheckCircle2, Target, Zap, Sparkles, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisResultsModalProps {
    isOpen: boolean
    onClose: () => void
    analysis: any
    videoTitle: string
}

export function AnalysisResultsModal({ isOpen, onClose, analysis, videoTitle }: AnalysisResultsModalProps) {
    if (!isOpen || !analysis) return null

    const report = analysis.analysis_json
    const sport = (analysis.sport || "").toLowerCase()
    const isFootball = sport === "football"
    const isCricket = sport === "cricket"

    // Football report shape: { summary, issues, recommendations, timeline }
    // Cricket report shape:  { analysisType, overallScore, technicalGrade, shots, uniqueIssues, recommendations, injuryRisks }

    const overallScore = isFootball
        ? report?.summary?.average_quality_score
        : report?.overallScore
    const grade = isFootball
        ? report?.summary?.overall_assessment
        : report?.technicalGrade
    const analysisDate = analysis.completed_at
        ? new Date(analysis.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "N/A"

    const scoreColor = (s: number) =>
        s >= 80 ? "var(--nx-cyan)" : s >= 65 ? "var(--nx-gold)" : s >= 50 ? "var(--nx-green)" : s >= 35 ? "var(--nx-amber)" : "var(--nx-red)"

    const severityColor = (sev: string) => {
        switch (sev?.toLowerCase()) {
            case "critical": case "high": return "var(--nx-red)"
            case "medium": case "moderate": case "warning": return "var(--nx-amber)"
            case "low": case "info": return "var(--nx-green)"
            default: return "var(--nx-text3)"
        }
    }

    const severityIcon = (sev: string) => {
        const s = sev?.toLowerCase()
        if (s === "critical" || s === "high") return "🔴"
        if (s === "medium" || s === "moderate" || s === "warning") return "🟡"
        return "🟢"
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[85vh] bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--nx-border)] shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-[var(--nx-cyan)]" />
                            <h2 className="text-xl font-bold text-[var(--nx-text1)]">AI Analysis Report</h2>
                        </div>
                        <p className="text-sm text-[var(--nx-text3)]">{videoTitle} · {analysisDate}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)] rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1">

                    {/* Summary KPIs */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
                            <div className="text-xs mb-1 text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Overall Score
                            </div>
                            <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor(overallScore || 0) }}>
                                {overallScore != null ? Math.round(overallScore) : "N/A"}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
                            <div className="text-xs mb-1 text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Grade
                            </div>
                            <div className="text-lg font-bold text-[var(--nx-green)] mt-1" style={{ fontFamily: "var(--font-display)" }}>
                                {grade || "N/A"}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
                            <div className="text-xs mb-1 text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Sport
                            </div>
                            <div className="text-lg font-bold text-[var(--nx-cyan)] mt-1">
                                {isFootball ? "⚽ Football" : "🏏 Cricket"}
                            </div>
                        </div>
                    </div>

                    {/* Annotated Video Player */}
                    {report?.annotated_video_url && (
                        <div className="rounded-xl overflow-hidden border border-[var(--nx-border)] bg-black">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--nx-bg3)] border-b border-[var(--nx-border)]">
                                <Activity className="w-4 h-4 text-[var(--nx-green)]" />
                                <span className="text-sm font-semibold text-[var(--nx-text1)]">Annotated Analysis Video</span>
                                <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}>
                                    AI OVERLAY
                                </span>
                            </div>
                            <video
                                src={report.annotated_video_url}
                                controls
                                className="w-full max-h-[400px]"
                                style={{ background: "#000" }}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <div className="px-4 py-2 bg-[var(--nx-bg4)] text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>
                                Green dots: joint positions · White lines: skeleton · Overlays: technique analysis
                            </div>
                        </div>
                    )}

                    {/* Football-specific summary */}
                    {isFootball && report?.summary && (
                        <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-[var(--nx-cyan)]" />
                                <span className="font-semibold text-[var(--nx-text1)]">Video Summary</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-[var(--nx-text3)]">Resolution:</span> <span className="text-[var(--nx-text1)]">{report.summary.resolution}</span></div>
                                <div><span className="text-[var(--nx-text3)]">Duration:</span> <span className="text-[var(--nx-text1)]">{report.summary.duration_display}</span></div>
                                <div><span className="text-[var(--nx-text3)]">Frames Analyzed:</span> <span className="text-[var(--nx-text1)]">{report.summary.frames_analyzed}</span></div>
                                <div><span className="text-[var(--nx-text3)]">Assessment:</span> <span className="text-[var(--nx-text1)]">{report.summary.overall_assessment}</span></div>
                            </div>
                        </div>
                    )}

                    {/* Cricket-specific: Shots breakdown */}
                    {isCricket && report?.shots && report.shots.length > 0 && (
                        <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-[var(--nx-gold)]" />
                                <span className="font-semibold text-[var(--nx-text1)]">Shot Analysis ({report.totalShotsDetected} detected)</span>
                            </div>
                            <div className="space-y-3">
                                {report.shots.slice(0, 5).map((shot: any, i: number) => (
                                    <div key={i} className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-[var(--nx-text1)]">Shot #{shot.shotNumber}</span>
                                            <span className="text-sm font-bold" style={{ color: scoreColor(shot.score || 0) }}>{shot.score || 0}</span>
                                        </div>
                                        {shot.measurements && (
                                            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--nx-text3)]">
                                                {Object.entries(shot.measurements).slice(0, 4).map(([key, val]: [string, any]) => (
                                                    <div key={key}>
                                                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}: </span>
                                                        <span className="text-[var(--nx-text2)]">{typeof val === "object" ? val?.value || val?.description || JSON.stringify(val) : val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {shot.estimatedSpeed?.value && (
                                            <div className="mt-1 text-xs text-[var(--nx-cyan)]">
                                                Speed: {shot.estimatedSpeed.value} {shot.estimatedSpeed.unit}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Issues */}
                    {(() => {
                        const issues = isFootball ? report?.issues : report?.uniqueIssues
                        if (!issues || issues.length === 0) return (
                            <div className="p-4 rounded-xl bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[var(--nx-green)]" />
                                <span className="text-sm text-[var(--nx-green)]">No issues detected — great form!</span>
                            </div>
                        )
                        return (
                            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle className="w-4 h-4 text-[var(--nx-amber)]" />
                                    <span className="font-semibold text-[var(--nx-text1)]">Issues Detected ({issues.length})</span>
                                </div>
                                <div className="space-y-3">
                                    {issues.map((issue: any, i: number) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-[var(--nx-bg4)]">
                                            <span className="text-base mt-0.5 shrink-0">{severityIcon(issue.severity)}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-[var(--nx-text1)]">{issue.title || issue.type || "Issue"}</span>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
                                                        color: severityColor(issue.severity),
                                                        background: `color-mix(in srgb, ${severityColor(issue.severity)} 15%, transparent)`,
                                                        border: `1px solid color-mix(in srgb, ${severityColor(issue.severity)} 30%, transparent)`
                                                    }}>
                                                        {(issue.severity || "").toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--nx-text3)]">{issue.description}</p>
                                                {issue.time_range_display && (
                                                    <p className="text-xs text-[var(--nx-text3)] mt-1">⏱ {issue.time_range_display}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })()}

                    {/* Recommendations */}
                    {(() => {
                        const recs = report?.recommendations
                        if (!recs || recs.length === 0) return null
                        return (
                            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-4 h-4 text-[var(--nx-gold)]" />
                                    <span className="font-semibold text-[var(--nx-text1)]">Recommendations</span>
                                </div>
                                <div className="space-y-3">
                                    {recs.map((rec: any, i: number) => (
                                        <div key={i} className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                                            {/* Cricket format */}
                                            {rec.name && (
                                                <div className="mb-1">
                                                    <span className="text-sm font-semibold text-[var(--nx-text1)]">{rec.name}</span>
                                                    {rec.sets && rec.reps && (
                                                        <span className="ml-2 text-xs text-[var(--nx-cyan)]">{rec.sets}x{rec.reps}</span>
                                                    )}
                                                </div>
                                            )}
                                            {rec.description && (
                                                <p className="text-xs text-[var(--nx-text3)]">{rec.description}</p>
                                            )}
                                            {/* Football format */}
                                            {rec.tip && (
                                                <p className="text-sm text-[var(--nx-text2)] mb-1">💡 {rec.tip}</p>
                                            )}
                                            {rec.drill && (
                                                <p className="text-xs text-[var(--nx-text3)]">🏋️ Drill: {rec.drill}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })()}

                    {/* Injury Risks (Cricket) */}
                    {isCricket && report?.injuryRisks && report.injuryRisks.length > 0 && (
                        <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-4 h-4 text-[var(--nx-red)]" />
                                <span className="font-semibold text-[var(--nx-text1)]">Injury Risks</span>
                            </div>
                            <div className="space-y-2">
                                {report.injuryRisks.map((risk: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--nx-bg4)]">
                                        <span className="text-base">{severityIcon(risk.severity || risk.risk)}</span>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--nx-text1)]">{risk.area || risk.type}</p>
                                            <p className="text-xs text-[var(--nx-text3)]">{risk.description || risk.recommendation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--nx-border)] bg-[var(--nx-bg3)] flex items-center justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
