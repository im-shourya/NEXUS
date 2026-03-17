"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check, Trophy, GraduationCap, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

type UserType = "athlete" | "scout" | "academy"

const userTypes = [
  {
    id: "athlete" as UserType,
    title: "Athlete",
    description: "Build your profile and get discovered by scouts",
    icon: User,
    color: "green",
    dbRole: "ATHLETE",
  },
  {
    id: "scout" as UserType,
    title: "Scout",
    description: "Discover and recruit India's top talent",
    icon: Trophy,
    color: "cyan",
    dbRole: "SCOUT",
  },
  {
    id: "academy" as UserType,
    title: "Academy",
    description: "Manage athletes, trials, and tournaments",
    icon: GraduationCap,
    color: "gold",
    dbRole: "ACADEMY",
  }
]

const colorMap = {
  green: {
    bg: "bg-[var(--nx-green-dim)]",
    border: "border-[var(--nx-green-border)]",
    text: "text-[var(--nx-green)]",
    ring: "ring-[var(--nx-green)]"
  },
  cyan: {
    bg: "bg-[rgba(0,212,255,0.08)]",
    border: "border-[rgba(0,212,255,0.22)]",
    text: "text-[var(--nx-cyan)]",
    ring: "ring-[var(--nx-cyan)]"
  },
  gold: {
    bg: "bg-[rgba(255,184,0,0.08)]",
    border: "border-[rgba(255,184,0,0.22)]",
    text: "text-[var(--nx-gold)]",
    ring: "ring-[var(--nx-gold)]"
  }
}

const dashboardMap: Record<string, string> = {
  ATHLETE: "/athlete/dashboard",
  SCOUT: "/scout/dashboard",
  ACADEMY: "/academy/dashboard",
}

