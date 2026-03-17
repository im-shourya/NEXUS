"use client"

import { useState } from "react"
import { X, Loader2, UploadCloud, Sparkles } from "lucide-react"

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const SPORT_OPTIONS = [
    { value: "football", label: "⚽ Football", subtypes: [] },
    { value: "cricket", label: "🏏 Cricket", subtypes: [
        { value: "batting", label: "Batting" },
        { value: "bowling", label: "Bowling" },
    ]},
]

export function UploadVideoModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisStatus, setAnalysisStatus] = useState<"idle" | "running" | "done" | "failed">("idle")
    const [error, setError] = useState("")

    const [title, setTitle] = useState("")
    const [type, setType] = useState("Highlights")
    const [file, setFile] = useState<File | null>(null)
    const [analysisSport, setAnalysisSport] = useState("football")
    const [analysisSubtype, setAnalysisSubtype] = useState("bowling")

    if (!isOpen) return null

    const selectedSport = SPORT_OPTIONS.find(s => s.value === analysisSport)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setError("Please select a video file")
            return
        }

        setLoading(true)
        setError("")
        setAnalysisStatus("idle")

        try {
            // 1. Upload video
            const formData = new FormData()
            formData.append("title", title)
            formData.append("type", type)
            formData.append("file", file)
            formData.append("analysisSport", analysisSport)
            formData.append("analysisSubtype", analysisSubtype)

            const response = await fetch("/api/videos", {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to upload video")
            }

            const { video } = await response.json()
            setLoading(false)

            // 2. Auto-trigger analysis
            setAnalyzing(true)
            setAnalysisStatus("running")

            const analyzeResponse = await fetch(`/api/videos/${video.id}/analyze`, {
                method: "POST"
            })

            const analyzeResult = await analyzeResponse.json()

            if (analyzeResult.status === "completed") {
                setAnalysisStatus("done")
            } else {
                setAnalysisStatus("failed")
                setError(analyzeResult.error || "Analysis failed")
            }

            onSuccess()

        } catch (err: any) {
            setError(err.message)
            setAnalysisStatus("failed")
        } finally {
            setLoading(false)
            setAnalyzing(false)
        }
    }

    const handleClose = () => {
        if (!loading && !analyzing) {
            setAnalysisStatus("idle")
            setError("")
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--nx-border)] shrink-0">
                    <h2 className="text-xl font-bold text-[var(--nx-text1)]">Upload & Analyze Video</h2>
                    <button
                        onClick={handleClose}
                        disabled={loading || analyzing}
                        className="p-2 text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)] rounded-xl transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Analysis Progress Overlay */}
                {(analyzing || analysisStatus === "done") && (
                    <div className="p-6 border-b border-[var(--nx-border)]">
                        <div className="flex items-center gap-3 mb-3">
                            <Sparkles className="w-5 h-5 text-[var(--nx-cyan)]" />
                            <span className="font-semibold text-[var(--nx-text1)]">AI Video Analysis</span>
                        </div>

                        {analysisStatus === "running" && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-[var(--nx-text2)]">
                                    <Loader2 className="w-4 h-4 animate-spin text-[var(--nx-cyan)]" />
                                    <span>Running {analysisSport === "cricket" ? `Cricket ${analysisSubtype}` : "Football"} analysis...</span>
                                </div>
                                <div className="h-1.5 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--nx-cyan)] to-[var(--nx-green)] rounded-full"
                                        style={{
                                            animation: "analysisProgress 3s ease-in-out infinite",
                                            width: "70%"
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-[var(--nx-text3)]">
                                    Detecting poses, analyzing biomechanics, evaluating form...
                                </p>
                            </div>
                        )}

                        {analysisStatus === "done" && (
                            <div className="flex items-center gap-2 text-sm text-[var(--nx-green)]">
                                <span className="text-lg">✅</span>
                                <span>Analysis complete! View results from your highlights page.</span>
                            </div>
                        )}

                        {analysisStatus === "failed" && (
                            <div className="flex items-center gap-2 text-sm text-[var(--nx-red)]">
                                <span className="text-lg">❌</span>
                                <span>Analysis failed. You can retry from the highlights page.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Form Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {error && !analyzing && (
                        <div className="mb-6 p-4 rounded-xl bg-[var(--nx-red)]/10 border border-[var(--nx-red)]/20 text-[var(--nx-red)] text-sm">
                            {error}
                        </div>
                    )}

                    <form id="upload-video-form" onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--nx-text2)]">Video Title</label>
                            <input
                                type="text"
                                required
                                disabled={loading || analyzing}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. State Championship Final — Goals Compilation"
                                className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--nx-text2)]">Video Category</label>
                            <select
                                value={type}
                                disabled={loading || analyzing}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none disabled:opacity-50"
                            >
                                <option value="Match Footage">Match Footage</option>
                                <option value="Training">Training</option>
                                <option value="Highlights">Highlights</option>
                                <option value="Skills">Skills</option>
                            </select>
                        </div>

                        {/* Sport Selection for ML Analysis */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(0,212,255,0.05)] to-[rgba(0,245,116,0.05)] border border-[rgba(0,212,255,0.15)] space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[var(--nx-cyan)]" />
                                <span className="text-sm font-semibold text-[var(--nx-cyan)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "11px" }}>
                                    AI Analysis Settings
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[var(--nx-text2)]">Sport</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SPORT_OPTIONS.map(sport => (
                                        <button
                                            key={sport.value}
                                            type="button"
                                            disabled={loading || analyzing}
                                            onClick={() => {
                                                setAnalysisSport(sport.value)
                                                if (sport.subtypes.length > 0) {
                                                    setAnalysisSubtype(sport.subtypes[0].value)
                                                }
                                            }}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                analysisSport === sport.value
                                                    ? "bg-[var(--nx-cyan)]/15 border-2 border-[var(--nx-cyan)] text-[var(--nx-cyan)]"
                                                    : "bg-[var(--nx-bg3)] border-2 border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]"
                                            } disabled:opacity-50`}
                                        >
                                            {sport.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedSport && selectedSport.subtypes.length > 0 && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Analysis Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedSport.subtypes.map(sub => (
                                            <button
                                                key={sub.value}
                                                type="button"
                                                disabled={loading || analyzing}
                                                onClick={() => setAnalysisSubtype(sub.value)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    analysisSubtype === sub.value
                                                        ? "bg-[var(--nx-green)]/15 border border-[var(--nx-green)] text-[var(--nx-green)]"
                                                        : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]"
                                                } disabled:opacity-50`}
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-[var(--nx-text3)]">
                                After upload, our AI will automatically analyze your video for form, technique, and biomechanics.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--nx-text2)]">File</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="video/*"
                                    required
                                    disabled={loading || analyzing}
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center justify-center p-6 border-2 border-dashed border-[var(--nx-border2)] hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-bg3)] rounded-xl transition-all">
                                    {file ? (
                                        <div className="text-sm font-medium text-[var(--nx-green)] truncate px-4">{file.name}</div>
                                    ) : (
                                        <div className="flex flex-col items-center text-[var(--nx-text3)] gap-2">
                                            <UploadCloud className="w-6 h-6" />
                                            <span className="text-sm">Click to select video file (max 500MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--nx-border)] bg-[var(--nx-bg3)] flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        disabled={loading || analyzing}
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl font-medium text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg)] border border-transparent hover:border-[var(--nx-border)] transition-all disabled:opacity-50"
                    >
                        {analysisStatus === "done" ? "Close" : "Cancel"}
                    </button>
                    {analysisStatus !== "done" && (
                        <button
                            type="submit"
                            form="upload-video-form"
                            disabled={loading || analyzing}
                            className="px-6 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                            ) : analyzing ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                            ) : (
                                <>Upload & Analyze</>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes analysisProgress {
                    0% { width: 10%; }
                    50% { width: 75%; }
                    100% { width: 95%; }
                }
            `}</style>
        </div>
    )
}
