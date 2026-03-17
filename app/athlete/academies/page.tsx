"use client"
import { useState } from "react"
import { MapPin, Search, Users, Award, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const ACADEMIES = [
  { id: 1, name: "Tata Football Academy", city: "Jamshedpur", state: "Jharkhand", sport: "Football", athletes: 120, distance: 45, badges: ["ISL Feeder","AIFF Affiliated"], repScore: 88, cityRank: 1, coaches: 8, emoji: "⚽", color: "var(--nx-green)" },
  { id: 2, name: "Sports Authority Centre", city: "Ranchi", state: "Jharkhand", sport: "Football", athletes: 80, distance: 12, badges: ["SAI Affiliate","Khelo India"], repScore: 82, cityRank: 2, coaches: 6, emoji: "⚽", color: "var(--nx-green)" },
  { id: 3, name: "JSW Sports Academy", city: "Bengaluru", state: "Karnataka", sport: "Athletics", athletes: 200, distance: 1200, badges: ["SAI Affiliated","National Program"], repScore: 95, cityRank: 1, coaches: 15, emoji: "🏃", color: "var(--nx-blue)" },
  { id: 4, name: "Gopichand Badminton Academy", city: "Hyderabad", state: "Telangana", sport: "Badminton", athletes: 150, distance: 900, badges: ["BAI Partner","Olympic Program"], repScore: 97, cityRank: 1, coaches: 12, emoji: "🏸", color: "#A3E635" },
  { id: 5, name: "Minerva FC Academy", city: "Mohali", state: "Punjab", sport: "Football", athletes: 90, distance: 1500, badges: ["I-League","AIFF"], repScore: 79, cityRank: 1, coaches: 7, emoji: "⚽", color: "var(--nx-green)" },
  { id: 6, name: "Odisha Hockey Academy", city: "Bhubaneswar", state: "Odisha", sport: "Hockey", athletes: 100, distance: 400, badges: ["Hockey India","SAI"], repScore: 92, cityRank: 1, coaches: 10, emoji: "🏑", color: "var(--nx-purple)" },
]

const SPORTS = ["All", "Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey"]

export default function AthleteAcademiesPage() {
  const [sport, setSport] = useState("All")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "grid">("grid")
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = ACADEMIES.filter(a => {
    const sm = sport === "All" || a.sport === sport
    const sr = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase())
    return sm && sr
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Discover Academies</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Find training academies that fit your sport and goals</p></div>
      </div>

      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city, state..." className="pl-10 rounded-2xl text-sm py-3" /></div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPORTS.map(s => (
          <button key={s} onClick={() => setSport(s)}
            className={cn("px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all shrink-0",
              sport === s ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]")}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(ac => (
          <div key={ac.id} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] hover:shadow-[var(--nx-shadow-hover)] transition-all cursor-pointer group"
            onClick={() => setSelected(selected === ac.id ? null : ac.id)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${ac.color}15`, border: `1px solid ${ac.color}30` }}>{ac.emoji}</div>
              <div className="text-right">
                <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-gold)" }}>{ac.repScore}</div>
                <div className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>#{ac.cityRank} {ac.city}</div>
              </div>
            </div>
            <h3 className="font-bold text-[var(--nx-text1)] text-sm">{ac.name}</h3>
            <p className="flex items-center gap-1 text-xs text-[var(--nx-text3)] mt-1"><MapPin className="w-3 h-3" />{ac.city}, {ac.state} · {ac.distance < 100 ? `${ac.distance} km away` : `${ac.distance} km`}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ac.badges.map((b, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ background: `${ac.color}10`, color: ac.color, border: `1px solid ${ac.color}20` }}>{b}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--nx-border)]">
              <div className="flex items-center gap-3 text-xs text-[var(--nx-text3)]">
                <span><Users className="w-3 h-3 inline mr-1" />{ac.athletes}</span>
                <span><Award className="w-3 h-3 inline mr-1" />{ac.coaches} coaches</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-[var(--nx-green)] hover:underline">
                Enquire <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {selected === ac.id && (
              <div className="mt-4 pt-4 border-t border-[var(--nx-border)] space-y-2">
                <p className="text-xs text-[var(--nx-text2)]">
                  {ac.name} is accepting enquiries for their {new Date().getFullYear()} intake. They have produced {Math.floor(ac.athletes * 0.15)} athletes who went on to professional trials.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-xs hover:brightness-110 transition-all">Send Enquiry</button>
                  <button className="flex-1 py-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-xs">View Profile</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
