"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Search, CheckCheck, Check, MoreVertical, Phone, ChevronLeft, Sparkles, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

import { useUser } from "@/store/auth-store"

const DUMMY_CONVERSATIONS = [
  { id: 1, name: "Rahul Verma", initials: "RV", org: "Mumbai City FC", role: "scout", tier: "ISL", tierColor: "var(--nx-purple)", preview: "Looking forward to seeing your performance!", time: "2h ago", unread: 2, isOnline: true },
  { id: 2, name: "Priya Singh", initials: "PS", org: "Chennaiyin FC", role: "scout", tier: "ISL", tierColor: "var(--nx-purple)", preview: "Please accept the trial invitation at your earliest...", time: "Yesterday", unread: 1, isOnline: false },
  { id: 3, name: "Nagpur FC Academy", initials: "NA", org: "Academy", role: "academy", tier: "ACADEMY", tierColor: "var(--nx-gold)", preview: "Please update your profile before the selection camp", time: "2d ago", unread: 0, isOnline: false },
  { id: 4, name: "K. Balaji", initials: "KB", org: "Bengaluru FC", role: "scout", tier: "ISL", tierColor: "var(--nx-purple)", preview: "Saw your free-kick compilation. Impressive accuracy.", time: "1w ago", unread: 0, isOnline: true },
]

type Message = {
  id: number | string; content: string; sender: "me" | "them"; time: string; read?: boolean;
  type?: "text" | "invite"
  inviteData?: { org: string; position: string; date: string; location: string; status: "pending" | "accepted" | "declined" }
}

const THREADS: Record<number, Message[]> = {
  1: [
    { id: 1, content: "Hello Priya! I've reviewed your profile and highlight reel. Very impressive performance in the state championship.", sender: "them", time: "10:02 AM", read: true },
    { id: 2, content: "Thank you so much! I've been working really hard on my technique.", sender: "me", time: "10:15 AM", read: true },
    { id: 3, content: "I can see that. Your sprint speed and ball control are particularly standout. I'd like to discuss a trial opportunity.", sender: "them", time: "10:18 AM", read: true },
    { id: 4, type: "invite", content: "", sender: "them", time: "10:22 AM", inviteData: { org: "Mumbai City FC", position: "Striker / Left Wing Forward", date: "Jan 5–7, 2026", location: "Mumbai Football Arena", status: "pending" } },
    { id: 5, content: "Looking forward to seeing your performance! Please confirm by Dec 30.", sender: "them", time: "10:23 AM", read: true },
  ],
  2: [
    { id: 1, content: "Hi, I've been following your progress on NEXUS. Your free-kick compilation was outstanding.", sender: "them", time: "Yesterday 3:12 PM", read: true },
    { id: 4, type: "invite", content: "", sender: "them", time: "Yesterday 3:18 PM", inviteData: { org: "Chennaiyin FC", position: "Striker / Forward", date: "Feb 2–4, 2026", location: "Chennai Football Stadium", status: "pending" } },
  ],
  3: [
    { id: 1, content: "Please update your profile to at least 80% completion before the ISL selection camp on January 18.", sender: "them", time: "2d ago", read: true },
  ],
  4: [
    { id: 1, content: "Saw your free-kick compilation. Impressive accuracy. Would love to discuss potential opportunities.", sender: "them", time: "1w ago", read: true },
  ],
}

const QUICK_REPLIES = [
  "Thank you! I am available. Could you share more details?",
  "I play right foot and can also cover the right wing.",
  "My current season stats are on my profile.",
  "Namaste! I will respond within 24 hours.",
]

