"use client"
import { useState , Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { CheckCircle2, Shield, Smartphone, CreditCard, Building2, ArrowLeft, Loader2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS: Record<string, { name: string; price: number; annual: number; color: string; features: string[] }> = {
  pro: {
    name: "Pro Athlete", price: 99, annual: 990, color: "var(--nx-green)",
    features: ["Unlimited video uploads", "All scout matches visible", "AI highlight reel", "Injury risk predictor", "Career trajectory chart", "Direct scout messaging"]
  },
  scout: {
    name: "Scout Pro", price: 499, annual: 4990, color: "var(--nx-purple)",
    features: ["Unlimited athlete discovery", "Advanced AI filters", "Shortlist management", "Trial invitation system", "Market intelligence", "Verified scout badge"]
  },
  academy: {
    name: "Academy Premium", price: 999, annual: 9990, color: "var(--nx-gold)",
    features: ["50 athlete profiles", "Bulk AI reel generation", "Squad performance heatmap", "Tournament management", "Scouting pack generation", "Academy reputation score"]
  },
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / GPay / PhonePe", icon: Smartphone, badge: "FAST", badgeColor: "var(--nx-green)", desc: "Instant · Recommended" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, badge: null, desc: "Visa · Mastercard · RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, badge: null, desc: "All major Indian banks" },
]

function PaymentPageInner() {
  const params = useSearchParams()
  const planKey = params.get("plan") || "pro"
  const plan = PLANS[planKey] || PLANS.pro
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
  const [method, setMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const price = billing === "annual" ? plan.annual : plan.price
  const gst = Math.round(price * 0.18)
  const total = price + gst
  const savings = billing === "annual" ? (plan.price * 12) - plan.annual : 0

  const handlePay = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2000))
    setProcessing(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--nx-bg)" }}>
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${plan.color}15`, border: `3px solid ${plan.color}` }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: plan.color }} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--nx-text1)] mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "1px" }}>PAYMENT SUCCESSFUL!</h2>
          <p className="text-[var(--nx-text2)] text-sm mb-6">{plan.name} activated. Receipt sent to your email.</p>
          <div className="p-4 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-left mb-6 space-y-2">
            {[["Plan", plan.name], ["Amount Paid", `₹${total}`], ["Billing", billing === "annual" ? "Annual" : "Monthly"], ["Payment ID", "pay_" + Math.random().toString(36).slice(2, 12)]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[var(--nx-text3)]">{k}</span>
                <span className="font-medium text-[var(--nx-text1)]">{v}</span>
              </div>
            ))}
          </div>
          <Link href="/athlete/dashboard" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm" style={{ background: plan.color, color: "#000", fontFamily: "var(--font-display)", letterSpacing: "1px", fontSize: "16px" }}>
            GO TO DASHBOARD →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--nx-bg)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pricing" className="p-2 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <NexusLogo size={28} />
          <span className="font-semibold text-[var(--nx-text1)]">Secure Checkout</span>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--nx-text3)]">
            <Lock className="w-3 h-3" />
            256-bit SSL · Razorpay
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* LEFT — Payment Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Billing Toggle */}
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="text-xs font-semibold text-[var(--nx-text3)] mb-3" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Billing Cycle</p>
              <div className="flex gap-3">
                {[["monthly", "Monthly", `₹${plan.price}/mo`], ["annual", "Annual", `₹${plan.annual}/yr`]].map(([val, label, price]) => (
                  <button key={val} onClick={() => setBilling(val as any)}
                    className={cn("flex-1 p-3 rounded-xl border text-sm transition-all text-left", billing === val ? "border-current" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}
                    style={billing === val ? { background: `${plan.color}10`, borderColor: `${plan.color}50`, color: plan.color } : {}}>
                    <p className="font-semibold" style={billing !== val ? { color: "var(--nx-text1)" } : {}}>{label}</p>
                    <p className="text-xs mt-0.5 opacity-80">{price}</p>
                    {val === "annual" && savings > 0 && <span className="text-[9px] font-bold mt-0.5 block" style={{ color: "var(--nx-green)" }}>SAVE ₹{savings}/yr</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="text-xs font-semibold text-[var(--nx-text3)] mb-3" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Payment Method</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setMethod(pm.id)}
                    className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left", method === pm.id ? "border-[var(--nx-green)] bg-[var(--nx-green-dim)]" : "border-[var(--nx-border)] bg-[var(--nx-bg4)] hover:border-[var(--nx-border2)]")}>
                    <pm.icon className="w-5 h-5 shrink-0" style={{ color: method === pm.id ? "var(--nx-green)" : "var(--nx-text2)" }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[var(--nx-text1)]">{pm.label}</span>
                        {pm.badge && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${pm.badgeColor}20`, color: pm.badgeColor, fontFamily: "var(--font-mono)" }}>{pm.badge}</span>}
                      </div>
                      <span className="text-xs text-[var(--nx-text3)]">{pm.desc}</span>
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2", method === pm.id ? "bg-[var(--nx-green)] border-[var(--nx-green)]" : "border-[var(--nx-text3)]")} />
                  </button>
                ))}
              </div>

              {/* UPI input */}
              {method === "upi" && (
                <div className="mt-4 space-y-1.5">
                  <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi or 9876543210@paytm" className="rounded-xl text-sm" />
                </div>
              )}

              {/* Card fields */}
              {method === "card" && (
                <div className="mt-4 space-y-3">
                  {[["Card Number", "0000 0000 0000 0000"], ["Name on Card", "ARJUN SHARMA"]].map(([l, p]) => (
                    <div key={l} className="space-y-1.5">
                      <label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</label>
                      <input placeholder={p} className="w-full rounded-xl text-sm" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Expiry</label><input placeholder="MM / YY" className="w-full rounded-xl text-sm" /></div>
                    <div className="space-y-1.5"><label className="text-xs text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>CVV</label><input placeholder="•••" className="w-full rounded-xl text-sm" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button onClick={handlePay} disabled={processing}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:brightness-110 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: plan.color, color: "#000", fontFamily: "var(--font-display)", letterSpacing: "1px", fontSize: "18px" }}>
              {processing ? <><Loader2 className="w-5 h-5 animate-spin" />PROCESSING...</> : `PAY ₹${total} →`}
            </button>

            <p className="text-center text-xs text-[var(--nx-text3)]">
              <Shield className="w-3 h-3 inline mr-1" />Secured by Razorpay · Cancel anytime from Settings
            </p>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 p-5 rounded-2xl border" style={{ background: `${plan.color}04`, borderColor: `${plan.color}30` }}>
              <p className="text-xs font-semibold text-[var(--nx-text3)] mb-4" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>Order Summary</p>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}15`, border: `2px solid ${plan.color}30` }}>
                  <span className="text-xl font-bold" style={{ color: plan.color, fontFamily: "var(--font-display)" }}>{plan.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-[var(--nx-text1)]">{plan.name}</p>
                  <p className="text-xs text-[var(--nx-text3)]">{billing === "annual" ? "Annual" : "Monthly"} subscription</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[var(--nx-text2)]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: plan.color }} />
                    {f}
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--nx-border)] pt-4 space-y-2">
                {[["Subtotal", `₹${price}`], ["GST (18%)", `₹${gst}`]].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-[var(--nx-text3)]">{l}</span>
                    <span className="text-[var(--nx-text2)]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[var(--nx-border)]">
                  <span className="text-[var(--nx-text1)]">Total</span>
                  <span style={{ color: plan.color, fontFamily: "var(--font-display)", fontSize: "18px" }}>₹{total}</span>
                </div>
                {savings > 0 && (
                  <div className="text-xs text-[var(--nx-green)] text-center pt-1">You save ₹{savings} with annual billing!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--nx-bg)", color: "var(--nx-text2)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>Loading...</div>}>
      <PaymentPageInner />
    </Suspense>
  )
}
