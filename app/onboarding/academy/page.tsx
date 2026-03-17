"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Type", "Details", "Sport", "Facilities", "Launch"]
const SPORTS = [{ id: "football", e: "⚽", l: "Football" }, { id: "cricket", e: "🏏", l: "Cricket" }, { id: "kabaddi", e: "🤼", l: "Kabaddi" }, { id: "athletics", e: "🏃", l: "Athletics" }, { id: "badminton", e: "🏸", l: "Badminton" }, { id: "hockey", e: "🏑", l: "Hockey" }, { id: "multi", e: "🏆", l: "Multi-Sport" }]
const ACADEMY_TYPES = [
  { id: "isl_feeder", label: "ISL Feeder Club", color: "var(--nx-purple)", desc: "Affiliated with ISL club" },
  { id: "sai", label: "SAI Centre", color: "var(--nx-teal)", desc: "Sports Authority of India" },
  { id: "private", label: "Private Academy", color: "var(--nx-gold)", desc: "Independent training centre" },
  { id: "school", label: "School / College", color: "var(--nx-cyan)", desc: "Institutional sports wing" },
  { id: "state", label: "State Sports Body", color: "var(--nx-green)", desc: "State government-run" },
  { id: "club", label: "Community Club", color: "var(--nx-orange)", desc: "Grassroots football/sports club" },
]
const FACILITY_OPTIONS = ["Full-size Ground", "Half-size Ground", "Indoor Hall", "Swimming Pool", "Weight Room / Gym", "Video Analysis Lab", "Physiotherapy Room", "Dormitory", "Canteen", "Medical Facility"]

