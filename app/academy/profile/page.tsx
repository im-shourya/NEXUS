"use client"
import { useState } from "react"
import { Camera, CheckCircle2, Loader2, Globe, Phone, Mail } from "lucide-react"

export default function AcademyProfilePage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: "Nagpur FC Youth Academy",
    sport: "Football",
    city: "Nagpur",
    state: "Maharashtra",
    established: "2015",
    capacity: "50",
    coaches: "8",
    description: "We develop the next generation of Indian footballers through structured training, mental conditioning, and competitive exposure. Our academy has produced 12 professional players in 9 years.",
    facilities: ["Full-size ground", "Weight room", "Video analysis lab", "Dormitory (40 beds)"],
    website: "https://nagpurfc.in",
    phone: "+91 71234 56789",
    email: "academy@nagpurfc.in",
    tier: "PREMIUM",
  })
  const up = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Profile</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">How scouts and athletes see your academy</p></div>

      {/* Logo / Banner */}
      <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Branding</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
              style={{ background: "rgba(255,184,0,0.1)", border: "2px solid rgba(255,184,0,0.3)", color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>
              NF
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--nx-gold)] flex items-center justify-center cursor-pointer hover:brightness-110">
              <Camera className="w-3.5 h-3.5 text-black" />
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <p className="font-semibold text-[var(--nx-text1)]">{form.name}</p>
            <p className="text-sm text-[var(--nx-text3)]">{form.sport} · {form.city}, {form.state}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>{form.tier}</span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
        <h2 className="font-semibold text-[var(--nx-text1)]">Basic Information</h2>
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Academy Name</label>
          <input value={form.name} onChange={e => up("name", e.target.value)} className="rounded-xl text-sm" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Primary Sport</label>
            <select value={form.sport} onChange={e => up("sport", e.target.value)} className="rounded-xl text-sm">
              {["Football", "Cricket", "Kabaddi", "Athletics", "Badminton", "Hockey", "Multi-Sport"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Established Year</label>
            <input type="number" value={form.established} onChange={e => up("established", e.target.value)} className="rounded-xl text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>City</label>
            <input value={form.city} onChange={e => up("city", e.target.value)} className="rounded-xl text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>State</label>
            <input value={form.state} onChange={e => up("state", e.target.value)} className="rounded-xl text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Athlete Capacity</label>
            <input type="number" value={form.capacity} onChange={e => up("capacity", e.target.value)} className="rounded-xl text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Number of Coaches</label>
            <input type="number" value={form.coaches} onChange={e => up("coaches", e.target.value)} className="rounded-xl text-sm" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>About Academy</label>
          <textarea value={form.description} onChange={e => up("description", e.target.value)} rows={3} className="rounded-xl text-sm" />
        </div>
      </div>

      {/* Facilities */}
      <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
        <h2 className="font-semibold text-[var(--nx-text1)]">Facilities</h2>
        <div className="flex flex-wrap gap-2">
          {form.facilities.map((f, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border2)] text-[var(--nx-text2)]">
              <CheckCircle2 className="w-3 h-3 text-[var(--nx-green)]" />{f}
              <button onClick={() => up("facilities", form.facilities.filter((_, j) => j !== i))} className="ml-1 text-[var(--nx-text3)] hover:text-[var(--nx-red)]">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input id="facilityInput" placeholder="Add facility..." className="w-full flex-1 rounded-xl text-sm py-2" />
          <button onClick={() => {
            const inp = document.getElementById("facilityInput") as HTMLInputElement
            if (inp.value.trim()) { up("facilities", [...form.facilities, inp.value.trim()]); inp.value = "" }
          }} className="px-4 py-2 rounded-xl bg-[var(--nx-gold)]/15 border border-[var(--nx-gold)]/25 text-[var(--nx-gold)] text-sm font-semibold hover:brightness-110 transition-all">
            Add
          </button>
        </div>
      </div>

      {/* Contact */}
      <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
        <h2 className="font-semibold text-[var(--nx-text1)]">Contact Details</h2>
        <div className="space-y-3">
          {[
            { icon: Globe, label: "Website", key: "website", type: "url", placeholder: "https://yoursite.com" },
            { icon: Phone, label: "Phone", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
            { icon: Mail, label: "Email", key: "email", type: "email", placeholder: "academy@example.com" },
          ].map(field => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs flex items-center gap-1.5 text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
                <field.icon className="w-3 h-3" />{field.label}
              </label>
              <input type={field.type} value={(form as any)[field.key]} onChange={e => up(field.key, e.target.value)} placeholder={field.placeholder} className="rounded-xl text-sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--nx-gold)] text-black font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-70">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </div>
    </div>
  )
}
