"use client"
import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    id: "free", name: "Free Athlete", price: 0, annualPrice: 0, role: "athlete",
    color: "var(--nx-border)", accentColor: "var(--nx-green)", popular: false,
    cta: "Start Free", ctaHref: "/auth/signup?role=athlete&plan=free",
    desc: "Get discovered without spending a rupee",
    features: ["Basic athlete profile", "2 video uploads", "3 scout matches per month", "Tournament registration", { locked: "AI highlight reel" }, { locked: "Injury risk predictor" }, { locked: "Unlimited matches" }],
  },
  {
    id: "pro", name: "Pro Athlete", price: 99, annualPrice: 990, role: "athlete",
    color: "var(--nx-green)", accentColor: "var(--nx-green)", popular: true,
    cta: "Get Pro", ctaHref: "/auth/signup?role=athlete&plan=pro",
    desc: "Everything you need to get scouted",
    features: ["Unlimited video uploads", "AI highlight reel generation (5/mo)", "Unlimited scout matches", "Full injury risk predictor", "Performance intelligence", "Direct scout messaging", "Priority profile placement"],
  },
  {
    id: "scout", name: "Scout Pro", price: 499, annualPrice: 4990, role: "scout",
    color: "var(--nx-purple)", accentColor: "var(--nx-purple)", popular: false,
    cta: "Start Scouting", ctaHref: "/auth/signup?role=scout",
    desc: "Discover and shortlist India's top talent",
    features: ["Unlimited athlete discovery", "Advanced AI filters", "Unlimited shortlist", "Trial invitation system", "Market intelligence", "Bulk athlete export", "Verified scout badge"],
  },
  {
    id: "academy", name: "Academy", price: 999, annualPrice: 9990, role: "academy",
    color: "var(--nx-gold)", accentColor: "var(--nx-gold)", popular: false,
    cta: "Set Up Academy", ctaHref: "/auth/signup?role=academy",
    desc: "Manage athletes, tournaments, and scout relations",
    features: ["50 athlete profiles", "Bulk AI reel generation (20/mo)", "Tournament management + live scoring", "Academy Reputation Score", "Scouting Pack generation", "Branded athlete reels", "Scout relationship intelligence"],
  },
]

const FAQ = [
  { q: "Can I upgrade from Free to Pro at any time?", a: "Yes. Your profile, videos, and scout matches are all preserved when you upgrade. Your AI score and match history carry over." },
  { q: "Is the Academy plan per sport or per institution?", a: "One plan covers your entire institution — all sports, all age groups, all coaches under one account. The 50-athlete slot limit is the total across all sports combined." },
  { q: "What payment methods are accepted?", a: "UPI (GPay, PhonePe, Paytm), Net Banking (all major Indian banks), Credit and Debit Cards (Visa, Mastercard, RuPay). All payments processed by Razorpay." },
]

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="pricing" className="py-20 px-6 md:px-20" style={{ background: "var(--nx-bg2)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--nx-text1)" }}>Simple Pricing. No Surprises.</h2>
          <p className="text-base mb-6" style={{ color: "var(--nx-text3)" }}>Start free. Upgrade when scouts start finding you.</p>
          <div className="inline-flex rounded-full p-1" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
            <button onClick={() => setAnnual(false)} className={cn("px-5 py-2 rounded-full text-sm font-semibold transition-all", !annual ? "bg-[var(--nx-green)] text-black" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn("px-5 py-2 rounded-full text-sm font-semibold transition-all", annual ? "bg-[var(--nx-green)] text-black" : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]")}>
              Annual <span className="text-[10px] ml-1" style={{ color: annual ? "black" : "var(--nx-green)" }}>Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PLANS.map(plan => (
            <div key={plan.id} className="relative rounded-2xl p-6 flex flex-col" style={{ background: plan.popular ? `linear-gradient(160deg, ${plan.accentColor}08, var(--nx-bg3))` : "var(--nx-bg3)", border: `2px solid ${plan.popular ? plan.color : "var(--nx-border)"}` }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: plan.color, color: "black", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>MOST POPULAR</div>
              )}
              <p className="text-[10px] font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: plan.accentColor }}>{plan.name}</p>
              <div className="mb-1">
                <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--nx-text1)" }}>₹{annual ? plan.annualPrice / 12 : plan.price}</span>
                {plan.price > 0 && <span className="text-sm ml-1" style={{ color: "var(--nx-text3)" }}>/mo</span>}
              </div>
              {annual && plan.price > 0 && <p className="text-[10px] text-[var(--nx-green)] mb-1">₹{plan.annualPrice}/year · save ₹{plan.price * 12 - plan.annualPrice}</p>}
              <p className="text-xs mb-5" style={{ color: "var(--nx-text3)" }}>{plan.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, i) => {
                  const locked = typeof f === "object" && "locked" in f
                  return (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: locked ? "var(--nx-text3)" : "var(--nx-text2)" }}>
                      {locked ? <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--nx-border2)" }} /> : <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: plan.accentColor }} />}
                      {locked ? (f as any).locked : f as string}
                    </li>
                  )
                })}
              </ul>
              <Link href={plan.ctaHref} className="py-3 rounded-full text-sm font-bold text-center transition-all hover:brightness-110 block" style={{ background: plan.popular ? plan.accentColor : "transparent", color: plan.popular ? "black" : plan.accentColor, border: `1.5px solid ${plan.popular ? "transparent" : plan.accentColor}` }}>
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-semibold text-center mb-5" style={{ color: "var(--nx-text1)" }}>Frequently asked questions</h3>
          {FAQ.map((item, i) => (
            <div key={i} className="border-b" style={{ borderColor: "var(--nx-border)" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                <span className="text-sm font-medium" style={{ color: "var(--nx-text1)" }}>{item.q}</span>
                <span className="text-xs ml-4 shrink-0" style={{ color: "var(--nx-green)" }}>{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div className="pb-4">
                  <p className="text-sm" style={{ color: "var(--nx-text2)", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
