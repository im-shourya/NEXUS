"use client"
import Link from "next/link"

const ATHLETE_FEATURES = [
  { icon: "🟢", text: "Build a video-first sports profile in 5 minutes. Free forever." },
  { icon: "🔵", text: "AI matches your profile to ISL, I-League, IPL and Khelo India scouts — automatically." },
  { icon: "🟢", text: "Get a 30-second AI highlight reel from your match footage — no editing skills needed." },
  { icon: "🔵", text: "Injury risk analysis from your training videos — know your body before it breaks down." },
  { icon: "🟢", text: "Register for tournaments near you — scouts get notified when you perform." },
  { icon: "🟡", text: "See how you rank among athletes your age and sport across India — in real time." },
]
const SCOUT_FEATURES = [
  "Search athletes by sport, position, age, city, and AI score — results in 3 seconds.",
  "Our AI engine pre-matches athletes to your criteria every night — wake up to a shortlist.",
  "Watch 30-second AI highlight reels before deciding who to contact. No wasted trial days.",
  "Send verified trial invitations directly through NEXUS. No WhatsApp chains.",
  "Live match alerts when your shortlisted athletes perform in tournaments.",
  "Analytics dashboard shows your pipeline from discovery to signing.",
]
const ACADEMY_FEATURES = [
  "Get a live Academy Reputation Score — #1 in your city based on squad AI performance.",
  "Every athlete you develop gets an AI highlight reel and scout match engine working 24/7.",
  "Tournament management tools — create events, live scoring, automatic scout alerts.",
  "Bulk AI highlight reel generation — process your entire squad in one click with your branding.",
  "The ISL Pipeline Tracker shows how many athletes received ISL trial invitations.",
  "Compare your academy's performance against every other academy in your city and sport.",
]

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid var(--nx-border)" }}>
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs">{icon}</div>
      <p className="text-sm" style={{ color: "var(--nx-text2)", lineHeight: 1.7 }}>{text}</p>
    </div>
  )
}

