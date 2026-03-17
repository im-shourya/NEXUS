"use client"
import { useState, useRef, useEffect , Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import Link from "next/link"

function OtpVerificationPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const phone = params.get("phone") || "+91 XXXXXXXXXX"
  const next = params.get("next") || "/onboarding"
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resent, setResent] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(30)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCountdown])

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next2 = [...otp]; next2[i] = val; setOtp(next2)
    if (val && i < 5) inputs.current[i + 1]?.focus()
    setError("")
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length === 6) { setOtp(text.split("")); inputs.current[5]?.focus() }
  }

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length < 6) { setError("Enter all 6 digits"); return }
    setLoading(true); setError("")
    await new Promise(r => setTimeout(r, 1200))
    if (code === "000000") { setError("Invalid OTP. Try any other 6 digits for demo."); setLoading(false); return }
    router.push(next)
  }

  const handleResend = async () => {
    setResent(true); setResendCountdown(30); setOtp(["","","","","",""])
    await new Promise(r => setTimeout(r, 800)); setResent(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--nx-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><NexusLogo size="lg" /></div>
        <div className="p-8 rounded-2xl text-center" style={{ background: "var(--nx-bg3)", border: "1px solid var(--nx-border)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5" style={{ background: "rgba(0,245,116,0.1)", border: "1px solid var(--nx-green-border)" }}>📱</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--nx-text1)" }}>Verify your phone</h1>
          <p className="text-sm mb-6" style={{ color: "var(--nx-text3)" }}>We sent a 6-digit code to <span className="font-semibold" style={{ color: "var(--nx-text2)" }}>{phone}</span></p>
          <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={el => { inputs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} autoFocus={i === 0}
                className="w-11 h-14 text-center text-xl font-bold rounded-xl transition-all"
                style={{ background: digit ? "rgba(0,245,116,0.08)" : "var(--nx-bg4)", border: `2px solid ${digit ? "var(--nx-green-border)" : error ? "rgba(255,59,48,0.4)" : "var(--nx-border)"}`, color: "var(--nx-text1)", fontFamily: "var(--font-display)", outline: "none" }} />
            ))}
          </div>
          {error && <p className="text-sm mb-4" style={{ color: "var(--nx-red)" }}>{error}</p>}
          <button onClick={handleVerify} disabled={loading || otp.join("").length < 6}
            className="w-full py-3 rounded-xl text-sm font-bold disabled:opacity-40 hover:brightness-110 transition-all flex items-center justify-center gap-2 mb-4"
            style={{ background: "var(--nx-green)", color: "black" }}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : <><CheckCircle2 className="w-4 h-4" />Verify OTP</>}
          </button>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--nx-text3)" }}>
            <span>Didn't receive it?</span>
            {resendCountdown > 0 ? <span>Resend in {resendCountdown}s</span> : (
              <button onClick={handleResend} disabled={resent} className="flex items-center gap-1 font-semibold" style={{ color: "var(--nx-cyan)" }}>
                {resent ? <><Loader2 className="w-3 h-3 animate-spin" />Sending...</> : <><RefreshCw className="w-3 h-3" />Resend OTP</>}
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-xs mt-5" style={{ color: "var(--nx-text3)" }}>
          <Link href="/auth/login" className="inline-flex items-center gap-1 hover:text-[var(--nx-text1)] transition-colors"><ArrowLeft className="w-3 h-3" />Back to login</Link>
        </p>
      </div>
    </div>
  )
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--nx-bg)", color: "var(--nx-text2)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>Loading...</div>}>
      <OtpVerificationPageInner />
    </Suspense>
  )
}
