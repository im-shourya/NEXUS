"use client"
import { useState } from "react"
import { Camera, Shield, CheckCircle2, Loader2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

const SPORTS = ["Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey", "Wrestling", "Multi-Sport"]
const REGIONS = ["North India", "South India", "East India", "West India", "Northeast India", "Pan-India"]
const AGE_GROUPS = ["U-14", "U-17", "U-19", "U-21", "Senior", "All Ages"]
const ORG_TIERS = [
  { id: "ISL", label: "Indian Super League (ISL)", color: "var(--nx-purple)" },
  { id: "I_LEAGUE", label: "I-League / I2 League", color: "var(--nx-purple)" },
  { id: "IPL", label: "IPL / BCCI Academy", color: "var(--nx-gold)" },
  { id: "PKL", label: "Pro Kabaddi League (PKL)", color: "var(--nx-pink)" },
  { id: "SAI", label: "SAI / Government Programme", color: "var(--nx-cyan)" },
  { id: "STATE", label: "State Association / Federation", color: "var(--nx-teal)" },
  { id: "PRIVATE", label: "Private / Independent Scout", color: "var(--nx-text2)" },
]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={cn("relative w-11 h-6 rounded-full transition-all shrink-0", on ? "bg-[var(--nx-purple)]" : "bg-[var(--nx-bg5)]")}>
      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform", on ? "left-6" : "left-1")} />
    </button>
  )
}

function ChipToggle({ items, selected, onToggle, color = "var(--nx-purple)" }: { items: string[]; selected: string[]; onToggle: (v: string) => void; color?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button key={item} onClick={() => onToggle(item)}
          className="px-3 py-1.5 rounded-xl text-sm transition-all"
          style={selected.includes(item) ? { background: `${color}15`, borderColor: `${color}50`, color, border: `1px solid ${color}50` } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text2)" }}>
          {item}
        </button>
      ))}
    </div>
  )
}

