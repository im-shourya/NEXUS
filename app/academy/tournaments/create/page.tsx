"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Basics", "Format", "Scouts", "Publish"]
const SPORTS = [
  { id: "FOOTBALL", label: "Football", emoji: "⚽" },
  { id: "CRICKET", label: "Cricket", emoji: "🏏" },
  { id: "KABADDI", label: "Kabaddi", emoji: "🤼" },
  { id: "ATHLETICS", label: "Athletics", emoji: "🏃" },
  { id: "BADMINTON", label: "Badminton", emoji: "🏸" },
  { id: "HOCKEY", label: "Hockey", emoji: "🏑" },
]
const FORMATS: Record<string, string[]> = {
  FOOTBALL: ["11-a-side", "7-a-side", "5-a-side", "Futsal"],
  CRICKET: ["T20", "ODI (50-over)", "T10", "40-over", "35-over"],
  KABADDI: ["PKL Format (40 min)", "Short Format (20 min)", "Beach Kabaddi"],
  ATHLETICS: ["Track & Field Meet", "Road Race", "Combined Events"],
  BADMINTON: ["Single Elimination", "Round Robin", "Group + Knockout"],
  HOCKEY: ["Field Hockey (11v11)", "Indoor Hockey (5v5)"],
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "", sport: "", format: "", ageGroup: "", city: "", state: "", venue: "",
    startDate: "", endDate: "", regDeadline: "", entryFee: "0", maxParticipants: "",
    prize: "", tier: "DISTRICT", scoutAlerts: true, isPublic: true, description: ""
  })
  const up = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const canNext = () => {
    if (step === 0) return form.title && form.sport && form.city && form.startDate
    if (step === 1) return form.format && form.ageGroup
    return true
  }
  const submit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push("/academy/tournaments")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="p-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)]">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Create Tournament</h1>
          <p className="text-sm text-[var(--nx-text3)]">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all"
              style={{ background: i < step ? "var(--nx-gold)" : i === step ? "rgba(255,184,0,0.2)" : "var(--nx-bg4)", border: `2px solid ${i <= step ? "var(--nx-gold)" : "var(--nx-border2)"}`, color: i < step ? "black" : i === step ? "var(--nx-gold)" : "var(--nx-text3)" }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className="text-[10px] hidden sm:block" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", color: i === step ? "var(--nx-text1)" : "var(--nx-text3)" }}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[var(--nx-border2)]" />}
          </div>
        ))}
      </div>

      {/* Step 0 — Basics */}
      {step === 0 && (
        <div className="space-y-5 p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Tournament Title</label>
            <input value={form.title} onChange={e => up("title", e.target.value)} placeholder="e.g. Nagpur FC U-17 District Cup 2026" className="rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Sport</label>
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => up("sport", s.id)}
                  className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm transition-all", form.sport === s.id ? "border-[var(--nx-gold)] bg-[rgba(255,184,0,0.08)] text-[var(--nx-gold)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-text2)] hover:border-[var(--nx-border2)]")}>
                  <span>{s.emoji}</span><span className="font-medium text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>City</label>
              <input value={form.city} onChange={e => up("city", e.target.value)} placeholder="Nagpur" className="rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Venue</label>
              <input value={form.venue} onChange={e => up("venue", e.target.value)} placeholder="Stadium / Ground name" className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["startDate", "Start Date"], ["endDate", "End Date"], ["regDeadline", "Reg. Deadline"]].map(([k, l]) => (
              <div key={k} className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</label>
                <input type="date" value={(form as any)[k]} onChange={e => up(k, e.target.value)} className="rounded-xl text-sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Format */}
      {step === 1 && (
        <div className="space-y-5 p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <div className="space-y-2">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Format</label>
            <div className="flex flex-wrap gap-2">
              {(FORMATS[form.sport] || FORMATS.FOOTBALL).map(f => (
                <button key={f} onClick={() => up("format", f)}
                  className={cn("px-3 py-2 rounded-xl text-sm transition-all", form.format === f ? "bg-[var(--nx-gold)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Age Group</label>
            <div className="flex flex-wrap gap-2">
              {["U-12", "U-14", "U-17", "U-19", "U-21", "Senior", "Open Age"].map(ag => (
                <button key={ag} onClick={() => up("ageGroup", ag)}
                  className={cn("px-3 py-2 rounded-xl text-sm transition-all", form.ageGroup === ag ? "bg-[var(--nx-gold)] text-black font-semibold" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]")}>
                  {ag}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Entry Fee (₹)</label>
              <input type="number" value={form.entryFee} onChange={e => up("entryFee", e.target.value)} placeholder="0 for free" className="rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Max Participants</label>
              <input type="number" value={form.maxParticipants} onChange={e => up("maxParticipants", e.target.value)} placeholder="50" className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Prize / Opportunity</label>
            <input value={form.prize} onChange={e => up("prize", e.target.value)} placeholder="e.g. ₹25,000 + ISL Academy Trial Opportunity" className="rounded-xl text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Tournament Tier</label>
            <select value={form.tier} onChange={e => up("tier", e.target.value)} className="rounded-xl text-sm">
              <option value="DISTRICT">District Level</option>
              <option value="STATE">State Level</option>
              <option value="KHELO_INDIA">Khelo India</option>
              <option value="AIFF">AIFF / National Body</option>
              <option value="ISL_OFFICIAL">ISL Official</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2 — Scouts */}
      {step === 2 && (
        <div className="space-y-5 p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
            <div>
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Scout Alert System</p>
              <p className="text-xs text-[var(--nx-text3)] mt-0.5">Subscribed scouts get notified for each goal, wicket, or milestone during live play</p>
            </div>
            <button onClick={() => up("scoutAlerts", !form.scoutAlerts)}
              className={cn("relative w-11 h-6 rounded-full transition-all shrink-0", form.scoutAlerts ? "bg-[var(--nx-gold)]" : "bg-[var(--nx-bg5)]")}>
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform", form.scoutAlerts ? "left-6" : "left-1")} />
            </button>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)" }}>
            <p className="text-xs font-semibold text-[var(--nx-cyan)] mb-2" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>How Scout Alerts Work</p>
            <ul className="text-xs text-[var(--nx-text2)] space-y-1">
              {["Scouts who bookmark this tournament are auto-enrolled", "Every live goal/milestone pushes a notification with scorer's NEXUS profile", "Scouts can view athlete profile and shortlist instantly from notification", "Your academy gets 2x more scout inquiries from tournaments with alerts enabled"].map((l, i) => (
                <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--nx-cyan)] mt-0.5 shrink-0" />{l}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Tournament Description</label>
            <textarea value={form.description} onChange={e => up("description", e.target.value)} placeholder="Describe the tournament, rules, and opportunities..." rows={4} className="rounded-xl text-sm" />
          </div>
        </div>
      )}

      {/* Step 3 — Publish */}
      {step === 3 && (
        <div className="space-y-5 p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
          <p className="font-semibold text-[var(--nx-text1)]">Review & Publish</p>
          {[
            { label: "Title", val: form.title || "—" },
            { label: "Sport", val: form.sport || "—" },
            { label: "Format", val: form.format || "—" },
            { label: "Age Group", val: form.ageGroup || "—" },
            { label: "City", val: form.city || "—" },
            { label: "Dates", val: form.startDate ? `${form.startDate} → ${form.endDate}` : "—" },
            { label: "Entry Fee", val: form.entryFee === "0" ? "Free" : `₹${form.entryFee}` },
            { label: "Scout Alerts", val: form.scoutAlerts ? "Enabled ✓" : "Disabled" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--nx-border)] last:border-0 text-sm">
              <span className="text-[var(--nx-text3)]">{r.label}</span>
              <span className="font-medium text-[var(--nx-text1)]">{r.val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--nx-gold)]/5 border border-[var(--nx-gold)]/20">
            <div>
              <p className="font-semibold text-sm text-[var(--nx-text1)]">Publishing as DRAFT first</p>
              <p className="text-xs text-[var(--nx-text3)] mt-0.5">You can change status to Open when ready for registrations</p>
            </div>
            <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>DRAFT</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm">
            <ArrowLeft className="w-4 h-4" />Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <>Create Tournament <ArrowRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  )
}
