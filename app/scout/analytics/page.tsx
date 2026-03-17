"use client"
import { useState } from "react"
import { MapPin, Globe, Zap, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

const discoveryFunnel = [
  { stage: "Athletes Viewed", count: 2847, color: "var(--nx-purple)" },
  { stage: "Profiles Opened", count: 412, color: "var(--nx-cyan)" },
  { stage: "Shortlisted", count: 48, color: "var(--nx-gold)" },
  { stage: "Messaged", count: 18, color: "var(--nx-green)" },
  { stage: "Trial Invited", count: 7, color: "var(--nx-orange)" },
  { stage: "Signed", count: 2, color: "var(--nx-green)" },
]
const weeklyData = [
  { week: "W1", profiles: 142, messages: 8 },
  { week: "W2", profiles: 189, messages: 11 },
  { week: "W3", profiles: 156, messages: 7 },
  { week: "W4", profiles: 234, messages: 15 },
  { week: "W5", profiles: 198, messages: 12 },
  { week: "W6", profiles: 271, messages: 18 },
]
const geoData = [
  { state: "Maharashtra", count: 412, pct: 18 },
  { state: "Karnataka", count: 356, pct: 15 },
  { state: "West Bengal", count: 298, pct: 13 },
  { state: "Tamil Nadu", count: 267, pct: 11 },
  { state: "Telangana", count: 245, pct: 10 },
  { state: "Punjab", count: 189, pct: 8 },
  { state: "Others", count: 680, pct: 25 },
]
const sportDist = [
  { name: "Football", value: 52, color: "var(--nx-green)" },
  { name: "Athletics", value: 18, color: "var(--nx-blue)" },
  { name: "Kabaddi", value: 14, color: "var(--nx-pink)" },
  { name: "Badminton", value: 10, color: "#A3E635" },
  { name: "Others", value: 6, color: "var(--nx-text3)" },
]

// Market Intelligence data
const positionScarcity = [
  { pos: "Goalkeeper", demand: 38, supply: 12, scarcity: 3.2 },
  { pos: "Leg-Spinner", demand: 45, supply: 8, scarcity: 5.6 },
  { pos: "CDM", demand: 31, supply: 19, scarcity: 1.6 },
  { pos: "Kabaddi Defender", demand: 27, supply: 22, scarcity: 1.2 },
  { pos: "Striker", demand: 52, supply: 67, scarcity: 0.8 },
  { pos: "Athletics — 100m", demand: 14, supply: 34, scarcity: 0.4 },
]
const regionalDensity = [
  { state: "Maharashtra", athletes: 1240, scouts: 8, ratio: 155 },
  { state: "Karnataka", athletes: 890, scouts: 5, ratio: 178 },
  { state: "Tamil Nadu", athletes: 760, scouts: 3, ratio: 253 },
  { state: "West Bengal", athletes: 680, scouts: 2, ratio: 340 },
  { state: "Jharkhand", athletes: 420, scouts: 1, ratio: 420 },
  { state: "Telangana", athletes: 510, scouts: 2, ratio: 255 },
  { state: "Punjab", athletes: 380, scouts: 3, ratio: 127 },
]
const pipelineVelocity = [
  { month: "Oct", football: 42, cricket: 28, kabaddi: 18 },
  { month: "Nov", football: 58, cricket: 31, kabaddi: 22 },
  { month: "Dec", football: 49, cricket: 35, kabaddi: 19 },
  { month: "Jan", football: 74, cricket: 42, kabaddi: 28 },
  { month: "Feb", football: 89, cricket: 51, kabaddi: 34 },
  { month: "Mar", football: 96, cricket: 58, kabaddi: 41 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--nx-bg3)] border border-[var(--nx-border2)] rounded-lg p-2 text-xs">
      <p className="text-[var(--nx-text3)]">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

export default function ScoutAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("activity")
  const [miSport, setMiSport] = useState("Football")

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Scout Analytics</h1>
        <p className="text-sm text-[var(--nx-text3)] mt-0.5">Your scouting pipeline + India talent market intelligence</p>
      </div>

      <div className="flex gap-1 border-b border-[var(--nx-border)]">
        {["activity","market_intelligence"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${activeTab === t ? "bg-[rgba(155,93,255,0.08)] text-[var(--nx-purple)] border-b-2 border-[var(--nx-purple)]" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"}`}>
            {t === "activity" ? "My Activity" : "Market Intelligence"}
          </button>
        ))}
      </div>

      {/* ACTIVITY TAB */}
      {activeTab === "activity" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Athletes Viewed", "2,847", "+18% vs last month", "var(--nx-purple)"], ["Messages Sent", "247", "+34 this week", "var(--nx-cyan)"], ["Trial Invites", "7", "4 accepted", "var(--nx-gold)"], ["Signed", "2", "This season", "var(--nx-green)"]].map(([l, v, s, c]) => (
              <div key={l as string} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}</p>
                <p className="text-xs text-[var(--nx-text1)] font-semibold mt-1">{l}</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">{s}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Discovery Funnel</p>
              <div className="space-y-2">
                {discoveryFunnel.map((item, i) => {
                  const pct = (item.count / discoveryFunnel[0].count) * 100
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--nx-text3)] w-28 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{item.stage}</span>
                      <div className="flex-1 h-6 rounded-lg bg-[var(--nx-bg5)] overflow-hidden relative">
                        <div className="h-full rounded-lg flex items-center pl-2 transition-all" style={{ width: `${pct}%`, background: `${item.color}22`, border: `1px solid ${item.color}44` }}>
                          <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: item.color, fontFamily: "var(--font-display)" }}>{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Weekly Activity Trend</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--nx-border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="profiles" stroke="var(--nx-purple)" strokeWidth={2} dot={{ fill: "var(--nx-purple)", r: 3 }} name="Profiles" />
                  <Line type="monotone" dataKey="messages" stroke="var(--nx-cyan)" strokeWidth={2} dot={{ fill: "var(--nx-cyan)", r: 3 }} name="Messages" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Geographic Reach</p>
              <div className="space-y-2">
                {geoData.map((g, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--nx-text2)] w-24 shrink-0">{g.state}</span>
                    <div className="flex-1 h-3 rounded-full bg-[var(--nx-bg5)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${g.pct * 4}%`, background: "var(--nx-purple)" }} />
                    </div>
                    <span className="text-xs font-bold text-[var(--nx-text1)] w-6 text-right" style={{ fontFamily: "var(--font-display)" }}>{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="font-semibold text-sm text-[var(--nx-text1)] mb-4">Sports Distribution</p>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={sportDist} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                      {sportDist.map((s, i) => <Cell key={i} fill={s.color} stroke="var(--nx-bg3)" strokeWidth={2} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {sportDist.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-[var(--nx-text2)] flex-1">{s.name}</span>
                      <span className="text-xs font-bold" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MARKET INTELLIGENCE TAB */}
      {activeTab === "market_intelligence" && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(155,93,255,0.04)", border: "1px solid rgba(155,93,255,0.2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-[var(--nx-purple)]" />
              <p className="font-semibold text-sm text-[var(--nx-text1)]">India Talent Market Intelligence</p>
            </div>
            <p className="text-xs text-[var(--nx-text3)]">Aggregated, anonymised data updated weekly. Peer scout activity is delayed 7 days to prevent gaming.</p>
          </div>

          {/* Position Scarcity Index */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Position Scarcity Index</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Scout demand ÷ quality athlete supply. &gt;2 = high scarcity opportunity</p>
              </div>
              <Target className="w-5 h-5 text-[var(--nx-orange)]" />
            </div>
            <div className="space-y-3">
              {positionScarcity.sort((a,b) => b.scarcity - a.scarcity).map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--nx-text2)] w-28 shrink-0">{p.pos}</span>
                  <div className="flex-1 h-7 rounded-xl bg-[var(--nx-bg5)] overflow-hidden relative">
                    <div className="h-full rounded-xl flex items-center px-3 transition-all" style={{ width: `${Math.min(100, p.scarcity * 18)}%`, background: p.scarcity > 2 ? "rgba(255,91,25,0.15)" : "rgba(0,245,116,0.07)", border: `1px solid ${p.scarcity > 2 ? "var(--nx-orange-border)" : "var(--nx-green-border)"}` }}>
                      <span className="text-xs font-bold whitespace-nowrap" style={{ color: p.scarcity > 2 ? "var(--nx-orange)" : "var(--nx-green)", fontFamily: "var(--font-display)" }}>{p.scarcity}x</span>
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-[10px] text-[var(--nx-text3)]">{p.demand}d / {p.supply}s</p>
                    {p.scarcity > 2 && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", fontFamily: "var(--font-mono)" }}>SCARCE</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Talent Density */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Regional Talent Density</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Athletes per scout — higher ratio = under-scouted region with hidden opportunities</p>
              </div>
              <MapPin className="w-5 h-5 text-[var(--nx-cyan)]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {regionalDensity.sort((a,b) => b.ratio - a.ratio).map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold" style={{ background: r.ratio > 300 ? "rgba(0,212,255,0.1)" : "var(--nx-bg5)", color: r.ratio > 300 ? "var(--nx-cyan)" : "var(--nx-text3)", fontFamily: "var(--font-display)" }}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[var(--nx-text1)]">{r.state}</p>
                      {r.ratio > 300 && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.1)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>UNDERSCOUT</span>}
                    </div>
                    <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">{r.athletes.toLocaleString()} athletes · {r.scouts} active scouts</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: r.ratio > 300 ? "var(--nx-cyan)" : "var(--nx-text2)" }}>{r.ratio}</p>
                    <p className="text-[8px] text-[var(--nx-text3)]" style={{fontFamily:"var(--font-mono)"}}>per scout</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Velocity */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Platform Pipeline Velocity</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">New high-quality athletes added per month by sport (AI score &gt;60, profile &gt;70%)</p>
              </div>
              <Zap className="w-5 h-5 text-[var(--nx-gold)]" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={pipelineVelocity}>
                <defs>
                  <linearGradient id="colorF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--nx-green)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--nx-green)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--nx-gold)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--nx-gold)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorK" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--nx-orange)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--nx-orange)" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nx-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--nx-text3)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="football" stroke="var(--nx-green)" fill="url(#colorF)" strokeWidth={2} name="Football" />
                <Area type="monotone" dataKey="cricket" stroke="var(--nx-gold)" fill="url(#colorC)" strokeWidth={2} name="Cricket" />
                <Area type="monotone" dataKey="kabaddi" stroke="var(--nx-orange)" fill="url(#colorK)" strokeWidth={2} name="Kabaddi" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 justify-center">
              {[["Football","var(--nx-green)"],["Cricket","var(--nx-gold)"],["Kabaddi","var(--nx-orange)"]].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:c}} />
                  <span className="text-xs text-[var(--nx-text3)]">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Scout Activity */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Peer Scout Activity Map</p>
                <p className="text-[10px] text-[var(--nx-text3)] mt-0.5">Anonymised · aggregated by organisation tier · 7-day delayed</p>
              </div>
              <span className="text-[9px] px-2 py-1 rounded font-bold" style={{ background: "rgba(155,93,255,0.15)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>ANONYMISED</span>
            </div>
            <div className="space-y-2">
              {[
                { tier: "ISL-Level Scouts", regions: "Maharashtra, Karnataka, West Bengal", activity: 89, trend: "+12%" },
                { tier: "I-League Scouts", regions: "Punjab, Haryana, Goa", activity: 64, trend: "+8%" },
                { tier: "IPL Academy Scouts", regions: "Tamil Nadu, Telangana, Maharashtra", activity: 78, trend: "+21%" },
                { tier: "SAI/AFI Scouts", regions: "Pan-India, focus on Haryana, Manipur", activity: 55, trend: "+5%" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--nx-text1)]">{row.tier}</p>
                    <p className="text-[10px] text-[var(--nx-text3)] mt-0.5"><MapPin className="w-2.5 h-2.5 inline" /> {row.regions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-purple)" }}>{row.activity}</p>
                    <p className="text-[9px] text-[var(--nx-green)]">{row.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
