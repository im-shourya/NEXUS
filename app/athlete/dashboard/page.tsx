"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Eye, ChevronRight, Play, Shield, Zap, Plus, X, MapPin, Activity } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { NexusScoreRing } from "@/components/nexus/nexus-score-ring"
import { SkillBar } from "@/components/nexus/skill-bar"
import { cn } from "@/lib/utils"

import { useAuthStore, useUser } from "@/store/auth-store"

// ─── MOCK DATA (replace with live API) ──────────────────────────────────────
const ATHLETE = {
  fullName: "Arjun Sharma", firstName: "Arjun",
  sport: "FOOTBALL",          // CRICKET | KABADDI | ATHLETICS | BADMINTON | HOCKEY | WRESTLING
  position: "Striker (LWF)", role: "RAIDER", playerType: "all_rounder",
  disciplines: ["100m", "Long Jump"],
  city: "Nagpur", state: "Maharashtra", age: 17,
  nexusScore: 74, profileStrength: 68,
  plan: "PRO", hasAiReel: false,
  currentAcademy: "Nagpur FC Youth Academy",
  careerGoal: "To represent India at the ISL U-21 level by 2026.",
  preferredFoot: "Right", weight: "68 kg", height: "5'10\"",
  lookingFor: ["Trial Opportunities", "Scout Connections"],
}
const SPORT_STAT4: Record<string, { label: string; value: string; color: string; sub: string }> = {
  FOOTBALL: { label: "Sprint Speed", value: "82/100", color: "var(--nx-cyan)", sub: "Top 15% strikers · India" },
  CRICKET: { label: "T20 Strike Rate", value: "142", color: "var(--nx-teal)", sub: "Above IPL academy threshold" },
  KABADDI: { label: "Raid Success", value: "74%", color: "var(--nx-pink)", sub: "This month's season best" },
  ATHLETICS: { label: "100m PB", value: "10.84s", color: "var(--nx-blue)", sub: "0.24s from National Junior" },
  BADMINTON: { label: "Smash Accuracy", value: "79%", color: "#A3E635", sub: "Singles · National ranking 142" },
  HOCKEY: { label: "Pass Accuracy", value: "81%", color: "var(--nx-purple)", sub: "Per Hockey India metrics" },
  WRESTLING: { label: "Takedown %", value: "68%", color: "var(--nx-red)", sub: "Freestyle · 65 kg category" },
  BASKETBALL: { label: "Points/Game", value: "18.4", color: "var(--nx-orange)", sub: "Point Guard · U-18 league" },
  VOLLEYBALL: { label: "Kills/Set", value: "4.1", color: "var(--nx-teal)", sub: "Kill % 52 · Outside Hitter" },
  TABLE_TENNIS: { label: "Point Win %", value: "71%", color: "var(--nx-pink)", sub: "State ranked #8 · TTFI" },
  ARCHERY: { label: "Avg/Arrow", value: "8.4/10", color: "#84CC16", sub: "70m recurve · national circuit" },
  KHO_KHO: { label: "Catches/Turn", value: "3.2", color: "var(--nx-gold)", sub: "Above state average" },
}
const SPARK = {
  views: [420, 510, 580, 490, 670, 740, 847], match: [5, 6, 7, 8, 9, 11, 12],
  video: [900, 1200, 1500, 1800, 2000, 2200, 2400], score: [65, 67, 69, 70, 72, 73, 74],
}
const SCOUT_MATCHES = [
  { id: 1, name: "Rahul Verma", org: "Mumbai City FC", tier: "ISL", tc: "var(--nx-purple)", score: 85, viewed: true, isNew: true },
  { id: 2, name: "K. Balaji", org: "Bengaluru FC", tier: "ISL", tc: "var(--nx-purple)", score: 72, viewed: false, isNew: false },
  { id: 3, name: "P. Singh", org: "Chennaiyin FC", tier: "I-L", tc: "var(--nx-cyan)", score: 68, viewed: false, isNew: false },
]
const ACTIVITY = [
  { id: 1, color: "var(--nx-green)", icon: "🔍", title: "Scout viewed your profile", body: "Rahul Verma · Mumbai City FC", time: "2h ago", link: "/athlete/matches" },
  { id: 2, color: "var(--nx-cyan)", icon: "🤖", title: "New AI match detected", body: "K. Balaji matched at 72%", time: "5h ago", link: "/athlete/matches" },
  { id: 3, color: "var(--nx-orange)", icon: "🎯", title: "Trial opportunity open", body: "ISL U-19 Trials · Mumbai", time: "1d ago", link: "/athlete/tournaments" },
  { id: 4, color: "var(--nx-teal)", icon: "📊", title: "Performance report ready", body: "Form analysis complete", time: "1d ago", link: "/athlete/performance" },
  { id: 5, color: "var(--nx-amber)", icon: "⏰", title: "Tournament deadline in 3 days", body: "Maharashtra State U-17 League", time: "2d ago", link: "/athlete/tournaments" },
]
const VIDEOS = [
  { id: "v1", title: "ISL Trial Highlights", views: 1204, scoutViews: 22, ai: true, duration: "2:34" },
  { id: "v2", title: "Free-kick Compilation", views: 847, scoutViews: 11, ai: false, duration: "1:48" },
  { id: "v3", title: "Match vs Nagpur FC", views: 423, scoutViews: 5, ai: false, duration: "4:12" },
]
const UPCOMING = [
  { title: "ISL U-19 Open Trials", city: "Mumbai", deadline: "Jan 14", urgency: "high", daysLeft: 3 },
  { title: "Maharashtra U-17 League", city: "Nagpur", deadline: "Jan 20", urgency: "medium", daysLeft: 9 },
  { title: "Khelo India U-17 Selection", city: "Pune", deadline: "Feb 3", urgency: "low", daysLeft: 23 },
]
const PITCH_POS = [
  { id: "GK", label: "GK", x: 50, y: 90 }, { id: "LB", label: "LB", x: 20, y: 75 }, { id: "CB1", label: "CB", x: 38, y: 75 },
  { id: "CB2", label: "CB", x: 62, y: 75 }, { id: "RB", label: "RB", x: 80, y: 75 }, { id: "CDM", label: "CDM", x: 50, y: 60 },
  { id: "LM", label: "LM", x: 18, y: 44 }, { id: "CM", label: "CM", x: 50, y: 44 }, { id: "RM", label: "RM", x: 82, y: 44 },
  { id: "ST", label: "ST", x: 35, y: 24 }, { id: "CF", label: "CF", x: 65, y: 24 },
]
const ACTIVE_POS = ["CF", "ST"]
const READINESS = [
  { day: "M", score: 82, level: "HIGH" }, { day: "T", score: 76, level: "HIGH" }, { day: "W", score: 58, level: "MOD" },
  { day: "T", score: 90, level: "HIGH" }, { day: "F", score: 71, level: "MOD" }, { day: "S", score: 40, level: "LOW" },
  { day: "S", score: 65, level: "MOD" },
]
const CRICKET_BATTING = { avg: 31.4, sr: 142, runs: 847, fifties: 6, hs: 78 }
const CRICKET_BOWLING = { avg: 21.3, econ: 9.6, wkts: 28, best: "4/23" }
const PROFILE_AREAS = [
  { label: "Info", done: true }, { label: "Photo", done: true }, { label: "Videos", done: true },
  { label: "Stats", done: false }, { label: "Career", done: true }, { label: "Achievements", done: false },
]

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function AnimCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null); const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true; let n = 0; const inc = target / 40
        const t = setInterval(() => { n += inc; if (n >= target) { setV(target); clearInterval(t) } else setV(Math.floor(n)) }, 18)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect()
  }, [target])
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`
  return <span ref={ref}>{fmt(v)}{suffix}</span>
}
function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const d = data.map(v => ({ v }))
  return (
    <ResponsiveContainer width="100%" height={26}>
      <LineChart data={d} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
function ReadinessBar({ day, score, level, today }: { day: string; score: number; level: string; today?: boolean }) {
  const color = level === "HIGH" ? "var(--nx-green)" : level === "MOD" ? "var(--nx-amber)" : "var(--nx-red)"
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-7 rounded-md overflow-hidden bg-[var(--nx-bg4)]" style={{ height: "44px" }}>
        <div className="w-full rounded-md" style={{ height: `${score}%`, marginTop: `${100 - score}%`, background: color, transition: "height 700ms ease-out" }} />
      </div>
      <span className={cn("text-[9px]", today ? "text-[var(--nx-green)] font-bold" : "text-[var(--nx-text3)]")}
        style={{ fontFamily: "var(--font-mono)" }}>{day}</span>
    </div>
  )
}

// Sport-specific profile card
function SportProfileCard({ sport, profile }: { sport: string, profile: any }) {
  if (sport === "FOOTBALL") return (
    <div className="space-y-1.5 text-sm">
      {[["Position", profile?.position_role || "-"], ["Height", profile?.height_cm ? `${profile.height_cm} cm` : "-"], ["Weight", profile?.weight_kg ? `${profile.weight_kg} kg` : "-"], ["City", profile?.city || "-"]].map(([l, v]) => (
        <div key={l} className="flex justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0">
          <span className="text-[9px] text-[var(--nx-text3)] shrink-0 w-28" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</span>
          <span className="text-xs text-[var(--nx-text1)] font-medium text-right">{v}</span>
        </div>
      ))}
    </div>
  )
  if (sport === "CRICKET") return (
    <div className="space-y-2">
      <div className="flex gap-1.5 flex-wrap">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(0,201,177,0.12)", color: "var(--nx-teal)", border: "1px solid rgba(0,201,177,0.25)" }}>🏏 All-Rounder</span>
        <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "rgba(0,201,177,0.08)", color: "var(--nx-teal)" }}>T20 · ODI</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
          <p className="text-[9px] text-[var(--nx-text3)] mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Batting</p>
          <p className="text-sm font-bold" style={{ color: "var(--nx-text1)" }}>Avg <span style={{ color: "var(--nx-teal)" }}>{CRICKET_BATTING.avg}</span></p>
          <p className="text-[10px] text-[var(--nx-text3)]">SR: {CRICKET_BATTING.sr} · HS: {CRICKET_BATTING.hs}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
          <p className="text-[9px] text-[var(--nx-text3)] mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Bowling</p>
          <p className="text-sm font-bold" style={{ color: "var(--nx-text1)" }}>Econ <span style={{ color: "var(--nx-teal)" }}>{CRICKET_BOWLING.econ}</span></p>
          <p className="text-[10px] text-[var(--nx-text3)]">{CRICKET_BOWLING.wkts} wkts · Best: {CRICKET_BOWLING.best}</p>
        </div>
      </div>
    </div>
  )
  if (sport === "KABADDI") return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(247,37,133,0.12)", color: "var(--nx-pink)", border: "1px solid rgba(247,37,133,0.25)", fontFamily: "var(--font-display)", letterSpacing: "1px" }}>RAIDER</span>
        <span className="text-xs text-[var(--nx-text3)]">72 kg · Speed Raider</span>
      </div>
      {[["Raid Success Rate", "74%"], ["Escape Rate", "68%"], ["Super Raids", "8 this season"]].map(([l, v]) => (
        <div key={l} className="flex justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0">
          <span className="text-[10px] text-[var(--nx-text3)]">{l}</span>
          <span className="text-xs font-bold" style={{ color: "var(--nx-pink)", fontFamily: "var(--font-display)", fontSize: "14px" }}>{v}</span>
        </div>
      ))}
    </div>
  )
  if (sport === "ATHLETICS") return (
    <div className="space-y-2">
      <div className="flex gap-1.5 flex-wrap">
        {ATHLETE.disciplines.map(d => (
          <span key={d} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(59,130,246,0.12)", color: "var(--nx-blue)", border: "1px solid rgba(59,130,246,0.25)" }}>{d}</span>
        ))}
      </div>
      {[["100m PB", "10.84s"], ["Long Jump PB", "7.23m"], ["Nat. Junior Std", "10.60s (0.24s gap)"]].map(([l, v]) => (
        <div key={l} className="flex justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0">
          <span className="text-[10px] text-[var(--nx-text3)]">{l}</span>
          <span className="text-xs font-bold" style={{ color: "var(--nx-blue)", fontFamily: "var(--font-mono)" }}>{v}</span>
        </div>
      ))}
    </div>
  )
  return (
    <div className="space-y-1.5 text-sm">
      {[["Sport", sport], ["Position", profile?.position_role || "-"], ["City", profile?.city || "-"]].map(([l, v]) => (
        <div key={l} className="flex justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0">
          <span className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{l}</span>
          <span className="text-xs text-[var(--nx-text1)] font-medium">{v}</span>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AthleteDashboard() {
  const user = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/profile/me')
      .then(res => res.json())
      .then(data => { if (data.profile) setProfile(data.profile) })
      .catch(console.error)
  }, [])

  const currentSport = profile?.sport || ATHLETE.sport
  const s4 = SPORT_STAT4[currentSport] || SPORT_STAT4.FOOTBALL
  const showBanner = !bannerDismissed && ATHLETE.profileStrength < 80

  return (
    <div className="space-y-4 max-w-7xl pb-6">

      {/* ── PROFILE COMPLETION BANNER ─────────────────────────────────── */}
      {showBanner && (
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl"
          style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.25)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <Zap className="w-4 h-4 text-[var(--nx-gold)] shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--nx-text1)]">
                Profile is <span style={{ color: "var(--nx-gold)" }}>{ATHLETE.profileStrength}% complete</span>
              </p>
              <p className="text-xs text-[var(--nx-text3)]">
                Reach 80% for <strong className="text-[var(--nx-gold)]">8× greater</strong> scout visibility — add career stats &amp; 1 more video
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/athlete/profile"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-black transition-all hover:brightness-110"
              style={{ background: "var(--nx-gold)" }}>
              Complete Now
            </Link>
            <button onClick={() => setBannerDismissed(true)} className="p-1 text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── PROFILE STRENGTH BAND ─────────────────────────────────────── */}
      <div className="px-5 py-3 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-[var(--nx-text3)]"
              style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Profile Strength</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: ATHLETE.profileStrength >= 80 ? "var(--nx-green-dim)" : "rgba(255,184,0,0.1)", color: ATHLETE.profileStrength >= 80 ? "var(--nx-green)" : "var(--nx-gold)", border: `1px solid ${ATHLETE.profileStrength >= 80 ? "var(--nx-green-border)" : "rgba(255,184,0,0.25)"}` }}>
              {ATHLETE.profileStrength}%
            </span>
          </div>
          <Link href="/athlete/profile" className="text-[10px] text-[var(--nx-green)] hover:underline" style={{ fontFamily: "var(--font-mono)" }}>Edit Profile →</Link>
        </div>
        <div className="flex gap-1.5">
          {PROFILE_AREAS.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-1.5 rounded-full" style={{ background: item.done ? "var(--nx-green)" : "var(--nx-bg5)" }} />
              <span className="text-[8px] hidden sm:block"
                style={{ fontFamily: "var(--font-mono)", color: item.done ? "var(--nx-green)" : "var(--nx-text3)", textTransform: "uppercase" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "PROFILE VIEWS", val: 847, spark: SPARK.views, color: "var(--nx-green)", trend: "↑ 23% this week", tc: "var(--nx-green)" },
          { label: "SCOUT MATCHES", val: 12, spark: SPARK.match, color: "var(--nx-cyan)", trend: "3 new today", tc: "var(--nx-cyan)" },
          { label: "VIDEO VIEWS", val: 2400, spark: SPARK.video, color: "var(--nx-green)", trend: "↑ 61% last 7d", tc: "var(--nx-green)" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-all">
            <p className="text-[9px] text-[var(--nx-text3)] mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</p>
            <p className="text-[38px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-display)", color: s.color }}><AnimCount target={s.val} /></p>
            <p className="text-[11px] mb-1" style={{ color: s.tc }}>{s.trend}</p>
            <MiniSpark data={s.spark} color={s.color} />
          </div>
        ))}
        {/* Sport-specific 4th stat */}
        <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-all">
          <p className="text-[9px] text-[var(--nx-text3)] mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s4.label}</p>
          <p className="text-[38px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-display)", color: s4.color }}>{s4.value}</p>
          <p className="text-[10px] text-[var(--nx-text3)] mb-1 leading-tight">{s4.sub}</p>
          <MiniSpark data={SPARK.score} color={s4.color} />
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* ── LEFT / CENTRE ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* NexusScore + Skill bars */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-[var(--nx-text1)]">NexusScore™</p>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: "rgba(0,212,255,0.1)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)", border: "1px solid rgba(0,212,255,0.2)" }}>
                  🤖 AI POWERED
                </span>
              </div>
              <div className="flex items-center gap-4">
                <NexusScoreRing score={ATHLETE.nexusScore} size={108} label="/100" animationDelay={200} />
                <div className="flex-1 space-y-2.5">
                  {[
                    { v: "Top 18%", l: "Strikers · India · U-17", c: "var(--nx-gold)" },
                    { v: "↑ 3 pts", l: "improvement this month", c: "var(--nx-green)" },
                    { v: "Peak 24–30", l: "projected performance age", c: "var(--nx-cyan)" },
                  ].map((r, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold leading-tight" style={{ color: r.c }}>{r.v}</p>
                      <p className="text-[10px] text-[var(--nx-text3)]">{r.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[var(--nx-border)] text-[11px]" style={{ color: "var(--nx-amber)" }}>
                Tactical (65) is lowest — <Link href="/athlete/performance" className="text-[var(--nx-green)] hover:underline">improve it →</Link>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Skill Breakdown</p>
                <Link href="/athlete/performance" className="text-[10px] text-[var(--nx-green)] hover:underline">Full report →</Link>
              </div>
              <div className="space-y-2.5">
                {[{ e: "⚡", l: "Speed", s: 82, d: 200 }, { e: "🎯", l: "Technique", s: 78, d: 320 }, { e: "💪", l: "Physical", s: 71, d: 440 }, { e: "🧠", l: "Tactical", s: 65, d: 560 }].map(({ e, l, s, d }) => (
                  <SkillBar key={l} label={l} score={s} emoji={e} size="sm" delay={d} />
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Readiness + AI Reel */}
          <div className="grid sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3 p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Weekly Readiness</p>
                <span className="text-[9px] text-[var(--nx-green)] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: "var(--nx-green-dim)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}>
                  HIGH TODAY
                </span>
              </div>
              <div className="flex items-end justify-between gap-1">
                {READINESS.map((r, i) => <ReadinessBar key={i} day={r.day} score={r.score} level={r.level} today={i === 4} />)}
              </div>
              <p className="text-[10px] text-[var(--nx-text3)] mt-2">Training load + recovery + momentum · Best trial day: Thursday</p>
            </div>
            <div className="sm:col-span-2 p-5 rounded-2xl flex flex-col justify-between"
              style={{ background: ATHLETE.hasAiReel ? "rgba(0,212,255,0.04)" : "rgba(0,245,116,0.04)", border: `1px solid ${ATHLETE.hasAiReel ? "rgba(0,212,255,0.2)" : "rgba(0,245,116,0.2)"}` }}>
              {ATHLETE.hasAiReel ? (
                <>
                  <p className="font-semibold text-sm text-[var(--nx-text1)] mb-2">🤖 Your AI Reel</p>
                  <div className="flex-1 rounded-xl bg-[var(--nx-bg4)] flex items-center justify-center cursor-pointer my-2 hover:opacity-90" style={{ minHeight: "56px" }}>
                    <Play className="w-6 h-6 text-[var(--nx-cyan)]" fill="currentColor" />
                  </div>
                  <p className="text-[10px] text-[var(--nx-text3)]">30-second · AI-generated · 22 scout plays</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5 text-[var(--nx-green)]" />
                    <p className="text-xs font-semibold text-[var(--nx-text1)]">Generate AI Reel</p>
                  </div>
                  <p className="text-[10px] text-[var(--nx-text3)] mb-3 leading-relaxed">
                    Scouts watch 3× more reels than raw footage. Auto-cut 30s from your best videos.
                  </p>
                  <Link href="/athlete/highlights"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-black hover:brightness-110 transition-all"
                    style={{ background: "var(--nx-green)" }}>
                    <Zap className="w-3.5 h-3.5" />Generate Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Highlights grid */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[var(--nx-text1)]">My Highlights</p>
              <Link href="/athlete/highlights" className="text-xs text-[var(--nx-green)] hover:underline flex items-center gap-1">Manage <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {VIDEOS.map(v => (
                <div key={v.id} className="rounded-xl overflow-hidden cursor-pointer group hover:ring-1 hover:ring-[var(--nx-green)] transition-all relative"
                  style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#031A08,#0D2B18)" }}>
                  {v.ai && <span className="absolute top-1 left-1 text-[7px] px-1 py-0.5 rounded font-bold z-10"
                    style={{ background: "rgba(0,212,255,0.15)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>AI</span>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,245,116,0.15)", border: "1.5px solid var(--nx-green)" }}>
                      <Play className="w-3 h-3 text-[var(--nx-green)]" fill="currentColor" style={{ marginLeft: "1px" }} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-1.5"
                    style={{ background: "linear-gradient(to top,rgba(6,13,8,0.9),transparent)" }}>
                    <p className="text-[9px] font-medium text-[var(--nx-text1)] truncate">{v.title}</p>
                    <div className="flex justify-between">
                      <span className="text-[8px] text-[var(--nx-text3)] flex items-center gap-0.5"><Eye className="w-2 h-2" />{v.views >= 1000 ? `${(v.views / 1000).toFixed(1)}K` : v.views}</span>
                      <span className="text-[8px] text-[var(--nx-gold)] flex items-center gap-0.5"><Shield className="w-2 h-2" />{v.scoutViews}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add placeholder */}
              <Link href="/athlete/highlights"
                className="rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)]"
                style={{ aspectRatio: "16/9", background: "var(--nx-bg4)", border: "2px dashed var(--nx-border2)" }}>
                <Plus className="w-4 h-4 text-[var(--nx-text3)]" />
                <span className="text-[8px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Add</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[var(--nx-border)] text-[10px] text-[var(--nx-text3)]">
              <Shield className="w-3 h-3 text-[var(--nx-gold)]" />
              <span><span className="text-[var(--nx-gold)] font-semibold">38 total scout plays</span> across all videos — only visible to you</span>
            </div>
          </div>

          {/* Football formation pitch */}
          {ATHLETE.sport === "FOOTBALL" && (
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-[var(--nx-text1)]">Formation Positions</p>
                <Link href="/athlete/profile" className="text-[11px] text-[var(--nx-green)] hover:underline">Edit →</Link>
              </div>
              <div className="flex items-start gap-5">
                <div className="relative rounded-xl overflow-hidden shrink-0"
                  style={{ width: "176px", height: "138px", background: "#031A08", border: "1px solid rgba(0,245,116,0.12)" }}>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
                    <rect x="0" y="0" width="100" height="100" fill="none" stroke="#00F574" strokeWidth="0.6" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#00F574" strokeWidth="0.4" />
                    <circle cx="50" cy="50" r="14" fill="none" stroke="#00F574" strokeWidth="0.4" />
                    <ellipse cx="50" cy="3" rx="16" ry="9" fill="none" stroke="#00F574" strokeWidth="0.4" />
                    <ellipse cx="50" cy="97" rx="16" ry="9" fill="none" stroke="#00F574" strokeWidth="0.4" />
                  </svg>
                  {PITCH_POS.map(pos => {
                    const active = ACTIVE_POS.includes(pos.id)
                    return (
                      <div key={pos.id} className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                          style={{ background: active ? "var(--nx-green)" : "rgba(255,255,255,0.06)", color: active ? "#000" : "rgba(255,255,255,0.25)", border: active ? "none" : "1px solid rgba(255,255,255,0.1)", boxShadow: active ? "0 0 8px rgba(0,245,116,0.6)" : "none", fontFamily: "var(--font-mono)" }}>
                          {pos.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <p className="text-xs text-[var(--nx-text2)] mb-2">Declared: <span className="text-[var(--nx-green)] font-semibold">CF, Striker (LWF)</span></p>
                  <div className="space-y-1.5">
                    {[["Playing Style", "Pressing · Dribbler"], ["Formation", "4-3-3 · 4-2-3-1"], ["Jersey", "#11"]].map(([l, v]) => (
                      <div key={l} className="flex items-center gap-2 text-xs">
                        <span className="text-[var(--nx-text3)] w-20 shrink-0 text-[10px]">{l}</span>
                        <span className="text-[var(--nx-text1)]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">

          {/* Sports Profile Quick */}
          <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[var(--nx-text1)]">My Profile</p>
              <Link href="/athlete/profile" className="text-[10px] text-[var(--nx-green)] hover:underline">Edit →</Link>
            </div>
            <SportProfileCard sport={currentSport} profile={profile} />
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[var(--nx-border)]">
              {ATHLETE.lookingFor.map(l => (
                <span key={l} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>
                  {l}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-[var(--nx-text3)] mt-2 italic leading-relaxed line-clamp-2">
              "{ATHLETE.careerGoal}"
            </p>
          </div>

          {/* SmartMatch */}
          <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[var(--nx-text1)]">SmartMatch™</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--nx-cyan)] animate-pulse" />
                <span className="text-[9px] text-[var(--nx-cyan)]" style={{ fontFamily: "var(--font-mono)" }}>12 MATCHES</span>
              </div>
            </div>
            <div className="space-y-2">
              {SCOUT_MATCHES.map((m, i) => (
                <div key={m.id}
                  className={cn("flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all hover:border-[var(--nx-border2)]",
                    i === 0 ? "border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.03)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)]")}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${m.tc}15`, color: m.tc, border: `1px solid ${m.tc}30`, fontFamily: "var(--font-display)" }}>
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-[var(--nx-text1)] truncate">{m.name}</p>
                      <span className="text-[7px] px-1 py-0.5 rounded shrink-0 font-bold"
                        style={{ background: `${m.tc}15`, color: m.tc, fontFamily: "var(--font-mono)" }}>{m.tier}</span>
                      {m.isNew && <span className="text-[7px] px-1 py-0.5 rounded shrink-0 font-bold"
                        style={{ background: "var(--nx-orange-dim)", color: "var(--nx-orange)", fontFamily: "var(--font-mono)" }}>NEW</span>}
                    </div>
                    <p className="text-[10px] text-[var(--nx-text3)] truncate">{m.org}{m.viewed && " · Viewed you"}</p>
                  </div>
                  <p className="font-bold shrink-0" style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--nx-cyan)" }}>{m.score}%</p>
                </div>
              ))}
            </div>
            <Link href="/athlete/matches"
              className="mt-2 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
              View all 12 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center gap-2 mb-3">
              <p className="font-semibold text-sm text-[var(--nx-text1)] flex-1">Live Activity</p>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nx-green)] animate-pulse" />
              <span className="text-[8px] text-[var(--nx-green)]" style={{ fontFamily: "var(--font-mono)" }}>LIVE</span>
            </div>
            {ACTIVITY.map(a => (
              <Link key={a.id} href={a.link}
                className="flex items-start gap-2.5 py-2 px-1.5 -mx-1.5 rounded-lg border border-transparent hover:border-[var(--nx-border)] hover:bg-[var(--nx-bg4)] transition-all">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--nx-text1)] leading-tight">{a.title}</p>
                  <p className="text-[10px] text-[var(--nx-text3)] truncate">{a.body}</p>
                  <p className="text-[9px] text-[var(--nx-text3)] mt-0.5">{a.time}</p>
                </div>
              </Link>
            ))}
            <Link href="/athlete/alerts"
              className="mt-2 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
              All alerts <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Upcoming */}
          <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[var(--nx-text1)]">⏰ Upcoming</p>
              <Link href="/athlete/tournaments" className="text-[10px] text-[var(--nx-green)] hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {UPCOMING.map((u, i) => {
                const color = u.urgency === "high" ? "var(--nx-red)" : u.urgency === "medium" ? "var(--nx-amber)" : "var(--nx-text2)"
                return (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                    <div className="min-w-0 mr-2">
                      <p className="text-xs font-medium text-[var(--nx-text1)] truncate">{u.title}</p>
                      <p className="text-[10px] text-[var(--nx-text3)] flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />{u.city}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0"
                      style={{ background: `${color}15`, color }}>
                      {u.daysLeft <= 3 ? `${u.daysLeft}d!` : u.deadline}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