export default function ScoutProfilePage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    fullName: "Rahul Verma",
    title: "Head of Talent Scouting",
    organisation: "Mumbai City FC",
    orgTier: "ISL",
    bio: "Scouting talent for Mumbai City FC's U-17 and U-19 squads. Looking for technically gifted attackers from West India. Transparent communication guaranteed.",
    linkedin: "",
    sports: ["Football"],
    regions: ["West India", "North India"],
    ageGroups: ["U-17", "U-19"],
    positions: ["Striker", "Attacking Midfielder", "Winger"],
    minScore: 65,
    minCompleteness: 70,
    availableForTrials: true,
    injuryFree: false,
    showOrg: true,
    showBadge: true,
    showViewed: true,
  })

  const up = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const toggleArr = (arr: string[], key: string, val: string) =>
    up(key, (form as any)[key].includes(val) ? (form as any)[key].filter((i: string) => i !== val) : [...(form as any)[key], val])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const selectedTier = ORG_TIERS.find(t => t.id === form.orgTier)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Scout Profile</h1>
          <p className="text-sm text-[var(--nx-text3)] mt-0.5">Your profile is visible to athletes you contact and academies you partner with</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-70" style={{ background: "var(--nx-purple)", color: "white" }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — Avatar + Verification */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: "rgba(155,93,255,0.1)", border: "2px solid rgba(155,93,255,0.3)", color: "var(--nx-purple)", fontFamily: "var(--font-display)" }}>
                RV
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--nx-purple)] flex items-center justify-center cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-white" /><input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <p className="font-bold text-[var(--nx-text1)]">{form.fullName}</p>
            <p className="text-sm text-[var(--nx-text3)] mt-0.5">{form.title}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold" style={{ background: `${selectedTier?.color}15`, color: selectedTier?.color, border: `1px solid ${selectedTier?.color}30`, fontFamily: "var(--font-mono)" }}>
                {form.orgTier}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--nx-green)]">
                <Shield className="w-3 h-3" />Verified
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <p className="font-semibold text-sm text-[var(--nx-text1)] mb-3">Verification Status</p>
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: "rgba(0,245,116,0.06)", border: "1px solid var(--nx-green-border)" }}>
              <Shield className="w-5 h-5 text-[var(--nx-green)] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--nx-green)]">ISL Verified Scout</p>
                <p className="text-xs text-[var(--nx-text3)]">Verified April 2024 · Mumbai City FC</p>
              </div>
            </div>
            <p className="text-xs text-[var(--nx-text3)] mt-3">Your verification badge appears on all communications to athletes. Athletes trust verified scouts 3x more.</p>
            <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
              <Upload className="w-3 h-3 inline mr-1" />Update Verification Document
            </button>
          </div>

          {/* Scout Stats */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <p className="font-semibold text-sm text-[var(--nx-text1)] mb-3">My Activity</p>
            {[["Athletes Discovered", "847"], ["Shortlisted", "62"], ["Trials Sent", "14"], ["Trials Accepted", "9"], ["Response Rate", "84%"]].map(([l, v]) => (
              <div key={l} className="flex justify-between items-center py-2 border-b border-[var(--nx-border)] last:border-0 text-sm">
                <span className="text-[var(--nx-text3)]">{l}</span>
                <span className="font-bold" style={{ color: "var(--nx-purple)", fontFamily: "var(--font-display)", fontSize: "18px" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Professional Details */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Professional Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Full Name</label>
                  <input value={form.fullName} onChange={e => up("fullName", e.target.value)} className="rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Your Title</label>
                  <input value={form.title} onChange={e => up("title", e.target.value)} placeholder="Head of Talent Scouting" className="rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Organisation</label>
                <input value={form.organisation} onChange={e => up("organisation", e.target.value)} className="rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Organisation Tier</label>
                <div className="flex flex-wrap gap-2">
                  {ORG_TIERS.map(t => (
                    <button key={t.id} onClick={() => up("orgTier", t.id)}
                      className="px-3 py-1.5 rounded-xl text-xs transition-all"
                      style={form.orgTier === t.id ? { background: `${t.color}15`, border: `1px solid ${t.color}50`, color: t.color, fontFamily: "var(--font-mono)" } : { background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text3)" }}>
                      {t.label.split(" (")[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Scouting Philosophy / Bio</label>
                <textarea value={form.bio} onChange={e => up("bio", e.target.value)} rows={3} placeholder="Describe what you look for and how you work with athletes..." className="rounded-xl text-sm" />
                <p className="text-xs text-[var(--nx-text3)]">Visible to athletes when they view your profile. Transparent scouts get 40% higher response rates.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>LinkedIn (Optional)</label>
                <input value={form.linkedin} onChange={e => up("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" className="rounded-xl text-sm" />
              </div>
            </div>
          </div>

          {/* Scouting Focus */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Scouting Focus</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Sports I Scout</label>
                <ChipToggle items={SPORTS} selected={form.sports} onToggle={v => toggleArr(form.sports, "sports", v)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Age Groups</label>
                <ChipToggle items={AGE_GROUPS} selected={form.ageGroups} onToggle={v => toggleArr(form.ageGroups, "ageGroups", v)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Geographic Regions</label>
                <ChipToggle items={REGIONS} selected={form.regions} onToggle={v => toggleArr(form.regions, "regions", v)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Minimum AI Score: {form.minScore}
                </label>
                <input type="range" min={40} max={95} value={form.minScore} onChange={e => up("minScore", +e.target.value)} className="w-full accent-[var(--nx-purple)]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Minimum Profile Completeness: {form.minCompleteness}%
                </label>
                <input type="range" min={40} max={100} value={form.minCompleteness} onChange={e => up("minCompleteness", +e.target.value)} className="w-full accent-[var(--nx-purple)]" />
              </div>
              {[
                ["availableForTrials", "Available for Trials Only", "Only show athletes actively seeking trial opportunities"],
                ["injuryFree", "Injury-Free Athletes Only", "Exclude athletes with MODERATE or HIGH injury risk"],
              ].map(([k, l, d]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-3 border-t border-[var(--nx-border)]">
                  <div><p className="text-sm font-medium text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
                  <Toggle on={(form as any)[k]} onChange={v => up(k, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Privacy Settings</h2>
            {[
              ["showOrg", "Show my organisation name to athletes before first contact", "Builds trust — verified scouts who show their organisation get 3x higher response rates"],
              ["showBadge", "Show verification badge details publicly", "Display your ISL/PKL/SAI tier badge on all communications"],
              ["showViewed", "Allow athletes to see when I viewed their profile", "Part of NEXUS transparency commitment — scouts who show interest get 2x more responses"],
            ].map(([k, l, d]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
                <div><p className="text-sm font-medium text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
                <Toggle on={(form as any)[k]} onChange={v => up(k, v)} />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-70" style={{ background: "var(--nx-purple)", color: "white" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
