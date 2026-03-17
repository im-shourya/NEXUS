"use client"
import { useState } from "react"
import { Users, Bell, Palette, Settings, CreditCard, AlertTriangle, CheckCircle2, Loader2, Camera, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "team", label: "Team", icon: Users },
  { id: "brand", label: "Branding", icon: Palette },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "onboarding", label: "Athlete Setup", icon: Settings },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]
const ROLES = ["Owner", "Coach", "Scout Liaison", "Tournament Manager"]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={cn("relative w-11 h-6 rounded-full transition-all shrink-0", on ? "bg-[var(--nx-gold)]" : "bg-[var(--nx-bg5)]")}>
      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform", on ? "left-6" : "left-1")} />
    </button>
  )
}

export default function AcademySettingsPage() {
  const [tab, setTab] = useState("team")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [team, setTeam] = useState([
    { id: 1, name: "Nagpur FC Admin", email: "admin@nagpurfc.in", role: "Owner" },
    { id: 2, name: "Coach Ramesh Kumar", email: "ramesh@nagpurfc.in", role: "Coach" },
  ])
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("Coach")
  const [notifs, setNotifs] = useState({ scoutInquiry: true, injuryAlert: true, tournamentMilestone: true, billing: true, achievement: false })
  const [onboarding, setOnboarding] = useState({ autoInvite: true, profileRequired: false, defaultVisibility: "SCOUTS_ONLY" })
  const [primaryColor, setPrimaryColor] = useState("#00F574")

  const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 1000)); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academy Settings</h1><p className="text-sm text-[var(--nx-text3)] mt-0.5">Manage team, branding, and account preferences</p></div>
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--nx-border)]">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
            tab === t.id ? t.id === "danger" ? "bg-[var(--nx-red)]/10 text-[var(--nx-red)] border border-[var(--nx-red)]/20" : "bg-[rgba(255,184,0,0.08)] text-[var(--nx-gold)] border border-[rgba(255,184,0,0.25)]"
              : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]")}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "team" && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Team Members</h2>
            <div className="space-y-3 mb-5">
              {team.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)" }}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--nx-text1)] truncate">{m.name}</p>
                    <p className="text-xs text-[var(--nx-text3)] truncate">{m.email}</p>
                  </div>
                  <select value={m.role} onChange={e => setTeam(p => p.map(t => t.id === m.id ? { ...t, role: e.target.value } : t))}
                    className="rounded-lg text-xs py-1.5 px-2 w-40">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  {m.role !== "Owner" && (
                    <button onClick={() => setTeam(p => p.filter(t => t.id !== m.id))} className="p-1.5 text-[var(--nx-text3)] hover:text-[var(--nx-red)] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Add by email..." className="flex-1 rounded-xl text-sm py-2" />
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className="rounded-xl text-sm py-2 w-40">
                {ROLES.filter(r => r !== "Owner").map(r => <option key={r}>{r}</option>)}
              </select>
              <button onClick={() => { if (newEmail.trim()) { setTeam(p => [...p, { id: Date.now(), name: newEmail, email: newEmail, role: newRole }]); setNewEmail("") } }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--nx-gold)", color: "#000" }}>
                <Plus className="w-4 h-4" />Add
              </button>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3">Role Permissions</h3>
            <div className="space-y-2 text-xs text-[var(--nx-text2)]">
              {[["Owner", "Full access including billing, team management, and plan changes"],
                ["Coach", "Access to athlete performance, roster, and training data. No billing access."],
                ["Scout Liaison", "Access to scout conversations and match management. No financial data."],
                ["Tournament Manager", "Access to tournament creation and live scoring only."]].map(([r, d]) => (
                <div key={r} className="flex gap-3 py-2 border-b border-[var(--nx-border)] last:border-0">
                  <span className="font-semibold text-[var(--nx-text1)] w-32 shrink-0">{r}</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "brand" && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Academy Logo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold" style={{ background: "rgba(255,184,0,0.1)", border: "2px solid rgba(255,184,0,0.3)", color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>NF</div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--nx-gold)] flex items-center justify-center cursor-pointer">
                  <Camera className="w-3.5 h-3.5 text-black" /><input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div>
                <p className="font-medium text-[var(--nx-text1)]">Academy Logo</p>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">Appears on AI reels, scouting packs, and public profile</p>
                <p className="text-xs text-[var(--nx-green)] mt-1">Recommended: 512×512px, PNG with transparent background</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">AI Reel Branding</h2>
            <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] mb-4">
              <p className="text-sm text-[var(--nx-text2)] mb-3">Your branded intro/outro card is prepended and appended to every AI reel generated for your athletes.</p>
              <div className="grid grid-cols-2 gap-3">
                {[["Intro Card (3s)", "Upload intro video or image"], ["Outro Card (3s)", "Upload outro with website URL"]].map(([l, p]) => (
                  <label key={l} className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[var(--nx-border2)] cursor-pointer hover:border-[var(--nx-gold)]/50 transition-colors text-center">
                    <Plus className="w-6 h-6 text-[var(--nx-text3)] mb-2" />
                    <span className="text-xs font-medium text-[var(--nx-text1)]">{l}</span>
                    <span className="text-[10px] text-[var(--nx-text3)] mt-0.5">{p}</span>
                    <input type="file" accept="video/*,image/*" className="hidden" />
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Academy Tagline</label>
              <input defaultValue="Developing Champions Since 2015" className="w-full rounded-xl text-sm" />
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
          <h2 className="font-semibold text-[var(--nx-text1)]">Academy Alert Preferences</h2>
          {[
            ["scoutInquiry", "Scout Inquiries", "New scouts viewing your athletes — delivered to Owner and Scout Liaison"],
            ["injuryAlert", "Injury Risk Alerts", "Critical — cannot be fully disabled. Alerts Coach when athlete risk changes to HIGH"],
            ["tournamentMilestone", "Tournament Milestones", "Live scoring milestone alerts for your tournaments"],
            ["billing", "Billing & Slot Warnings", "Plan renewals, payment failures, and slot capacity warnings"],
            ["achievement", "Athlete Achievements", "When an athlete unlocks a new platform milestone or badge"],
          ].map(([k, l, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
              <div><p className="font-medium text-sm text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
              <Toggle on={(notifs as any)[k]} onChange={v => setNotifs(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
        </div>
      )}

      {tab === "onboarding" && (
        <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-4">
          <h2 className="font-semibold text-[var(--nx-text1)]">Athlete Onboarding Settings</h2>
          {[
            ["autoInvite", "Auto-send invitation SMS", "New athletes added to your roster automatically receive an SMS invitation to create a NEXUS profile"],
            ["profileRequired", "Require profile completion before discovery", "Athletes must reach 60% profile strength before appearing in scout discovery"],
          ].map(([k, l, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
              <div><p className="font-medium text-sm text-[var(--nx-text1)]">{l}</p><p className="text-xs text-[var(--nx-text3)] mt-0.5">{d}</p></div>
              <Toggle on={(onboarding as any)[k]} onChange={v => setOnboarding(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Default Profile Visibility for New Athletes</label>
            <select value={onboarding.defaultVisibility} onChange={e => setOnboarding(p => ({ ...p, defaultVisibility: e.target.value }))} className="rounded-xl text-sm">
              <option value="SCOUTS_ONLY">Scouts Only (Recommended)</option>
              <option value="PUBLIC">Public (All visitors)</option>
              <option value="PRIVATE">Private (Hidden until manually changed)</option>
            </select>
          </div>
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl border" style={{ background: "rgba(255,184,0,0.03)", borderColor: "rgba(255,184,0,0.25)" }}>
            <div className="flex items-center justify-between mb-4">
              <div><p className="text-xl font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>ACADEMY PREMIUM</p>
                <p className="text-sm text-[var(--nx-text2)]">₹999/month · Renews April 1, 2026</p></div>
              <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>ACTIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[["Athletes", "48 / 50"], ["Reels Used", "14 / 20"], ["Tournaments", "3 active"]].map(([l, v]) => (
                <div key={l} className="p-3 rounded-xl bg-[var(--nx-bg4)] text-center">
                  <div className="text-lg font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)" }}>{v}</div>
                  <div className="text-[10px] text-[var(--nx-text3)]">{l}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: "var(--nx-gold)", color: "#000" }}>
              Upgrade to Elite (100 slots) — ₹1,999/month
            </button>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3">Payment History</h3>
            <div className="space-y-2">
              {[["Mar 1, 2026", "₹1,179"], ["Feb 1, 2026", "₹1,179"], ["Jan 1, 2026", "₹1,179"]].map(([d, a], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div><p className="text-sm font-medium text-[var(--nx-text1)]">Academy Premium Monthly</p><p className="text-xs text-[var(--nx-text3)]">{d}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--nx-gold)]">{a}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--nx-green-dim)] text-[var(--nx-green)]">Paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "danger" && (
        <div className="space-y-4">
          {[
            { title: "Pause Academy", desc: "Hide your academy from discovery. Enrolled athletes keep their profiles but won't appear under your academy.", action: "Pause", color: "var(--nx-amber)" },
            { title: "Export All Data", desc: "Download full athlete roster, performance data, scout interactions, and tournament history as JSON.", action: "Export Data", color: "var(--nx-cyan)" },
            { title: "Delete Academy Account", desc: "Permanently delete the academy account. Enrolled athletes' individual profiles are NOT affected.", action: "Delete Account", color: "var(--nx-red)" },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ borderColor: `${item.color}25`, background: `${item.color}05` }}>
              <div className="flex items-start justify-between gap-4">
                <div><h3 className="font-semibold text-[var(--nx-text1)]">{item.title}</h3><p className="text-sm text-[var(--nx-text3)] mt-1">{item.desc}</p></div>
                <button className="px-4 py-2 rounded-xl font-semibold text-sm transition-all shrink-0" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>{item.action}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {["team", "brand", "notifications", "onboarding"].includes(tab) && (
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70" style={{ background: "var(--nx-gold)", color: "#000" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  )
}
