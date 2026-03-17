import Link from "next/link"

const TRUSTED_BY = ["Mumbai City FC","Bengaluru FC","Patna Pirates","MI Academy","SAI National Centre","Hockey India","Khelo India","IPL Academies","Wrestling Federation"]

export default function FinalCtaSection() {
  return (
    <section className="py-24 px-6 md:px-20 relative overflow-hidden text-center" style={{ background: "linear-gradient(135deg, #031203, #0a1a0a, #031203)" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(80px,18vw,200px)", color: "rgba(0,245,116,0.025)", fontWeight: 400, letterSpacing: "-4px" }}>NEXUS</span>
      </div>
      <div className="relative max-w-3xl mx-auto">
        <p className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-green)" }}>JOIN THE GRID</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--nx-text1)", lineHeight: 1.05 }}>Your next scout match is being computed right now.</h2>
        <p className="text-lg mb-8" style={{ color: "var(--nx-text3)", lineHeight: 1.75 }}>3.2 million athletes across India have no digital presence in the professional sports world. Every minute without a NEXUS profile is a minute you're invisible.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link href="/auth/signup?role=athlete" className="px-8 py-4 rounded-full text-base font-bold transition-all hover:brightness-110" style={{ background: "var(--nx-green)", color: "black" }}>
            Create Your Free Profile →
          </Link>
          <Link href="/auth/login" className="px-8 py-4 rounded-full text-base font-medium transition-all hover:border-[var(--nx-border2)]" style={{ border: "1.5px solid var(--nx-border)", color: "var(--nx-text2)" }}>
            Sign In to Your Account
          </Link>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--nx-text3)" }}>Already trusted by scouts from:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TRUSTED_BY.map(org => (
            <span key={org} className="px-3 py-1.5 rounded-full text-xs" style={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border)", color: "var(--nx-text3)" }}>{org}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
