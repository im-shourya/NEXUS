"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Trophy, Shield, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { NexusLogo } from "@/components/nexus/nexus-logo"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get("role") || "athlete"
  const matchCount = searchParams.get("matchCount") || "12"
  const profileStrength = searchParams.get("profileStrength") || "40"

  // 4-second automatic redirect to dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      const dashboardPath = role === "scout" ? "/scout/dashboard" : role === "academy" ? "/academy/dashboard" : "/dashboard"
      router.push(dashboardPath)
    }, 4000)
    return () => clearTimeout(timer)
  }, [role, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: "var(--nx-bg)" }}>
      {/* Background radial glow */}
      <div className="absolute inset-0 nx-green-radial opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-md text-center z-10 space-y-8">
        <NexusLogo size="lg" className="mb-4" />

        {/* Animated Checkmark */}
        <div className="relative flex justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center animate-in zoom-in duration-500" 
               style={{ background: "var(--nx-green-dim)", border: "2px solid var(--nx-green-border)" }}>
            <CheckCircle2 className="w-12 h-12" style={{ color: "var(--nx-green)" }} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-nx-h1 uppercase" style={{ color: "var(--nx-text1)" }}>
            {role === "athlete" ? "Your profile is live!" : role === "academy" ? "Academy Registered!" : "Verification Pending"}
          </h2>
          <p className="text-nx-body text-[var(--nx-text2)] max-w-[320px] mx-auto">
            {role === "athlete" 
              ? `${matchCount} scouts in your region were just notified.` 
              : "Welcome to the NEXUS Sports Intelligence Grid."}
          </p>
        </div>

        {/* Stat Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 rounded-full border border-[var(--nx-border2)] bg-[var(--nx-bg3)] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--nx-gold)]" />
            <span className="text-nx-mono text-xs uppercase">Strength: {profileStrength}%</span>
          </div>
          <div className="px-4 py-2 rounded-full border border-[var(--nx-border2)] bg-[var(--nx-bg3)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--nx-cyan)]" />
            <span className="text-nx-mono text-xs uppercase">{matchCount} AI Matches</span>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button 
            onClick={() => router.push(role === "scout" ? "/scout/dashboard" : "/dashboard")}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-bold transition-all hover:brightness-110 active:scale-95"
            style={{ background: "var(--nx-green)", color: "black" }}
          >
            GO TO MY DASHBOARD <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-nx-label text-[var(--nx-text3)] animate-pulse">
            Redirecting in 4 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--nx-bg)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--nx-green)]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
