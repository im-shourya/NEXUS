"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

const benefits = [
  "AI-powered talent matching",
  "Direct scout connections",
  "Video performance analysis",
  "Trial notifications",
  "Progress tracking",
  "Free to join"
]

export default function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--nx-green)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--nx-orange)]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="relative p-12 md:p-16 rounded-[32px] bg-gradient-to-br from-[var(--nx-bg3)] to-[var(--nx-bg4)] border border-[var(--nx-border)] overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--nx-green)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--nx-cyan)]/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
          
          {/* Pattern */}
          <div className="absolute inset-0 nx-dot-grid opacity-20" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]">
                <Sparkles className="w-4 h-4 text-[var(--nx-green)]" />
                <span className="text-sm font-medium text-[var(--nx-green)]">
                  Join 50M+ Athletes
                </span>
              </div>

              <h2 className="text-nx-h1 text-[var(--nx-text1)] mb-6">
                Your Sports Career<br />
                <span className="text-[var(--nx-green)]">Starts Here</span>
              </h2>

              <p className="text-nx-body-lg mb-8 max-w-lg">
                Don&apos;t let your talent go unnoticed. Create your free profile today 
                and let AI connect you with the opportunities you deserve.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit) => (
                  <div 
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-[var(--nx-text2)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--nx-green)] shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/onboarding"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-[var(--nx-green)] text-black rounded-full hover:brightness-110 transition-all hover:shadow-[var(--nx-green-shadow)] hover:scale-[1.02]"
                >
                  Create Free Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium border border-[var(--nx-border2)] text-[var(--nx-text1)] rounded-full hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)] transition-all"
                >
                  Explore Platform
                </Link>
              </div>
            </div>

            {/* Right Content - Stats Card */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-[var(--nx-bg2)] border border-[var(--nx-border)]">
                <h3 className="text-lg font-semibold text-[var(--nx-text1)] mb-6">
                  Platform Impact
                </h3>

                <div className="space-y-6">
                  {/* Stat Item */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--nx-text3)]">Athletes Discovered</span>
                      <span className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-green)]">
                        12,847
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-[var(--nx-green)] nx-bar-fill"
                        style={{ '--nx-fill-to': '85%' } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  {/* Stat Item */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--nx-text3)]">Academy Placements</span>
                      <span className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-cyan)]">
                        4,523
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-[var(--nx-cyan)] nx-bar-fill nx-d-200"
                        style={{ '--nx-fill-to': '65%' } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  {/* Stat Item */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--nx-text3)]">Professional Contracts</span>
                      <span className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-gold)]">
                        892
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-[var(--nx-gold)] nx-bar-fill nx-d-400"
                        style={{ '--nx-fill-to': '45%' } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  {/* Stat Item */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--nx-text3)]">Scholarships Awarded</span>
                      <span className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-purple)]">
                        2,156
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-[var(--nx-purple)] nx-bar-fill nx-d-600"
                        style={{ '--nx-fill-to': '55%' } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Counter */}
                <div className="mt-8 pt-6 border-t border-[var(--nx-border)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--nx-green)] nx-live-pulse" />
                      <span className="text-sm text-[var(--nx-text3)]">Athletes online now</span>
                    </div>
                    <span className="text-lg font-mono text-[var(--nx-green)]">
                      24,847
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
