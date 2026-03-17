"use client"
import { useState } from "react"
import { Search, Send, X, Megaphone, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CONVERSATIONS = [
  { id: 1, name: "Rahul Verma", org: "Mumbai City FC", type: "scout", time: "2h", unread: 2, avatar: "RV", pinned: true },
  { id: 2, name: "K. Balaji", org: "Bengaluru FC", type: "scout", time: "6h", unread: 0, avatar: "KB", pinned: true },
  { id: 3, name: "Priya Sharma (Parent)", org: "Admission Enquiry · Nagpur", type: "parent", time: "1d", unread: 1, avatar: "PS", pinned: false },
  { id: 4, name: "Arjun Sharma", org: "Athlete · Football Striker", type: "athlete", time: "2d", unread: 0, avatar: "AS", pinned: false },
  { id: 5, name: "Tournament Update", org: "System notification", type: "system", time: "3d", unread: 0, avatar: "SY", pinned: false },
]
const MSGS: Record<number, { id: number; text: string; sent: boolean; time: string; from: string }[]> = {
  1: [
    { id: 1, from: "Rahul Verma", text: "We'd like to schedule a scouting visit to your academy on March 22. We're interested in observing 4–5 of your top U-19 players.", sent: false, time: "2h ago" },
    { id: 2, from: "Me", text: "Thank you for reaching out. We'd be delighted to host a visit. Our U-19 morning training session runs 8–10 AM. We can have 6 athletes available.", sent: true, time: "1h ago" },
  ],
  2: [
    { id: 1, from: "Me", text: "Hi K. Balaji, following up on your interest in Vikram Singh. He's been our most consistent performer this month with a NexusScore of 71/100.", sent: true, time: "6h ago" },
  ],
  3: [
    { id: 1, from: "Priya Sharma", text: "Hello, I am enquiring about enrollment for my son (age 14, football) at your academy. Could you share the fee structure and current vacancies?", sent: false, time: "1d ago" },
  ],
}

const ASSIGN_OPTIONS = ["Head Coach","Admin Officer","Scout Liaison","Tournament Manager"]
const ATHLETES_ALL = ["Arjun Sharma","Vikram Singh","Sneha Patel","Priya Desai","Karan Mehta","Ravi Kumar","Mohan Das","Suresh Nair"]

export default function AcademyMessagesPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0])
  const [messages, setMessages] = useState(MSGS)
  const [newMsg, setNewMsg] = useState("")
  const [assignments, setAssignments] = useState<Record<number, string>>({})
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastText, setBroadcastText] = useState("")
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "tournament">("all")
  const [activeTab, setActiveTab] = useState<"all" | "scout" | "parent">("all")

  const sendMessage = () => {
    if (!newMsg.trim()) return
    setMessages(p => ({ ...p, [activeConv.id]: [...(p[activeConv.id] || []), { id: Date.now(), from: "Academy", text: newMsg, sent: true, time: "Now" }] }))
    setNewMsg("")
  }

  const sendBroadcast = () => {
    if (!broadcastText.trim()) return
    setBroadcastSent(true)
    setTimeout(() => { setBroadcastSent(false); setBroadcastText(""); setShowBroadcast(false) }, 2000)
  }

  const typeColor = { scout: "var(--nx-purple)", parent: "var(--nx-gold)", athlete: "var(--nx-green)", system: "var(--nx-text3)" }
  const typeLabel = { scout: "SCOUT", parent: "PARENT", athlete: "ATHLETE", system: "SYSTEM" }

  const filtered = CONVERSATIONS.filter(c => activeTab === "all" || c.type === activeTab)

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Inbox */}
      <div className="w-72 shrink-0 bg-[var(--nx-bg2)] border-r border-[var(--nx-border)] flex flex-col">
        <div className="p-4 border-b border-[var(--nx-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-[var(--nx-text1)]">Shared Inbox</p>
            <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)", border: "1px solid rgba(255,184,0,0.25)" }}>
              <Megaphone className="w-3 h-3" />Broadcast
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
            <input placeholder="Search..." className="w-full pl-10 text-xs rounded-xl py-2 w-full" />
          </div>
          <div className="flex gap-1">
            {["all","scout","parent"].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-semibold capitalize transition-all", activeTab === t ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Pinned */}
          {activeTab === "all" && filtered.some(c => c.pinned) && (
            <div>
              <p className="px-4 py-2 text-[9px] font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>📌 Pinned — Scout Conversations</p>
              {filtered.filter(c => c.pinned).map(conv => <ConvRow key={conv.id} conv={conv} active={activeConv.id === conv.id} onClick={() => setActiveConv(conv)} typeColor={typeColor} typeLabel={typeLabel} />)}
              <div className="mx-4 border-b border-[var(--nx-border)]" />
            </div>
          )}
          {filtered.filter(c => activeTab !== "all" || !c.pinned).map(conv => (
            <ConvRow key={conv.id} conv={conv} active={activeConv.id === conv.id} onClick={() => setActiveConv(conv)} typeColor={typeColor} typeLabel={typeLabel} />
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-[var(--nx-bg)]">
        <div className="p-4 border-b border-[var(--nx-border)] bg-[var(--nx-bg2)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: (typeColor as any)[activeConv.type] + "15", color: (typeColor as any)[activeConv.type], border: `1px solid ${(typeColor as any)[activeConv.type]}30`, fontFamily: "var(--font-display)" }}>
            {activeConv.avatar}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-[var(--nx-text1)]">{activeConv.name}</p>
            <p className="text-[10px] text-[var(--nx-text3)]">{activeConv.org}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold px-2 py-1 rounded" style={{ background: `${(typeColor as any)[activeConv.type]}12`, color: (typeColor as any)[activeConv.type], fontFamily: "var(--font-mono)" }}>{(typeLabel as any)[activeConv.type]}</span>
            <select value={assignments[activeConv.id] || ""} onChange={e => setAssignments(p => ({...p, [activeConv.id]: e.target.value}))} className="text-xs rounded-xl py-1.5 px-2 min-w-[140px]">
              <option value="">Assign to...</option>
              {ASSIGN_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            {assignments[activeConv.id] && <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)]" />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {(messages[activeConv.id] || []).map(msg => (
            <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-xs px-4 py-2.5 rounded-2xl text-sm", msg.sent ? "rounded-tr-sm" : "rounded-tl-sm")} style={{
                background: msg.sent ? "var(--nx-gold)" : "var(--nx-bg3)",
                color: msg.sent ? "black" : "var(--nx-text1)",
                border: msg.sent ? "none" : "1px solid var(--nx-border)",
              }}>
                <p className="font-semibold text-[10px] mb-1 opacity-70">{msg.from}</p>
                <p>{msg.text}</p>
                <p className={cn("text-[9px] mt-1", msg.sent ? "text-black/50 text-right" : "text-[var(--nx-text3)]")}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--nx-border)] bg-[var(--nx-bg2)]">
          <div className="flex gap-2">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder={`Reply as Academy...`} className="flex-1 text-sm rounded-xl py-2.5" />
            <button onClick={sendMessage} disabled={!newMsg.trim()} className="p-2.5 rounded-xl disabled:opacity-40 transition-all" style={{ background: "var(--nx-gold)", color: "black" }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBroadcast(false)} />
          <div className="relative w-full max-w-md bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-[var(--nx-text1)]">Broadcast Message</h2>
                <p className="text-xs text-[var(--nx-text3)] mt-0.5">Send to all athletes or a specific group</p>
              </div>
              <button onClick={() => setShowBroadcast(false)} className="p-2 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Send to</p>
                <div className="flex gap-2">
                  {[["all","All Athletes (48)"],["tournament","Tournament Registrants"]].map(([v, l]) => (
                    <button key={v} onClick={() => setBroadcastTarget(v as any)} className={cn("flex-1 py-2 rounded-xl text-xs font-semibold transition-all", broadcastTarget === v ? "bg-[var(--nx-gold)] text-black" : "bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)]")}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[var(--nx-text3)] mb-2 tracking-widest uppercase" style={{fontFamily:"var(--font-mono)"}}>Message</p>
                <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)} rows={4} placeholder="e.g. ISL U-19 trials have been announced — please update your profile to 80% before March 22..." className="text-sm rounded-xl w-full" />
              </div>
              <div className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <p className="text-[10px] text-[var(--nx-text3)]">
                  This message will appear in each athlete's individual inbox with a <span className="font-semibold text-[var(--nx-amber)]">BROADCAST</span> label. Athletes cannot reply to broadcasts.
                </p>
              </div>
              <button onClick={sendBroadcast} disabled={!broadcastText.trim() || broadcastSent} className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 hover:brightness-110 transition-all flex items-center justify-center gap-2" style={{ background: "var(--nx-gold)", color: "black" }}>
                {broadcastSent ? <><CheckCircle2 className="w-4 h-4" />Sent!</> : <><Megaphone className="w-4 h-4" />Send Broadcast</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ConvRow({ conv, active, onClick, typeColor, typeLabel }: any) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-start gap-3 p-4 border-b border-[var(--nx-border)] transition-all hover:bg-[var(--nx-bg4)]", active && "bg-[var(--nx-green-dim)] border-l-2 border-l-[var(--nx-green)]")}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0" style={{ background: typeColor[conv.type] + "12", color: typeColor[conv.type], border: `1px solid ${typeColor[conv.type]}25`, fontFamily: "var(--font-display)" }}>{conv.avatar}</div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xs text-[var(--nx-text1)]">{conv.name}</p>
          <span className="text-[9px] text-[var(--nx-text3)]">{conv.time}</span>
        </div>
        <p className="text-[10px] text-[var(--nx-text3)] truncate">{conv.org}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ background: typeColor[conv.type] + "12", color: typeColor[conv.type], fontFamily: "var(--font-mono)" }}>{typeLabel[conv.type]}</span>
          {conv.unread > 0 && <span className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "var(--nx-green)", color: "black" }}>{conv.unread}</span>}
        </div>
      </div>
    </button>
  )
}
