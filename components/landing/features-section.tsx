"use client"

import { 
  Brain, Target, Trophy, Users, 
  Zap, Shield, BarChart3, Globe,
  Video, MessageSquare, Calendar, Award
} from "lucide-react"

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our proprietary ATLAS AI analyzes 127 performance metrics to match athletes with the perfect scouts and academies.",
    color: "green",
    stat: "94%",
    statLabel: "Match Accuracy"
  },
  {
    icon: Target,
    title: "Smart Scouting",
    description: "Scouts discover hidden talent using advanced filters, video analysis, and AI recommendations across all districts.",
    color: "cyan",
    stat: "2.4K+",
    statLabel: "Active Scouts"
  },
  {
    icon: Trophy,
    title: "Trial Management",
    description: "Complete trial lifecycle from registration to selection with automated scheduling and real-time updates.",
    color: "gold",
    stat: "850+",
    statLabel: "Monthly Trials"
  },
  {
    icon: Users,
    title: "Academy Network",
    description: "Connect with SAI centers, state academies, and private training facilities across all 28 states.",
    color: "purple",
    stat: "1,200+",
    statLabel: "Partner Academies"
  }
]

const additionalFeatures = [
  { icon: Video, title: "Video Analysis", description: "AI-powered performance tracking from uploaded videos" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track progress with detailed performance metrics" },
  { icon: Calendar, title: "Event Discovery", description: "Find tournaments, trials, and training camps" },
  { icon: MessageSquare, title: "Direct Messaging", description: "Connect directly with scouts and coaches" },
  { icon: Shield, title: "Verified Profiles", description: "All scouts and academies are verified" },
  { icon: Globe, title: "Multilingual", description: "Available in 10+ Indian languages" },
  { icon: Zap, title: "Real-time Alerts", description: "Instant notifications for opportunities" },
  { icon: Award, title: "Achievement System", description: "Earn badges and build your reputation" },
]

const colorClasses = {
  green: {
    bg: "bg-[var(--nx-green-dim)]",
    border: "border-[var(--nx-green-border)]",
    text: "text-[var(--nx-green)]",
    glow: "group-hover:shadow-[var(--nx-green-shadow)]"
  },
  cyan: {
    bg: "bg-[rgba(0,212,255,0.08)]",
    border: "border-[rgba(0,212,255,0.22)]",
    text: "text-[var(--nx-cyan)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]"
  },
  gold: {
    bg: "bg-[rgba(255,184,0,0.08)]",
    border: "border-[rgba(255,184,0,0.22)]",
    text: "text-[var(--nx-gold)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(255,184,0,0.3)]"
  },
  purple: {
    bg: "bg-[rgba(155,93,255,0.08)]",
    border: "border-[rgba(155,93,255,0.22)]",
    text: "text-[var(--nx-purple)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(155,93,255,0.3)]"
  }
}

export default function FeaturesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 nx-dot-grid opacity-30" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest text-[var(--nx-cyan)] bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.22)] rounded-full">
            Platform Features
          </span>
          <h2 className="text-nx-h1 text-[var(--nx-text1)] mb-6">
            Everything You Need to<br />
            <span className="text-[var(--nx-green)]">Discover & Develop</span> Talent
          </h2>
          <p className="text-nx-body-lg max-w-2xl mx-auto">
            A comprehensive ecosystem built for athletes, scouts, and academies 
            with AI at its core. From talent discovery to professional development.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {mainFeatures.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-3xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-transparent transition-all duration-300 ${colors.glow}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-nx-h3 text-[var(--nx-text1)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-nx-body mb-6">
                  {feature.description}
                </p>

                {/* Stat */}
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-[family-name:var(--font-display)] ${colors.text}`}>
                    {feature.stat}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--nx-text3)] pb-1">
                    {feature.statLabel}
                  </span>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-3xl ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />
              </div>
            )
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-[var(--nx-bg3)]/50 border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] hover:bg-[var(--nx-green-dim)] transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <feature.icon className="w-6 h-6 text-[var(--nx-green)] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold text-[var(--nx-text1)] mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-[var(--nx-text3)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
