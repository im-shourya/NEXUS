"use client"
import { useState, useEffect } from "react"
import { Search, Bookmark, MessageSquare, Eye, MapPin, ChevronRight, ChevronLeft, X, Star, Sparkles, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const SPORTS = ["Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey", "Wrestling"]
const FOOTBALL_POSITIONS = ["Goalkeeper", "Centre-Back", "Left-Back", "Right-Back", "CDM", "Central Mid", "CAM", "Left Wing", "Right Wing", "Striker", "Centre Forward"]
const CRICKET_TYPES = ["Batsman", "Pace Bowler", "Spin Bowler", "All-Rounder", "Wicket-Keeper"]
const BOWLING_STYLES = ["Right-Arm Fast", "Right-Arm Fast-Medium", "Right-Arm Off-Spin", "Right-Arm Leg-Spin", "Left-Arm Fast", "Left-Arm Orthodox"]
const KABADDI_ROLES = ["Raider", "Defender", "All-Rounder"]
const KABADDI_WEIGHTS = ["60-65kg", "66-70kg", "71-75kg", "76-80kg", "80+kg"]
const ATHLETICS_DISCIPLINES = ["100m", "200m", "400m", "800m", "1500m", "5000m", "High Jump", "Long Jump", "Triple Jump", "Javelin", "Shot Put", "Discus", "Hurdles"]
const ATHLETICS_STANDARDS = ["State Qualifier", "National Junior", "National Senior", "Asian Games"]
const BADMINTON_FORMATS = ["Singles", "Doubles", "Mixed Doubles"]
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "West Bengal", "Rajasthan", "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "Jharkhand", "Kerala", "Telangana", "Andhra Pradesh"]

function scoreColor(s: number) {
  if (s >= 80) return "var(--nx-cyan)"
  if (s >= 65) return "var(--nx-gold)"
  return "var(--nx-green)"
}

const DUMMY_ATHLETES = [
  { id: 1, name: "Arjun Sharma", username: "arjun-sharma", sport: "Football", position: "Striker (CF)", city: "Nagpur", state: "Maharashtra", age: 17, nexusScore: 74, matchPct: 85, skills: [{ l: "Speed", v: 82 }, { l: "Dribbling", v: 76 }, { l: "Shooting", v: 71 }], profileStrength: 82, available: true, injuryRisk: "LOW", initials: "AS", isShortlisted: false, profileViews: 847, recentActivity: "Updated 2d ago", bio: "ISL trial ready. Maharashtra U-17 top scorer 2025. Nagpur FC Youth Academy.", careerGoal: "Represent India at U-20 level.", preferredFoot: "Right" },
  { id: 2, name: "Vikram Singh", username: "vikram-singh", sport: "Football", position: "Centre Mid", city: "Pune", state: "Maharashtra", age: 19, nexusScore: 71, matchPct: 78, skills: [{ l: "Passing", v: 84 }, { l: "Stamina", v: 79 }, { l: "Tackling", v: 68 }], profileStrength: 76, available: true, injuryRisk: "LOW", initials: "VS", isShortlisted: false, profileViews: 423, recentActivity: "Active today", bio: "University footballer. Technical midfielder seeking ISL development squad.", careerGoal: "ISL first team by 23.", preferredFoot: "Left" },
  { id: 3, name: "Karan Mehta", username: "karan-mehta", sport: "Football", position: "Striker (LW)", city: "Mumbai", state: "Maharashtra", age: 16, nexusScore: 68, matchPct: 74, skills: [{ l: "Speed", v: 86 }, { l: "Dribbling", v: 79 }, { l: "Finishing", v: 65 }], profileStrength: 71, available: true, injuryRisk: "LOW", initials: "KM", isShortlisted: true, profileViews: 38, recentActivity: "Updated 1w ago", bio: "Speed merchant. Youngest in academy squad. High potential.", careerGoal: "ISL Under-21.", preferredFoot: "Right" },
  { id: 4, name: "Priya Desai", username: "priya-desai", sport: "Football", position: "Centre Forward", city: "Aurangabad", state: "Maharashtra", age: 17, nexusScore: 67, matchPct: 71, skills: [{ l: "Headers", v: 81 }, { l: "Positioning", v: 75 }, { l: "Strength", v: 72 }], profileStrength: 68, available: false, injuryRisk: "MODERATE", initials: "PD", isShortlisted: false, profileViews: 29, recentActivity: "Active 3d ago", bio: "Physical striker. Strong in the air. Looking for U-19 trials.", careerGoal: "Professional contract.", preferredFoot: "Both" },
  { id: 5, name: "Ravi Kumar", username: "ravi-kumar", sport: "Football", position: "Left Wing", city: "Solapur", state: "Maharashtra", age: 18, nexusScore: 63, matchPct: 66, skills: [{ l: "Pace", v: 88 }, { l: "Crossing", v: 71 }, { l: "Dribbling", v: 68 }], profileStrength: 58, available: true, injuryRisk: "LOW", initials: "RK", isShortlisted: false, profileViews: 12, recentActivity: "Updated 2w ago", bio: "Pacey winger from small town. Untapped potential.", careerGoal: "First pro contract.", preferredFoot: "Left" },
  { id: 6, name: "Sneha Patel", username: "sneha-patel", sport: "Football", position: "Striker", city: "Nagpur", state: "Maharashtra", age: 16, nexusScore: 78, matchPct: 82, skills: [{ l: "Goals", v: 85 }, { l: "Technique", v: 80 }, { l: "Awareness", v: 74 }], profileStrength: 88, available: true, injuryRisk: "LOW", initials: "SP", isShortlisted: false, profileViews: 156, recentActivity: "Active today", bio: "Prolific scorer. 34 goals in 28 matches. ISL trial attended in 2025.", careerGoal: "IPL/ISL career.", preferredFoot: "Right" },
]

export default function ScoutDiscoverPage() {
  const [athletes, setAthletes] = useState<any[]>(DUMMY_ATHLETES)
  const [sport, setSport] = useState("Football")
  const [minScore, setMinScore] = useState(60)
  const [minCompleteness, setMinCompleteness] = useState(60)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [injuryFreeOnly, setInjuryFreeOnly] = useState(false)
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [minAge, setMinAge] = useState(14)
  const [maxAge, setMaxAge] = useState(25)
  const [sortBy, setSortBy] = useState("match_score")
  const [shortlisted, setShortlisted] = useState<any[]>([])
  const [drawerAthlete, setDrawerAthlete] = useState<any | null>(null)
  const [drawerIdx, setDrawerIdx] = useState(0)
  const [assessmentNotes, setAssessmentNotes] = useState("")

  useEffect(() => {
    fetch('/api/discover')
      .then(res => res.json())
      .then(data => {
        if (data.athletes && data.athletes.length > 0) {
          const mapped = data.athletes.map((a: any) => ({
            id: a.id,
            name: a.users?.full_name || "Unknown",
            username: a.username,
            sport: a.sport,
            position: a.position_role || "-",
            city: a.city || "-",
            state: a.state || "-",
            age: 18,
            nexusScore: a.nexus_score || 0,
            matchPct: Math.floor(Math.random() * 20) + 70,
            skills: [{ l: "Speed", v: 80 }, { l: "Strength", v: 75 }, { l: "Stamina", v: 70 }],
            profileStrength: a.profile_strength || 0,
            available: true,
            injuryRisk: "LOW",
            initials: a.users?.full_name?.substring(0, 2).toUpperCase() || "UN",
            isShortlisted: false,
            profileViews: 10,
            recentActivity: "Active today",
            bio: a.bio || "Searching for opportunities.",
            preferredFoot: "Right"
          }))
          setAthletes(mapped)
        }
      })
      .catch(console.error)
  }, [])

  const HIDDEN_GEMS = athletes.filter(a => a.nexusScore >= 65 && a.profileViews < 50)
  const [stars, setStars] = useState({ potential: 0, coachability: 0, physical: 0, technical: 0 })
  const [timeline, setTimeline] = useState("")
  const [showHiddenGems, setShowHiddenGems] = useState(false)
  // sport-specific filters
  const [selectedFoot, setSelectedFoot] = useState<string[]>([])
  const [selectedCricketTypes, setSelectedCricketTypes] = useState<string[]>([])
  const [selectedBowlingStyles, setSelectedBowlingStyles] = useState<string[]>([])
  const [selectedKabaddiWeights, setSelectedKabaddiWeights] = useState<string[]>([])
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedStandard, setSelectedStandard] = useState("")
  const [selectedBadmintonFormat, setSelectedBadmintonFormat] = useState("")

  const filtered = athletes
    .filter(a => a.sport === sport && a.nexusScore >= minScore && a.profileStrength >= minCompleteness)
    .filter(a => !availableOnly || a.available)
    .filter(a => !injuryFreeOnly || a.injuryRisk === "LOW")
    .filter(a => a.age >= minAge && a.age <= maxAge)
    .filter(a => selectedStates.length === 0 || selectedStates.includes(a.state))
    .filter(a => selectedFoot.length === 0 || selectedFoot.includes((a as any).preferredFoot))
    .sort((a, b) => sortBy === "match_score" ? b.matchPct - a.matchPct : sortBy === "score" ? b.nexusScore - a.nexusScore : b.age - a.age)

  const openDrawer = (athlete: any) => { setDrawerAthlete(athlete); setDrawerIdx(filtered.findIndex(a => a.id === athlete.id)) }
  const nextAthlete = () => { const next = filtered[(drawerIdx + 1) % filtered.length]; setDrawerAthlete(next); setDrawerIdx((drawerIdx + 1) % filtered.length) }
  const prevAthlete = () => { const prev = filtered[(drawerIdx - 1 + filtered.length) % filtered.length]; setDrawerAthlete(prev); setDrawerIdx((drawerIdx - 1 + filtered.length) % filtered.length) }
  const toggleShortlist = (id: any) => setShortlisted(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleChip = (arr: string[], setArr: (v: string[]) => void, val: string) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  return (
    <div className="flex gap-0 h-[calc(100vh-80px)] overflow-hidden">
      {/* Filter Sidebar */}
      <div className="w-64 shrink-0 bg-[var(--nx-bg2)] border-r border-[var(--nx-border)] overflow-y-auto p-4 space-y-5">
        <div>
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Sport</p>
          <div className="space-y-1">
            {SPORTS.map(s => (
              <button key={s} onClick={() => { setSport(s); setSelectedPositions([]); setSelectedFoot([]); setSelectedCricketTypes([]); setSelectedBowlingStyles([]); setSelectedKabaddiWeights([]); setSelectedDisciplines([]) }}
                className={cn("w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all", sport === s ? "bg-[var(--nx-green-dim)] text-[var(--nx-green)] font-semibold border-l-2 border-[var(--nx-green)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]")}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Football-specific */}
        {sport === "Football" && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Position</p>
              <div className="flex flex-wrap gap-1">
                {FOOTBALL_POSITIONS.map(p => (
                  <button key={p} onClick={() => toggleChip(selectedPositions, setSelectedPositions, p)}
                    className={cn("px-2 py-0.5 rounded-full text-[10px] transition-all", selectedPositions.includes(p) ? "bg-[var(--nx-green)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {p.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Preferred Foot</p>
              <div className="flex gap-2">
                {["Right", "Left", "Both"].map(f => (
                  <button key={f} onClick={() => toggleChip(selectedFoot, setSelectedFoot, f)}
                    className={cn("flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all", selectedFoot.includes(f) ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cricket-specific */}
        {sport === "Cricket" && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Player Type</p>
              <div className="flex flex-wrap gap-1">
                {CRICKET_TYPES.map(p => (
                  <button key={p} onClick={() => toggleChip(selectedCricketTypes, setSelectedCricketTypes, p)}
                    className={cn("px-2 py-0.5 rounded-full text-[10px] transition-all", selectedCricketTypes.includes(p) ? "bg-[var(--nx-gold)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {(selectedCricketTypes.includes("Pace Bowler") || selectedCricketTypes.includes("Spin Bowler") || selectedCricketTypes.includes("All-Rounder")) && (
              <div>
                <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Bowling Style</p>
                <div className="flex flex-wrap gap-1">
                  {BOWLING_STYLES.map(s => (
                    <button key={s} onClick={() => toggleChip(selectedBowlingStyles, setSelectedBowlingStyles, s)}
                      className={cn("px-2 py-0.5 rounded-full text-[10px] transition-all", selectedBowlingStyles.includes(s) ? "bg-[var(--nx-gold)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                      {s.replace("Right-Arm ", "RA ").replace("Left-Arm ", "LA ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Kabaddi-specific */}
        {sport === "Kabaddi" && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Role</p>
              <div className="flex gap-1.5">
                {KABADDI_ROLES.map(r => (
                  <button key={r} onClick={() => toggleChip(selectedPositions, setSelectedPositions, r)}
                    className={cn("flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all", selectedPositions.includes(r) ? "bg-[var(--nx-orange)] text-white" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Weight Category</p>
              <div className="flex flex-wrap gap-1">
                {KABADDI_WEIGHTS.map(w => (
                  <button key={w} onClick={() => toggleChip(selectedKabaddiWeights, setSelectedKabaddiWeights, w)}
                    className={cn("px-2 py-0.5 rounded-full text-[10px] transition-all", selectedKabaddiWeights.includes(w) ? "bg-[var(--nx-orange)] text-white font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Athletics-specific */}
        {sport === "Athletics" && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Discipline</p>
              <div className="flex flex-wrap gap-1">
                {ATHLETICS_DISCIPLINES.map(d => (
                  <button key={d} onClick={() => toggleChip(selectedDisciplines, setSelectedDisciplines, d)}
                    className={cn("px-2 py-0.5 rounded-full text-[10px] transition-all", selectedDisciplines.includes(d) ? "bg-[var(--nx-cyan)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Minimum Standard</p>
              <div className="space-y-1">
                {["", ...ATHLETICS_STANDARDS].map(s => (
                  <button key={s} onClick={() => setSelectedStandard(s)}
                    className={cn("w-full text-left px-2 py-1 rounded-lg text-xs transition-all", selectedStandard === s ? "bg-[var(--nx-cyan)]/10 text-[var(--nx-cyan)] border border-[var(--nx-cyan)]/30" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]")}>
                    {s || "Any Standard"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Badminton-specific */}
        {sport === "Badminton" && (
          <div>
            <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Format</p>
            <div className="space-y-1">
              {BADMINTON_FORMATS.map(f => (
                <button key={f} onClick={() => setSelectedBadmintonFormat(selectedBadmintonFormat === f ? "" : f)}
                  className={cn("w-full text-left px-2 py-1 rounded-lg text-xs transition-all", selectedBadmintonFormat === f ? "bg-[var(--nx-purple)]/10 text-[var(--nx-purple)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Age Range: {minAge}–{maxAge}</p>
          <div className="space-y-2">
            <div><label className="text-[10px] text-[var(--nx-text3)]">Min {minAge}</label><input type="range" min={12} max={35} value={minAge} onChange={e => setMinAge(+e.target.value)} className="w-full accent-[var(--nx-purple)]" /></div>
            <div><label className="text-[10px] text-[var(--nx-text3)]">Max {maxAge}</label><input type="range" min={12} max={35} value={maxAge} onChange={e => setMaxAge(+e.target.value)} className="w-full accent-[var(--nx-purple)]" /></div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>States</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {STATES.slice(0, 8).map(s => (
              <label key={s} className="flex items-center gap-2 text-xs text-[var(--nx-text2)] cursor-pointer hover:text-[var(--nx-text1)]">
                <input type="checkbox" checked={selectedStates.includes(s)} onChange={() => toggleChip(selectedStates, setSelectedStates, s)} className="accent-[var(--nx-purple)]" />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Min AI Score: {minScore}</p>
          <input type="range" min={40} max={95} value={minScore} onChange={e => setMinScore(+e.target.value)} className="w-full accent-[var(--nx-purple)]" />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Min Profile: {minCompleteness}%</p>
          <input type="range" min={40} max={100} value={minCompleteness} onChange={e => setMinCompleteness(+e.target.value)} className="w-full accent-[var(--nx-purple)]" />
        </div>

        {[["availableOnly", availableOnly, setAvailableOnly, "Available for Trials"], ["injuryFreeOnly", injuryFreeOnly, setInjuryFreeOnly, "Injury-Free Only"]].map(([key, val, setter, label]) => (
          <div key={key as string} className="flex items-center justify-between">
            <span className="text-xs text-[var(--nx-text2)]">{label as string}</span>
            <button onClick={() => (setter as any)(!val)} className={cn("relative w-9 h-5 rounded-full transition-all", val ? "bg-[var(--nx-purple)]" : "bg-[var(--nx-bg5)]")}>
              <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform", val ? "left-4" : "left-0.5")} />
            </button>
          </div>
        ))}

        <p className="text-[10px] text-[var(--nx-text3)] pt-2 border-t border-[var(--nx-border)]">{filtered.length} athletes match</p>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
            <input placeholder="Search athletes..." className="w-full pl-10 text-sm rounded-xl py-2" />
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs rounded-xl py-2 px-3 w-36">
              <option value="match_score">Best Match</option>
              <option value="score">Highest Score</option>
              <option value="newest">Newest</option>
            </select>
            <button onClick={() => setShowHiddenGems(!showHiddenGems)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all", showHiddenGems ? "bg-[var(--nx-gold)] text-black" : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
              <Sparkles className="w-3.5 h-3.5" />Hidden Gems
            </button>
          </div>
        </div>

        {showHiddenGems && HIDDEN_GEMS.length > 0 && (
          <div className="mb-5 p-4 rounded-2xl" style={{ background: "rgba(255,184,0,0.04)", border: "1px solid rgba(255,184,0,0.25)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--nx-gold)]" />
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Hidden Gems — AI score ≥65 with fewer than 50 profile views</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {HIDDEN_GEMS.map(a => (
                <button key={a.id} onClick={() => openDrawer(a)} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] hover:border-[var(--nx-gold)]/50 transition-all text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)" }}>{a.initials}</div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--nx-text1)]">{a.name}</p>
                    <p className="text-[10px] text-[var(--nx-text3)]">{a.position} · Score {a.nexusScore}</p>
                    <p className="text-[9px] text-[var(--nx-gold)]">Only {a.profileViews} views</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(athlete => {
            const sc = shortlisted.includes(athlete.id)
            const mc = scoreColor(athlete.matchPct)
            return (
              <div key={athlete.id} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-border2)] hover:shadow-[var(--nx-shadow-card)] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "rgba(0,245,116,0.1)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>
                      {athlete.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[var(--nx-text1)]">{athlete.name}</p>
                      <p className="text-[10px] text-[var(--nx-text3)]">{athlete.position} · Age {athlete.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: mc }}>{athlete.matchPct}%</div>
                    <div className="text-[8px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>MATCH</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>⚽ {athlete.sport}</span>
                  <span className="text-[9px] text-[var(--nx-text3)] flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{athlete.city}</span>
                  {athlete.available && <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}><Zap className="w-2 h-2 inline" />AVAIL</span>}
                  {athlete.profileViews < 50 && athlete.nexusScore >= 65 && <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)", border: "1px solid rgba(255,184,0,0.25)", fontFamily: "var(--font-mono)" }}>💎 GEM</span>}
                </div>
                <div className="flex gap-1.5 mb-3">
                  {athlete.skills.slice(0, 3).map((sk: any, i: number) => (
                    <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
                      <span className="text-[9px] text-[var(--nx-text3)]">{sk.l}</span>
                      <span className="text-[10px] font-bold" style={{ color: scoreColor(sk.v), fontFamily: "var(--font-display)", fontSize: "12px" }}>{sk.v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleShortlist(athlete.id)}
                    className={cn("p-2 rounded-xl border transition-all", sc ? "bg-[var(--nx-green-dim)] border-[var(--nx-green-border)] text-[var(--nx-green)]" : "bg-[var(--nx-bg4)] border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-green)] hover:border-[var(--nx-green-border)]")}>
                    <Bookmark className="w-3.5 h-3.5" fill={sc ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => openDrawer(athlete)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs text-[var(--nx-text2)] bg-[var(--nx-bg4)] border border-[var(--nx-border)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
                    <Eye className="w-3 h-3" />View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
                    <MessageSquare className="w-3 h-3" />Msg
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right-side Profile Drawer */}
      {drawerAthlete && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerAthlete(null)} />
          <div className="relative w-[480px] bg-[var(--nx-bg2)] border-l border-[var(--nx-border)] overflow-y-auto z-10">
            <div className="h-28 relative" style={{ background: `linear-gradient(135deg, rgba(0,245,116,0.15), var(--nx-bg4))` }}>
              <button onClick={() => setDrawerAthlete(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 absolute bottom-4 left-4 right-14">
                <button onClick={prevAthlete} className="p-1.5 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] text-[var(--nx-text3)]">{drawerIdx + 1}/{filtered.length}</span>
                <button onClick={nextAthlete} className="p-1.5 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)" }}>{drawerAthlete.matchPct}%</span>
                <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>MATCH</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "2px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>
                  {drawerAthlete.initials}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[var(--nx-text1)]">{drawerAthlete.name}</h2>
                  <p className="text-sm text-[var(--nx-text3)]">{drawerAthlete.position} · Age {drawerAthlete.age} · {drawerAthlete.city}, {drawerAthlete.state}</p>
                  <p className="text-xs text-[var(--nx-text2)] mt-1 italic">"{drawerAthlete.bio}"</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[["NexusScore™", drawerAthlete.nexusScore, scoreColor(drawerAthlete.nexusScore)], ["Profile", drawerAthlete.profileStrength + "%", "var(--nx-gold)"], ["Views", drawerAthlete.profileViews, "var(--nx-text2)"]].map(([l, v, c]) => (
                  <div key={l as string} className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-center">
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
                    <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{l}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Skill Breakdown</p>
                <div className="space-y-2">
                  {drawerAthlete.skills.map((sk: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-[var(--nx-text2)] w-20 shrink-0">{sk.l}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sk.v}%`, background: scoreColor(sk.v) }} />
                      </div>
                      <span className="text-xs font-bold w-6 text-right" style={{ color: scoreColor(sk.v), fontFamily: "var(--font-display)", fontSize: "14px" }}>{sk.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRIVATE SCOUT ASSESSMENT PANEL */}
              <div className="p-4 rounded-2xl" style={{ background: "rgba(155,93,255,0.04)", border: "1px solid rgba(155,93,255,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-[var(--nx-purple)]" />
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">My Assessment</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>PRIVATE</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {(([["potential", "Potential"], ["coachability", "Coachability"], ["physical", "Physical"], ["technical", "Technical"]] as [keyof typeof stars, string][])).map(([k, l]) => (
                    <div key={k}>
                      <p className="text-[10px] text-[var(--nx-text3)] mb-1 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>{l}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setStars(p => ({ ...p, [k]: n }))} className={cn("w-5 h-5 transition-all", stars[k] >= n ? "text-[var(--nx-gold)]" : "text-[var(--nx-border2)]")}>
                            <Star className="w-4 h-4" fill={stars[k] >= n ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <p className="text-[10px] text-[var(--nx-text3)] mb-1.5 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Development Timeline</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Ready Now", "6 Months", "1 Year", "2+ Years", "Not Suitable"].map(t => (
                      <button key={t} onClick={() => setTimeline(t)}
                        className={cn("px-2.5 py-1 rounded-xl text-xs transition-all", timeline === t ? "bg-[var(--nx-purple)] text-white font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-[var(--nx-text3)] mb-1.5 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Private Notes</p>
                  <textarea value={assessmentNotes} onChange={e => setAssessmentNotes(e.target.value)} rows={3} placeholder="Your private assessment notes..." className="text-xs rounded-xl w-full" />
                </div>

                <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-purple)", color: "white" }}>
                  Save Assessment
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleShortlist(drawerAthlete.id)} className={cn("flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all", shortlisted.includes(drawerAthlete.id) ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-green-border)] hover:text-[var(--nx-green)]")}>
                  <Bookmark className="w-4 h-4" fill={shortlisted.includes(drawerAthlete.id) ? "currentColor" : "none"} />
                  {shortlisted.includes(drawerAthlete.id) ? "Shortlisted" : "Shortlist"}
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110" style={{ background: "var(--nx-purple)", color: "white" }}>
                  <MessageSquare className="w-4 h-4" />Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