export default function AcademyOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ type: "", name: "", city: "", state: "", established: "", capacity: "", coaches: "", sport: "", facilities: [] as string[], description: "" })
  const up = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const toggleFacility = (f: string) => up("facilities", form.facilities.includes(f) ? form.facilities.filter(i => i !== f) : [...form.facilities, f])
  const canNext = () => { if (step === 0) return form.type; if (step === 1) return form.name && form.city; if (step === 2) return form.sport; return true }
  const submit = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "academy",
          academyName: form.name,
          tier: form.type,
          sports: [form.sport],
          city: form.city,
          state: form.state,
          facilities: form.facilities,
          description: form.description,
          capacity: form.capacity,
          established: form.established,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save profile")
      router.push(data.redirect || "/academy/dashboard")
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.")
      setSaving(false)
    }
  }
  const selectedType = ACADEMY_TYPES.find(t => t.id === form.type)

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--nx-bg2), var(--nx-bg))" }}>
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-[100px]" style={{ background: "rgba(255,184,0,0.12)" }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-7xl mb-6">🏟️</div>
          <h2 className="text-3xl font-bold text-[var(--nx-text1)] mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>Academy Portal</h2>
          <p className="text-[var(--nx-text2)] text-sm leading-relaxed">Register your academy, list your athletes, and attract scouts from ISL, PKL, and SAI directly through NEXUS.</p>
          <div className="mt-8 flex gap-1.5 justify-center">
            {STEPS.map((_, i) => <div key={i} className="h-1 rounded-full transition-all" style={{ width: i === step ? "24px" : "8px", background: i <= step ? "var(--nx-gold)" : "var(--nx-border2)" }} />)}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8"><NexusLogo size={32} /></Link>

          <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: i < step ? "var(--nx-gold)" : i === step ? "rgba(255,184,0,0.2)" : "var(--nx-bg4)", border: `2px solid ${i <= step ? "var(--nx-gold)" : "var(--nx-border2)"}`, color: i < step ? "black" : i === step ? "var(--nx-gold)" : "var(--nx-text3)" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-[10px] hidden sm:block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", color: i === step ? "var(--nx-text1)" : "var(--nx-text3)" }}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-3 h-px bg-[var(--nx-border2)]" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Type</h1><p className="text-sm text-[var(--nx-text3)] mt-1">Select the type that best describes your academy</p></div>
              <div className="grid grid-cols-2 gap-2.5">
                {ACADEMY_TYPES.map(type => (
                  <button key={type.id} onClick={() => up("type", type.id)}
                    className={cn("p-4 rounded-xl border text-left transition-all", form.type === type.id ? "font-medium" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}
                    style={form.type === type.id ? { background: `${type.color}10`, borderColor: `${type.color}40`, color: type.color } : {}}>
                    <p className="font-semibold text-sm" style={form.type !== type.id ? { color: "var(--nx-text1)" } : {}}>{type.label}</p>
                    <p className="text-[10px] mt-0.5" style={form.type !== type.id ? { color: "var(--nx-text3)" } : { opacity: 0.8 }}>{type.desc}</p>
                    {form.type === type.id && <CheckCircle2 className="w-4 h-4 mt-2" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Details</h1><p className="text-sm text-[var(--nx-text3)] mt-1">Basic information about your academy</p></div>
              <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Academy Name</label>
                <input value={form.name} onChange={e => up("name", e.target.value)} placeholder="e.g. Nagpur FC Youth Academy" className="rounded-xl text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>City</label>
                  <input value={form.city} onChange={e => up("city", e.target.value)} placeholder="Nagpur" className="rounded-xl text-sm" /></div>
                <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>State</label>
                  <input value={form.state} onChange={e => up("state", e.target.value)} placeholder="Maharashtra" className="rounded-xl text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Est. Year</label>
                  <input type="number" value={form.established} onChange={e => up("established", e.target.value)} placeholder="2015" className="rounded-xl text-sm" /></div>
                <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => up("capacity", e.target.value)} placeholder="50" className="rounded-xl text-sm" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Primary Sport</h1><p className="text-sm text-[var(--nx-text3)] mt-1">This shapes your athlete profiles and scout connections</p></div>
              <div className="grid grid-cols-2 gap-2.5">
                {SPORTS.map(sport => (
                  <button key={sport.id} onClick={() => up("sport", sport.id)}
                    className={cn("flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left", form.sport === sport.id ? "border-[var(--nx-gold)] bg-[rgba(255,184,0,0.08)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}>
                    <span className="text-2xl">{sport.e}</span>
                    <span className="font-medium text-sm text-[var(--nx-text1)]">{sport.l}</span>
                    {form.sport === sport.id && <CheckCircle2 className="w-4 h-4 ml-auto text-[var(--nx-gold)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Facilities</h1><p className="text-sm text-[var(--nx-text3)] mt-1">Select all facilities available at your academy</p></div>
              <div className="grid grid-cols-2 gap-2">
                {FACILITY_OPTIONS.map(f => (
                  <button key={f} onClick={() => toggleFacility(f)}
                    className={cn("flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all",
                      form.facilities.includes(f) ? "bg-[var(--nx-gold)]/10 border-[var(--nx-gold)]/40 text-[var(--nx-gold)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]")}>
                    {form.facilities.includes(f) ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded border border-[var(--nx-border2)] shrink-0" />}
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Ready to Launch!</h1><p className="text-sm text-[var(--nx-text3)] mt-1">Your academy profile is ready to go live</p></div>
              <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-gold)]/30" style={{ background: "rgba(255,184,0,0.03)" }}>
                <p className="text-xs font-semibold mb-3" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>SUMMARY</p>
                {[
                  { label: "Academy Name", val: form.name || "—" },
                  { label: "Type", val: selectedType?.label || "—" },
                  { label: "Location", val: form.city && form.state ? `${form.city}, ${form.state}` : "—" },
                  { label: "Sport", val: SPORTS.find(s => s.id === form.sport)?.l || "—" },
                  { label: "Facilities", val: form.facilities.length > 0 ? `${form.facilities.length} listed` : "None" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--nx-border)] last:border-0 text-sm">
                    <span className="text-[var(--nx-text3)]">{r.label}</span>
                    <span className="font-medium text-[var(--nx-text1)]">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]">
                <p className="text-sm text-[var(--nx-text1)]">✅ After registration, you can <strong className="text-[var(--nx-green)]">add your athletes</strong>, upload videos, and start receiving scout enquiries.</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:text-[var(--nx-text1)] transition-colors"><ArrowLeft className="w-4 h-4" />Back</button>}
            {step < STEPS.length - 1
              ? <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50">Continue <ArrowRight className="w-4 h-4" /></button>
              : <button onClick={submit} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <>Launch Academy <ArrowRight className="w-4 h-4" /></>}
                </button>}
          </div>
          <p className="text-center text-xs text-[var(--nx-text3)] mt-4">Already have an account? <Link href="/auth/login" className="text-[var(--nx-gold)] hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
