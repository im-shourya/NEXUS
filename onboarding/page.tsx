"use client"

import Link from "next/link"
import { ArrowRight, User, Search, Building2, Shield } from "lucide-react"

const userTypes = [
  {
    id: "athlete",
    title: "Athlete",
    description: "I'm a player looking to get discovered by scouts and academies",
    icon: User,
    color: "var(--nx-green)",
    href: "/onboarding/athlete",
    features: ["AI Profile Scoring", "Scout Matching", "Trial Notifications", "Performance Tracking"]
  },
  {
    id: "scout",
    title: "Scout",
    description: "I'm a talent scout searching for the next sports stars",
    icon: Search,
    color: "var(--nx-cyan)",
    href: "/onboarding/scout",
    features: ["AI Talent Discovery", "Video Analysis", "Shortlist Management", "Direct Messaging"]
  },
  {
    id: "academy",
    title: "Academy",
    description: "I represent an academy or training center",
    icon: Building2,
    color: "var(--nx-gold)",
    href: "/onboarding/academy",
    features: ["Trial Hosting", "Athlete Management", "Performance Analytics", "Recruitment Pipeline"]
  },
  {
    id: "guardian",
    title: "Parent/Guardian",
    description: "I'm supporting a young athlete's journey",
    icon: Shield,
    color: "var(--nx-purple)",
    href: "/onboarding/guardian",
    features: ["Manage Child Profiles", "Track Progress", "Approve Opportunities", "Safety Controls"]
  }
]

export default function OnboardingPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--nx-green)]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--nx-cyan)]/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-nx-h1 text-[var(--nx-text1)] mb-4">
            Welcome to <span className="text-[var(--nx-green)]">NEXUS</span>
          </h1>
          <p className="text-nx-body-lg max-w-xl mx-auto">
            Tell us who you are so we can personalize your experience 
            and connect you with the right opportunities.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {userTypes.map((type) => (
            <Link
              key={type.id}
              href={type.href}
              className="group relative p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-transparent transition-all duration-300"
              style={{
                // @ts-expect-error CSS variable
                '--hover-shadow': `0 0 40px ${type.color}25, 0 0 0 1px ${type.color}40`
              }}
            >
              {/* Hover Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                style={{ 
                  background: `${type.color}08`,
                  boxShadow: `0 0 40px ${type.color}15, 0 0 0 1px ${type.color}30`
                }}
              />

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `${type.color}12`,
                    border: `1px solid ${type.color}25`
                  }}
                >
                  <type.icon className="w-7 h-7" style={{ color: type.color }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[var(--nx-text1)] mb-2 flex items-center gap-2">
                    {type.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: type.color }} />
                  </h2>
                  <p className="text-sm text-[var(--nx-text3)] mb-4">
                    {type.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 text-[10px] font-medium rounded-full"
                        style={{
                          background: `${type.color}10`,
                          color: type.color,
                          border: `1px solid ${type.color}20`
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-sm text-[var(--nx-text3)] mt-8">
          You can always switch roles or add additional profiles later.
        </p>
      </div>
    </div>
  )
}