export default function RoleValueSections() {
  return (
    <div>
      {/* Athlete */}
      <section id="athletes" className="py-20 px-6 md:px-20" style={{ background: "var(--nx-bg)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold mb-3" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-green)", textTransform: "uppercase", letterSpacing: "2px" }}>FOR ATHLETES</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--nx-text1)" }}>Your talent deserves to be seen — not just in your city.</h2>
            <p className="text-base mb-6" style={{ color: "var(--nx-text2)", lineHeight: 1.75 }}>90% of India's sports talent lives outside the top 8 cities. Scouts from ISL clubs, IPL academies, and national programmes are on NEXUS looking for athletes exactly like you.</p>
            <div className="mb-6">
              {ATHLETE_FEATURES.map((f, i) => <FeatureRow key={i} icon={f.icon} text={f.text} />)}
            </div>
            <Link href="/auth/signup?role=athlete" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110" style={{ background: "var(--nx-green)", color: "black" }}>
              Create Your Free Profile →
            </Link>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "2px solid var(--nx-green-border)", fontFamily: "var(--font-display)", fontSize: "20px" }}>AS</div>
              <div>
                <p className="font-bold" style={{ color: "var(--nx-text1)" }}>Arjun Sharma</p>
                <p className="text-xs" style={{ color: "var(--nx-text3)" }}>Striker · Age 17 · Nagpur, Maharashtra</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase" }}>NexusScore™</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--nx-bg5)" }}>
                  <div className="h-full rounded-full" style={{ width: "74%", background: "var(--nx-green)" }} />
                </div>
                <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-green)", fontSize: "20px" }}>74/100</span>
              </div>
            </div>
            <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--nx-cyan)" }}>🤖 New Scout Match</p>
              <p className="text-sm font-bold" style={{ color: "var(--nx-text1)" }}>Rahul Verma · Mumbai City FC</p>
              <p className="text-xs" style={{ color: "var(--nx-cyan)" }}>85% match · ISL U-19 · 3 reasons matched</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--nx-purple)" }}>K. Balaji · Bengaluru FC</p>
              <p className="text-xs" style={{ color: "var(--nx-text3)" }}>72% match · ISL U-21</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scout */}
      <section id="scouts" className="py-20 px-6 md:px-20" style={{ background: "var(--nx-bg2)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="p-6 rounded-2xl order-2 md:order-1" style={{ background: "var(--nx-bg3)", border: "1px solid rgba(155,93,255,0.2)" }}>
            <p className="text-xs font-semibold mb-3" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-purple)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Discover Athletes</p>
            <div className="space-y-2 mb-4">
              {["Football","Striker","Age 16–20","Maharashtra","Score ≥70"].map(chip => (
                <span key={chip} className="inline-block mr-2 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(155,93,255,0.1)", color: "var(--nx-purple)", border: "1px solid rgba(155,93,255,0.25)" }}>✓ {chip}</span>
              ))}
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--nx-text3)" }}>247 athletes match — showing top results</p>
            <div className="space-y-2">
              {[["AS","Arjun Sharma","Striker · Nagpur","85%"],["SP","Sneha Patel","CF · Nagpur","82%"],["VS","Vikram Singh","CAM · Pune","78%"]].map(([i,n,p,m]) => (
                <div key={n} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--nx-green-dim)", color: "var(--nx-green)", border: "1px solid var(--nx-green-border)", fontFamily: "var(--font-display)" }}>{i}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--nx-text1)" }}>{n}</p>
                    <p className="text-[10px]" style={{ color: "var(--nx-text3)" }}>{p}</p>
                  </div>
                  <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-cyan)", fontSize: "18px" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold mb-3" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-purple)", textTransform: "uppercase", letterSpacing: "2px" }}>FOR SCOUTS</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--nx-text1)" }}>Stop travelling 3 cities to find one player. India's talent is here.</h2>
            <p className="text-base mb-6" style={{ color: "var(--nx-text2)", lineHeight: 1.75 }}>Verified athletes across every Indian state, with AI performance scores, match footage, injury history, and direct contact — all searchable in 30 seconds.</p>
            <div className="space-y-3 mb-6">
              {SCOUT_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(155,93,255,0.2)", color: "var(--nx-purple)" }}>✓</div>
                  <p className="text-sm" style={{ color: "var(--nx-text2)" }}>{f}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=scout" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110" style={{ background: "var(--nx-purple)", color: "white" }}>
              Start Discovering Talent →
            </Link>
          </div>
        </div>
      </section>

      {/* Academy */}
      <section id="academies" className="py-20 px-6 md:px-20" style={{ background: "var(--nx-bg)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold mb-3" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-gold)", textTransform: "uppercase", letterSpacing: "2px" }}>FOR ACADEMIES &amp; CLUBS</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--nx-text1)" }}>The #1 Football Academy in Nagpur. Prove it with data.</h2>
            <p className="text-base mb-6" style={{ color: "var(--nx-text2)", lineHeight: 1.75 }}>NEXUS gives your academy an AI-backed reputation score, a public profile visible to ISL scouts, and tools to prove your athletes' quality — not just word of mouth.</p>
            <div className="space-y-3 mb-6">
              {ACADEMY_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs" style={{ background: "rgba(255,184,0,0.15)", color: "var(--nx-gold)" }}>✓</div>
                  <p className="text-sm" style={{ color: "var(--nx-text2)" }}>{f}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(255,184,0,0.05)", border: "1px solid rgba(255,184,0,0.2)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--nx-gold)" }}>Academies on NEXUS receive 4× more scout inquiries within 90 days of joining.</p>
            </div>
            <Link href="/auth/signup?role=academy" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:brightness-110" style={{ background: "var(--nx-gold)", color: "black" }}>
              Set Up Your Academy →
            </Link>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: "var(--nx-bg3)", border: "1px solid rgba(255,184,0,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Academy Reputation Score</p>
                <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-gold)" }}>82 <span className="text-2xl text-[var(--nx-text3)]">/100</span></p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--nx-gold)" }}>🥇 #1 Football Academy in Nagpur</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {[["Athlete Quality",80,"var(--nx-green)"],["Scout Engagement",88,"var(--nx-cyan)"],["Trial Conversion",72,"var(--nx-gold)"]].map(([l,v,c]) => (
                <div key={l as string} className="flex items-center gap-3">
                  <span className="text-xs w-32 shrink-0" style={{ color: "var(--nx-text2)" }}>{l}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nx-bg5)" }}>
                    <div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }} />
                  </div>
                  <span className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: c as string }}>{v}%</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl" style={{ background: "rgba(155,93,255,0.06)", border: "1px solid rgba(155,93,255,0.2)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--nx-purple)" }}>🔍 Rahul Verma (Mumbai City FC) enquired about 3 athletes from your squad this week</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
