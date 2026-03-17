"use client"

import { useState, useEffect } from "react"
import { Play, Upload, Sparkles, Eye, Clock, Video, MoreVertical, Star, Trash2, Share2, Download, CheckCircle2, Loader2, AlertCircle, Filter, Grid, List, BarChart3, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

import { UploadVideoModal } from "./upload-modal"
import { AnalysisResultsModal } from "./analysis-results-modal"

const VIDEO_TYPES = ["All", "Match Footage", "Training", "Highlights", "AI Reel", "Skills"]

export default function AthleteHighlightsPage() {
  const [filter, setFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [reelGenerating, setReelGenerating] = useState(false)
  const [reelReady, setReelReady] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [rawVideos, setRawVideos] = useState<any[]>([])

  // Analysis modal state
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null)
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("")
  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null)

  const loadVideos = () => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => { if (data.videos) setRawVideos(data.videos) })
      .catch(console.error)
  }

  useEffect(() => { loadVideos() }, [])

  const VIDEOS = rawVideos.map(v => {
    // Get latest analysis from joined data
    const analyses = v.video_analyses || []
    const latestAnalysis = analyses.length > 0 ? analyses[analyses.length - 1] : null

    return {
      id: v.id,
      title: v.title,
      type: v.sport_tags?.[0] || "Training",
      sport: v.analysis_sport || "Football",
      duration: Math.floor((v.duration_secs || 0) / 60) + ":" + ((v.duration_secs || 0) % 60).toString().padStart(2, '0'),
      views: v.total_views || 0,
      scoutViews: v.scout_plays || 0,
      status: (v.status || "ready").toLowerCase(),
      featured: v.display_order > 0,
      isAiReel: v.is_ai_reel,
      uploadedAt: new Date(v.created_at).toLocaleDateString(),
      thumbnail: v.thumbnail_url,
      // Analysis data
      analysisStatus: latestAnalysis?.status?.toLowerCase() || null,
      analysisScore: latestAnalysis?.overall_score,
      analysisGrade: latestAnalysis?.grade,
      analysisId: latestAnalysis?.id,
      fullAnalysis: latestAnalysis,
    }
  })

  const filtered = filter === "All" ? VIDEOS : VIDEOS.filter(v => v.type === filter)

  const generateReel = async () => {
    setReelGenerating(true)
    await new Promise(r => setTimeout(r, 3000))
    setReelGenerating(false)
    setReelReady(true)
  }

  const handleViewAnalysis = async (video: any) => {
    if (video.fullAnalysis) {
      setSelectedAnalysis(video.fullAnalysis)
      setSelectedVideoTitle(video.title)
      setAnalysisModalOpen(true)
    } else {
      // Fetch analysis
      try {
        const res = await fetch(`/api/videos/${video.id}/analysis`)
        const data = await res.json()
        if (data.analysis) {
          setSelectedAnalysis(data.analysis)
          setSelectedVideoTitle(video.title)
          setAnalysisModalOpen(true)
        }
      } catch (err) {
        console.error("Failed to fetch analysis", err)
      }
    }
  }

  const handleRerunAnalysis = async (videoId: string) => {
    setAnalyzingVideoId(videoId)
    try {
      await fetch(`/api/videos/${videoId}/analyze`, { method: "POST" })
      loadVideos()
    } catch (err) {
      console.error("Analysis failed", err)
    } finally {
      setAnalyzingVideoId(null)
    }
  }

  const getAnalysisBadge = (video: any) => {
    if (analyzingVideoId === video.id || video.analysisStatus === "running" || video.analysisStatus === "pending") {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[rgba(0,212,255,0.15)] text-[var(--nx-cyan)] border border-[rgba(0,212,255,0.3)]">
          <Loader2 className="w-3 h-3 animate-spin" />Analyzing
        </span>
      )
    }
    if (video.analysisStatus === "completed") {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[rgba(0,245,116,0.15)] text-[var(--nx-green)] border border-[rgba(0,245,116,0.3)]">
          <BarChart3 className="w-3 h-3" />Score: {Math.round(video.analysisScore || 0)}
        </span>
      )
    }
    if (video.analysisStatus === "failed") {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[rgba(255,68,68,0.15)] text-[var(--nx-red)] border border-[rgba(255,68,68,0.3)]">
          <AlertCircle className="w-3 h-3" />Failed
        </span>
      )
    }
    return null
  }

  const stats = [
    { label: "Total Videos", value: VIDEOS.length, color: "var(--nx-green)" },
    { label: "Total Views", value: VIDEOS.reduce((sum, v) => sum + v.views, 0) || "0", color: "var(--nx-cyan)" },
    { label: "Analyzed", value: VIDEOS.filter(v => v.analysisStatus === "completed").length, color: "var(--nx-gold)" },
    { label: "AI Reels", value: VIDEOS.filter(v => v.isAiReel).length, color: "var(--nx-purple)" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">My Highlights</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">Your video portfolio — upload, analyze, and showcase</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            className="p-2 rounded-lg bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors"
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 transition-all text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload & Analyze
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: "var(--font-display)" }}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--nx-text3)] mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* AI Reel Banner */}
      <div className={cn(
        "relative p-5 rounded-2xl border overflow-hidden",
        reelReady
          ? "bg-[var(--nx-green-dim)] border-[var(--nx-green-border)]"
          : "border-[rgba(0,212,255,0.22)]"
      )} style={{ background: reelReady ? undefined : "linear-gradient(135deg, rgba(0,212,255,0.04), rgba(0,245,116,0.04))" }}>
        {!reelReady && !reelGenerating && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.08), transparent)",
            animation: "shimmer 2s infinite",
            backgroundSize: "200% 100%"
          }} />
        )}
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[var(--nx-cyan)]" />
              <span className="text-sm font-semibold text-[var(--nx-cyan)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", fontSize: "11px" }}>
                AI Highlight Reel Generator
              </span>
            </div>
            {reelReady ? (
              <p className="text-sm text-[var(--nx-text1)]">
                ✅ Your 30-second AI reel is ready! Scouts watch reels <strong className="text-[var(--nx-green)]">3x more</strong> than raw footage.
              </p>
            ) : reelGenerating ? (
              <div>
                <p className="text-sm text-[var(--nx-text1)] mb-2">Analysing {VIDEOS.length} videos... finding top moments</p>
                <div className="h-1.5 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--nx-cyan)] rounded-full animate-pulse" style={{ width: "65%" }} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--nx-text2)]">
                Our AI watches your videos and auto-cuts a 30-second career reel — no editing skills needed.
              </p>
            )}
          </div>
          {!reelGenerating && (
            <button
              onClick={reelReady ? undefined : generateReel}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shrink-0",
                reelReady
                  ? "bg-[var(--nx-green)] text-black hover:brightness-110"
                  : "bg-[var(--nx-cyan)] text-black hover:brightness-110"
              )}
            >
              {reelReady ? (
                <><Play className="w-4 h-4" />Play Reel</>
              ) : (
                <><Sparkles className="w-4 h-4" />Generate Now</>
              )}
            </button>
          )}
          {reelGenerating && (
            <div className="flex items-center gap-2 text-[var(--nx-cyan)]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">65%</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-[var(--nx-text3)] shrink-0" />
        {VIDEO_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all shrink-0",
              filter === type
                ? "bg-[var(--nx-green)] text-black font-semibold"
                : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <label
        className={cn(
          "flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
          dragging
            ? "border-[var(--nx-green)] bg-[var(--nx-green-dim)]"
            : "border-[var(--nx-border2)] hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)]"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
        onClick={() => setIsUploadOpen(true)}
      >
        <div className="w-12 h-12 rounded-xl bg-[var(--nx-bg3)] flex items-center justify-center">
          <Upload className="w-6 h-6 text-[var(--nx-text3)]" />
        </div>
        <div className="text-center">
          <p className="font-medium text-[var(--nx-text1)]">Drag videos here or click to upload & analyze</p>
          <p className="text-sm text-[var(--nx-text3)] mt-1">MP4, MOV, AVI · Up to 500MB · AI analysis included</p>
        </div>
      </label>

      {/* Video Grid / List */}
      <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {filtered.map(video => (
          <div
            key={video.id}
            className={cn(
              "group bg-[var(--nx-bg3)] border border-[var(--nx-border)] rounded-2xl overflow-hidden transition-all hover:border-[var(--nx-green-border)] hover:shadow-[var(--nx-shadow-hover)]",
              viewMode === "list" && "flex gap-4 p-4"
            )}
          >
            {/* Thumbnail */}
            <div className={cn(
              "relative bg-[var(--nx-bg4)]",
              viewMode === "grid" ? "aspect-video" : "w-32 h-20 rounded-xl overflow-hidden shrink-0"
            )}>
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--nx-bg5), var(--nx-bg4))" }}>
                <Video className="w-8 h-8 text-[var(--nx-text3)]" />
              </div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,13,8,0.9), transparent 50%)" }} />

              {/* Status overlays */}
              {video.status === "processing" && (
                <div className="absolute inset-0 bg-[var(--nx-bg)]/70 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-[var(--nx-amber)] animate-spin" />
                  <span className="text-xs text-[var(--nx-amber)]">Processing...</span>
                </div>
              )}
              {video.status === "ready" && (
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--nx-green)] flex items-center justify-center bg-black/40">
                    <Play className="w-4 h-4 text-[var(--nx-green)] ml-0.5" />
                  </div>
                </button>
              )}

              {/* Top badges */}
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                {video.isAiReel && (
                  <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-[rgba(0,212,255,0.8)] text-black" style={{ fontFamily: "var(--font-mono)" }}>AI REEL</span>
                )}
                {video.featured && (
                  <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-[rgba(0,245,116,0.8)] text-black" style={{ fontFamily: "var(--font-mono)" }}>FEATURED</span>
                )}
                {getAnalysisBadge(video)}
              </div>

              {/* Views + Duration */}
              <div className="absolute top-2 right-2">
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md bg-[var(--nx-bg3)]/90 text-[var(--nx-green)]">
                  <Eye className="w-3 h-3" />{video.views}
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="flex items-center gap-1 text-[10px] text-[var(--nx-text1)]">
                  <Clock className="w-3 h-3" />{video.duration}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className={cn(viewMode === "grid" ? "p-4" : "flex-1 min-w-0")}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--nx-text1)] text-sm truncate">{video.title}</h3>
                  <p className="text-xs text-[var(--nx-text3)] mt-0.5">{video.sport} · {video.type} · {video.uploadedAt}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === video.id ? null : video.id)}
                    className="p-1 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)] transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menuOpen === video.id && (
                    <div className="absolute right-0 top-8 w-44 bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-xl shadow-xl z-10 py-1">
                      {video.analysisStatus === "completed" && (
                        <button onClick={() => { setMenuOpen(null); handleViewAnalysis(video) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--nx-cyan)] hover:bg-[var(--nx-bg4)] transition-colors">
                          <BarChart3 className="w-3.5 h-3.5" />View Analysis
                        </button>
                      )}
                      <button onClick={() => { setMenuOpen(null); handleRerunAnalysis(video.id) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--nx-text2)] hover:bg-[var(--nx-bg4)] transition-colors">
                        <RotateCw className="w-3.5 h-3.5" />Re-Analyze
                      </button>
                      {[
                        { icon: Star, label: "Set Featured" },
                        { icon: Share2, label: "Share Link" },
                        { icon: Download, label: "Download" },
                        { icon: Trash2, label: "Delete", danger: true },
                      ].map(item => (
                        <button key={item.label} onClick={() => setMenuOpen(null)}
                          className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--nx-bg4)] transition-colors",
                            item.danger ? "text-[var(--nx-red)]" : "text-[var(--nx-text2)]")}>
                          <item.icon className="w-3.5 h-3.5" />{item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-[var(--nx-text3)]">
                  <Eye className="w-3 h-3" />{video.views} views
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--nx-gold)]">
                  🔍 {video.scoutViews} scouts
                </span>
                {video.analysisStatus === "completed" && (
                  <button
                    onClick={() => handleViewAnalysis(video)}
                    className="flex items-center gap-1 text-xs text-[var(--nx-cyan)] hover:text-[var(--nx-green)] transition-colors font-medium"
                  >
                    <BarChart3 className="w-3 h-3" />View Analysis
                  </button>
                )}
                {!video.analysisStatus && (
                  <button
                    onClick={() => handleRerunAnalysis(video.id)}
                    className="flex items-center gap-1 text-xs text-[var(--nx-text3)] hover:text-[var(--nx-cyan)] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />Analyze
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <UploadVideoModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSuccess={loadVideos} />
      <AnalysisResultsModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        analysis={selectedAnalysis}
        videoTitle={selectedVideoTitle}
      />
    </div>
  )
}
