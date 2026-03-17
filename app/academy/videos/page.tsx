"use client"
import { useState } from "react"
import { Sparkles, Video, Upload, Play, Eye, Loader2, CheckCircle2, Share2, Grid, List, X, Plus, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const ATHLETES_LIST = ["Rahul Kumar","Sneha Patel","Amit Singh","Priya Sharma","Karan Mehta","Vikram Singh","Arjun Sharma","Riya Desai"]
const VIDEOS = [
  { id: 1, athlete: "Arjun Sharma", sport: "Football", title: "Season Highlights 2024", type: "Highlights", duration: "4:12", views: 892, scoutViews: 34, isAiReel: false, status: "ready", featured: true, hasReel: true },
  { id: 2, athlete: "Sneha Patel", sport: "Football", title: "AI Sprint Compilation", type: "AI Reel", duration: "0:30", views: 1247, scoutViews: 67, isAiReel: true, status: "ready", featured: true, hasReel: true },
  { id: 3, athlete: "Amit Singh", sport: "Kabaddi", title: "PKL Selection Trials", type: "Match Footage", duration: "32:18", views: 456, scoutViews: 21, isAiReel: false, status: "ready", featured: false, hasReel: false },
  { id: 4, athlete: "Priya Sharma", sport: "Badminton", title: "AI Reel — State Finals", type: "AI Reel", duration: "0:30", views: 778, scoutViews: 28, isAiReel: true, status: "ready", featured: true, hasReel: true },
  { id: 5, athlete: "Karan Mehta", sport: "Football", title: "Goalkeeper Training", type: "Training", duration: "8:45", views: 123, scoutViews: 4, isAiReel: false, status: "processing", featured: false, hasReel: false },
  { id: 6, athlete: "Vikram Singh", sport: "Football", title: "Free-kick Compilation", type: "Highlights", duration: "6:22", views: 334, scoutViews: 12, isAiReel: false, status: "ready", featured: false, hasReel: false },
]

const sportColor: Record<string,string> = { Football: "var(--nx-green)", Athletics: "var(--nx-blue)", Kabaddi: "var(--nx-pink)", Badminton: "#A3E635" }

type BulkJob = { athlete: string; status: "queued" | "processing" | "complete" | "failed" }

export default function AcademyVideosPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [videos, setVideos] = useState(VIDEOS)
  const [selected, setSelected] = useState<number[]>([])
  const [bulkJobs, setBulkJobs] = useState<BulkJob[]>([])
  const [bulkRunning, setBulkRunning] = useState(false)
  const [bulkComplete, setBulkComplete] = useState(false)
  const [reelCredits] = useState({ used: 14, limit: 20 })
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [brandIntro, setBrandIntro] = useState("")
  const [brandOutro, setBrandOutro] = useState("")
  const [filterSport, setFilterSport] = useState("")
  const [filterScoutPlays, setFilterScoutPlays] = useState(false)

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])
  const toggleFeatured = (id: number) => setVideos(p => p.map(v => v.id === id ? { ...v, featured: !v.featured } : v))

  const withoutReels = ATHLETES_LIST.filter(a => !VIDEOS.find(v => v.athlete === a && v.isAiReel))

  const startBulkGeneration = async () => {
    if (selected.length === 0) return
    const athletes = selected.map(id => VIDEOS.find(v => v.id === id)?.athlete || "")
    const jobs: BulkJob[] = athletes.map(a => ({ athlete: a, status: "queued" as const }))
    setBulkJobs(jobs)
    setBulkRunning(true)
    setBulkComplete(false)

    for (let i = 0; i < jobs.length; i++) {
      setBulkJobs(p => p.map((j, idx) => idx === i ? { ...j, status: "processing" } : j))
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
      setBulkJobs(p => p.map((j, idx) => idx === i ? { ...j, status: Math.random() > 0.1 ? "complete" : "failed" } : j))
    }
    setBulkRunning(false)
    setBulkComplete(true)
    setSelected([])
  }

  const filtered = videos
    .filter(v => !filterSport || v.sport === filterSport)
    .filter(v => !filterScoutPlays || v.scoutViews > 10)

  const statusIcon = (s: BulkJob["status"]) => {
    if (s === "queued") return <Clock className="w-4 h-4 text-[var(--nx-text3)]" />
    if (s === "processing") return <Loader2 className="w-4 h-4 text-[var(--nx-cyan)] animate-spin" />
    if (s === "complete") return <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)]" />
    return <AlertCircle className="w-4 h-4 text-[var(--nx-red)]" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Video Library</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">All athlete videos · AI reel generation · scouting packs</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(v => v === "grid" ? "list" : "grid")} className="p-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]">
            {view === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowBrandModal(true)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
            🎬 Brand Settings
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />Upload<input type="file" accept="video/*" className="hidden" />
          </label>
        </div>
      </div>

      {/* Reel Credits + Bulk Generation */}
      <div className="p-5 rounded-2xl border" style={{ background: "rgba(0,212,255,0.04)", borderColor: "rgba(0,212,255,0.2)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[var(--nx-cyan)]" />
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Bulk AI Highlight Reel Generation</p>
            </div>
            <p className="text-xs text-[var(--nx-text3)]">Select athletes below to generate reels for multiple athletes simultaneously.</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold" style={{ color: "var(--nx-cyan)", fontFamily: "var(--font-display)" }}>{reelCredits.used} / {reelCredits.limit}</p>
            <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>CREDITS USED</p>
            <div className="w-24 h-1.5 rounded-full bg-[var(--nx-bg5)] overflow-hidden mt-1 ml-auto">
              <div className="h-full rounded-full transition-all" style={{ width: `${(reelCredits.used / reelCredits.limit) * 100}%`, background: reelCredits.used / reelCredits.limit > 0.8 ? "var(--nx-amber)" : "var(--nx-cyan)" }} />
            </div>
          </div>
        </div>

        {/* Athlete checklist */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Select athletes to generate reels:</p>
          <div className="flex flex-wrap gap-2">
            {videos.map(v => (
              <label key={v.id} className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer border transition-all" style={{ background: selected.includes(v.id) ? "rgba(0,212,255,0.06)" : "var(--nx-bg4)", borderColor: selected.includes(v.id) ? "rgba(0,212,255,0.3)" : "var(--nx-border)" }}>
                <input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleSelect(v.id)} className="accent-[var(--nx-cyan)] w-3.5 h-3.5" />
                <span className="text-xs font-semibold text-[var(--nx-text1)]">{v.athlete}</span>
                {v.hasReel ? <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>HAS REEL</span>
                  : <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(245,166,35,0.1)", color: "var(--nx-amber)", fontFamily: "var(--font-mono)" }}>NO REEL</span>}
              </label>
            ))}
            <button onClick={() => setSelected(videos.filter(v => !v.hasReel).map(v => v.id))} className="px-3 py-2 rounded-xl text-xs text-[var(--nx-text3)] border border-dashed border-[var(--nx-border)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
              Select all without reel
            </button>
          </div>
        </div>

        <button
          onClick={startBulkGeneration}
          disabled={selected.length === 0 || bulkRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:brightness-110"
          style={{ background: "var(--nx-cyan)", color: "black" }}>
          {bulkRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Reels for {selected.length > 0 ? `${selected.length} Athletes` : "Selected Athletes"}
        </button>

        {/* Bulk Progress */}
        {bulkJobs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Generation Progress</p>
            {bulkJobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                {statusIcon(job.status)}
                <span className="text-sm text-[var(--nx-text1)] flex-1">{job.athlete}</span>
                <span className="text-[10px] font-semibold capitalize" style={{ fontFamily: "var(--font-mono)", color: job.status === "complete" ? "var(--nx-green)" : job.status === "failed" ? "var(--nx-red)" : job.status === "processing" ? "var(--nx-cyan)" : "var(--nx-text3)" }}>
                  {job.status}
                </span>
                {job.status === "complete" && (
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-green)] transition-colors"><Play className="w-3 h-3" /></button>
                    <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-cyan)] transition-colors"><Share2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            ))}
            {bulkComplete && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)]" />
                <p className="text-xs text-[var(--nx-green)] font-semibold">{bulkJobs.filter(j => j.status === "complete").length} reels generated successfully</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select value={filterSport} onChange={e => setFilterSport(e.target.value)} className="text-xs rounded-xl py-2 px-3">
          <option value="">All Sports</option>
          {["Football","Cricket","Kabaddi","Athletics","Badminton"].map(s => <option key={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs text-[var(--nx-text2)] cursor-pointer">
          <input type="checkbox" checked={filterScoutPlays} onChange={e => setFilterScoutPlays(e.target.checked)} className="accent-[var(--nx-green)]" />
          Scout Plays &gt;10 only
        </label>
        <p className="text-xs text-[var(--nx-text3)] ml-auto">{filtered.length} videos</p>
      </div>

      {/* Video Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] overflow-hidden hover:border-[var(--nx-border2)] transition-all">
              <div className="aspect-video relative" style={{ background: `linear-gradient(135deg, ${sportColor[v.sport] || "var(--nx-green)"}11, var(--nx-bg4))` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${sportColor[v.sport] || "var(--nx-green)"}44` }}>
                    <Play className="w-5 h-5" style={{ color: sportColor[v.sport] || "var(--nx-green)" }} fill="currentColor" />
                  </div>
                </div>
                {v.isAiReel && <div className="absolute top-2 left-2"><span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.85)", color: "black", fontFamily: "var(--font-mono)" }}>AI REEL</span></div>}
                {v.status === "processing" && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="text-center"><Loader2 className="w-6 h-6 text-[var(--nx-amber)] animate-spin mx-auto mb-1" /><p className="text-[10px] text-[var(--nx-amber)]">Processing...</p></div></div>}
                <div className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: "rgba(0,0,0,0.7)", color: "var(--nx-text2)", fontFamily: "var(--font-mono)" }}>{v.duration}</div>
                <div className="absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "var(--nx-green)" }}><Eye className="w-2.5 h-2.5 inline mr-0.5" />{v.views}</div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--nx-text1)] truncate">{v.title}</p>
                    <p className="text-[10px] text-[var(--nx-text3)]">{v.athlete} · {v.sport} · {v.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--nx-text3)] mb-2">
                  <Eye className="w-3 h-3" />{v.views} total · <span style={{ color: "var(--nx-gold)" }}>🔍 {v.scoutViews} scout plays</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleFeatured(v.id)} className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-semibold transition-all", v.featured ? "bg-[var(--nx-gold)]/10 text-[var(--nx-gold)] border border-[var(--nx-gold)]/25" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>
                    {v.featured ? "★ Featured" : "Feature"}
                  </button>
                  <button className="p-1.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-cyan)] transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Upload placeholder */}
          <label className="rounded-2xl border-2 border-dashed border-[var(--nx-border)] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)] transition-all min-h-[200px]">
            <Plus className="w-8 h-8 text-[var(--nx-text3)] mb-2" />
            <p className="text-sm font-semibold text-[var(--nx-text2)]">Upload Video</p>
            <p className="text-xs text-[var(--nx-text3)] mt-1">MP4, MOV · up to 500MB</p>
            <input type="file" accept="video/*" className="hidden" />
          </label>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-[var(--nx-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--nx-bg4)] border-b border-[var(--nx-border)]">
                {["Athlete","Title","Sport","Views","Scout Plays","Featured","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} className={cn("border-b border-[var(--nx-border)] hover:bg-[var(--nx-bg4)]/50 transition-colors", i % 2 === 0 ? "bg-[var(--nx-bg3)]" : "bg-[var(--nx-bg2)]")}>
                  <td className="px-4 py-3 text-xs font-semibold text-[var(--nx-text1)]">{v.athlete}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--nx-text1)]">{v.title}</span>
                      {v.isAiReel && <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.12)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>AI</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs" style={{ color: sportColor[v.sport] || "var(--nx-green)" }}>{v.sport}</span></td>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: "var(--nx-text2)", fontFamily: "var(--font-display)" }}>{v.views}</td>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>{v.scoutViews}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(v.id)} className={cn("text-[10px] px-2 py-1 rounded-lg font-semibold transition-all", v.featured ? "text-[var(--nx-gold)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-gold)]")}>
                      {v.featured ? "★ Yes" : "☆ No"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-cyan)] transition-colors"><Share2 className="w-3 h-3" /></button>
                      <button className="p-1.5 rounded-lg text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-colors"><X className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Brand Settings Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBrandModal(false)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-[var(--nx-text1)]">Branded Reel Templates</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">Prepended/appended to all AI-generated reels</p>
              </div>
              <button onClick={() => setShowBrandModal(false)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Intro Card (3-second MP4 or image)</label>
                <p className="text-[10px] text-[var(--nx-text3)] mb-2">Typically shows: academy logo, academy name, tagline, contact details</p>
                {brandIntro ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-green-border)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)]" />
                    <span className="text-xs text-[var(--nx-text1)] flex-1 truncate">{brandIntro}</span>
                    <button onClick={() => setBrandIntro("")} className="text-[var(--nx-text3)] hover:text-[var(--nx-red)]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-[var(--nx-border)] cursor-pointer hover:border-[var(--nx-green-border)] transition-all">
                    <Upload className="w-4 h-4 text-[var(--nx-text3)]" />
                    <span className="text-xs text-[var(--nx-text2)]">Upload intro card</span>
                    <input type="file" accept="video/*,image/*" className="hidden" onChange={e => setBrandIntro(e.target.files?.[0]?.name || "")} />
                  </label>
                )}
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Outro Card</label>
                <p className="text-[10px] text-[var(--nx-text3)] mb-2">Typically shows: academy NEXUS profile URL, recruitment CTA</p>
                {brandOutro ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-green-border)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)]" />
                    <span className="text-xs text-[var(--nx-text1)] flex-1 truncate">{brandOutro}</span>
                    <button onClick={() => setBrandOutro("")} className="text-[var(--nx-text3)] hover:text-[var(--nx-red)]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-[var(--nx-border)] cursor-pointer hover:border-[var(--nx-green-border)] transition-all">
                    <Upload className="w-4 h-4 text-[var(--nx-text3)]" />
                    <span className="text-xs text-[var(--nx-text2)]">Upload outro card</span>
                    <input type="file" accept="video/*,image/*" className="hidden" onChange={e => setBrandOutro(e.target.files?.[0]?.name || "")} />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-[var(--nx-text3)] p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                These branded cards are automatically added to every AI reel generated for your enrolled athletes. Individual athletes can opt out per video.
              </p>
              <button onClick={() => setShowBrandModal(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all" style={{ background: "var(--nx-green)", color: "black" }}>
                Save Brand Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
