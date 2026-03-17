"use client"
import { useState } from "react"
import { MapPin, Shield, ChevronRight, Search, MessageSquare, TrendingUp, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const ACADEMIES = [
  { id: 1, name: "Tata Football Academy", city: "Jamshedpur", state: "Jharkhand", sport: "Football", athletes: 120, repScore: 88, placement: 74, scoutInquiryRate: 4.2, coScouts: 3, badges: ["ISL Feeder", "AIFF Affiliated"], color: "var(--nx-green)", tier: "PREMIUM", partnered: true, cityRank: 1, avgAiScore: 76 },
  { id: 2, name: "JSW Sports Academy", city: "Bengaluru", state: "Karnataka", sport: "Multi-Sport", athletes: 200, repScore: 95, placement: 82, scoutInquiryRate: 6.8, coScouts: 7, badges: ["SAI Affiliated", "National Program"], color: "var(--nx-blue)", tier: "ELITE", partnered: true, cityRank: 1, avgAiScore: 81 },
  { id: 3, name: "Gopichand Academy", city: "Hyderabad", state: "Telangana", sport: "Badminton", athletes: 150, repScore: 97, placement: 91, scoutInquiryRate: 8.1, coScouts: 5, badges: ["BAI Partner", "Olympic Program"], color: "#A3E635", tier: "ELITE", partnered: false, cityRank: 1, avgAiScore: 84 },
  { id: 4, name: "Nagpur FC Youth Academy", city: "Nagpur", state: "Maharashtra", sport: "Football", athletes: 48, repScore: 82, placement: 58, scoutInquiryRate: 3.1, coScouts: 2, badges: ["ISL Scout Access", "AIFF"], color: "var(--nx-green)", tier: "STANDARD", partnered: false, cityRank: 1, avgAiScore: 72 },
  { id: 5, name: "Minerva FC Academy", city: "Mohali", state: "Punjab", sport: "Football", athletes: 90, repScore: 79, placement: 65, scoutInquiryRate: 2.4, coScouts: 2, badges: ["I-League", "AIFF"], color: "var(--nx-purple)", tier: "STANDARD", partnered: false, cityRank: 1, avgAiScore: 68 },
  { id: 6, name: "Odisha Hockey Academy", city: "Bhubaneswar", state: "Odisha", sport: "Hockey", athletes: 100, repScore: 92, placement: 78, scoutInquiryRate: 5.3, coScouts: 4, badges: ["Hockey India", "SAI"], color: "var(--nx-teal)", tier: "PREMIUM", partnered: false, cityRank: 1, avgAiScore: 79 },
]

const TOP_BY_SCORE = [...ACADEMIES].sort((a, b) => b.avgAiScore - a.avgAiScore).slice(0, 5)

export default function ScoutAcademiesPage() {
  const [search, setSearch] = useState("")
  const [sportFilter, setSportFilter] = useState("All")
  const sports = ["All", "Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey"]

  const filtered = ACADEMIES.filter(a =>
    (sportFilter === "All" || a.sport === sportFilter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Network</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">Partner academies · talent pipeline access · co-scouting</p>
      </div>

      {/* Top Academies Leaderboard */}
      <div className="p-5 rounded-2xl" style={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4" style={{ color: "var(--nx-gold)" }} />
          <h2 className="font-semibold text-sm text-[var(--nx-text1)]">Top Academies by Average AI Score</h2>
          <span className="text-[9px] ml-auto" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)" }}>NATIONAL RANKING</span>
        </div>
        <div className="space-y-2">
          {TOP_BY_SCORE.map((ac, i) => (
            <div key={ac.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
              <span className="text-sm font-bold w-5 shrink-0" style={{ fontFamily: "var(--font-display)", color: i === 0 ? "var(--nx-gold)" : i === 1 ? "var(--nx-text2)" : "var(--nx-text3)" }}>
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: `${ac.color}15`, color: ac.color, fontFamily: "var(--font-display)" }}>
                {ac.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--nx-text1)] truncate">{ac.name}</p>
                <p className="text-[10px] text-[var(--nx-text3)]">{ac.city} · {ac.sport}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{ac.avgAiScore}</p>
                <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>AVG AI SCORE</p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-gold)" }}>{ac.repScore}</p>
                <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>REP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search academies by name or city..."
            className="w-full pl-10 rounded-2xl text-sm py-3" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sports.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0", sportFilter === s ? "text-black" : "border border-[var(--nx-border)] text-[var(--nx-text2)]")}
              style={sportFilter === s ? { background: "var(--nx-purple)" } : { background: "var(--nx-bg3)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Academy Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(ac => (
          <div key={ac.id} className="p-5 rounded-2xl transition-all hover:shadow-[var(--nx-shadow-card)]"
            style={{ background: "var(--nx-bg3)", border: `1px solid ${ac.partnered ? "rgba(155,93,255,0.3)" : "var(--nx-border)"}` }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: `${ac.color}15`, border: `1px solid ${ac.color}25`, color: ac.color, fontFamily: "var(--font-display)" }}>
                {ac.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-gold)" }}>{ac.repScore}</div>
                <div className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>REP · #{ac.cityRank} {ac.city}</div>
              </div>
            </div>

            {ac.partnered && (
              <div className="flex items-center gap-1 mb-2 text-[10px] font-semibold" style={{ color: "var(--nx-purple)" }}>
                <Shield className="w-3 h-3" />PARTNER ACADEMY
              </div>
            )}

            <h3 className="font-bold text-[var(--nx-text1)] text-sm">{ac.name}</h3>
            <p className="flex items-center gap-1 text-xs text-[var(--nx-text3)] mt-1 mb-2">
              <MapPin className="w-3 h-3" />{ac.city}, {ac.state}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {ac.badges.map((b, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px]"
                  style={{ background: `${ac.color}10`, color: ac.color, border: `1px solid ${ac.color}20` }}>{b}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "Athletes", val: ac.athletes },
                { label: "Avg AI", val: ac.avgAiScore },
                { label: "Placed%", val: ac.placement + "%" },
                { label: "Inquiry/mo", val: ac.scoutInquiryRate.toFixed(1) },
              ].map((s, i) => (
                <div key={i} className="p-2 rounded-lg text-center" style={{ background: "var(--nx-bg4)" }}>
                  <div className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: i === 1 ? "var(--nx-cyan)" : i === 3 ? "var(--nx-gold)" : "var(--nx-text1)" }}>{s.val}</div>
                  <div className="text-[8px] text-[var(--nx-text3)] leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Scout inquiry rate bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--nx-text3)]">Scout Inquiry Rate</span>
                <span className="text-[10px] font-semibold" style={{ color: "var(--nx-gold)" }}>{ac.scoutInquiryRate}/mo</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "var(--nx-bg5)" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, ac.scoutInquiryRate * 10)}%`, background: "var(--nx-gold)" }} />
              </div>
            </div>

            <div className="flex gap-2">
              {ac.partnered
                ? <div className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                    style={{ background: "rgba(155,93,255,0.1)", border: "1px solid rgba(155,93,255,0.3)", color: "var(--nx-purple)" }}>
                    <Shield className="w-3.5 h-3.5" />Partner
                  </div>
                : <button className="flex-1 py-2 rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
                    style={{ background: "var(--nx-purple)", color: "white" }}>Connect</button>
              }
              <button className="p-2 rounded-xl border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors" style={{ background: "var(--nx-bg4)" }}>
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors" style={{ background: "var(--nx-bg4)" }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
