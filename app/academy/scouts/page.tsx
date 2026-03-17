"use client"
import { useState } from "react"
import { MessageSquare, Calendar, ChevronRight, CheckCircle2, X, Send, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const SCOUT_RELATIONSHIPS = [
  { id: 1, name: "Rahul Verma", org: "Mumbai City FC", tier: "ISL", athletes_viewed: 8, messages: 14, trend: "+3x vs last quarter", status: "High Interest", lastContact: "2h ago", initials: "RV", partnership: false },
  { id: 2, name: "K. Balaji", org: "Bengaluru FC", tier: "ISL", athletes_viewed: 5, messages: 6, trend: "+1x vs last quarter", status: "Moderate Interest", lastContact: "1d ago", initials: "KB", partnership: false },
  { id: 3, name: "Priya Mehta", org: "Khelo India", tier: "SAI", athletes_viewed: 4, messages: 9, trend: "New this month", status: "New Relationship", lastContact: "3d ago", initials: "PM", partnership: true },
]
const TIMELINE: Record<number, { date: string; action: string; athlete: string; type: string }[]> = {
  1: [
    { date: "Mar 16", action: "Viewed profile", athlete: "Arjun Sharma", type: "view" },
    { date: "Mar 14", action: "Sent message to", athlete: "Vikram Singh", type: "message" },
    { date: "Mar 12", action: "Shortlisted", athlete: "Arjun Sharma", type: "shortlist" },
    { date: "Mar 10", action: "Viewed profile", athlete: "Sneha Patel", type: "view" },
    { date: "Mar 8", action: "Sent trial invitation to", athlete: "Arjun Sharma", type: "trial" },
  ],
  2: [
    { date: "Mar 15", action: "Shortlisted", athlete: "Vikram Singh", type: "shortlist" },
    { date: "Mar 13", action: "Viewed profile", athlete: "Priya Desai", type: "view" },
  ],
  3: [
    { date: "Mar 14", action: "Messaged", athlete: "Karan Mehta", type: "message" },
    { date: "Mar 11", action: "Viewed 3 profiles", athlete: "Multiple", type: "view" },
  ],
}
const BULK_INVITATIONS = [
  { id: 1, org: "Mumbai City FC", event: "ISL U-19 Open Trials 2026", slots: 3, dates: "Jan 18–20", city: "Mumbai", status: "pending" }
]
const SCOUT_VISIT_CALENDAR = [
  { scout: "Rahul Verma", org: "Mumbai City FC", date: "March 22", time: "10:00 AM", rsvp: "Confirmed", type: "Training Observation" },
  { scout: "Priya Mehta", org: "Khelo India", date: "March 28", time: "2:00 PM", rsvp: "Pending", type: "Individual Assessment" },
]

export default function AcademyScoutsPage() {
  const [activeScout, setActiveScout] = useState<typeof SCOUT_RELATIONSHIPS[0] | null>(null)
  const [showBulkModal, setShowBulkModal] = useState<typeof BULK_INVITATIONS[0] | null>(null)
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([])
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitForm, setVisitForm] = useState({ scout: "", date: "", time: "", type: "Training Observation" })
  const [showPartnershipModal, setShowPartnershipModal] = useState<typeof SCOUT_RELATIONSHIPS[0] | null>(null)
  const athletes = ["Arjun Sharma","Vikram Singh","Sneha Patel","Priya Desai","Karan Mehta"]

  const typeColor = (t: string) => ({ view: "var(--nx-text3)", message: "var(--nx-purple)", shortlist: "var(--nx-gold)", trial: "var(--nx-green)" })[t] || "var(--nx-text3)"
  const typeIcon = (t: string) => ({ view: "👁", message: "💬", shortlist: "★", trial: "🎯" })[t] || "•"

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Scout Relationships</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">Institutional scout CRM · bulk trial management · visit scheduling</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {[["Scout Inquiries This Month", "23", "var(--nx-cyan)"], ["Unique Scout Organisations", "8", "var(--nx-purple)"], ["Repeat Scouts (3+ athletes)", "3", "var(--nx-gold)"], ["Trial Invitations Sent", "12", "var(--nx-green)"]].map(([l, v, c]) => (
          <div key={l as string} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
            <p className="text-xs text-[var(--nx-text2)] font-semibold mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Bulk Trial Invitation */}
      {BULK_INVITATIONS.map(inv => (
        <div key={inv.id} className="p-5 rounded-2xl border-2" style={{ background: "rgba(0,245,116,0.04)", borderColor: "rgba(0,245,116,0.3)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", fontFamily: "var(--font-mono)" }}>BULK TRIAL INVITATION</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>PENDING RESPONSE</span>
              </div>
              <p className="font-semibold text-sm text-[var(--nx-text1)]">{inv.org} — {inv.event}</p>
              <p className="text-xs text-[var(--nx-text3)] mt-0.5"><Calendar className="w-3 h-3 inline mr-1" />{inv.dates} · {inv.city} · {inv.slots} athlete slots offered</p>
            </div>
            <button onClick={() => { setShowBulkModal(inv); setSelectedAthletes([]) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all shrink-0" style={{ background: "var(--nx-green)", color: "black" }}>
              Select Athletes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Institutional Relationships */}
        <div className="lg:col-span-1 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm text-[var(--nx-text1)]">Institutional Relationships</p>
            <button onClick={() => setShowVisitModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
              <Calendar className="w-3 h-3" />Schedule Visit
            </button>
          </div>
          {SCOUT_RELATIONSHIPS.map(rel => (
            <button key={rel.id} onClick={() => setActiveScout(activeScout?.id === rel.id ? null : rel)}
              className={cn("w-full p-4 rounded-2xl border text-left transition-all", activeScout?.id === rel.id ? "border-[var(--nx-purple)] bg-[rgba(155,93,255,0.06)]" : "bg-[var(--nx-bg3)] border-[var(--nx-border)] hover:border-[var(--nx-border2)]")}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.2)", fontFamily: "var(--font-display)" }}>{rel.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-[var(--nx-text1)]">{rel.name}</p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(155,93,255,0.12)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>{rel.tier}</span>
                    {rel.partnership && <CheckCircle2 className="w-3 h-3 text-[var(--nx-green)]" />}
                  </div>
                  <p className="text-[10px] text-[var(--nx-text3)]">{rel.org}</p>
                  <p className="text-[10px] mt-1" style={{ color: rel.status === "High Interest" ? "var(--nx-green)" : "var(--nx-gold)" }}>{rel.status}</p>
                  <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Viewed {rel.athletes_viewed} athletes · {rel.messages} messages</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CRM Timeline */}
        <div className="lg:col-span-2">
          {activeScout ? (
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">{activeScout.name} — {activeScout.org}</p>
                  <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Relationship timeline · last contact {activeScout.lastContact}</p>
                </div>
                <div className="flex gap-2">
                  {!activeScout.partnership && (
                    <button onClick={() => setShowPartnershipModal(activeScout)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(0,245,116,0.08)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>
                      <Award className="w-3 h-3" />Propose Partnership
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>
                    <MessageSquare className="w-3 h-3" />Message
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[["Athletes Viewed", activeScout.athletes_viewed, "var(--nx-cyan)"], ["Messages Exchanged", activeScout.messages, "var(--nx-purple)"], ["Engagement Trend", activeScout.trend, "var(--nx-gold)"]].map(([l, v, c]) => (
                  <div key={l as string} className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-center">
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
                    <p className="text-[9px] text-[var(--nx-text3)] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-3 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Interaction Timeline</p>
                <div className="space-y-2">
                  {(TIMELINE[activeScout.id] || []).map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                      <span className="text-sm">{typeIcon(ev.type)}</span>
                      <span className="text-xs font-semibold text-[var(--nx-text3)] w-10 shrink-0" style={{ fontFamily: "var(--font-mono)", color: typeColor(ev.type) }}>{ev.date}</span>
                      <span className="text-xs text-[var(--nx-text2)] flex-1">{ev.action} <span className="font-semibold text-[var(--nx-text1)]">{ev.athlete}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Scout Visit Calendar</p>
              <div className="space-y-3">
                {SCOUT_VISIT_CALENDAR.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                    <Calendar className="w-8 h-8 p-1.5 rounded-xl shrink-0" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--nx-text1)]">{v.scout} · {v.org}</p>
                      <p className="text-xs text-[var(--nx-text3)]">{v.date} at {v.time} · {v.type}</p>
                    </div>
                    <span className={cn("text-[9px] px-2 py-1 rounded font-bold", v.rsvp === "Confirmed" ? "text-[var(--nx-green)]" : "text-[var(--nx-amber)]")} style={{ background: v.rsvp === "Confirmed" ? "var(--nx-green-dim)" : "rgba(245,166,35,0.1)", fontFamily: "var(--font-mono)" }}>
                      {v.rsvp}
                    </span>
                  </div>
                ))}
                <button onClick={() => setShowVisitModal(true)} className="w-full py-3 rounded-xl text-xs text-[var(--nx-text3)] border border-dashed border-[var(--nx-border)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
                  + Schedule a Scout Visit Day
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Trial Selection Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBulkModal(null)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-[var(--nx-text1)]">Select Athletes to Nominate</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">{showBulkModal.slots} slots offered by {showBulkModal.org}</p>
              </div>
              <button onClick={() => setShowBulkModal(null)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 mb-5">
              {athletes.map(a => (
                <label key={a} className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", selectedAthletes.includes(a) ? "border-[var(--nx-green-border)] bg-[var(--nx-green-dim)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}>
                  <input type="checkbox" checked={selectedAthletes.includes(a)} onChange={() => setSelectedAthletes(p => p.includes(a) ? p.filter(x => x !== a) : p.length < showBulkModal.slots ? [...p, a] : p)} className="accent-[var(--nx-green)] w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--nx-text1)]">{a}</p>
                    <p className="text-[10px] text-[var(--nx-text3)]">Football Striker · AI Score 74</p>
                  </div>
                  <span className="text-[10px] text-[var(--nx-green)]">85% match</span>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-[var(--nx-text3)] mb-4">{selectedAthletes.length} of {showBulkModal.slots} slots selected</p>
            <button disabled={selectedAthletes.length === 0} onClick={() => setShowBulkModal(null)} className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 hover:brightness-110 transition-all" style={{ background: "var(--nx-green)", color: "black" }}>
              Confirm Nominations &amp; Send Invitations
            </button>
          </div>
        </div>
      )}

      {/* Partnership Proposal Modal */}
      {showPartnershipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPartnershipModal(null)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-[var(--nx-text1)]">Partnership Proposal</h2>
              <button onClick={() => setShowPartnershipModal(null)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] mb-4">
              <p className="text-xs font-semibold text-[var(--nx-text1)] mb-2">Draft Proposal to {showPartnershipModal.org}</p>
              <p className="text-xs text-[var(--nx-text2)] leading-relaxed">
                Dear {showPartnershipModal.name},<br /><br />
                Based on our continued engagement on NEXUS — with {showPartnershipModal.athletes_viewed} athlete interactions and {showPartnershipModal.messages} messages — we would like to formalise a talent pipeline partnership. Nagpur FC Youth Academy currently has 48 athletes with an average AI score of 72/100, and a trial conversion rate of 16.7% this season. We propose a structured scouting visit programme with priority access to our top athletes.
              </p>
            </div>
            <button onClick={() => setShowPartnershipModal(null)} className="w-full py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2" style={{ background: "var(--nx-green)", color: "black" }}>
              <Send className="w-4 h-4" />Send Partnership Proposal
            </button>
          </div>
        </div>
      )}

      {/* Visit Scheduling Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowVisitModal(false)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-[var(--nx-text1)]">Schedule Scout Visit Day</h2>
              <button onClick={() => setShowVisitModal(false)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[["Scout Name", "scout"], ["Date", "date"], ["Time", "time"]].map(([l, k]) => (
                <div key={k}>
                  <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>{l}</label>
                  <input value={(visitForm as any)[k]} onChange={e => setVisitForm(p => ({...p, [k]: e.target.value}))} type={k === "time" ? "time" : "text"} className="text-sm rounded-xl w-full" />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Visit Type</label>
                <select value={visitForm.type} onChange={e => setVisitForm(p => ({...p, type: e.target.value}))} className="text-sm rounded-xl w-full py-2">
                  {["Training Observation","Individual Assessment","Match Day","Group Trial"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button onClick={() => setShowVisitModal(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all" style={{ background: "var(--nx-green)", color: "black" }}>
                Send Scout Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
