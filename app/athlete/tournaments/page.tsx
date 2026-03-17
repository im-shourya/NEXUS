"use client"
import { useState } from "react"
import { MapPin, Calendar, Trophy, Users, Filter, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const SPORTS = ["All Sports", "Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey", "Wrestling"]

const SPORT_COLORS: Record<string, string> = {
  Football: "var(--nx-green)", Cricket: "var(--nx-teal)", Kabaddi: "var(--nx-pink)",
  Athletics: "var(--nx-blue)", Badminton: "#A3E635", Hockey: "var(--nx-purple)", Wrestling: "var(--nx-red)"
}

const TOURNAMENTS = [
  { id: 1, title: "ISL U-19 Open Trials 2026", sport: "Football", format: "11-a-side", city: "Mumbai", state: "Maharashtra", startDate: "Jan 18", endDate: "Jan 20", regDeadline: "Jan 14", prize: "ISL Development Contract", tier: "ISL_OFFICIAL", ageGroup: "U-19", entryFee: 0, maxParticipants: 64, currentReg: 58, status: "OPEN", scoutAlerts: true, featured: true, closingIn: 3 },
  { id: 2, title: "Khelo India Football League", sport: "Football", format: "11-a-side", city: "Nagpur", state: "Maharashtra", startDate: "Feb 3", endDate: "Feb 7", regDeadline: "Jan 28", prize: "₹50,000 + Khelo India Selection", tier: "KHELO_INDIA", ageGroup: "U-17", entryFee: 500, maxParticipants: 32, currentReg: 18, status: "OPEN", scoutAlerts: true, featured: false, closingIn: 17 },
  { id: 3, title: "Maharashtra State Cricket U-19", sport: "Cricket", format: "T20", city: "Pune", state: "Maharashtra", startDate: "Jan 25", endDate: "Jan 27", regDeadline: "Jan 15", prize: "State Team Selection", tier: "STATE", ageGroup: "U-19", entryFee: 0, maxParticipants: 48, currentReg: 48, status: "CLOSING", scoutAlerts: false, featured: false, closingIn: 1 },
  { id: 4, title: "PKL Talent Hunt Camp 2026", sport: "Kabaddi", format: "PKL Format", city: "Patna", state: "Bihar", startDate: "Feb 10", endDate: "Feb 12", regDeadline: "Feb 5", prize: "PKL Development Squad Opportunity", tier: "ISL_OFFICIAL", ageGroup: "Open Age", entryFee: 0, maxParticipants: 80, currentReg: 34, status: "OPEN", scoutAlerts: true, featured: true, closingIn: 25 },
  { id: 5, title: "SAI National Junior Athletics Meet", sport: "Athletics", format: "Track & Field", city: "Patiala", state: "Punjab", startDate: "Mar 1", endDate: "Mar 3", regDeadline: "Feb 22", prize: "National Camp Selection", tier: "KHELO_INDIA", ageGroup: "U-21", entryFee: 0, maxParticipants: 200, currentReg: 89, status: "OPEN", scoutAlerts: true, featured: false, closingIn: 42 },
  { id: 6, title: "Nagpur Open Football Tournament", sport: "Football", format: "7-a-side", city: "Nagpur", state: "Maharashtra", startDate: "Jan 28", endDate: "Jan 29", regDeadline: "Jan 20", prize: "₹25,000", tier: "DISTRICT", ageGroup: "Open Age", entryFee: 1500, maxParticipants: 16, currentReg: 12, status: "OPEN", scoutAlerts: false, featured: false, closingIn: 9 },
  { id: 7, title: "Delhi Football Academy Trials", sport: "Football", format: "Individual Assessment", city: "Delhi", state: "Delhi", startDate: "Feb 2", endDate: "Feb 2", regDeadline: "Jan 28", prize: "Academy Scholarship", tier: "STATE", ageGroup: "U-17", entryFee: 0, maxParticipants: 50, currentReg: 50, status: "CLOSED", scoutAlerts: false, featured: false, closingIn: 0 },
  { id: 8, title: "Bengaluru FC Youth Trials", sport: "Football", format: "Group Trials", city: "Bengaluru", state: "Karnataka", startDate: "Jan 22", endDate: "Jan 22", regDeadline: "Tomorrow", prize: "ISL Academy Development Squad", tier: "ISL_OFFICIAL", ageGroup: "U-17", entryFee: 0, maxParticipants: 100, currentReg: 94, status: "CLOSING", scoutAlerts: true, featured: true, closingIn: 1 },
]

const TIER_BADGES: Record<string, { label: string; color: string }> = {
  ISL_OFFICIAL: { label: "ISL", color: "var(--nx-purple)" },
  KHELO_INDIA: { label: "Khelo India", color: "var(--nx-gold)" },
  STATE: { label: "State", color: "var(--nx-cyan)" },
  DISTRICT: { label: "District", color: "var(--nx-text2)" },
}

export default function AthleteTournamentsPage() {
  const [activeSport, setActiveSport] = useState("All Sports")
  const [registered, setRegistered] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filtered = TOURNAMENTS.filter(t => activeSport === "All Sports" || t.sport === activeSport)
  const featured = filtered.filter(t => t.featured)
  const rest = filtered.filter(t => !t.featured)

  const register = (id: number) => setRegistered(p => [...p, id])

  const statusChip = (t: typeof TOURNAMENTS[0]) => {
    if (registered.includes(t.id)) return <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}><CheckCircle2 className="w-3 h-3" />Registered</span>
    if (t.status === "CLOSED") return <span className="px-2.5 py-1 rounded-xl text-xs text-[var(--nx-text3)] bg-[var(--nx-bg5)] border border-[var(--nx-border)]">Closed</span>
    if (t.status === "CLOSING" && t.closingIn <= 2) return <span className="px-2.5 py-1 rounded-xl text-xs font-bold animate-pulse" style={{ background: "rgba(255,59,48,0.1)", color: "var(--nx-red)", border: "1px solid rgba(255,59,48,0.3)" }}>{t.regDeadline === "Tomorrow" ? "Closes Tomorrow" : `Closes in ${t.closingIn}d`}</span>
    if (t.closingIn <= 7) return <span className="px-2.5 py-1 rounded-xl text-xs font-semibold" style={{ background: "rgba(245,166,35,0.1)", color: "var(--nx-amber)", border: "1px solid rgba(245,166,35,0.3)" }}>{t.closingIn}d left</span>
    return null
  }

  const registerBtn = (t: typeof TOURNAMENTS[0]) => {
    if (registered.includes(t.id)) return null
    if (t.status === "CLOSED") return null
    if (t.currentReg >= t.maxParticipants && !registered.includes(t.id)) return (
      <button className="px-3 py-1.5 rounded-xl text-xs text-[var(--nx-text3)] bg-[var(--nx-bg5)] border border-[var(--nx-border)] cursor-not-allowed">Full</button>
    )
    return (
      <button onClick={() => register(t.id)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: SPORT_COLORS[t.sport] || "var(--nx-green)", color: "#000" }}>
        {t.entryFee > 0 ? `Register · ₹${t.entryFee}` : "Register Free"}
      </button>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Tournaments & Trials</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Register for competitions. Scouts get auto-notified when you perform.</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
          <Filter className="w-4 h-4" />Filters
        </button>
      </div>

      {/* Sport Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPORTS.map(sport => (
          <button key={sport} onClick={() => setActiveSport(sport)}
            className={cn("px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all shrink-0",
              activeSport === sport ? "bg-[var(--nx-green)] text-black font-semibold" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
            {sport}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Featured</h2>
          {featured.map(t => {
            const tier = TIER_BADGES[t.tier]
            const sportColor = SPORT_COLORS[t.sport] || "var(--nx-green)"
            return (
              <div key={t.id} className="p-5 rounded-2xl border-2 relative overflow-hidden" style={{ background: `${sportColor}04`, borderColor: `${sportColor}40` }}>
                <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: sportColor }} />
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${sportColor}10`, border: `1px solid ${sportColor}25` }}>
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-[var(--nx-text1)]">{t.title}</h3>
                          {tier && <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${tier.color}15`, color: tier.color, fontFamily: "var(--font-mono)" }}>{tier.label}</span>}
                          {statusChip(t)}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--nx-text2)]">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.city}, {t.state}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.startDate}–{t.endDate}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{t.ageGroup}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded text-[10px] text-[var(--nx-text3)] bg-[var(--nx-bg5)]">{t.sport}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] text-[var(--nx-text3)] bg-[var(--nx-bg5)]">{t.format}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ color: "var(--nx-gold)", background: "rgba(255,184,0,0.08)" }}>🏆 {t.prize}</span>
                        </div>
                      </div>
                      {registerBtn(t)}
                    </div>
                    {t.scoutAlerts && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--nx-green)]">
                        <Zap className="w-3 h-3" />
                        <span>Scout Alert enabled — registered athletes are auto-notified to active scouts</span>
                      </div>
                    )}
                    {/* Capacity bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(t.currentReg / t.maxParticipants) * 100}%`, background: t.currentReg / t.maxParticipants > 0.9 ? "var(--nx-red)" : sportColor }} />
                      </div>
                      <span className="text-[10px] text-[var(--nx-text3)] shrink-0">{t.currentReg}/{t.maxParticipants} registered</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* All Tournaments */}
      <div className="space-y-3">
        {rest.map(t => {
          const tier = TIER_BADGES[t.tier]
          const sportColor = SPORT_COLORS[t.sport] || "var(--nx-green)"
          return (
            <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] transition-all hover:border-[var(--nx-border2)] hover:shadow-[var(--nx-shadow-card)]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${sportColor}08`, border: `1px solid ${sportColor}20` }}>
                {t.sport === "Football" ? "⚽" : t.sport === "Cricket" ? "🏏" : t.sport === "Kabaddi" ? "🤼" : t.sport === "Athletics" ? "🏃" : t.sport === "Badminton" ? "🏸" : "🏆"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">{t.title}</p>
                  {tier && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${tier.color}15`, color: tier.color, fontFamily: "var(--font-mono)" }}>{tier.label}</span>}
                  {statusChip(t)}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-[var(--nx-text3)]">
                  <span>{t.city}, {t.state}</span>
                  <span>{t.startDate} · {t.ageGroup}</span>
                  <span className="text-[var(--nx-gold)]">🏆 {t.prize}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {t.scoutAlerts && <Zap className="w-3.5 h-3.5 text-[var(--nx-green)]" title="Scout alerts enabled" />}
                {registerBtn(t)}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--nx-text3)]">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tournaments found for {activeSport}</p>
          <p className="text-sm mt-1">Check back soon or try a different sport filter</p>
        </div>
      )}
    </div>
  )
}
