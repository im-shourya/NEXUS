"use client"
import { useState } from "react"
import { TrendingUp, ExternalLink, Copy, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const MY_STATS = {
  name: "Nagpur FC Youth Academy",
  city: "Nagpur",
  sport: "Football",
  reputationScore: 82,
  cityRank: 1,
  stateRank: 4,
  nationalRank: 23,
  avgAiScore: 72,
  scoutInquiries: 23,
  trialConversions: 12,
  profileStrength: 88,
  profileViews: 1204,
  enquiries: 34,
  athletes: 48,
}

const COMPETITORS = [
  { name: "Mumbai City FC Academy", city: "Mumbai", reputation: 91, avgAiScore: 79, scoutInquiries: 38, trials: 22, athletes: 50, rank: 1, diff: -9 },
  { name: "Bengaluru FC Youth", city: "Bengaluru", reputation: 87, avgAiScore: 76, scoutInquiries: 31, trials: 18, athletes: 50, rank: 2, diff: -5 },
  { name: "Hyderabad FC Academy", city: "Hyderabad", reputation: 84, avgAiScore: 74, scoutInquiries: 27, trials: 14, athletes: 45, rank: 3, diff: -2 },
  { name: "Nagpur FC Youth Academy", city: "Nagpur", reputation: 82, avgAiScore: 72, scoutInquiries: 23, trials: 12, athletes: 48, rank: 4, isMe: true, diff: 0 },
  { name: "Pune FC Academy", city: "Pune", reputation: 76, avgAiScore: 68, scoutInquiries: 17, trials: 9, athletes: 40, rank: 5, diff: 6 },
  { name: "Aurangabad Sports Academy", city: "Aurangabad", reputation: 71, avgAiScore: 63, scoutInquiries: 12, trials: 7, athletes: 32, rank: 6, diff: 11 },
  { name: "Nagpur Sports Club", city: "Nagpur", reputation: 68, avgAiScore: 61, scoutInquiries: 9, trials: 5, athletes: 28, rank: 7, diff: 14 },
]

const TABS = ["My Academy Listing", "Similar Academies"]

export default function AcademyAcademiesPage() {
  const [tab, setTab] = useState("My Academy Listing")
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText("https://nexus.in/academy/nagpur-fc-youth")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Academies</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">Manage your public listing and benchmark against peers</p>
      </div>

      <div className="flex gap-1 border-b border-[var(--nx-border)]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all",
            tab === t ? "bg-[rgba(255,184,0,0.08)] text-[var(--nx-gold)] border-b-2 border-[var(--nx-gold)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "My Academy Listing" && (
        <div className="space-y-5">
          {/* Preview Card */}
          <div className="p-5 rounded-2xl border" style={{ background: "rgba(255,184,0,0.03)", borderColor: "rgba(255,184,0,0.3)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[var(--nx-text1)]">Your Public Listing Preview</p>
              <div className="flex gap-2">
                <button onClick={copyUrl} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
                  <Copy className="w-3 h-3" />{copied ? "Copied!" : "Copy URL"}
                </button>
                <a href="/academy/nagpur-fc-youth" target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[var(--nx-gold)] text-black font-semibold">
                  <ExternalLink className="w-3 h-3" />Preview
                </a>
              </div>
            </div>
            {/* Miniature Preview */}
            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "rgba(255,184,0,0.1)", border: "2px solid rgba(255,184,0,0.3)" }}>NF</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[var(--nx-text1)]">{MY_STATS.name}</p>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>ISL Feeder</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>Khelo India</span>
                  </div>
                  <p className="text-sm text-[var(--nx-text2)] mt-0.5">⚽ Football · {MY_STATS.city}, Maharashtra</p>
                  <div className="flex gap-4 mt-2 text-xs text-[var(--nx-text3)]">
                    <span>{MY_STATS.athletes} athletes</span>
                    <span>{MY_STATS.scoutInquiries} scout inquiries</span>
                    <span>{MY_STATS.trialConversions} trials placed</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)" }}>{MY_STATS.reputationScore}</p>
                  <p className="text-[10px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Score</p>
                  <p className="text-[10px] text-[var(--nx-gold)] mt-0.5">#{MY_STATS.cityRank} in Nagpur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Profile Views", val: MY_STATS.profileViews.toLocaleString(), sub: "this month", color: "var(--nx-cyan)" },
              { label: "Enquiries", val: MY_STATS.enquiries, sub: "this month", color: "var(--nx-gold)" },
              { label: "Scout Inquiries", val: MY_STATS.scoutInquiries, sub: "this month", color: "var(--nx-purple)" },
              { label: "Profile Completeness", val: `${MY_STATS.profileStrength}%`, sub: "complete", color: "var(--nx-green)" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-center">
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.val}</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
                <p className="text-[10px] text-[var(--nx-text3)]">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Edit Shortcuts */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3">Quick Edit Shortcuts</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { label: "Update Academy Description", link: "/academy/profile#description" },
                { label: "Upload Academy Logo", link: "/academy/settings#brand" },
                { label: "Add Coaching Staff", link: "/academy/profile#staff" },
                { label: "Update Facilities", link: "/academy/profile#facilities" },
                { label: "Feature New Athletes", link: "/academy/videos" },
                { label: "Create a Tournament", link: "/academy/tournaments/create" },
              ].map((item, i) => (
                <a key={i} href={item.link} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-all">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[var(--nx-gold)]" />{item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Ranking Breakdown */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3">Your Academy Rankings</h3>
            {[
              { label: "City Rank (Nagpur · Football)", val: `#${MY_STATS.cityRank}`, color: "var(--nx-gold)" },
              { label: "State Rank (Maharashtra · Football)", val: `#${MY_STATS.stateRank}`, color: "var(--nx-green)" },
              { label: "National Rank (All Football Academies)", val: `#${MY_STATS.nationalRank}`, color: "var(--nx-cyan)" },
              { label: "Reputation Score", val: `${MY_STATS.reputationScore}/100`, color: "var(--nx-gold)" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[var(--nx-border)] last:border-0">
                <span className="text-sm text-[var(--nx-text2)]">{r.label}</span>
                <span className="font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: r.color }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Similar Academies" && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)" }}>
            <p className="text-sm text-[var(--nx-text2)]">
              <span className="text-[var(--nx-cyan)] font-semibold">Benchmarking Intelligence</span> — Rankings are based on average AI score of enrolled athletes, scout engagement rate, and trial conversion. Updated weekly.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] overflow-hidden">
            <div className="grid grid-cols-6 p-3 border-b border-[var(--nx-border)] bg-[var(--nx-bg4)]" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr" }}>
              {["Academy", "Score", "Avg AI", "Scouts/mo", "Trials", "Gap"].map(h => (
                <p key={h} className="text-[10px] font-semibold text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</p>
              ))}
            </div>
            {COMPETITORS.map((c, i) => (
              <div key={i} className={cn("grid p-4 border-b border-[var(--nx-border)] last:border-0 transition-all", c.isMe ? "bg-[rgba(255,184,0,0.04)]" : "hover:bg-[var(--nx-bg4)]")}
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>#{c.rank}</span>
                    <p className={cn("text-sm font-semibold", c.isMe ? "text-[var(--nx-gold)]" : "text-[var(--nx-text1)]")}>{c.name}</p>
                    {c.isMe && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)", fontFamily: "var(--font-mono)" }}>YOU</span>}
                  </div>
                  <p className="text-xs text-[var(--nx-text3)] mt-0.5"><MapPin className="w-2.5 h-2.5 inline mr-0.5" />{c.city}</p>
                </div>
                <p className="text-sm font-bold self-center" style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: c.isMe ? "var(--nx-gold)" : "var(--nx-text1)" }}>{c.reputation}</p>
                <p className="text-sm self-center" style={{ color: c.isMe ? "var(--nx-gold)" : "var(--nx-text2)" }}>{c.avgAiScore}/100</p>
                <p className="text-sm self-center" style={{ color: c.isMe ? "var(--nx-gold)" : "var(--nx-text2)" }}>{c.scoutInquiries}</p>
                <p className="text-sm self-center" style={{ color: c.isMe ? "var(--nx-gold)" : "var(--nx-text2)" }}>{c.trials}</p>
                <p className="text-sm self-center font-semibold" style={{ color: c.diff < 0 ? "var(--nx-red)" : c.diff === 0 ? "var(--nx-gold)" : "var(--nx-green)" }}>
                  {c.diff === 0 ? "—" : c.diff < 0 ? `${c.diff}` : `+${c.diff}`}
                </p>
              </div>
            ))}
          </div>

          {/* Improvement Tips */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-semibold text-[var(--nx-text1)] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--nx-gold)]" />How to Close the Gap with #3 Hyderabad FC
            </h3>
            <div className="space-y-3">
              {[
                { action: "Increase average AI score by 2pts", impact: "Moves you 1.5 reputation points up", difficulty: "Medium" },
                { action: "Get 4 more scout inquiries per month", impact: "Closes 30% of the gap", difficulty: "Hard" },
                { action: "Upload 15+ videos this month (7 athletes inactive)", impact: "+3 video activity score", difficulty: "Easy" },
                { action: "Host 1 more tournament this quarter", impact: "+2 tournament participation score", difficulty: "Easy" },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-black" style={{ background: "var(--nx-gold)" }}>{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--nx-text1)]">{tip.action}</p>
                    <p className="text-xs text-[var(--nx-text3)] mt-0.5">{tip.impact}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded shrink-0" style={{ background: tip.difficulty === "Easy" ? "var(--nx-green-dim)" : tip.difficulty === "Medium" ? "rgba(245,166,35,0.1)" : "rgba(255,59,48,0.08)", color: tip.difficulty === "Easy" ? "var(--nx-green)" : tip.difficulty === "Medium" ? "var(--nx-amber)" : "var(--nx-red)" }}>
                    {tip.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
