"use client"

import { useState } from "react"
import { UserPlus, Upload, Sparkles, Target, Trophy, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const athleteSteps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and build your comprehensive athlete profile with personal details, sport preferences, and physical stats.",
    detail: "Takes just 5 minutes"
  },
  {
    step: 2,
    icon: Upload,
    title: "Upload Performance",
    description: "Add your best match footage, training videos, and performance documents. Our AI analyzes every frame.",
    detail: "AI analyzes 127 metrics"
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Get AI-Matched",
    description: "ATLAS AI calculates your potential score and matches you with relevant scouts, academies, and opportunities.",
    detail: "94% match accuracy"
  },
  {
    step: 4,
    icon: Target,
    title: "Attend Trials",
    description: "Register for verified trials near you. Get real-time updates, preparation guides, and direct scout communication.",
    detail: "850+ monthly trials"
  },
  {
    step: 5,
    icon: Trophy,
    title: "Get Selected",
    description: "Receive offers from academies and teams. Track your progress and build your professional sports career.",
    detail: "12,000+ selections made"
  }
]

const scoutSteps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Verify Your Account",
    description: "Complete verification with your organization credentials to access the full scout dashboard.",
    detail: "24-hour verification"
  },
  {
    step: 2,
    icon: Target,
    title: "Set Search Criteria",
    description: "Define exactly what you're looking for: position, age, location, metrics, and more.",
    detail: "50+ filter options"
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Discover Talent",
    description: "AI surfaces the best matches from 50M+ athletes. Watch videos, review stats, and compare candidates.",
    detail: "AI-powered discovery"
  },
  {
    step: 4,
    icon: Trophy,
    title: "Manage Shortlists",
    description: "Build shortlists, schedule trials, and manage the entire recruitment pipeline in one place.",
    detail: "End-to-end workflow"
  }
]

type UserType = "athlete" | "scout"

export default function HowItWorksSection() {
  const [activeType, setActiveType] = useState<UserType>("athlete")
  const [activeStep, setActiveStep] = useState(1)

  const steps = activeType === "athlete" ? athleteSteps : scoutSteps

  return (
    <section className="relative py-32 bg-[var(--nx-bg2)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--nx-green)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--nx-cyan)]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest text-[var(--nx-gold)] bg-[rgba(255,184,0,0.08)] border border-[rgba(255,184,0,0.22)] rounded-full">
            How It Works
          </span>
          <h2 className="text-nx-h1 text-[var(--nx-text1)] mb-6">
            Your Path to<br />
            <span className="text-[var(--nx-green)]">Sports Excellence</span>
          </h2>
          <p className="text-nx-body-lg max-w-2xl mx-auto mb-10">
            Whether you&apos;re an athlete looking for opportunities or a scout searching 
            for talent, NEXUS guides you every step of the way.
          </p>

          {/* Toggle */}
          <div className="inline-flex p-1.5 rounded-full bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
            {(["athlete", "scout"] as UserType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type)
                  setActiveStep(1)
                }}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-semibold transition-all",
                  activeType === type
                    ? "bg-[var(--nx-green)] text-black"
                    : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"
                )}
              >
                {type === "athlete" ? "For Athletes" : "For Scouts"}
              </button>
            ))}
          </div>
        </div>

        {/* Steps Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={cn(
                  "w-full text-left p-6 rounded-2xl border transition-all duration-300",
                  activeStep === step.step
                    ? "bg-[var(--nx-green-dim)] border-[var(--nx-green-border)]"
                    : "bg-[var(--nx-bg3)] border-[var(--nx-border)] hover:border-[var(--nx-border2)]"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                    activeStep === step.step
                      ? "bg-[var(--nx-green)] text-black"
                      : "bg-[var(--nx-bg4)] text-[var(--nx-text3)]"
                  )}>
                    {step.step}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg font-semibold mb-1 transition-colors",
                      activeStep === step.step
                        ? "text-[var(--nx-green)]"
                        : "text-[var(--nx-text1)]"
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      "text-sm transition-colors",
                      activeStep === step.step
                        ? "text-[var(--nx-text2)]"
                        : "text-[var(--nx-text3)]"
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div className="lg:sticky lg:top-32">
            <div className="relative p-8 rounded-3xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--nx-green)]/10 rounded-full blur-[80px]" />
              
              <div className="relative">
                {/* Icon */}
                {steps.map((step) => step.step === activeStep && (
                  <div key={step.step} className="nx-score-reveal">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] flex items-center justify-center mb-6">
                      <step.icon className="w-10 h-10 text-[var(--nx-green)]" />
                    </div>
                    
                    <div className="text-xs font-mono uppercase tracking-widest text-[var(--nx-text3)] mb-2">
                      Step {step.step} of {steps.length}
                    </div>
                    
                    <h3 className="text-nx-h2 text-[var(--nx-text1)] mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-nx-body-lg mb-6">
                      {step.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                      <Sparkles className="w-4 h-4 text-[var(--nx-gold)]" />
                      <span className="text-sm font-medium text-[var(--nx-gold)]">
                        {step.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[var(--nx-green-dim)] to-transparent border border-[var(--nx-green-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[var(--nx-text1)] mb-1">
                    Ready to get started?
                  </h4>
                  <p className="text-sm text-[var(--nx-text3)]">
                    Join 50M+ athletes on NEXUS
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[var(--nx-green)] text-black font-semibold rounded-full hover:brightness-110 transition-all">
                  Start Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
