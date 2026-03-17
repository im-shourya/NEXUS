"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Zap, Trophy, Clock, ArrowLeft, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type EventType = { id: number; time: number; type: string; player: string; team: "a" | "b"; detail?: string }

const ROSTER_A = ["Rahul Kumar", "Amit Singh", "Priya Sharma", "Karan Mehta", "Vijay Nair", "Sneha Patel", "Deepika Rao", "Ravi Kumar", "Anjali Singh", "Mohan Das", "Suresh Nair"]
const ROSTER_B = ["Dev Sharma", "Raj Patel", "Ananya Singh", "Vikram Roy", "Pooja Kumar", "Rahul Das", "Meera Nair", "Arun Singh", "Priya Das", "Kishore Rao", "Sunita Kumar"]

export default function LiveScoringPage() {
  const params = useParams()
  const router = useRouter()
  const [scoreA, setScoreA] = useState(2)
  const [scoreB, setScoreB] = useState(1)
  const [minute, setMinute] = useState(67)
  const [half, setHalf] = useState(2)
  const [isLive, setIsLive] = useState(true)
  const [events, setEvents] = useState<EventType[]>([
    { id: 1, time: 12, type: "GOAL", player: "Rahul Kumar", team: "a", detail: "Open play" },
    { id: 2, time: 34, type: "YELLOW", player: "Dev Sharma", team: "b" },
    { id: 3, time: 45, type: "HALF_TIME", player: "", team: "a" },
    { id: 4, time: 58, type: "GOAL", player: "Dev Sharma", team: "b", detail: "Penalty" },
    { id: 5, time: 63, type: "GOAL", player: "Karan Mehta", team: "a", detail: "Free kick" },
  ])
  const [showModal, setShowModal] = useState<string | null>(null)
  const [modalPlayer, setModalPlayer] = useState("")
  const [modalTeam, setModalTeam] = useState<"a" | "b">("a")
  const [modalDetail, setModalDetail] = useState("")
  const [scoutAlerts, setScoutAlerts] = useState(0)

  const addEvent = (type: string) => {
    const newEvent: EventType = {
      id: Date.now(), time: minute, type, player: modalPlayer,
      team: modalTeam, detail: modalDetail
    }
    setEvents(prev => [...prev, newEvent])
    if (type === "GOAL") {
      if (modalTeam === "a") setScoreA(s => s + 1)
      else setScoreB(s => s + 1)
      setScoutAlerts(s => s + 1)
    }
    setShowModal(null)
    setModalPlayer("")
    setModalDetail("")
  }

  const EVENT_ICONS: Record<string, string> = {
    GOAL: "⚽", YELLOW: "🟨", RED: "🟥", SUBSTITUTION: "🔄",
    HALF_TIME: "🕐", FULL_TIME: "🏁", PENALTY: "🎯"
  }
  const EVENT_COLORS: Record<string, string> = {
    GOAL: "var(--nx-green)", YELLOW: "var(--nx-amber)", RED: "var(--nx-red)",
    SUBSTITUTION: "var(--nx-cyan)", HALF_TIME: "var(--nx-text3)", FULL_TIME: "var(--nx-gold)"
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--nx-bg)" }}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)]">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-[var(--nx-text1)] text-lg">Live Scoring</h1>
            <p className="text-xs text-[var(--nx-text3)]">Nagpur FC Youth Cup · U-17 Football</p>
          </div>
          <div className="flex items-center gap-2">
            {scoutAlerts > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(0,245,116,0.1)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>
                <Zap className="w-3 h-3" />{scoutAlerts} Scout Alerts Sent
              </span>
            )}
            <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold", isLive ? "bg-[var(--nx-orange-dim)] text-[var(--nx-orange)] border border-[var(--nx-orange-border)]" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
              <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-[var(--nx-orange)] animate-pulse" : "bg-[var(--nx-text3)]")} />
              {isLive ? "LIVE" : "ENDED"}
            </span>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="p-6 rounded-2xl border" style={{ background: "linear-gradient(135deg, var(--nx-bg3), var(--nx-bg4))", borderColor: "var(--nx-border2)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Half {half} · {minute}'
            </span>
            <span className="text-[10px] text-[var(--nx-orange)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
              ● LIVE
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="font-bold text-[var(--nx-text1)] text-sm mb-1">Nagpur FC Youth</p>
              <p className="text-7xl font-bold text-[var(--nx-text1)]" style={{ fontFamily: "var(--font-display)" }}>{scoreA}</p>
              <p className="text-xs text-[var(--nx-text3)] mt-1">HOME</p>
            </div>
            <div className="text-center px-6">
              <p className="text-2xl text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-display)" }}>—</p>
              <p className="text-xs text-[var(--nx-text3)] mt-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>VS</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-bold text-[var(--nx-text1)] text-sm mb-1">City FC Academy</p>
              <p className="text-7xl font-bold text-[var(--nx-text1)]" style={{ fontFamily: "var(--font-display)" }}>{scoreB}</p>
              <p className="text-xs text-[var(--nx-text3)] mt-1">AWAY</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { type: "GOAL", label: "⚽ Goal", color: "var(--nx-green)" },
            { type: "YELLOW", label: "🟨 Yellow Card", color: "var(--nx-amber)" },
            { type: "RED", label: "🟥 Red Card", color: "var(--nx-red)" },
            { type: "SUBSTITUTION", label: "🔄 Sub", color: "var(--nx-cyan)" },
          ].map(btn => (
            <button key={btn.type} onClick={() => { setShowModal(btn.type); setModalPlayer("") }}
              className="py-3 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
              style={{ background: `${btn.color}15`, color: btn.color, border: `1px solid ${btn.color}30` }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Minute Control */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <Clock className="w-4 h-4 text-[var(--nx-text3)]" />
          <span className="text-sm text-[var(--nx-text2)]">Current Minute</span>
          <input type="number" value={minute} onChange={e => setMinute(+e.target.value)}
            className="w-20 rounded-xl text-sm py-1.5 text-center" min={0} max={120} />
          <button onClick={() => setMinute(m => m + 1)} className="px-3 py-1.5 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">+1</button>
          <button onClick={() => { setShowModal("HALF_TIME"); addEvent("HALF_TIME") }}
            className="ml-auto px-4 py-1.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-xs text-[var(--nx-text2)] hover:border-[var(--nx-border2)]">
            Half Time
          </button>
          <button onClick={() => { setIsLive(false); addEvent("FULL_TIME") }}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)", border: "1px solid rgba(255,184,0,0.25)" }}>
            Full Time
          </button>
        </div>

        {/* Event Log */}
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <h3 className="font-semibold text-[var(--nx-text1)] mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--nx-gold)]" />Match Events
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...events].reverse().map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: `${EVENT_COLORS[event.type]}08`, border: `1px solid ${EVENT_COLORS[event.type]}20` }}>
                <span className="text-base">{EVENT_ICONS[event.type] || "•"}</span>
                <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: EVENT_COLORS[event.type], minWidth: "32px" }}>{event.time}'</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--nx-text1)]">{event.player || event.type}</span>
                  {event.detail && <span className="text-xs text-[var(--nx-text3)] ml-2">({event.detail})</span>}
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: event.team === "a" ? "var(--nx-green-dim)" : "rgba(0,212,255,0.1)", color: event.team === "a" ? "var(--nx-green)" : "var(--nx-cyan)" }}>
                  {event.team === "a" ? "HOME" : "AWAY"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scout Alert Banner */}
        <div className="p-4 rounded-2xl" style={{ background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)" }}>
          <p className="text-sm text-[var(--nx-text1)] flex items-center gap-2">
            <Star className="w-4 h-4 text-[var(--nx-green)]" />
            <strong className="text-[var(--nx-green)]">5 scouts</strong> are watching this tournament live. Goals automatically notify all subscribed scouts.
          </p>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && showModal !== "HALF_TIME" && showModal !== "FULL_TIME" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-2xl p-6 w-full max-w-sm shadow-[var(--nx-shadow-float)]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[var(--nx-text1)] text-lg mb-5">{EVENT_ICONS[showModal]} Record {showModal}</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Team</label>
                <div className="flex gap-2">
                  {[["a", "Nagpur FC (Home)"], ["b", "City FC (Away)"]].map(([val, label]) => (
                    <button key={val} onClick={() => setModalTeam(val as "a" | "b")}
                      className={cn("flex-1 py-2 rounded-xl text-sm transition-all", modalTeam === val ? "bg-[var(--nx-green)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Player</label>
                <select value={modalPlayer} onChange={e => setModalPlayer(e.target.value)} className="rounded-xl text-sm">
                  <option value="">Select player...</option>
                  {(modalTeam === "a" ? ROSTER_A : ROSTER_B).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {showModal === "GOAL" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Goal Type</label>
                  <select value={modalDetail} onChange={e => setModalDetail(e.target.value)} className="rounded-xl text-sm">
                    <option value="Open play">Open play</option>
                    <option value="Header">Header</option>
                    <option value="Penalty">Penalty</option>
                    <option value="Free kick">Free kick</option>
                    <option value="Own goal">Own goal</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(null)} className="flex-1 py-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-sm text-[var(--nx-text2)]">Cancel</button>
                <button onClick={() => addEvent(showModal)} disabled={!modalPlayer}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-sm disabled:opacity-50">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
