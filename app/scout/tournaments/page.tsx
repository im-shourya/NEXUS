"use client"
import { useState } from "react"
import { BookmarkPlus, Bookmark, Play, MapPin, Calendar, Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_TOURNAMENTS = [
  { id: 1, title: "ISL U-19 Open Trials 2026", sport: "Football", city: "Mumbai", state: "Maharashtra", startDate: "Jan 18", endDate: "Jan 20", status: "OPEN", tier: "ISL_OFFICIAL", ageGroup: "U-19", prize: "ISL Development Contract", closingIn: 3, bookmarked: true, hasShortlisted: ["Arjun Sharma", "Karan Mehta"] },
  { id: 2, title: "Khelo India Football League", sport: "Football", city: "Nagpur", state: "Maharashtra", startDate: "Feb 3", endDate: "Feb 7", status: "OPEN", tier: "KHELO_INDIA", ageGroup: "U-17", prize: "₹50,000 + Selection", closingIn: 23, bookmarked: true, hasShortlisted: ["Vikram Singh"] },
  { id: 3, title: "Maharashtra State Cup", sport: "Football", city: "Pune", state: "Maharashtra", startDate: "Feb 15", endDate: "Feb 17", status: "OPEN", tier: "STATE", ageGroup: "Open", prize: "State Championship", closingIn: 35, bookmarked: false, hasShortlisted: [] },
  { id: 4, title: "Bengaluru FC Youth Trials", sport: "Football", city: "Bengaluru", state: "Karnataka", startDate: "Jan 22", endDate: "Jan 22", status: "LIVE", tier: "ISL_OFFICIAL", ageGroup: "U-17", prize: "ISL Academy Squad", closingIn: 0, bookmarked: true, hasShortlisted: ["Sneha Patel"] },
]

const LIVE_MATCH = {
  tournament: "Bengaluru FC Youth Trials",
  teamA: "Nagpur FC Youth", teamB: "City FC Academy",
  scoreA: 2, scoreB: 1, minute: 67,
  events: [
    { time: "63'", type: "GOAL", player: "Arjun Sharma", team: "A", detail: "Free kick", isShortlisted: true },
    { time: "58'", type: "GOAL", player: "Dev Sharma", team: "B", detail: "Penalty", isShortlisted: false },
    { time: "45'", type: "HALF_TIME", player: "", team: "A", detail: "", isShortlisted: false },
    { time: "12'", type: "GOAL", player: "Arjun Sharma", team: "A", detail: "Open play", isShortlisted: true },
  ],
  lineup_a: [
    { name: "Arjun Sharma", position: "ST", isShortlisted: true, score: 74 },
    { name: "Vikram Singh", position: "CM", isShortlisted: true, score: 71 },
    { name: "Karan Mehta", position: "LW", isShortlisted: false, score: 68 },
    { name: "Ravi Kumar", position: "LB", isShortlisted: false, score: 63 },
  ]
}

const TIER_BADGES: Record<string, { label: string; color: string }> = {
  ISL_OFFICIAL: { label: "ISL", color: "var(--nx-purple)" },
  KHELO_INDIA: { label: "Khelo India", color: "var(--nx-gold)" },
  STATE: { label: "State", color: "var(--nx-teal)" },
}

export default function ScoutTournamentsPage() {
  const [activeTab, setActiveTab] = useState("discover")
  const [bookmarked, setBookmarked] = useState<number[]>([1, 2, 4])
  const [liveFlash, setLiveFlash] = useState<string | null>(null)

  const scoutedTournaments = ALL_TOURNAMENTS.filter(t => bookmarked.includes(t.id))
  const liveOnes = scoutedTournaments.filter(t => t.status === "LIVE")

  const toggleBookmark = (id: number) => {
    setBookmarked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Tournaments</h1><p className="text-sm text-[var(--nx-text3)] mt-0.5">Scout tournaments and get live milestone alerts</p></div>
      </div>

      <div className="flex gap-1 border-b border-[var(--nx-border)]">
        {["discover", "scouted_events", "live_view"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn("px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all capitalize flex items-center gap-2", activeTab === t ? "bg-[rgba(155,93,255,0.08)] text-[var(--nx-purple)] border-b-2 border-[var(--nx-purple)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>
            {t === "live_view" && liveOnes.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--nx-orange)] animate-pulse" />}
            {t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
            {t === "scouted_events" && <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>{bookmarked.length}</span>}
          </button>
        ))}
      </div>

      {/* DISCOVER */}
      {activeTab === "discover" && (
        <div className="space-y-3">
          {ALL_TOURNAMENTS.map(t => {
            const tier = TIER_BADGES[t.tier]
            const isBookmarked = bookmarked.includes(t.id)
            return (
              <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "rgba(0,245,116,0.08)", border: "1px solid var(--nx-border)" }}>
                  {t.status === "LIVE" ? "🔴" : "⚽"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-[var(--nx-text1)]">{t.title}</p>
                    {tier && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${tier.color}15`, color: tier.color, fontFamily: "var(--font-mono)" }}>{tier.label}</span>}
                    {t.status === "LIVE" && <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-bold animate-pulse" style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", border: "1px solid var(--nx-orange-border)", fontFamily: "var(--font-mono)" }}>● LIVE</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 text-[10px] text-[var(--nx-text3)] mt-0.5">
                    <span><MapPin className="w-2.5 h-2.5 inline" /> {t.city}</span>
                    <span><Calendar className="w-2.5 h-2.5 inline" /> {t.startDate}–{t.endDate}</span>
                    <span>{t.ageGroup}</span>
                  </div>
                  {t.hasShortlisted.length > 0 && (
                    <p className="text-[10px] text-[var(--nx-gold)] mt-0.5">
                      <Star className="w-2.5 h-2.5 inline mr-0.5" fill="currentColor" />Your shortlisted: {t.hasShortlisted.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {t.closingIn > 0 && t.closingIn <= 7 && <span className="text-[10px] text-[var(--nx-red)]">{t.closingIn}d left</span>}
                  <button onClick={() => toggleBookmark(t.id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all", isBookmarked ? "bg-[var(--nx-purple)] text-white" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]")}>
                    {isBookmarked ? <Bookmark className="w-3.5 h-3.5" fill="currentColor" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    {isBookmarked ? "Scouting" : "Scout This"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* SCOUTED EVENTS */}
      {activeTab === "scouted_events" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(155,93,255,0.04)", border: "1px solid rgba(155,93,255,0.2)" }}>
            <p className="text-xs text-[var(--nx-text2)]">
              You receive automatic push notifications when your shortlisted athletes score goals, take wickets, or achieve milestones in these tournaments.
            </p>
          </div>
          {scoutedTournaments.length === 0 ? (
            <div className="text-center py-12 text-[var(--nx-text3)]">
              <BookmarkPlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No scouted events yet</p>
              <p className="text-sm mt-1">Click "Scout This" on tournaments to subscribe to live alerts</p>
            </div>
          ) : (
            scoutedTournaments.map(t => {
              const tier = TIER_BADGES[t.tier]
              return (
                <div key={t.id} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-[var(--nx-text1)]">{t.title}</p>
                        {t.status === "LIVE" && <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", fontFamily: "var(--font-mono)" }}>● LIVE</span>}
                        {tier && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${tier.color}15`, color: tier.color, fontFamily: "var(--font-mono)" }}>{tier.label}</span>}
                      </div>
                      <p className="text-xs text-[var(--nx-text3)]">{t.city} · {t.startDate}–{t.endDate}</p>
                      {t.hasShortlisted.length > 0 && <p className="text-[10px] text-[var(--nx-gold)] mt-1"><Star className="w-2.5 h-2.5 inline mr-0.5" fill="currentColor" />Watching: {t.hasShortlisted.join(", ")}</p>}
                    </div>
                    <div className="flex gap-2">
                      {t.status === "LIVE" && <button onClick={() => setActiveTab("live_view")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse" style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", border: "1px solid var(--nx-orange-border)" }}><Play className="w-3 h-3" fill="currentColor" />View Live</button>}
                      <button onClick={() => toggleBookmark(t.id)} className="p-1.5 rounded-xl border border-[var(--nx-border)] text-[var(--nx-red)] hover:bg-[var(--nx-red)]/10 transition-colors" title="Remove">
                        <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* LIVE VIEW */}
      {activeTab === "live_view" && (
        <div className="space-y-4">
          {liveOnes.length === 0 ? (
            <div className="text-center py-12 text-[var(--nx-text3)]">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No scouted tournaments are live right now</p>
            </div>
          ) : (
            <>
              {/* Scoreboard */}
              <div className="p-6 rounded-2xl border-2" style={{ background: "linear-gradient(135deg, var(--nx-bg3), var(--nx-bg4))", borderColor: "var(--nx-orange-border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-[var(--nx-orange)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>● LIVE · {LIVE_MATCH.minute}'</span>
                  <span className="text-[10px] text-[var(--nx-text3)]">{LIVE_MATCH.tournament}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1"><p className="font-bold text-sm text-[var(--nx-text1)]">{LIVE_MATCH.teamA}</p><p className="text-6xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>{LIVE_MATCH.scoreA}</p></div>
                  <div className="text-center px-6"><p className="text-2xl text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-display)" }}>—</p></div>
                  <div className="text-center flex-1"><p className="font-bold text-sm text-[var(--nx-text1)]">{LIVE_MATCH.teamB}</p><p className="text-6xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>{LIVE_MATCH.scoreB}</p></div>
                </div>
              </div>

              {/* Athlete Spotlight */}
              <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <p className="font-semibold text-sm text-[var(--nx-text1)] mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[var(--nx-gold)]" fill="currentColor" />Athlete Spotlight — Your Shortlisted Players
                </p>
                <div className="space-y-2">
                  {LIVE_MATCH.lineup_a.filter(p => p.isShortlisted).map((player, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,184,0,0.05)", border: "1px solid rgba(255,184,0,0.2)" }}>
                      <Star className="w-3.5 h-3.5 text-[var(--nx-gold)] shrink-0" fill="currentColor" />
                      <span className="font-semibold text-sm text-[var(--nx-text1)]">{player.name}</span>
                      <span className="text-xs text-[var(--nx-text3)]">{player.position}</span>
                      <span className="ml-auto font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--nx-cyan)" }}>{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Log */}
              <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <p className="font-semibold text-sm text-[var(--nx-text1)] mb-3">Match Events</p>
                <div className="space-y-2">
                  {LIVE_MATCH.events.map((ev, i) => (
                    <div key={i} className={cn("flex items-center gap-3 p-2.5 rounded-xl", ev.isShortlisted ? "border" : "")} style={ev.isShortlisted ? { background: "rgba(0,245,116,0.04)", borderColor: "var(--nx-green-border)" } : {}}>
                      <span className="text-sm font-bold w-10 shrink-0" style={{ fontFamily: "var(--font-display)", color: "var(--nx-text3)" }}>{ev.time}</span>
                      <span className="text-base">{ev.type === "GOAL" ? "⚽" : ev.type === "HALF_TIME" ? "🕐" : "•"}</span>
                      <span className="flex-1 text-xs text-[var(--nx-text1)]">{ev.player || ev.type} {ev.detail && `(${ev.detail})`}</span>
                      {ev.isShortlisted && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>★ SHORTLISTED</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
