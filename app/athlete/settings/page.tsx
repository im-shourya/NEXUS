"use client"

import { useState } from "react"
import { User, Bell, Lock, CreditCard, AlertTriangle, CheckCircle2, Camera, Phone, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]

const NOTIF_TOGGLES = [
  { id: "scout_view", label: "Scout viewed my profile", desc: "Get notified when scouts view your profile", default: true },
  { id: "new_match", label: "New AI match detected", desc: "When matching engine finds a new scout for you", default: true },
  { id: "trial_invite", label: "Trial invitations", desc: "When scouts send trial invitations", default: true },
  { id: "messages", label: "New messages", desc: "When scouts or academies message you", default: true },
  { id: "tournament_reminder", label: "Tournament reminders", desc: "Registration deadlines and upcoming events", default: true },
  { id: "performance", label: "AI analysis ready", desc: "When video analysis completes", default: true },
  { id: "injury", label: "Injury risk alerts", desc: "When risk level changes (Critical — always on)", default: true, locked: true },
  { id: "marketing", label: "Platform updates & tips", desc: "Product news and tips to improve your score", default: false },
]

const SPORT_NOTIFS = [
  { id: "isl_trials", label: "ISL trial announcements in my region" },
  { id: "ileague_scout", label: "I-League club scout follows me" },
  { id: "set_piece", label: "Free-kick / set-piece analysis complete" },
]

const PAYMENT_HISTORY = [
  { id: "pay_001", date: "Mar 1, 2026", plan: "Pro Athlete Monthly", amount: "₹99", status: "Paid" },
  { id: "pay_002", date: "Feb 1, 2026", plan: "Pro Athlete Monthly", amount: "₹99", status: "Paid" },
  { id: "pay_003", date: "Jan 1, 2026", plan: "Pro Athlete Monthly", amount: "₹99", status: "Paid" },
]

function Toggle({ on, onChange, locked }: { on: boolean; onChange: (v: boolean) => void; locked?: boolean }) {
  return (
    <button
      onClick={() => !locked && onChange(!on)}
      disabled={locked}
      className={cn(
        "relative w-11 h-6 rounded-full transition-all shrink-0",
        on ? "bg-[var(--nx-green)]" : "bg-[var(--nx-bg5)]",
        locked && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
        on ? "left-6" : "left-1"
      )} />
    </button>
  )
}