export default function SignupPage() {
  const router = useRouter()
  const setUser = useAuthStore(s => s.setUser)
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Academy-specific fields
    orgName: "",
    academySlug: "",
    // Scout-specific fields
    scoutOrg: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedType = userTypes.find(t => t.id === userType)

  const validateStep1 = () => {
    if (!userType) return false
    return true
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms"
    }

    // Academy-specific validation
    if (userType === "academy") {
      if (!formData.orgName.trim()) {
        newErrors.orgName = "Academy name is required"
      }
    }

    // Scout-specific validation
    if (userType === "scout") {
      if (!formData.scoutOrg.trim()) {
        newErrors.scoutOrg = "Organization name is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      setServerError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2() || !selectedType) return

    setIsLoading(true)
    setServerError("")

    try {
      const supabase = createClient()
      const role = selectedType.dbRole

      // 1. Sign up with Supabase Auth (OTP/email confirmation skipped)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: role,
          },
        },
      })

      if (authError) {
        setServerError(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setServerError("Signup failed. Please try again.")
        setIsLoading(false)
        return
      }

      const userId = authData.user.id

      // 2. Insert into users table
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        email: formData.email,
        role: role,
        full_name: formData.fullName,
        plan: "FREE",
        onboarding_complete: false, // Will be completed in onboarding flow
      })

      if (userError) {
        console.error("User insert error:", userError)
        // If user row already exists (e.g. from a trigger), that's ok
        if (!userError.message.includes("duplicate")) {
          setServerError(userError.message)
          setIsLoading(false)
          return
        }
      }

      // 3. Skip role-specific profile — onboarding flow will handle that

      // 4. Set role cookie for middleware
      document.cookie = `nx-role=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
      document.cookie = `nx-onboarding=false; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`

      // 5. Update Zustand auth store
      setUser({
        id: userId,
        email: formData.email,
        role: role as any,
        plan: "FREE",
        fullName: formData.fullName,
        onboardingCompleted: false,
        onboardingStep: 0,
      })

      // 6. Redirect to onboarding flow
      const onboardingMap: Record<string, string> = {
        ATHLETE: "/onboarding/athlete",
        SCOUT: "/onboarding/scout",
        ACADEMY: "/onboarding/academy",
      }
      router.push(onboardingMap[role] || "/onboarding")

    } catch (err: any) {
      setServerError(err?.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-[var(--nx-green)]"]
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <NexusLogo size="lg" />
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              step >= 1 ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg4)] text-[var(--nx-text3)]"
            )}>
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className={cn(
              "flex-1 h-1 rounded-full",
              step > 1 ? "bg-[var(--nx-green)]" : "bg-[var(--nx-bg4)]"
            )} />
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              step >= 2 ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg4)] text-[var(--nx-text3)]"
            )}>
              2
            </div>
          </div>

          {/* Server Error Banner */}
          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.25)] text-sm text-[var(--nx-red)]">
              {serverError}
            </div>
          )}

          {/* Step 1: Choose User Type */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--nx-text1)] mb-2">
                  Join NEXUS
                </h1>
                <p className="text-[var(--nx-text3)]">
                  Select how you want to use the platform
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {userTypes.map((type) => {
                  const colors = colorMap[type.color as keyof typeof colorMap]
                  return (
                    <button
                      key={type.id}
                      onClick={() => setUserType(type.id)}
                      className={cn(
                        "w-full p-5 rounded-2xl border text-left transition-all",
                        userType === type.id
                          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring}`
                          : "bg-[var(--nx-bg4)] border-[var(--nx-border)] hover:border-[var(--nx-border2)]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          userType === type.id ? colors.bg : "bg-[var(--nx-bg3)]"
                        )}>
                          <type.icon className={cn(
                            "w-6 h-6",
                            userType === type.id ? colors.text : "text-[var(--nx-text3)]"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold mb-1",
                            userType === type.id ? colors.text : "text-[var(--nx-text1)]"
                          )}>
                            {type.title}
                          </h3>
                          <p className="text-sm text-[var(--nx-text3)]">
                            {type.description}
                          </p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          userType === type.id
                            ? `${colors.border} ${colors.bg}`
                            : "border-[var(--nx-border)]"
                        )}>
                          {userType === type.id && (
                            <div className="w-2.5 h-2.5 rounded-full"
                              style={{ background: type.color === "green" ? "var(--nx-green)" : type.color === "cyan" ? "var(--nx-cyan)" : "var(--nx-gold)" }}
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleContinue}
                disabled={!userType}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[var(--nx-text3)] hover:text-[var(--nx-text1)] mb-4"
                >
                  &larr; Back
                </button>
                <h1 className="text-3xl font-bold text-[var(--nx-text1)] mb-2">
                  Create your account
                </h1>
                <p className="text-[var(--nx-text3)]">
                  Fill in your details to get started as {userType === "athlete" ? "an" : "a"} {userType}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                        errors.fullName ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                      )}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                        errors.email ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                      )}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.email}</p>
                  )}
                </div>

                {/* Scout: Organization Name */}
                {userType === "scout" && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                      Organization / Club Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                      <input
                        type="text"
                        value={formData.scoutOrg}
                        onChange={(e) => setFormData({ ...formData, scoutOrg: e.target.value })}
                        className={cn(
                          "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                          errors.scoutOrg ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                        )}
                        placeholder="e.g. Mumbai City FC"
                      />
                    </div>
                    {errors.scoutOrg && (
                      <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.scoutOrg}</p>
                    )}
                  </div>
                )}

                {/* Academy: Academy Name */}
                {userType === "academy" && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                      Academy Name
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                      <input
                        type="text"
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        className={cn(
                          "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                          errors.orgName ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                        )}
                        placeholder="e.g. Nagpur Football Academy"
                      />
                    </div>
                    {errors.orgName && (
                      <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.orgName}</p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={cn(
                        "w-full pl-12 pr-12 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                        errors.password ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                      )}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full",
                              i < strength ? strengthColors[strength - 1] : "bg-[var(--nx-bg4)]"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--nx-text3)]">
                        Password strength: {strength > 0 ? strengthLabels[strength - 1] : "Enter password"}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nx-text2)] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--nx-bg4)] border text-[var(--nx-text1)] placeholder-[var(--nx-text3)] focus:outline-none focus:border-[var(--nx-green)] transition-colors",
                        errors.confirmPassword ? "border-[var(--nx-red)]" : "border-[var(--nx-border)]"
                      )}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-green)] focus:ring-[var(--nx-green)] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[var(--nx-text3)]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[var(--nx-green)] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[var(--nx-green)] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-[var(--nx-red)]">{errors.agreeToTerms}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Sign In Link */}
          <p className="mt-8 text-center text-[var(--nx-text3)]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--nx-green)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--nx-bg2)] items-center justify-center p-12">
        <div className="absolute inset-0 nx-green-radial opacity-40" />
        <div className="absolute inset-0 nx-dot-grid opacity-30" />

        <div className="relative max-w-lg">
          <div className="space-y-6">
            {/* Feature Cards */}
            {[
              { icon: User, title: "50M+ Athletes", desc: "Join India's largest sports talent network", color: "green" },
              { icon: Trophy, title: "2,400+ Scouts", desc: "Get discovered by verified professional scouts", color: "cyan" },
              { icon: GraduationCap, title: "850+ Academies", desc: "Connect with top training institutions", color: "gold" }
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  colorMap[item.color as keyof typeof colorMap].bg
                )}>
                  <item.icon className={cn("w-6 h-6", colorMap[item.color as keyof typeof colorMap].text)} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--nx-text1)]">{item.title}</h3>
                  <p className="text-sm text-[var(--nx-text3)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
