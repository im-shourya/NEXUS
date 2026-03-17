"use client"
import { useState } from "react"
import { Search, Send, Shield, Star, Clock, CheckCircle2, X, BarChart2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const CONVERSATIONS = [
  { id: 1, name: "Arjun Sharma", org: "Football Striker · Nagpur", time: "2h", unread: 1, avatar: "AS", responseLikelihood: 84, optimalTime: "Weekdays 7–9 PM", lastOnline: "Online now", isShortlisted: true, trialStatus: "invited" },
  { id: 2, name: "Vikram Singh", org: "Football Mid · Pune", time: "5h", unread: 0, avatar: "VS", responseLikelihood: 67, optimalTime: "Sat & Sun morning", lastOnline: "3h ago", isShortlisted: true, trialStatus: null },
  { id: 3, name: "Sneha Patel", org: "Football CF · Nagpur", time: "1d", unread: 0, avatar: "SP", responseLikelihood: 91, optimalTime: "Weekday evenings", lastOnline: "Today", isShortlisted: false, trialStatus: null },
  { id: 4, name: "Karan Mehta", org: "Football LW · Mumbai", time: "3d", unread: 0, avatar: "KM", responseLikelihood: 55, optimalTime: "Weekends", lastOnline: "3d ago", isShortlisted: false, trialStatus: "accepted" },
]

const TEMPLATES = [
  { label: "Initial Interest", text: "Hi [Name], I came across your profile on NEXUS and I'm very impressed by your [skill]. I'd like to discuss a potential trial opportunity with [Club]. Are you available for a conversation?" },
  { label: "Trial Invitation", text: null, isTrialInvite: true },
  { label: "Follow-Up", text: "Hi [Name], following up on my earlier message. We're actively scouting for the U-19 programme and I believe you'd be a great fit. Please let me know your availability." },
  { label: "Regret", text: "Hi [Name], thank you for your interest and for attending our trial. After careful consideration, we've decided to go in a different direction this time. We wish you all the best and hope to reconnect in the future." },
]

const MSGS_BY_CONV: Record<number, { id: number; from: string; text: string; sent: boolean; time: string; isTrialInvite?: boolean; trialData?: any }[]> = {
  1: [
    { id: 1, from: "Me", text: "Hi Arjun, I came across your profile on NEXUS. Your sprint speed rating of 82/100 is impressive — top 15% nationally. I'd like to discuss a trial opportunity with Mumbai City FC U-19.", sent: true, time: "Yesterday" },
    { id: 2, from: "Arjun Sharma", text: "Thank you for reaching out! I am very interested in this opportunity. My current training is at Nagpur FC Youth Academy and I am available for trials in January or February.", sent: false, time: "Yesterday" },
    { id: 3, from: "Me", text: "", sent: true, time: "2h ago", isTrialInvite: true, trialData: { club: "Mumbai City FC", category: "U-19", dates: "18–20 January 2026", city: "Mumbai", format: "Group Trial", accommodation: true, status: "pending" } },
  ],
  2: [
    { id: 1, from: "Me", text: "Hi Vikram, your passing accuracy of 84/100 caught my attention. We're looking for a technical midfielder for the U-19 squad.", sent: true, time: "5h ago" },
  ],
  3: [
    { id: 1, from: "Me", text: "Hi Sneha, your goal-scoring record is exceptional — 34 goals in 28 matches. I'd love to discuss a formal trial.", sent: true, time: "1d ago" },
  ],
}

export default function ScoutMessagesPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0])
  const [newMsg, setNewMsg] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [trialForm, setTrialForm] = useState({ club: "Mumbai City FC", category: "U-19", dates: "", city: "Mumbai", accommodation: false, format: "Group Trial" })
  const [messages, setMessages] = useState(MSGS_BY_CONV)
  const [showMetrics, setShowMetrics] = useState(false)
  const [trialResponses, setTrialResponses] = useState<Record<number, "accepted" | "declined">>({})

  const currentMsgs = messages[activeConv.id] || []

  const sendMessage = (text?: string) => {
    const t = text || newMsg
    if (!t.trim()) return
    setMessages(p => ({ ...p, [activeConv.id]: [...(p[activeConv.id] || []), { id: Date.now(), from: "Me", text: t, sent: true, time: "Now" }] }))
    setNewMsg("")
    setShowTemplates(false)
  }

  const sendTrialInvite = () => {
    setMessages(p => ({
      ...p,
      [activeConv.id]: [...(p[activeConv.id] || []), {
        id: Date.now(), from: "Me", text: "", sent: true, time: "Now", isTrialInvite: true,
        trialData: { ...trialForm, status: "pending" }
      }]
    }))
    setShowTrialModal(false)
  }

  const likelihoodColor = (n: number) => n >= 80 ? "var(--nx-green)" : n >= 60 ? "var(--nx-gold)" : "var(--nx-amber)"

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0">
      {/* Conversation List */}
      <div className="w-72 shrink-0 bg-[var(--nx-bg2)] border-r border-[var(--nx-border)] flex flex-col">
        <div className="p-4 border-b border-[var(--nx-border)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
            <input placeholder="Search conversations..." className="w-full pl-10 text-sm rounded-xl py-2" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map(conv => (
            <button key={conv.id} onClick={() => setActiveConv(conv)} className={cn("w-full flex items-start gap-3 p-4 border-b border-[var(--nx-border)] transition-all hover:bg-[var(--nx-bg4)]", activeConv.id === conv.id && "bg-[var(--nx-green-dim)] border-l-2 border-l-[var(--nx-green)]")}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "var(--nx-bg4)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>{conv.avatar}</div>
                {conv.isShortlisted && <Star className="absolute -top-1 -right-1 w-3 h-3 text-[var(--nx-gold)]" fill="currentColor" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[var(--nx-text1)]">{conv.name}</p>
                  <span className="text-[10px] text-[var(--nx-text3)]">{conv.time}</span>
                </div>
                <p className="text-[10px] text-[var(--nx-text3)] truncate">{conv.org}</p>
                <div className="flex items-center gap-2 mt-1">
                  {conv.trialStatus === "accepted" && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}>✓ TRIAL CONFIRMED</span>}
                  {conv.trialStatus === "invited" && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(255,184,0,0.08)", color: "var(--nx-gold)", border: "1px solid rgba(255,184,0,0.2)", fontFamily: "var(--font-mono)" }}>INVITE SENT</span>}
                  {conv.unread > 0 && <span className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "var(--nx-green)", color: "black" }}>{conv.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Outreach Metrics */}
        <div className="border-t border-[var(--nx-border)]">
          <button onClick={() => setShowMetrics(!showMetrics)} className="w-full flex items-center justify-between p-3 text-xs text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Outreach Metrics</span>
            </div>
            <span>{showMetrics ? "▲" : "▼"}</span>
          </button>
          {showMetrics && (
            <div className="px-4 pb-4 space-y-2">
              {[["Response Rate", "61%", "var(--nx-green)"], ["Avg Reply Time", "4.2h", "var(--nx-cyan)"], ["Conversion Rate", "39%", "var(--nx-gold)"]].map(([l, v, c]) => (
                <div key={l} className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--nx-text3)]">{l}</span>
                  <span className="text-xs font-bold" style={{ color: c, fontFamily: "var(--font-display)" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[var(--nx-bg)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--nx-border)] bg-[var(--nx-bg2)] flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: "var(--nx-bg4)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>{activeConv.avatar}</div>
            {activeConv.isShortlisted && <Star className="absolute -top-1 -right-1 w-3 h-3 text-[var(--nx-gold)]" fill="currentColor" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-[var(--nx-text1)]">{activeConv.name}</p>
            <p className="text-[10px] text-[var(--nx-text3)]">{activeConv.org} · {activeConv.lastOnline}</p>
          </div>

          {/* Response Likelihood + Optimal Send Time */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-16 h-1.5 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${activeConv.responseLikelihood}%`, background: likelihoodColor(activeConv.responseLikelihood) }} />
                </div>
                <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: likelihoodColor(activeConv.responseLikelihood) }}>{activeConv.responseLikelihood}%</span>
              </div>
              <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>RESPONSE LIKELIHOOD</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-[var(--nx-cyan)]" />
                <span className="text-xs font-semibold" style={{ color: "var(--nx-cyan)" }}>{activeConv.optimalTime}</span>
              </div>
              <p className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>BEST SEND TIME</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {currentMsgs.map(msg => (
            <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
              {msg.isTrialInvite ? (
                /* Trial Invitation System Card */
                <div className="max-w-sm w-full rounded-2xl overflow-hidden" style={{ border: "1px solid var(--nx-green-border)" }}>
                  <div className="px-4 py-2 flex items-center justify-between" style={{ background: "var(--nx-green-dim)" }}>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-[var(--nx-green)]" />
                      <span className="text-[10px] font-semibold text-[var(--nx-green)] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>Trial Invitation</span>
                    </div>
                    <Shield className="w-3.5 h-3.5 text-[var(--nx-green)]" />
                  </div>
                  <div className="p-4 space-y-2 bg-[var(--nx-bg4)]">
                    {[
                      ["Organisation", msg.trialData?.club || trialForm.club],
                      ["Category", msg.trialData?.category || trialForm.category],
                      ["Dates", msg.trialData?.dates || "TBC"],
                      ["City", msg.trialData?.city || trialForm.city],
                      ["Format", msg.trialData?.format || trialForm.format],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--nx-text3)] w-20 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{l}</span>
                        <span className="text-xs font-semibold text-[var(--nx-text1)]">{v}</span>
                      </div>
                    ))}
                    {(msg.trialData?.accommodation || trialForm.accommodation) && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--nx-border)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--nx-green)]" />
                        <span className="text-[10px] text-[var(--nx-green)]">Accommodation provided</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-[var(--nx-bg3)] border-t border-[var(--nx-border)]">
                    {msg.sent ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--nx-text3)]">{msg.time}</span>
                        <span className="text-[10px] font-semibold" style={{ color: msg.trialData?.status === "accepted" ? "var(--nx-green)" : "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>
                          {msg.trialData?.status === "accepted" ? "✓ ACCEPTED" : "PENDING"}
                        </span>
                      </div>
                    ) : (
                      !trialResponses[msg.id] ? (
                        <div className="flex gap-2">
                          <button onClick={() => setTrialResponses(p => ({ ...p, [msg.id]: "declined" }))} className="flex-1 py-2 rounded-xl text-xs border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-red)] hover:text-[var(--nx-red)] transition-colors">Decline</button>
                          <button onClick={() => setTrialResponses(p => ({ ...p, [msg.id]: "accepted" }))} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110" style={{ background: "var(--nx-green)", color: "black" }}>Accept Trial ✓</button>
                        </div>
                      ) : (
                        <div className="text-center py-1">
                          <span className="text-xs font-semibold" style={{ color: trialResponses[msg.id] === "accepted" ? "var(--nx-green)" : "var(--nx-red)", fontFamily: "var(--font-mono)" }}>
                            {trialResponses[msg.id] === "accepted" ? "✓ TRIAL ACCEPTED" : "✗ DECLINED"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className={cn("max-w-xs px-4 py-2.5 rounded-2xl text-sm", msg.sent ? "rounded-tr-sm" : "rounded-tl-sm")} style={{
                  background: msg.sent ? "var(--nx-purple)" : "var(--nx-bg3)",
                  color: msg.sent ? "white" : "var(--nx-text1)",
                  border: msg.sent ? "none" : "1px solid var(--nx-border)",
                }}>
                  <p>{msg.text}</p>
                  <p className={cn("text-[9px] mt-1", msg.sent ? "text-white/60 text-right" : "text-[var(--nx-text3)]")}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--nx-border)] bg-[var(--nx-bg2)]">
          {showTemplates && (
            <div className="mb-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] space-y-1.5">
              <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Message Templates</p>
              {TEMPLATES.map((t, i) => (
                t.isTrialInvite ? (
                  <button key={i} onClick={() => { setShowTrialModal(true); setShowTemplates(false) }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all hover:bg-[var(--nx-bg5)]" style={{ color: "var(--nx-green)" }}>
                    ⚡ {t.label} — Send structured trial invitation card
                  </button>
                ) : (
                  <button key={i} onClick={() => { setNewMsg(t.text!); setShowTemplates(false) }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-[var(--nx-text2)] transition-all hover:bg-[var(--nx-bg5)] hover:text-[var(--nx-text1)]">
                    {t.label}
                  </button>
                )
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowTemplates(!showTemplates)} className={cn("p-2.5 rounded-xl border transition-all text-xs font-semibold", showTemplates ? "bg-[var(--nx-purple)] text-white border-transparent" : "bg-[var(--nx-bg4)] border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>
              📋
            </button>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder={`Message ${activeConv.name}...`} className="flex-1 w-full px-4 py-2.5 text-sm rounded-xl" />
            <button onClick={() => sendMessage()} disabled={!newMsg.trim()} className="p-2.5 rounded-xl transition-all disabled:opacity-40" style={{ background: "var(--nx-purple)", color: "white" }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trial Invitation Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTrialModal(false)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-[var(--nx-text1)]">Send Trial Invitation</h2>
              <button onClick={() => setShowTrialModal(false)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[["Club / Organisation", "club"], ["Dates", "dates"], ["City", "city"]].map(([l, k]) => (
                <div key={k}>
                  <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>{l}</label>
                  <input value={(trialForm as any)[k]} onChange={e => setTrialForm(p => ({...p, [k]: e.target.value}))} className="text-sm rounded-xl w-full" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Category</label>
                  <select value={trialForm.category} onChange={e => setTrialForm(p => ({...p, category: e.target.value}))} className="text-sm rounded-xl w-full py-2">
                    {["U-14","U-17","U-19","U-21","Senior"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--nx-text3)] mb-1 block tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Format</label>
                  <select value={trialForm.format} onChange={e => setTrialForm(p => ({...p, format: e.target.value}))} className="text-sm rounded-xl w-full py-2">
                    {["Group Trial","Individual Assessment","Residential Camp"].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={trialForm.accommodation} onChange={e => setTrialForm(p => ({...p, accommodation: e.target.checked}))} className="accent-[var(--nx-green)]" />
                <span className="text-xs text-[var(--nx-text2)]">Accommodation provided</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowTrialModal(false)} className="flex-1 py-2.5 rounded-xl text-sm border border-[var(--nx-border)] text-[var(--nx-text2)]">Cancel</button>
                <button onClick={sendTrialInvite} className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 flex items-center justify-center gap-2" style={{ background: "var(--nx-green)", color: "black" }}>
                  <Send className="w-4 h-4" />Send Invite Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
