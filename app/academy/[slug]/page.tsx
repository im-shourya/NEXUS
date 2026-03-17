import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Phone, Mail, Globe } from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Nagpur FC Youth Academy — Football | ISL Feeder Academy | NEXUS`,
    description: `ISL Feeder football academy in Nagpur. 48 athletes. 23 scout inquiries this season. 12 athletes placed in professional trials. View squad and enquire.`,
    openGraph: { title: "Nagpur FC Youth Academy | NEXUS", description: "India's sports talent discovery platform" },
  }
}

const ACADEMY = {
  name: "Nagpur FC Youth Academy",
  slug: "nagpur-fc-youth",
  sport: "Football",
  city: "Nagpur",
  state: "Maharashtra",
  founded: 2012,
  description: "One of Maharashtra's leading football development academies, producing talent for ISL clubs and national programmes since 2012. Our holistic programme combines technical coaching, physical conditioning, video analysis, and academic support.",
  logo: "NF",
  totalAthletes: 48,
  coaches: 6,
  reputationScore: 82,
  cityRank: 1,
  scoutInquiriesThisSeason: 23,
  trialsPlaced: 12,
  affiliations: [
    { type: "ISL Feeder", club: "Mumbai City FC", color: "var(--nx-purple)" },
    { type: "Khelo India", color: "var(--nx-gold)" },
  ],
  facilities: ["Natural Grass Pitch", "Floodlights", "Gymnasium", "Video Analysis Room", "Physiotherapy Room", "Hostel (60 boys)"],
  ageGroups: [
    { group: "U-12", athletes: 8, sessions: 4, fee: "₹3,000/mo" },
    { group: "U-14", athletes: 12, sessions: 5, fee: "₹4,500/mo" },
    { group: "U-17", athletes: 16, sessions: 6, fee: "₹6,000/mo" },
    { group: "U-19", athletes: 8, sessions: 6, fee: "₹6,000/mo" },
    { group: "Senior", athletes: 4, sessions: 5, fee: "₹5,000/mo" },
  ],
  coaches_list: [
    { name: "Rajesh Kumar", role: "Head Coach", qualification: "AFC B Licence" },
    { name: "Amit Shah", role: "Assistant Coach", qualification: "AFC C Licence" },
    { name: "Priya Nair", role: "Physical Trainer", qualification: "NSCI Certified" },
    { name: "Dr. Rahul Gupta", role: "Physiotherapist", qualification: "BPT, SPORTS" },
  ],
  topAthletes: [
    { name: "Arjun Sharma", position: "Striker", age: 17, score: 74, initials: "AS" },
    { name: "Vikram Singh", position: "Midfielder", age: 18, score: 71, initials: "VS" },
    { name: "Priya Desai", position: "Winger", age: 16, score: 68, initials: "PD" },
    { name: "Karan Mehta", position: "Centre-Back", age: 19, score: 67, initials: "KM" },
    { name: "Ravi Kumar", position: "Goalkeeper", age: 17, score: 65, initials: "RK" },
    { name: "Sneha Patel", position: "Striker", age: 16, score: 63, initials: "SP" },
  ],
  tournaments: [
    { name: "Nagpur U-17 District Cup", dates: "Feb 3–7", status: "OPEN", sport: "Football" },
    { name: "Maharashtra State U-19 League", dates: "Mar 15–20", status: "UPCOMING", sport: "Football" },
  ],
  phone: "+91 98765 43210",
  email: "nagpurfcyouth@nexus.in",
  website: "www.nagpurfcyouth.in",
  tacticalPhilosophy: ["Possession-Based", "Pressing", "Technical Development"],
}

export default function AcademyPublicProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--nx-bg)" }}>
      {/* Minimal Nav */}
      <nav className="sticky top-0 z-30 h-14 px-6 flex items-center justify-between" style={{ background: "rgba(6,13,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--nx-border)" }}>
        <Link href="/" className="font-bold text-lg text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "2px" }}>NEXUS</Link>
        <div className="flex gap-2">
          <Link href="/auth/login" className="px-4 py-1.5 rounded-xl text-sm text-[var(--nx-text2)] border border-[var(--nx-border)] hover:text-[var(--nx-text1)] transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="px-4 py-1.5 rounded-xl text-sm font-semibold text-black" style={{ background: "var(--nx-green)" }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="h-52 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #031A08, #0D2B18, #040E07)" }}>
        <div className="absolute inset-0 opacity-3" style={{ backgroundImage: "radial-gradient(circle, rgba(0,245,116,0.04) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 600px 300px at 20% 100%, rgba(0,245,116,0.12), transparent)" }} />
        <div className="absolute bottom-5 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold" style={{ background: "rgba(255,184,0,0.1)", border: "2px solid rgba(255,184,0,0.4)", color: "var(--nx-gold)", fontFamily: "var(--font-display)" }}>
            {ACADEMY.logo}
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.5px" }}>{ACADEMY.name}</h1>
              {ACADEMY.affiliations.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30`, fontFamily: "var(--font-mono)" }}>{a.type}</span>
              ))}
            </div>
            <p className="text-sm mt-1 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span>⚽ {ACADEMY.sport}</span>
              <span>·</span>
              <MapPin className="w-3.5 h-3.5" />{ACADEMY.city}, {ACADEMY.state}
              <span>·</span>Est. {ACADEMY.founded}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Band */}
      <div className="grid grid-cols-4 border-b" style={{ background: "var(--nx-bg2)", borderColor: "var(--nx-border)" }}>
        {[
          { val: ACADEMY.totalAthletes, label: "Athletes Enrolled" },
          { val: `#${ACADEMY.cityRank}`, label: `in ${ACADEMY.city}` },
          { val: ACADEMY.scoutInquiriesThisSeason, label: "Scout Inquiries" },
          { val: ACADEMY.trialsPlaced, label: "Trials Placed" },
        ].map((s, i) => (
          <div key={i} className="py-4 text-center" style={{ borderRight: i < 3 ? "1px solid var(--nx-border)" : "none" }}>
            <p className="text-3xl font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
            <p className="text-[10px] text-[var(--nx-text3)] mt-0.5" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* LEFT — Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-bold text-[var(--nx-text1)] mb-3">About the Academy</h2>
            <p className="text-sm text-[var(--nx-text2)] leading-relaxed">{ACADEMY.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {ACADEMY.tacticalPhilosophy.map(p => (
                <span key={p} className="px-2.5 py-1 rounded-xl text-xs text-[var(--nx-green)] bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]">{p}</span>
              ))}
            </div>
          </div>

          {/* Top Athletes */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-bold text-[var(--nx-text1)] mb-4">Top Athletes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACADEMY.topAthletes.map((a, i) => (
                <Link key={i} href={`/athlete/${a.name.toLowerCase().replace(/\s+/g, "-")}`} className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)" }}>{a.initials}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[var(--nx-text1)] truncate">{a.name}</p>
                      <p className="text-[10px] text-[var(--nx-text3)]">{a.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--nx-text3)]">Age {a.age}</span>
                    <span className="text-sm font-bold text-[var(--nx-cyan)]" style={{ fontFamily: "var(--font-display)" }}>{a.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Age Group Programme */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-bold text-[var(--nx-text1)] mb-4">Training Programmes</h2>
            <div className="space-y-2">
              {ACADEMY.ageGroups.map((ag, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "rgba(255,184,0,0.1)", color: "var(--nx-gold)" }}>{ag.group}</span>
                    <span className="text-sm text-[var(--nx-text2)]">{ag.athletes} athletes · {ag.sessions} sessions/week</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--nx-text1)]">{ag.fee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching Staff */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-bold text-[var(--nx-text1)] mb-4">Coaching Staff</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {ACADEMY.coaches_list.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "rgba(0,212,255,0.1)", color: "var(--nx-cyan)" }}>{c.name.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-sm text-[var(--nx-text1)]">{c.name}</p>
                    <p className="text-xs text-[var(--nx-text3)]">{c.role} · {c.qualification}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="space-y-5">
          {/* Reputation Score */}
          <div className="p-5 rounded-2xl border text-center" style={{ background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.3)" }}>
            <p className="text-xs text-[var(--nx-text3)] mb-1" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Academy Reputation Score</p>
            <p className="text-6xl font-bold text-[var(--nx-gold)]" style={{ fontFamily: "var(--font-display)" }}>{ACADEMY.reputationScore}</p>
            <p className="text-sm text-[var(--nx-gold)] font-semibold mt-1">#{ACADEMY.cityRank} Football Academy in {ACADEMY.city}</p>
            <div className="w-full h-2 rounded-full bg-[var(--nx-bg4)] mt-3 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${ACADEMY.reputationScore}%`, background: "var(--nx-gold)" }} />
            </div>
          </div>

          {/* Facilities */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-bold text-[var(--nx-text1)] mb-3">Facilities</h3>
            <div className="space-y-1.5">
              {ACADEMY.facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[var(--nx-text2)]">
                  <span className="text-[var(--nx-green)] text-xs">✓</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-bold text-[var(--nx-text1)] mb-3">Enquire About Admission</h3>
            <div className="space-y-3">
              {[["Your Name", "text", "Full name"], ["Age", "number", "Current age"], ["Sport", "text", "Primary sport"]].map(([l, t, p]) => (
                <div key={l as string} className="space-y-1">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</label>
                  <input type={t as string} placeholder={p as string} className="w-full rounded-xl text-sm" />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Message</label>
                <textarea placeholder="Tell us about your background..." rows={3} className="w-full rounded-xl text-sm" />
              </div>
              <button className="w-full py-2.5 rounded-xl font-bold text-sm text-black" style={{ background: "var(--nx-gold)", fontFamily: "var(--font-display)", letterSpacing: "1px", fontSize: "16px" }}>
                SEND ENQUIRY →
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h3 className="font-bold text-[var(--nx-text1)] mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-[var(--nx-text2)]">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[var(--nx-text3)]" />{ACADEMY.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[var(--nx-text3)]" />{ACADEMY.email}</div>
              <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-[var(--nx-text3)]" />{ACADEMY.website}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[var(--nx-text3)]" />{ACADEMY.city}, {ACADEMY.state}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
