"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { ArrowRight, ArrowLeft, CheckCircle2, Camera, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Role", "Sport", "Profile", "Details", "Goal"]
const SPORTS = [
  { id: "football", label: "Football", emoji: "⚽", color: "var(--nx-green)", positions: ["Goalkeeper", "Centre-Back", "Right-Back", "Left-Back", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Second Striker", "Centre Forward"] },
  { id: "cricket", label: "Cricket", emoji: "🏏", color: "var(--nx-teal)", positions: ["Batsman", "Fast Bowler", "Spin Bowler", "All-Rounder", "Wicket-Keeper"] },
  { id: "kabaddi", label: "Kabaddi", emoji: "🤼", color: "var(--nx-pink)", positions: ["Raider", "Defender (Corner)", "Defender (Cover)", "All-Rounder"] },
  { id: "athletics", label: "Athletics", emoji: "🏃", color: "var(--nx-blue)", positions: ["100m Sprint", "200m Sprint", "400m Sprint", "800m", "1500m", "Long Jump", "High Jump", "Triple Jump", "Javelin", "Discus", "Shot Put"] },
  { id: "badminton", label: "Badminton", emoji: "🏸", color: "#A3E635", positions: ["Singles", "Doubles", "Mixed Doubles"] },
  { id: "hockey", label: "Hockey", emoji: "🏑", color: "var(--nx-purple)", positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Drag Flicker"] },
  { id: "wrestling", label: "Wrestling", emoji: "🤸", color: "var(--nx-red)", positions: ["Freestyle", "Greco-Roman", "Kushti"] },
  { id: "kho", label: "Kho-Kho", emoji: "🏃", color: "var(--nx-amber)", positions: ["Chaser", "Defender"] },
  { id: "basketball", label: "Basketball", emoji: "🏀", color: "var(--nx-orange)", positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Centre"] },
  { id: "volleyball", label: "Volleyball", emoji: "🏐", color: "var(--nx-cyan)", positions: ["Setter", "Outside Hitter", "Middle Blocker", "Libero", "Opposite"] },
  { id: "tabletennis", label: "Table Tennis", emoji: "🏓", color: "var(--nx-pink)", positions: ["Singles", "Doubles"] },
  { id: "archery", label: "Archery", emoji: "🏹", color: "#84CC16", positions: ["Recurve", "Compound", "Traditional"] },
]

const LOOKING_FOR = ["Trial Opportunities", "Scout Connections", "Tournaments", "Sponsorship", "Coaching", "Teammates"]

type FormData = {
  firstName: string; lastName: string; dob: string; gender: string;
  sport: string; position: string; city: string; state: string;
  height: string; weight: string; academy: string;
  lookingFor: string[]; bio: string; avatar: string | null;
  phone: string; email: string;
}

export default function AthleteOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", dob: "", gender: "",
    sport: "", position: "", city: "", state: "", height: "", weight: "",
    academy: "", lookingFor: ["Trial Opportunities", "Scout Connections"],
    bio: "", avatar: null, phone: "", email: ""
  })

  const selectedSport = SPORTS.find(s => s.id === form.sport)

  // Persist draft on every change
  useEffect(() => {
    try { sessionStorage.setItem('nexus_onboarding_draft', JSON.stringify({ form, step })) } catch {}
  }, [form, step])

  const update = (field: keyof FormData, val: any) => setForm(p => ({ ...p, [field]: val }))
  const toggleLookingFor = (item: string) =>
    update("lookingFor", form.lookingFor.includes(item)
      ? form.lookingFor.filter(i => i !== item)
      : [...form.lookingFor, item])

  const canNext = () => {
    if (step === 1) return form.sport !== ""
    if (step === 2) return form.firstName && form.lastName && form.dob && form.city
    if (step === 3) return form.position !== ""
    return true
  }

  const next = () => {
    if (step < STEPS.length - 1 && canNext()) setStep(s => s + 1)
  }

  const submit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push("/athlete/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--nx-bg2), var(--nx-bg))" }}>
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: selectedSport ? `${selectedSport.color}20` : "rgba(0,245,116,0.12)" }} />

        <div className="relative z-10 text-center max-w-sm">
          <div className="text-8xl mb-6 nx-float">
            {selectedSport ? selectedSport.emoji : "🏆"}
          </div>
          <h2 className="text-3xl font-bold text-[var(--nx-text1)] mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
            {step === 0 && "Welcome to NEXUS"}
            {step === 1 && "Choose Your Sport"}
            {step === 2 && "Your Identity"}
            {step === 3 && `Your ${selectedSport?.label ?? ""} Profile`}
            {step === 4 && "Almost There!"}
          </h2>
          <p className="text-[var(--nx-text2)] text-sm leading-relaxed">
            {step === 0 && "India's first AI sports talent discovery platform. 50M+ athletes, zero structured discovery — until now."}
            {step === 1 && "Tell us your sport so we can tailor your profile, match you with the right scouts, and show you relevant opportunities."}
            {step === 2 && "Scouts need your basic info to connect. Your age group and location are key matching factors."}
            {step === 3 && "Position-specific fields help scouts find exactly the talent they're looking for."}
            {step === 4 && "Just a few more details and your profile goes live for 2,400+ scouts to discover."}
          </p>

          {/* Progress Indicators */}
          <div className="mt-8 flex gap-1.5 justify-center">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all" style={{
                width: i === step ? "24px" : "8px",
                background: i <= step ? (selectedSport?.color || "var(--nx-green)") : "var(--nx-border2)"
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <NexusLogo size={32} />
          </Link>

          {/* Step Progress */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                )}
                  style={{
                    background: i < step ? "var(--nx-green)" : i === step ? (selectedSport?.color || "var(--nx-green)") + "20" : "var(--nx-bg4)",
                    border: `2px solid ${i <= step ? (selectedSport?.color || "var(--nx-green)") : "var(--nx-border2)"}`,
                    color: i < step ? "#000" : i === step ? (selectedSport?.color || "var(--nx-green)") : "var(--nx-text3)"
                  }}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: i === step ? "var(--nx-text1)" : "var(--nx-text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-[var(--nx-border2)]" />}
              </div>
            ))}
          </div>

          {/* STEP 0: Role (already done — athlete role confirmed) */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--nx-text1)]">I'm an Athlete</h1>
                <p className="text-[var(--nx-text3)] text-sm mt-1">Build your profile and get discovered by scouts across India</p>
              </div>
              <div className="p-5 rounded-2xl bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]">
                <h3 className="font-semibold text-[var(--nx-green)] mb-3">What you'll get:</h3>
                <div className="space-y-2">
                  {[
                    "AI-powered scout matching — 85% accuracy",
                    "NexusScore™ computed from your video uploads",
                    "30-second AI highlight reel auto-generated",
                    "Sport-specific injury risk analysis",
                    "Career trajectory predictor",
                    "Direct messaging with verified scouts",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[var(--nx-text1)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First Name" value={form.firstName}
                  onChange={e => update("firstName", e.target.value)} className="rounded-xl text-sm" />
                <input type="text" placeholder="Last Name" value={form.lastName}
                  onChange={e => update("lastName", e.target.value)} className="rounded-xl text-sm" />
              </div>
              <input type="tel" placeholder="Mobile Number (+91)" value={form.phone}
                onChange={e => update("phone", e.target.value)} className="rounded-xl text-sm" />
            </div>
          )}

          {/* STEP 1: Sport Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Choose Your Sport</h1>
                <p className="text-[var(--nx-text3)] text-sm mt-1">This determines your profile fields, scout matches, and AI analysis</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {SPORTS.map(sport => (
                  <button key={sport.id} onClick={() => update("sport", sport.id)}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                      form.sport === sport.id
                        ? "border-current"
                        : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]"
                    )}
                    style={form.sport === sport.id ? { background: `${sport.color}10`, borderColor: `${sport.color}50`, color: sport.color } : {}}>
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className="font-medium text-sm" style={form.sport !== sport.id ? { color: "var(--nx-text1)" } : {}}>{sport.label}</span>
                    {form.sport === sport.id && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Your Profile</h1>
                <p className="text-[var(--nx-text3)] text-sm mt-1">Scouts use this information to discover you</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--nx-green-dim)] border-2 border-[var(--nx-green)] flex items-center justify-center">
                    {form.avatar
                      ? <img src={form.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                      : <User className="w-7 h-7 text-[var(--nx-green)]" />
                    }
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--nx-green)] flex items-center justify-center cursor-pointer hover:brightness-110">
                    <Camera className="w-3 h-3 text-black" />
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-[var(--nx-green)]">Adding a photo increases scout matches by 4x</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} className="rounded-xl text-sm py-2.5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Gender</label>
                  <select value={form.gender} onChange={e => update("gender", e.target.value)} className="rounded-xl text-sm py-2.5">
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>City</label>
                <input value={form.city} onChange={e => update("city", e.target.value)} placeholder="e.g. Nagpur" className="rounded-xl text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Height (cm)</label>
                  <input type="number" value={form.height} onChange={e => update("height", e.target.value)} placeholder="175" className="rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={e => update("weight", e.target.value)} placeholder="65" className="rounded-xl text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Sport Details */}
          {step === 3 && selectedSport && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--nx-text1)}">{selectedSport.emoji} {selectedSport.label} Profile</h1>
                <p className="text-[var(--nx-text3)] text-sm mt-1">Position-specific fields for scout matching accuracy</p>
              </div>

              {/* Football: Interactive SVG Pitch */}
              {form.sport === "football" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Position — Click on pitch to select
                  </label>
                  {form.position && <p className="text-sm font-semibold" style={{ color: selectedSport.color }}>Selected: {form.position}</p>}
                  <div className="relative rounded-xl overflow-hidden" style={{ background: "rgba(0,100,30,0.15)", border: "1px solid rgba(0,245,116,0.15)" }}>
                    <svg viewBox="0 0 100 140" className="w-full" style={{ maxHeight: "280px" }}>
                      <rect x="5" y="5" width="90" height="130" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                      <circle cx="50" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                      <rect x="25" y="5" width="50" height="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                      <rect x="25" y="115" width="50" height="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                      {[
                        { pos: "Goalkeeper", x: 50, y: 128 },
                        { pos: "Centre-Back", x: 38, y: 108 }, { pos: "Centre-Back", x: 62, y: 108 },
                        { pos: "Left-Back", x: 18, y: 100 }, { pos: "Right-Back", x: 82, y: 100 },
                        { pos: "Defensive Midfielder", x: 50, y: 85 },
                        { pos: "Central Midfielder", x: 30, y: 72 }, { pos: "Attacking Midfielder", x: 70, y: 72 },
                        { pos: "Left Winger", x: 15, y: 45 }, { pos: "Right Winger", x: 85, y: 45 },
                        { pos: "Second Striker", x: 36, y: 30 }, { pos: "Centre Forward", x: 64, y: 30 },
                      ].map((p, i) => {
                        const sel = form.position === p.pos
                        return (
                          <g key={i} style={{ cursor: "pointer" }} onClick={() => update("position", p.pos)}>
                            <circle cx={p.x} cy={p.y} r="6" fill={sel ? selectedSport.color : "rgba(255,255,255,0.08)"} stroke={sel ? selectedSport.color : "rgba(255,255,255,0.2)"} strokeWidth={sel ? "1.5" : "0.5"} />
                            <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="3" fill={sel ? "#000" : "rgba(255,255,255,0.6)"} fontFamily="var(--font-mono)" fontWeight={sel ? "bold" : "normal"}>
                              {p.pos.split(" ").map(w => w[0]).join("").slice(0,3)}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                  {/* Preferred foot */}
                  <div className="mt-3">
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Preferred Foot</label>
                    <div className="flex gap-2">
                      {["Right","Left","Both"].map(f => (
                        <button key={f} onClick={() => update("preferredFoot" as any, f)}
                          className={cn("flex-1 py-2 rounded-xl text-sm font-semibold transition-all", (form as any).preferredFoot === f ? "text-black" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}
                          style={(form as any).preferredFoot === f ? { background: selectedSport.color } : {}}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Athletics: Discipline chips + PB inputs */}
              {form.sport === "athletics" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Primary Discipline (select up to 3)</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSport.positions.map(pos => (
                        <button key={pos} onClick={() => {
                          const cur = ((form as any).disciplines || []) as string[]
                          const next = cur.includes(pos) ? cur.filter((x:string)=>x!==pos) : cur.length < 3 ? [...cur,pos] : cur
                          update("disciplines" as any, next)
                          if (next.length > 0) update("position", next[0])
                        }}
                          className={cn("px-3 py-1.5 rounded-full text-xs font-semibold transition-all")}
                          style={((form as any).disciplines||[]).includes(pos) ? { background: `${selectedSport.color}20`, borderColor: `${selectedSport.color}40`, color: selectedSport.color, border: `1px solid ${selectedSport.color}40` } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text3)" }}>
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                  {((form as any).disciplines||[]).length > 0 && (
                    <div>
                      <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Personal Bests (optional)</label>
                      <div className="space-y-2">
                        {((form as any).disciplines||[]).map((d:string) => (
                          <div key={d} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                            <span className="text-sm font-semibold w-28 shrink-0" style={{ color: selectedSport.color }}>{d}</span>
                            <input placeholder={d.includes("m")&&!d.includes("Jump")&&!d.includes("Triple")?"e.g. 10.84s or 44:32.5":"e.g. 7.23m"} className="w-full flex-1 text-sm rounded-lg py-1.5 px-3 bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text1)]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Kabaddi: Role + Weight */}
              {form.sport === "kabaddi" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Raider","Defender","All-Rounder"].map(r => (
                        <button key={r} onClick={() => update("position", r)}
                          className={cn("py-3 rounded-xl text-sm font-semibold transition-all border")}
                          style={form.position === r ? { background: `${selectedSport.color}20`, borderColor: selectedSport.color, color: selectedSport.color } : { background: "var(--nx-bg4)", borderColor: "var(--nx-border)", color: "var(--nx-text3)" }}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Weight Category (PKL)</label>
                    <div className="flex flex-wrap gap-2">
                      {["55kg","60kg","65kg","70kg","75kg","80kg","85+kg"].map(w => (
                        <button key={w} onClick={() => update("weightCategory" as any, w)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={(form as any).weightCategory === w ? { background: `${selectedSport.color}20`, border: `1px solid ${selectedSport.color}`, color: selectedSport.color } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text3)" }}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Wrestling: Style + Weight */}
              {form.sport === "wrestling" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Freestyle","Greco-Roman","Kushti"].map(s => (
                        <button key={s} onClick={() => update("position", s)}
                          className="py-3 rounded-xl text-sm font-semibold transition-all border"
                          style={form.position === s ? { background: `${selectedSport.color}20`, borderColor: selectedSport.color, color: selectedSport.color } : { background: "var(--nx-bg4)", borderColor: "var(--nx-border)", color: "var(--nx-text3)" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--nx-text3)] mb-2 block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Weight Category</label>
                    <div className="flex flex-wrap gap-2">
                      {["53kg","57kg","65kg","74kg","86kg","97kg","125kg"].map(w => (
                        <button key={w} onClick={() => update("weightCategory" as any, w)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={(form as any).weightCategory === w ? { background: `${selectedSport.color}20`, border: `1px solid ${selectedSport.color}`, color: selectedSport.color } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text3)" }}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Default: chip grid for all other sports */}
              {!["football","athletics","kabaddi","wrestling"].includes(form.sport) && (
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Position / Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSport.positions.map(pos => (
                      <button key={pos} onClick={() => update("position", pos)}
                        className={cn("p-2.5 rounded-xl border text-sm transition-all text-left", form.position === pos ? "font-medium" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]")}
                        style={form.position === pos ? { background: `${selectedSport.color}15`, borderColor: `${selectedSport.color}40`, color: selectedSport.color } : {}}>
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Current Academy / Club (optional)</label>
                <input value={form.academy} onChange={e => update("academy", e.target.value)} placeholder="e.g. Nagpur FC Youth" className="rounded-xl text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>I'm Looking For</label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR.map(item => (
                    <button key={item} onClick={() => toggleLookingFor(item)}
                      className={cn("px-3 py-1.5 rounded-full text-xs transition-all",
                        form.lookingFor.includes(item)
                          ? "font-medium"
                          : "bg-[var(--nx-bg4)] border border-[var(--nx-border2)] text-[var(--nx-text2)]"
                      )}
                      style={form.lookingFor.includes(item) ? { background: `${selectedSport.color}15`, borderColor: `${selectedSport.color}40`, color: selectedSport.color, border: `1px solid ${selectedSport.color}40` } : {}}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Bio + Final */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Almost Done!</h1>
                <p className="text-[var(--nx-text3)] text-sm mt-1">Tell scouts your story</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Career Goal (Optional)</label>
                <textarea value={form.bio} onChange={e => update("bio", e.target.value)}
                  placeholder="e.g. My dream is to represent India in the ISL and eventually the national team..."
                  rows={3} className="rounded-xl text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Email (for trial invitations)</label>
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="your@email.com" className="rounded-xl text-sm" />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-2">
                <p className="text-xs font-semibold text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PROFILE SUMMARY</p>
                {[
                  { label: "Name", value: `${form.firstName} ${form.lastName}` || "Not set" },
                  { label: "Sport", value: selectedSport?.label || "Not set" },
                  { label: "Position", value: form.position || "Not set" },
                  { label: "City", value: form.city || "Not set" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--nx-text3)]">{r.label}</span>
                    <span className="font-medium text-[var(--nx-text1)]">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
                <ArrowLeft className="w-4 h-4" />Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={next} disabled={!canNext()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: selectedSport?.color || "var(--nx-green)", color: "#000" }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: selectedSport?.color || "var(--nx-green)", color: "#000" }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating Profile...</> : <>Create My Profile <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-[var(--nx-text3)] mt-4">
            Already have an account? <Link href="/auth/login" className="text-[var(--nx-green)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