export default function AthleteSettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_TOGGLES.map(t => [t.id, t.default]))
  )
  const [sportToggles, setSportToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(SPORT_NOTIFS.map(t => [t.id, true]))
  )
  const [privacySettings, setPrivacySettings] = useState({
    visibility: "all_scouts",
    show_contact: true,
    show_ai_scores: true,
    show_form_analysis: false,
    peer_comparison: true,
    auto_pb_update: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Settings</h1>
        <p className="text-[var(--nx-text3)] text-sm mt-0.5">Manage your account, notifications, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--nx-border)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? tab.id === "danger"
                  ? "bg-[var(--nx-red)]/10 text-[var(--nx-red)] border border-[var(--nx-red)]/20"
                  : "bg-[var(--nx-green-dim)] text-[var(--nx-green)] border border-[var(--nx-green-border)]"
                : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg4)]"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ACCOUNT TAB ── */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[var(--nx-green-dim)] border-2 border-[var(--nx-green)] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)" }}>PS</span>
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--nx-green)] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all">
                  <Camera className="w-3.5 h-3.5 text-black" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div>
                <p className="font-medium text-[var(--nx-text1)]">Priya Sharma</p>
                <p className="text-sm text-[var(--nx-text3)]">Football · Striker · Jharkhand</p>
                <p className="text-xs text-[var(--nx-green)] mt-1">Adding a photo increases scout matches by 4x</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email Address", value: "priya.sharma@email.com", type: "email" },
                { icon: Phone, label: "Mobile Number", value: "+91 98765 43210", type: "tel", verified: true },
              ].map((field, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>
                    <field.icon className="w-3 h-3" />{field.label}
                    {field.verified && <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] bg-[var(--nx-green-dim)] text-[var(--nx-green)] border border-[var(--nx-green-border)]">✓ Verified</span>}
                  </label>
                  <input type={field.type} defaultValue={field.value} className="w-full rounded-xl text-sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Password</h2>
            <div className="space-y-4">
              {["Current Password", "New Password", "Confirm Password"].map((label, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>{label}</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full rounded-xl text-sm pr-10" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--nx-text3)]">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Language & Region</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>Language</label>
                <select className="w-full rounded-xl text-sm">
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nx-text3)" }}>Timezone</label>
                <select className="w-full rounded-xl text-sm">
                  <option>Asia/Kolkata (IST)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-70">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-1">Notification Preferences</h2>
            <p className="text-sm text-[var(--nx-text3)] mb-5">Choose what you want to be notified about</p>
            <div className="space-y-4">
              {NOTIF_TOGGLES.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--nx-text1)] text-sm">{t.label}</p>
                    <p className="text-xs text-[var(--nx-text3)] mt-0.5">{t.desc}</p>
                  </div>
                  <Toggle on={toggles[t.id]} onChange={v => setToggles(p => ({ ...p, [t.id]: v }))} locked={t.locked} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-1">Football-Specific Alerts</h2>
            <p className="text-sm text-[var(--nx-text3)] mb-5">Tailored for your sport and position</p>
            <div className="space-y-4">
              {SPORT_NOTIFS.map(t => (
                <div key={t.id} className="flex items-center justify-between py-3 border-b border-[var(--nx-border)] last:border-0">
                  <p className="font-medium text-[var(--nx-text1)] text-sm flex-1">{t.label}</p>
                  <Toggle on={sportToggles[t.id]} onChange={v => setSportToggles(p => ({ ...p, [t.id]: v }))} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY TAB ── */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Profile Visibility</h2>
            <div className="space-y-3">
              {[
                { value: "all_scouts", label: "All Scouts (Recommended)", desc: "Any verified scout on NEXUS can find your profile" },
                { value: "verified_scouts", label: "Verified Scouts Only", desc: "Only identity-verified scouts with organisation documents" },
                { value: "private", label: "Private", desc: "Only scouts you directly share your profile link with" },
              ].map(opt => (
                <button key={opt.value} onClick={() => setPrivacySettings(p => ({ ...p, visibility: opt.value }))}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                    privacySettings.visibility === opt.value
                      ? "border-[var(--nx-green-border)] bg-[var(--nx-green-dim)]"
                      : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]"
                  )}>
                  <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0", privacySettings.visibility === opt.value ? "border-[var(--nx-green)] bg-[var(--nx-green)]" : "border-[var(--nx-text3)]")} />
                  <div>
                    <p className={cn("font-medium text-sm", privacySettings.visibility === opt.value ? "text-[var(--nx-green)]" : "text-[var(--nx-text1)]")}>{opt.label}</p>
                    <p className="text-xs text-[var(--nx-text3)] mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-5">Data & Performance Settings</h2>
            <div className="space-y-4">
              {[
                { key: "show_contact", label: "Allow scouts to see contact details", desc: "Email and phone visible to matched scouts" },
                { key: "show_ai_scores", label: "Show full AI scores to scouts", desc: "Scouts see complete skill breakdown (Pro plan)" },
                { key: "show_form_analysis", label: "Show form analysis findings publicly", desc: "CV analysis visible on your public profile" },
                { key: "peer_comparison", label: "Include me in peer comparison database", desc: "Your anonymised data helps cohort accuracy" },
                { key: "auto_pb_update", label: "Allow organisers to submit results to my profile", desc: "Athletics: tournament organisers can update your PBs" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--nx-border)] last:border-0">
                  <div>
                    <p className="font-medium text-sm text-[var(--nx-text1)]">{item.label}</p>
                    <p className="text-xs text-[var(--nx-text3)] mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle
                    on={(privacySettings as any)[item.key]}
                    onChange={v => setPrivacySettings(p => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTION TAB ── */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-green-border)]" style={{ background: "linear-gradient(135deg, var(--nx-green-dim), var(--nx-bg3))" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>PRO ATHLETE</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--nx-green)] text-black">ACTIVE</span>
                </div>
                <p className="text-sm text-[var(--nx-text2)]">₹99/month · Renews April 1, 2026</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] text-sm hover:border-[var(--nx-red)]/50 hover:text-[var(--nx-red)] transition-colors">
                Cancel Plan
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Videos", value: "∞", max: "Unlimited" },
                { label: "Scout Matches", value: "∞", max: "Unlimited" },
                { label: "AI Analyses", value: "5", max: "per month" },
              ].map((u, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--nx-bg4)] text-center">
                  <div className="text-xl font-bold text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)" }}>{u.value}</div>
                  <div className="text-[10px] text-[var(--nx-text3)]">{u.label}</div>
                  <div className="text-[9px] text-[var(--nx-text3)]">{u.max}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Payment History</h2>
            <div className="space-y-2">
              {PAYMENT_HISTORY.map(pay => (
                <div key={pay.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div>
                    <p className="font-medium text-sm text-[var(--nx-text1)]">{pay.plan}</p>
                    <p className="text-xs text-[var(--nx-text3)]">{pay.date} · #{pay.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--nx-green)]">{pay.amount}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--nx-green-dim)] text-[var(--nx-green)]">{pay.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DANGER ZONE TAB ── */}
      {activeTab === "danger" && (
        <div className="space-y-4">
          {[
            {
              title: "Pause Account",
              desc: "Hide your profile for 30 days. Scouts can't find you, but your data is preserved.",
              action: "Pause Account",
              color: "var(--nx-amber)"
            },
            {
              title: "Download My Data",
              desc: "Export all your profile data, videos metadata, matches, and messages as JSON. Delivered to your email within 24 hours.",
              action: "Export Data",
              color: "var(--nx-cyan)"
            },
            {
              title: "Delete Account",
              desc: "Permanently delete your account and all associated data. This action is irreversible after a 30-day grace period.",
              action: "Delete Account",
              color: "var(--nx-red)"
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ borderColor: `${item.color}25`, background: `${item.color}05` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--nx-text1)]">{item.title}</h3>
                  <p className="text-sm text-[var(--nx-text3)] mt-1">{item.desc}</p>
                </div>
                <button
                  className="px-4 py-2 rounded-xl font-semibold text-sm transition-all shrink-0"
                  style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}
                >
                  {item.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
