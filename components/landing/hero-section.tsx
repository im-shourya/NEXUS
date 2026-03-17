"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { SportBadge } from "@/components/nexus/sport-badge"

const heroStats = [
  { value: "50M+", label: "Youth Athletes" },
  { value: "2,400+", label: "Active Scouts" },
  { value: "850+", label: "Partner Academies" },
  { value: "12", label: "Sports Covered" },
]

const sports = [
  "Football", "Cricket", "Kabaddi", "Athletics", "Badminton", 
  "Basketball", "Hockey", "Wrestling", "Kho-Kho", "Volleyball"
]

export default function HeroSection() {
  const [currentSport, setCurrentSport] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSport((prev) => (prev + 1) % sports.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 nx-green-radial opacity-60" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--nx-orange)]/5 rounded-full blur-[120px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-[10%] nx-float nx-d-200">
        <SportBadge sport="football" size="lg" />
      </div>
      <div className="absolute top-48 right-[15%] nx-float nx-d-400">
        <SportBadge sport="cricket" size="lg" />
      </div>
      <div className="absolute bottom-32 left-[20%] nx-float nx-d-600">
        <SportBadge sport="kabaddi" size="md" />
      </div>
      <div className="absolute bottom-48 right-[10%] nx-float nx-d-300">
        <SportBadge sport="athletics" size="md" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] nx-fade-up">
          <Sparkles className="w-4 h-4 text-[var(--nx-green)]" />
          <span className="text-sm font-medium text-[var(--nx-green)]">
            AI-Powered Talent Discovery Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-nx-display text-[var(--nx-text1)] mb-4 nx-fade-up nx-d-100">
          <span className="block">Discover India&apos;s</span>
          <span className="block">
            Next{" "}
            <span className="relative inline-block">
              <span 
                key={currentSport}
                className="text-[var(--nx-green)] nx-score-reveal"
              >
                {sports[currentSport]}
              </span>
            </span>
          </span>
          <span className="block">Champion</span>
        </h1>

        {/* Subheading */}
        <p className="text-nx-body-lg max-w-2xl mx-auto mb-10 nx-fade-up nx-d-200">
          The AI platform connecting 50 million youth athletes across India 
          to ISL scouts, state academies, and professional coaches. 
          Your talent deserves to be discovered.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 nx-fade-up nx-d-300">
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-[var(--nx-green)] text-black rounded-full hover:brightness-110 transition-all hover:shadow-[var(--nx-green-shadow)] hover:scale-[1.02]"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium border border-[var(--nx-border2)] text-[var(--nx-text1)] rounded-full hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)] transition-all">
            <Play className="w-5 h-5 text-[var(--nx-green)]" />
            Watch Demo
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto nx-fade-up nx-d-400">
          {heroStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="relative p-6 rounded-2xl bg-[var(--nx-bg3)]/50 border border-[var(--nx-border)] backdrop-blur-sm"
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              <div className="text-nx-stat mb-1">{stat.value}</div>
              <div className="text-nx-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 nx-fade-up nx-d-500">
          <p className="text-xs text-[var(--nx-text3)] uppercase tracking-widest mb-6">
            Trusted by Leading Organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["ISL", "BCCI", "BAI", "PKL", "SAI", "IOA"].map((org) => (
              <div 
                key={org}
                className="text-2xl font-bold text-[var(--nx-text3)] font-[family-name:var(--font-display)] tracking-wider"
              >
                {org}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--nx-bg)] to-transparent" />
    </section>
  )
}
