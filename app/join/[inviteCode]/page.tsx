"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, ArrowRight } from "lucide-react"

export default function JoinInvitePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.inviteCode as string
  const [loading, setLoading] = useState(true)
  const [invite, setInvite] = useState<{ academyName: string; sport: string; city: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate invite code lookup
    setTimeout(() => {
      if (code && code.length > 4) {
        setInvite({ academyName: "Nagpur FC Youth Academy", sport: "Football", city: "Nagpur" })
      } else {
        setError("This invitation link is invalid or has expired.")
      }
      setLoading(false)
    }, 800)
  }, [code])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--nx-bg)" }}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[var(--nx-green)] animate-spin mx-auto mb-3" />
        <p className="text-[var(--nx-text2)] text-sm">Verifying your invitation...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--nx-bg)" }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl" style={{ background: "rgba(255,59,48,0.1)", border: "2px solid rgba(255,59,48,0.3)" }}>⚠️</div>
        <h1 className="text-xl font-bold text-[var(--nx-text1)] mb-2">Invitation Invalid</h1>
        <p className="text-[var(--nx-text2)] text-sm mb-6">{error}</p>
        <Link href="/" className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-black" style={{ background: "var(--nx-green)" }}>
          Go to NEXUS Home
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--nx-bg)" }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-lg font-bold text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "2px" }}>NEXUS</p>
          <p className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Sports Intelligence Platform</p>
        </div>

        {/* Invite Card */}
        <div className="p-6 rounded-2xl text-center mb-5" style={{ background: "rgba(0,245,116,0.04)", border: "2px solid var(--nx-green-border)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ background: "rgba(0,245,116,0.08)", border: "2px solid var(--nx-green-border)", color: "var(--nx-green)", fontFamily: "var(--font-display)" }}>NF</div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)] mb-1" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>YOU'VE BEEN INVITED!</h1>
          <p className="text-[var(--nx-text2)] text-sm mb-4">
            <strong className="text-[var(--nx-green)]">{invite?.academyName}</strong> has invited you to join NEXUS and link your athlete profile to their academy.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-xl text-xs text-[var(--nx-green)] bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]">⚽ {invite?.sport}</span>
            <span className="px-3 py-1 rounded-xl text-xs text-[var(--nx-text2)] bg-[var(--nx-bg4)] border border-[var(--nx-border)]">📍 {invite?.city}</span>
          </div>
        </div>

        {/* What Happens */}
        <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] mb-5">
          <p className="text-xs font-semibold text-[var(--nx-text3)] mb-3" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>What happens next</p>
          <div className="space-y-2.5">
            {[
              ["Create your free NEXUS athlete profile", "Takes about 5 minutes"],
              ["Your profile links to " + invite?.academyName, "Academy admin will be notified"],
              ["Scouts from ISL and national programmes discover you", "AI matching runs automatically"],
              ["Receive trial invitations directly on NEXUS", "No WhatsApp, no intermediaries"],
            ].map(([title, sub], i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-black" style={{ background: "var(--nx-green)" }}>{i + 1}</div>
                <div>
                  <p className="text-sm font-medium text-[var(--nx-text1)]">{title}</p>
                  <p className="text-xs text-[var(--nx-text3)]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link href={`/onboarding?role=athlete&inviteCode=${code}&academy=nagpur-fc-youth`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base text-black hover:brightness-110 transition-all"
            style={{ background: "var(--nx-green)", fontFamily: "var(--font-display)", letterSpacing: "1px", fontSize: "18px" }}>
            CREATE MY ATHLETE PROFILE <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/auth/login?from=invite"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-medium text-[var(--nx-text2)] bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:text-[var(--nx-text1)] transition-colors">
            I already have an account — Sign In
          </Link>
          <p className="text-center text-xs text-[var(--nx-text3)]">
            Free forever for athletes. Your profile belongs to you, not the academy.
          </p>
        </div>
      </div>
    </div>
  )
}