export default function AthleteMessagesPage() {
  const user = useUser()
  const [activeConv, setActiveConv] = useState<number | string>(1)
  const [conversations, setConversations] = useState<any[]>(DUMMY_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<string | number, Message[]>>(THREADS)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  useEffect(() => {
    fetch('/api/messages/conversations')
      .then(res => res.json())
      .then(data => {
        if (data.conversations && data.conversations.length > 0) {
          const formatted = data.conversations.map((c: any) => ({
            id: c.id,
            name: c.other_user?.full_name || "Unknown User",
            initials: c.other_user?.full_name ? c.other_user.full_name.substring(0, 2).toUpperCase() : "U",
            org: c.other_user?.role || "User",
            role: c.other_user?.role?.toLowerCase() || "user",
            tier: c.other_user?.role === 'SCOUT' ? 'ISL' : c.other_user?.role,
            tierColor: c.other_user?.role === 'ACADEMY' ? 'var(--nx-gold)' : 'var(--nx-purple)',
            preview: "Tap to view messages", // The backend doesn't return last message content yet
            time: new Date(c.last_message_at || c.created_at).toLocaleDateString(),
            unread: c.unread_count || 0,
            isOnline: false
          }))
          setConversations(formatted)
          if (formatted.length > 0) setActiveConv(formatted[0].id)
        }
      })
      .catch(console.error)
  }, [])

  // Fetch messages for active conversation
  useEffect(() => {
    if (typeof activeConv === 'string') {
      fetch(`/api/messages/${activeConv}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            const formattedMsgs = data.messages.map((m: any) => ({
              id: m.id,
              content: m.content,
              sender: m.sender_id === user?.id ? "me" : "them",
              time: new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              read: m.read,
              type: "text"
            }))
            setAllMessages(prev => ({ ...prev, [activeConv]: formattedMsgs }))
          } else {
            setAllMessages(prev => ({ ...prev, [activeConv]: [] }))
          }
        })
        .catch(console.error)
    }
  }, [activeConv, user])

  const conv = conversations.find(c => c.id === activeConv) || DUMMY_CONVERSATIONS[0]
  const messages = allMessages[activeConv] || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConv])

  const send = async () => {
    if (!input.trim()) return

    const newMsg: Message = {
      id: Date.now(), content: input, sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false, type: "text"
    }

    // Optimistic update
    setAllMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }))
    setInput("")

    // Call API if it's a real conversation
    if (typeof activeConv === 'string') {
      try {
        await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: activeConv, content: newMsg.content })
        })
      } catch (err) {
        console.error("Failed to send message", err)
      }
    }
  }

  const handleInvite = (msgId: number | string, action: "accepted" | "declined") => {
    setAllMessages(prev => ({
      ...prev,
      [activeConv]: prev[activeConv].map(m =>
        m.id === msgId && m.inviteData ? { ...m, inviteData: { ...m.inviteData, status: action } } : m
      )
    }))
  }

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.org.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread || 0), 0)

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-[var(--nx-border)]" style={{ background: "var(--nx-bg2)" }}>

      {/* ── INBOX PANEL ─────────────────────────────── */}
      <div className={cn(
        "w-80 border-r border-[var(--nx-border)] flex flex-col shrink-0",
        showMobileChat ? "hidden sm:flex" : "flex"
      )}>
        {/* Inbox header */}
        <div className="p-4 border-b border-[var(--nx-border)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-[var(--nx-text1)]">Messages</h2>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>
                {totalUnread} unread
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--nx-text3)]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 py-2 text-sm rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text1)] placeholder:text-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)]"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => (
            <button key={c.id} onClick={() => { setActiveConv(c.id); setShowMobileChat(true) }}
              className={cn(
                "w-full flex items-start gap-3 p-4 text-left border-b border-[var(--nx-border)] transition-all",
                activeConv === c.id
                  ? "bg-[var(--nx-green-dim)] border-l-2 border-l-[var(--nx-green)]"
                  : "hover:bg-[var(--nx-bg4)]"
              )}>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: `${c.tierColor}18`, border: `2px solid ${c.tierColor}40`, color: c.tierColor, fontFamily: "var(--font-mono)" }}>
                  {c.initials}
                </div>
                {c.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--nx-green)] rounded-full border-2 border-[var(--nx-bg2)]" />}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm text-[var(--nx-text1)] truncate">{c.name}</span>
                  <span className="text-[10px] text-[var(--nx-text3)] shrink-0 ml-1">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--nx-text3)] truncate">{c.preview}</span>
                  {c.unread > 0 && (
                    <span className="ml-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: "var(--nx-green)", color: "black" }}>{c.unread}</span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 block font-medium" style={{ color: c.tierColor, fontFamily: "var(--font-mono)" }}>{c.org}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── CHAT PANEL ───────────────────────────────── */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !showMobileChat ? "hidden sm:flex" : "flex"
      )}>
        {/* Chat header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[var(--nx-border)] shrink-0" style={{ background: "var(--nx-bg3)" }}>
          <button onClick={() => setShowMobileChat(false)} className="sm:hidden p-1.5 rounded-lg text-[var(--nx-text3)]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: `${conv.tierColor}18`, border: `2px solid ${conv.tierColor}40`, color: conv.tierColor, fontFamily: "var(--font-mono)" }}>
              {conv.initials}
            </div>
            {conv.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--nx-green)] rounded-full border border-[var(--nx-bg3)]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-[var(--nx-text1)]">{conv.name}</span>
              <Shield className="w-3 h-3 text-[var(--nx-cyan)]" />
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${conv.tierColor}15`, color: conv.tierColor, fontFamily: "var(--font-mono)" }}>{conv.tier}</span>
            </div>
            <p className="text-xs truncate" style={{ color: conv.isOnline ? "var(--nx-green)" : "var(--nx-text3)" }}>
              {conv.isOnline ? "● Online" : "Last seen recently"} · {conv.org}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="p-2 rounded-xl border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors" style={{ background: "var(--nx-bg4)" }}>
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors" style={{ background: "var(--nx-bg4)" }}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: "var(--nx-bg)" }}>
          {/* Date separator */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-px bg-[var(--nx-border)]" />
            <span className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Today</span>
            <div className="flex-1 h-px bg-[var(--nx-border)]" />
          </div>

          {messages.map(msg => (
            <div key={msg.id} className={cn("flex flex-col gap-1", msg.sender === "me" ? "items-end" : "items-start")}>

              {/* Sender name — shown for "them" messages only */}
              {msg.sender === "them" && msg.type !== "invite" && (
                <span className="text-[11px] font-semibold ml-1" style={{ color: conv.tierColor }}>{conv.name}</span>
              )}

              {/* Trial Invite Card */}
              {msg.type === "invite" && msg.inviteData && (
                <div className="w-72 rounded-2xl border overflow-hidden"
                  style={{ background: "rgba(0,212,255,0.05)", borderColor: "rgba(0,212,255,0.22)" }}>
                  <div className="px-4 py-2.5 border-b flex items-center gap-1.5" style={{ borderColor: "rgba(0,212,255,0.15)" }}>
                    <Sparkles className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
                    <span className="text-[10px] font-bold text-[var(--nx-cyan)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Trial Invitation</span>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <p className="font-bold text-[var(--nx-text1)] text-base">{msg.inviteData.org}</p>
                    <div className="space-y-1.5 text-xs text-[var(--nx-text2)]">
                      <p>⚽ Position: {msg.inviteData.position}</p>
                      <p>📅 Date: {msg.inviteData.date}</p>
                      <p>📍 Venue: {msg.inviteData.location}</p>
                    </div>
                    {msg.inviteData.status === "pending" && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => handleInvite(msg.id, "accepted")}
                          className="flex-1 py-2 rounded-xl text-xs font-bold hover:brightness-110 transition-all"
                          style={{ background: "var(--nx-green)", color: "black" }}>✓ Accept</button>
                        <button onClick={() => handleInvite(msg.id, "declined")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[var(--nx-border2)] text-[var(--nx-text2)] hover:border-[var(--nx-red)] hover:text-[var(--nx-red)] transition-colors"
                          style={{ background: "var(--nx-bg4)" }}>Decline</button>
                      </div>
                    )}
                    {msg.inviteData.status === "accepted" && (
                      <p className="text-center text-xs font-bold py-1" style={{ color: "var(--nx-green)" }}>✓ Invitation Accepted!</p>
                    )}
                    {msg.inviteData.status === "declined" && (
                      <p className="text-center text-xs font-bold py-1" style={{ color: "var(--nx-red)" }}>Invitation Declined</p>
                    )}
                  </div>
                  <div className="px-4 pb-3 text-right">
                    <span className="text-[10px] text-[var(--nx-text3)]">{msg.time}</span>
                  </div>
                </div>
              )}

              {/* Regular text message */}
              {msg.type !== "invite" && (
                <div className="max-w-xs">
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    msg.sender === "me"
                      ? "rounded-tr-sm text-[var(--nx-text1)]"
                      : "rounded-tl-sm text-[var(--nx-text1)]"
                  )}
                    style={msg.sender === "me"
                      ? { background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)" }
                      : { background: "var(--nx-bg3)", border: "1px solid var(--nx-border2)" }}>
                    {msg.content}
                  </div>
                  <div className={cn("flex items-center gap-1 mt-1", msg.sender === "me" ? "justify-end" : "justify-start")}>
                    <span className="text-[10px] text-[var(--nx-text3)]">{msg.time}</span>
                    {msg.sender === "me" && (
                      msg.read
                        ? <CheckCheck className="w-3 h-3" style={{ color: "var(--nx-cyan)" }} />
                        : <Check className="w-3 h-3 text-[var(--nx-text3)]" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 px-4 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border2)" }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--nx-text3)]"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <span className="text-xs text-[var(--nx-text3)]">{conv.name} is typing…</span>
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2.5 border-t border-[var(--nx-border)] overflow-x-auto" style={{ background: "var(--nx-bg2)" }}>
          <div className="flex gap-2 min-w-max">
            {QUICK_REPLIES.map((r, i) => (
              <button key={i} onClick={() => setInput(r)}
                className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all hover:border-[var(--nx-green-border)] hover:text-[var(--nx-green)]"
                style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border2)", color: "var(--nx-text2)" }}>
                {r.length > 36 ? r.slice(0, 36) + "…" : r}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-[var(--nx-border)] flex items-center gap-3" style={{ background: "var(--nx-bg2)" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type a message…"
            className="flex-1 w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text1)] placeholder:text-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)]"
          />
          <button onClick={send} disabled={!input.trim()}
            className="p-3 rounded-xl shrink-0 transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--nx-green)", color: "black" }}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
