"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Role", "Organisation", "Sport", "Criteria", "Verify"]
const SPORTS = [
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "kabaddi", label: "Kabaddi", emoji: "🤼" },
  { id: "athletics", label: "Athletics", emoji: "🏃" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "hockey", label: "Hockey", emoji: "🏑" },
  { id: "wrestling", label: "Wrestling", emoji: "🤸" },
  { id: "multi", label: "Multi-Sport", emoji: "🏆" },
]

const TIERS = [
  { id: "isl", label: "ISL Club", desc: "Indian Super League", color: "var(--nx-purple)" },
  { id: "ileague", label: "I-League Club", desc: "India's 2nd tier", color: "var(--nx-cyan)" },
  { id: "pkl", label: "PKL Franchise", desc: "Pro Kabaddi League", color: "var(--nx-pink)" },
  { id: "sai", label: "SAI / State Body", desc: "Sports Authority of India", color: "var(--nx-teal)" },
  { id: "khelo", label: "Khelo India", desc: "Ministry of Sports", color: "var(--nx-gold)" },
  { id: "academy", label: "Private Academy", desc: "Independent academy", color: "var(--nx-green)" },
  { id: "independent", label: "Independent Scout", desc: "Freelance talent scout", color: "var(--nx-orange)" },
]

export default function ScoutOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: "", lastName: "", orgName: "", tier: "", sport: "", position: "", ageMin: "14", ageMax: "21", region: "All India", phone: "" })
  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const selectedTier = TIERS.find(t => t.id === form.tier)
  const selectedSport = SPORTS.find(s => s.id === form.sport)

  const canNext = () => {
    if (step === 1) return form.orgName && form.tier
    if (step === 2) return form.sport
    if (step === 3) return form.position
    return true
  }

  const submit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push("/scout/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--nx-bg2), var(--nx-bg))" }}>
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(155,93,255,0.15)" }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-7xl mb-6">🔍</div>
          <h2 className="text-3xl font-bold text-[var(--nx-text1)] mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
            {step === 0 && "Scout Portal"} {step === 1 && "Your Organisation"} {step === 2 && "Your Sport"} {step === 3 && "Match Criteria"} {step === 4 && "Verification"}
          </h2>
          <p className="text-[var(--nx-text2)] text-sm leading-relaxed">
            {step === 0 && "Access AI-powered athlete discovery with NEXUS Scout. Find the next star for your club or franchise."}
            {step === 1 && "Your organisation and tier determine which athlete pools you can access and your verification badge."}
            {step === 2 && "Define your primary sport so we can surface the right athletes for you."}
            {step === 3 && "Set your discovery criteria — position, age, region — for daily AI recommendations."}
            {step === 4 && "Verify your identity to unlock full scout features and appear as a verified contact to athletes."}
          </p>
          <div className="mt-8 flex gap-1.5 justify-center">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all" style={{ width: i === step ? "24px" : "8px", background: i <= step ? "var(--nx-purple)" : "var(--nx-border2)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <NexusLogo size={32} />
          </Link>

          {/* Steps */}
          <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                  style={{ background: i < step ? "var(--nx-purple)" : i === step ? "rgba(155,93,255,0.2)" : "var(--nx-bg4)", border: `2px solid ${i <= step ? "var(--nx-purple)" : "var(--nx-border2)"}`, color: i < step ? "white" : i === step ? "var(--nx-purple)" : "var(--nx-text3)" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-[10px] hidden sm:block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", color: i === step ? "var(--nx-text1)" : "var(--nx-text3)" }}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-3 h-px bg-[var(--nx-border2)]" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Scout Registration</h1>
                <p className="text-sm text-[var(--nx-text3)] mt-1">Tell us about yourself to begin</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>First Name</label>
                  <input value={form.firstName} onChange={e => up("firstName", e.target.value)} placeholder="Rahul" className="rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Last Name</label>
                  <input value={form.lastName} onChange={e => up("lastName", e.target.value)} placeholder="Verma" className="rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => up("phone", e.target.value)} placeholder="+91 98765 43210" className="rounded-xl text-sm" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Your Organisation</h1>
                <p className="text-sm text-[var(--nx-text3)] mt-1">This determines your scout tier and badge</p></div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Organisation Name</label>
                <input value={form.orgName} onChange={e => up("orgName", e.target.value)} placeholder="e.g. Mumbai City FC" className="rounded-xl text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Organisation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIERS.map(tier => (
                    <button key={tier.id} onClick={() => up("tier", tier.id)}
                      className={cn("flex items-center gap-2 p-3 rounded-xl border text-left transition-all",
                        form.tier === tier.id ? "border-current font-medium" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}
                      style={form.tier === tier.id ? { background: `${tier.color}10`, borderColor: `${tier.color}50`, color: tier.color } : {}}>
                      <div>
                        <p className="text-sm font-semibold" style={form.tier !== tier.id ? { color: "var(--nx-text1)" } : {}}>{tier.label}</p>
                        <p className="text-[10px] text-[var(--nx-text3)]">{tier.desc}</p>
                      </div>
                      {form.tier === tier.id && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Primary Sport</h1>
                <p className="text-sm text-[var(--nx-text3)] mt-1">Select your main scouting discipline</p></div>
              <div className="grid grid-cols-2 gap-2.5">
                {SPORTS.map(sport => (
                  <button key={sport.id} onClick={() => up("sport", sport.id)}
                    className={cn("flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                      form.sport === sport.id ? "border-[var(--nx-purple)] bg-[rgba(155,93,255,0.1)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}>
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className="font-medium text-sm text-[var(--nx-text1)]">{sport.label}</span>
                    {form.sport === sport.id && <CheckCircle2 className="w-4 h-4 ml-auto text-[var(--nx-purple)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Match Criteria</h1>
                <p className="text-sm text-[var(--nx-text3)] mt-1">AI uses these to find athletes for you daily</p></div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Target Position(s)</label>
                <input value={form.position} onChange={e => up("position", e.target.value)} placeholder="e.g. Striker, Left Wing Forward" className="rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Min Age</label>
                  <input type="number" value={form.ageMin} onChange={e => up("ageMin", e.target.value)} className="rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Max Age</label>
                  <input type="number" value={form.ageMax} onChange={e => up("ageMax", e.target.value)} className="rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Preferred Region</label>
                <select value={form.region} onChange={e => up("region", e.target.value)} className="rounded-xl text-sm">
                  {["All India", "North India", "South India", "East India", "West India", "Northeast India"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Identity Verification</h1>
                <p className="text-sm text-[var(--nx-text3)] mt-1">Verified scouts get a badge and 3x more athlete responses</p></div>
              <div className="p-4 rounded-2xl border" style={{ background: "rgba(0,212,255,0.04)", borderColor: "rgba(0,212,255,0.2)" }}>
                <p className="text-sm text-[var(--nx-text1)] font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-[var(--nx-cyan)]" />Verification Documents</p>
                <div className="space-y-2">
                  {["Organisation ID / employee letter", "Government ID (Aadhaar/PAN/Passport)", "Recent profile photo"].map((doc, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] cursor-pointer hover:border-[var(--nx-border2)] transition-colors">
                      <div className="w-8 h-8 rounded-lg border-2 border-dashed border-[var(--nx-border2)] flex items-center justify-center text-[var(--nx-text3)] hover:border-[var(--nx-cyan)]">
                        +
                      </div>
                      <span className="text-sm text-[var(--nx-text2)]">{doc}</span>
                      <input type="file" className="hidden" />
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <p className="text-sm font-semibold text-[var(--nx-text1)] mb-2">Profile Summary</p>
                {[
                  { label: "Name", val: `${form.firstName} ${form.lastName}` || "—" },
                  { label: "Organisation", val: form.orgName || "—" },
                  { label: "Tier", val: selectedTier?.label || "—" },
                  { label: "Sport", val: selectedSport?.label || "—" },
                  { label: "Target", val: form.position || "—" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0 text-sm">
                    <span className="text-[var(--nx-text3)]">{r.label}</span>
                    <span className="font-medium text-[var(--nx-text1)]">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors">
                <ArrowLeft className="w-4 h-4" />Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-purple)] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-purple)] text-white font-semibold text-sm hover:brightness-110 transition-all">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating Profile...</> : <>Start Scouting <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
          <p className="text-center text-xs text-[var(--nx-text3)] mt-4">
            Already have an account? <Link href="/auth/login" className="text-[var(--nx-purple)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
