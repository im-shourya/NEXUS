import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Eye, Video, Play, Shield, MessageSquare, Trophy, TrendingUp, Star, Calendar, ExternalLink } from "lucide-react"

// In production this fetches from Supabase via service role
function getAthleteByUsername(username: string) {
  return {
    id: "ath_001",
    fullName: "Arjun Sharma",
    username,
    sport: "Football",
    position: "Striker (LWF)",
    city: "Nagpur",
    state: "Maharashtra",
    age: 17,
    dob: "2008-03-12",
    height: "5'10\"",
    weight: "68kg",
    preferredFoot: "Right",
    currentAcademy: "Nagpur FC Youth Academy",
    bio: "Representing Maharashtra in U-17 football since 2022. Looking to break into ISL academies and represent India at the junior level. Playing style: pressing, technical dribbling, goal-scoring.",
    lookingFor: ["Trial Opportunities", "Scout Connections", "Tournaments"],
    profileStrength: 82,
    initials: "AS",
    stats: { profileViews: 847, scoutMatches: 12, videoViews: 2400, topMatchPct: 85 },
    nexusScore: 74,
    sportMetrics: {
      speed: 82, dribbling: 76, ballControl: 78, shooting: 71,
      passing: 68, defensive: 58, gameIntelligence: 65,
    },
    injuryRisk: "LOW",
    peerRank: "Top 18%",
    careerGoal: "To play for an ISL club by age 20 and represent India at the U-23 level.",
    videos: [
      { id: "v1", title: "ISL Trial Highlights — Jan 2026", duration: "2:34", views: 1204, scoutViews: 22, isAiReel: true, isHero: true },
      { id: "v2", title: "Free-kick Compilation", duration: "1:48", views: 847, scoutViews: 11 },
      { id: "v3", title: "Match vs City FC Academy", duration: "4:12", views: 423, scoutViews: 5 },
      { id: "v4", title: "Sprint & Dribbling Drills", duration: "3:20", views: 312, scoutViews: 3 },
    ],
    careerHistory: [
      { club: "Nagpur FC Youth Academy", years: "2022–Present", league: "Maharashtra U-17 League", goals: 23, assists: 14 },
      { club: "Nagpur District FA", years: "2020–2022", league: "District Youth League", goals: 31, assists: 19 },
    ],
    achievements: [
      { title: "Maharashtra U-17 Top Scorer", year: 2025, type: "🏆" },
      { title: "Khelo India Selection Camp", year: 2024, type: "⭐" },
      { title: "Best Player — Nagpur District Cup", year: 2024, type: "🥇" },
      { title: "50+ Career Goals", year: 2024, type: "🎯" },
    ],
    instagram: "arjunsharma_football",
    youtube: "@arjunsharmanagpur",
    isPublic: true,
    plan: "PRO",
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const a = getAthleteByUsername(params.username)
  return {
    title: `${a.fullName} — ${a.sport} ${a.position} from ${a.city} | NEXUS`,
    description: `${a.age}-year-old ${a.position} from ${a.city}, ${a.state}. NexusScore™ ${a.nexusScore}/100. AI Scout Match ${a.stats.topMatchPct}%. View performance data and highlight videos on NEXUS — India's sports talent discovery platform.`,
    keywords: [a.fullName, a.sport, a.position, a.city, a.state, "NEXUS", "ISL talent", "India sports"],
    openGraph: {
      title: `${a.fullName} — ${a.sport} Talent from ${a.city}`,
      description: `${a.position} · Age ${a.age} · NexusScore™ ${a.nexusScore}/100`,
      type: "profile",
    },
    other: {
      "profile:first_name": a.fullName.split(" ")[0],
      "profile:last_name": a.fullName.split(" ").slice(1).join(" "),
    },
  }
}

const METRIC_LABELS: Record<string, string> = {
  speed: "Sprint Speed", dribbling: "Dribbling", ballControl: "Ball Control",
  shooting: "Shooting", passing: "Passing", defensive: "Defensive", gameIntelligence: "Game IQ",
}

function scoreColor(s: number) {
  if (s >= 80) return "var(--nx-cyan)"
  if (s >= 65) return "var(--nx-gold)"
  if (s >= 50) return "var(--nx-green)"
  if (s >= 35) return "var(--nx-amber)"
  return "var(--nx-red)"
}

export default function PublicAthletePage({ params }: { params: { username: string } }) {
  const athlete = getAthleteByUsername(params.username)
  if (!athlete.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nx-bg)" }}>
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--nx-text1)] mb-2">Private Profile</p>
          <p className="text-sm text-[var(--nx-text3)]">This athlete has set their profile to private.</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-xl text-sm bg-[var(--nx-green)] text-black font-semibold">Back to NEXUS</Link>
        </div>
      </div>
    )
  }

  const heroVideo = athlete.videos.find(v => v.isHero) || athlete.videos[0]

  return (
    <div className="min-h-screen" style={{ background: "var(--nx-bg)" }}>
      {/* Minimal Nav */}
      <nav className="sticky top-0 z-30 h-14 px-6 flex items-center justify-between" style={{ background: "rgba(6,13,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--nx-border)" }}>
        <Link href="/" className="font-bold text-xl text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "2px" }}>NEXUS</Link>
        <div className="flex gap-2">
          <Link href="/auth/login" className="px-4 py-1.5 rounded-xl text-sm text-[var(--nx-text2)] border border-[var(--nx-border)] hover:text-[var(--nx-text1)] transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="px-4 py-1.5 rounded-xl text-sm font-semibold text-black transition-all hover:brightness-110" style={{ background: "var(--nx-green)" }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Cover */}
      <div className="h-56 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #031A08, #0D2B18, #040E07)" }}>
        <div className="absolute inset-0 opacity-3" style={{ backgroundImage: "radial-gradient(circle, rgba(0,245,116,0.04) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 700px 350px at 25% 100%, rgba(0,245,116,0.14), transparent)" }} />

        {/* Avatar + identity */}
        <div className="absolute bottom-5 left-6 flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
            style={{ background: "linear-gradient(135deg, rgba(0,245,116,0.25), rgba(0,245,116,0.1))", border: "3px solid var(--nx-green)", boxShadow: "var(--nx-green-shadow)", fontFamily: "var(--font-display)", color: "var(--nx-green)" }}>
            {athlete.initials}
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.5px" }}>{athlete.fullName.toUpperCase()}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(0,245,116,0.15)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-mono)" }}>
                ⚽ {athlete.sport.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-sm flex items-center gap-3 flex-wrap" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span>{athlete.position}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{athlete.city}, {athlete.state}</span>
              <span>·</span>
              <span>Age {athlete.age}</span>
            </p>
          </div>
        </div>

        {/* CTA (top-right) */}
        <div className="absolute top-4 right-6 flex gap-2">
          <Link href={`/auth/signup?sport=football&source=athlete-profile`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
            style={{ background: "var(--nx-green)" }}>
            <Shield className="w-4 h-4" />Connect on NEXUS
          </Link>
        </div>
      </div>

      {/* Stats Band */}
      <div className="grid grid-cols-4 border-b" style={{ background: "var(--nx-bg2)", borderColor: "var(--nx-border)" }}>
        {[
          { val: athlete.stats.profileViews.toLocaleString(), label: "Profile Views" },
          { val: `${athlete.stats.topMatchPct}%`, label: "Top Scout Match", color: "var(--nx-cyan)" },
          { val: athlete.nexusScore, label: "NexusScore™", color: scoreColor(athlete.nexusScore) },
          { val: athlete.videos.length, label: "Highlight Videos" },
        ].map((s, i) => (
          <div key={i} className="py-4 text-center" style={{ borderRight: i < 3 ? "1px solid var(--nx-border)" : "none" }}>
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color || "var(--nx-green)" }}>{s.val}</p>
            <p className="text-[10px] text-[var(--nx-text3)] mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* ── LEFT / MAIN ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero video */}
          {heroVideo && (
            <div className="rounded-2xl overflow-hidden border border-[var(--nx-border)] relative group cursor-pointer"
              style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #031A08, #0D2B18)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "rgba(0,245,116,0.15)", border: "2px solid var(--nx-green)" }}>
                  <Play className="w-8 h-8 text-[var(--nx-green)]" fill="currentColor" style={{ marginLeft: "3px" }} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(6,13,8,0.95), transparent)" }}>
                <div className="flex items-center gap-2 mb-1">
                  {heroVideo.isAiReel && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.15)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>🤖 AI REEL</span>
                  )}
                </div>
                <p className="font-bold text-[var(--nx-text1)]">{heroVideo.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--nx-text3)]">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{heroVideo.views.toLocaleString()} views</span>
                  <span className="flex items-center gap-1 text-[var(--nx-gold)]"><Shield className="w-3 h-3" />{heroVideo.scoutViews} scout plays</span>
                </div>
              </div>
            </div>
          )}

          {/* Video grid */}
          <div>
            <h2 className="font-bold text-[var(--nx-text1)] mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-[var(--nx-green)]" />Highlight Videos
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {athlete.videos.filter(v => !v.isHero).map(v => (
                <div key={v.id} className="rounded-xl overflow-hidden border border-[var(--nx-border)] cursor-pointer hover:border-[var(--nx-green-border)] transition-all group"
                  style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #031A08, #0D2B18)" }}>
                  <div className="relative h-full flex flex-col justify-end p-2">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,245,116,0.15)", border: "1.5px solid var(--nx-green)" }}>
                        <Play className="w-4 h-4 text-[var(--nx-green)]" fill="currentColor" style={{ marginLeft: "1px" }} />
                      </div>
                    </div>
                    <p className="text-[10px] font-medium text-[var(--nx-text1)] truncate relative z-10">{v.title}</p>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[9px] text-[var(--nx-text3)]">{v.duration}</span>
                      <span className="text-[9px] text-[var(--nx-green)] flex items-center gap-0.5"><Eye className="w-2 h-2" />{v.views >= 1000 ? `${(v.views/1000).toFixed(1)}K` : v.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          {athlete.plan === "PRO" && (
            <div>
              <h2 className="font-bold text-[var(--nx-text1)] mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--nx-cyan)]" />Performance Intelligence
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,255,0.1)", color: "var(--nx-cyan)", fontFamily: "var(--font-mono)" }}>🤖 AI</span>
              </h2>
              <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] space-y-3">
                {Object.entries(athlete.sportMetrics).map(([key, val], i) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--nx-text2)] w-36 shrink-0">{METRIC_LABELS[key] || key}</span>
                    <div className="flex-1 h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: scoreColor(val), transition: `width 1s ease-out ${i * 80}ms` }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right tabular-nums" style={{ color: scoreColor(val), fontFamily: "var(--font-display)", fontSize: "16px" }}>{val}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--nx-border)]">
                  <span className="text-xs text-[var(--nx-text3)]">Injury Risk</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>✅ LOW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--nx-text3)]">Peer Rank</span>
                  <span className="text-xs font-bold text-[var(--nx-gold)]">{athlete.peerRank} of Strikers · India · Age 16–17</span>
                </div>
              </div>
            </div>
          )}

          {/* Career History */}
          <div>
            <h2 className="font-bold text-[var(--nx-text1)] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--nx-gold)]" />Career History
            </h2>
            <div className="space-y-3">
              {athlete.careerHistory.map((c, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: "rgba(0,245,116,0.08)", border: "1px solid var(--nx-green-border)" }}>⚽</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[var(--nx-text1)]">{c.club}</p>
                    <p className="text-xs text-[var(--nx-text3)] mt-0.5">{c.years} · {c.league}</p>
                  </div>
                  <div className="text-right text-xs text-[var(--nx-text3)]">
                    <p><span className="text-[var(--nx-green)] font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>{c.goals}</span> goals</p>
                    <p><span className="text-[var(--nx-cyan)] font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>{c.assists}</span> assists</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="font-bold text-[var(--nx-text1)] mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--nx-gold)]" />Achievements
            </h2>
            <div className="flex flex-wrap gap-2">
              {athlete.achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                  <span>{a.type}</span>
                  <div>
                    <p className="text-xs font-medium text-[var(--nx-text1)]">{a.title}</p>
                    <p className="text-[10px] text-[var(--nx-text3)]">{a.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-5">
          {/* Quick Profile */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-bold text-[var(--nx-text1)] mb-3">Profile</h3>
            <div className="space-y-2">
              {[
                ["Position", athlete.position],
                ["Age", `${athlete.age} years`],
                ["Height", athlete.height],
                ["Weight", athlete.weight],
                ["Preferred Foot", athlete.preferredFoot],
                ["Academy", athlete.currentAcademy],
                ["City", `${athlete.city}, ${athlete.state}`],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between py-1.5 border-b border-[var(--nx-border)] last:border-0 text-sm">
                  <span className="text-[var(--nx-text3)]">{l}</span>
                  <span className="font-medium text-[var(--nx-text1)]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-bold text-[var(--nx-text1)] mb-3">Looking For</h3>
            <div className="flex flex-wrap gap-2">
              {athlete.lookingFor.map(l => (
                <span key={l} className="px-2.5 py-1 rounded-xl text-xs font-medium" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>{l}</span>
              ))}
            </div>
            {athlete.bio && (
              <p className="text-sm text-[var(--nx-text2)] mt-3 leading-relaxed italic">"{athlete.bio}"</p>
            )}
          </div>

          {/* Scout Assessment Panel — private, scout-facing only */}
          <div className="p-5 rounded-2xl border" style={{ background: "rgba(155,93,255,0.05)", borderColor: "rgba(155,93,255,0.25)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--nx-purple)" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--nx-purple)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>My Scout Assessment</h3>
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", fontFamily: "var(--font-mono)" }}>PRIVATE · NOT VISIBLE TO ATHLETE</span>
            </div>
            
            {/* Star Ratings */}
            <div className="space-y-2 mb-4">
              {["Potential", "Coachability", "Physical Profile", "Technical Ability"].map((criterion, ci) => {
                const defaultRating = [4, 3, 5, 4][ci]
                return (
                  <div key={criterion} className="flex items-center gap-3">
                    <span className="text-xs w-28 shrink-0" style={{ color: "var(--nx-text2)" }}>{criterion}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className="text-sm cursor-pointer" style={{ color: star <= defaultRating ? "var(--nx-gold)" : "var(--nx-border2)" }}>★</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Development Timeline */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold mb-2" style={{ color: "var(--nx-text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Development Timeline</p>
              <div className="flex gap-2 flex-wrap">
                {["Ready Now", "6 Months", "1 Year", "2+ Years", "Not Suitable"].map(t => (
                  <button key={t} className="px-2.5 py-1 rounded-full text-xs transition-all"
                    style={{ background: t === "6 Months" ? "rgba(155,93,255,0.15)" : "var(--nx-bg4)", border: `1px solid ${t === "6 Months" ? "rgba(155,93,255,0.4)" : "var(--nx-border)"}`, color: t === "6 Months" ? "var(--nx-purple)" : "var(--nx-text3)" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Scouting Summary */}
            <div className="p-3 rounded-xl mb-4" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: "var(--nx-cyan)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>🤖 AI Scouting Summary</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--nx-text2)" }}>
                {athlete.fullName} is a {athlete.age}-year-old {athlete.position} from {athlete.city}. Primary strengths: sprint speed (82/100, top 15% nationally) and ball control (78/100). Current injury risk LOW. AI score improved by 11 points over the last 90 days — strong positive trajectory. At current improvement rate, projected to reach ISL U-21 trial-ready standard within 4–6 months.
              </p>
            </div>
            
            {/* Watchlist Intelligence */}
            <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--nx-cyan)" }}>🔍 High Scout Interest: 3 ISL-level scouts viewed this athlete in the last 14 days — competitive interest detected. Recommend initiating contact before trial window closes.</p>
            </div>
            
            {/* Private Notes */}
            <div>
              <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--nx-text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Private Notes</p>
              <textarea rows={2} placeholder="Add private scouting notes..." className="w-full text-xs rounded-xl resize-none"
                style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)", color: "var(--nx-text2)", padding: "8px 12px" }} />
              <button className="mt-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--nx-purple)", color: "white" }}>Save Assessment</button>
            </div>
          </div>

          {/* CTA for scouts */}
          <div className="p-5 rounded-2xl border" style={{ background: "rgba(155,93,255,0.04)", borderColor: "rgba(155,93,255,0.25)" }}>
            <h3 className="font-bold text-[var(--nx-text1)] mb-2">Scout or Academy?</h3>
            <p className="text-xs text-[var(--nx-text3)] mb-3">Sign in to message {athlete.fullName.split(" ")[0]}, send a trial invitation, and see full AI performance data.</p>
            <Link href={`/auth/signup?role=scout&source=profile&athlete=${athlete.username}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: "var(--nx-purple)" }}>
              <MessageSquare className="w-4 h-4" />Connect on NEXUS
            </Link>
            <p className="text-center text-[10px] text-[var(--nx-text3)] mt-2">Free for scouts · Verified badge available</p>
          </div>

          {/* Social */}
          {(athlete.instagram || athlete.youtube) && (
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h3 className="font-bold text-[var(--nx-text1)] mb-3">Social</h3>
              <div className="space-y-2">
                {athlete.instagram && (
                  <a href={`https://instagram.com/${athlete.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
                    <span>📸</span>@{athlete.instagram}<ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                {athlete.youtube && (
                  <a href={`https://youtube.com/${athlete.youtube}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--nx-text2)] hover:text-[var(--nx-text1)] transition-colors">
                    <span>▶️</span>{athlete.youtube}<ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12 py-6 text-center" style={{ borderColor: "var(--nx-border)" }}>
        <Link href="/" className="font-bold text-lg text-[var(--nx-green)] mr-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "2px" }}>NEXUS</Link>
        <span className="text-xs text-[var(--nx-text3)]">India's Sports Talent Discovery Platform · nexus.in</span>
      </div>
    </div>
  )
}
