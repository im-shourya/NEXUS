"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { NexusLogo } from "@/components/nexus/nexus-logo"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

const dashboardMap: Record<string, string> = {
  ATHLETE: "/athlete/dashboard",
  SCOUT: "/scout/dashboard",
  ACADEMY: "/academy/dashboard",
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useAuthStore(s => s.setUser)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check for callback errors
  const callbackError = searchParams.get("error")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setServerError("")

    try {
      const supabase = createClient()

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setServerError(
          authError.message === "Invalid login credentials"
            ? "Invalid email or password. Please try again."
            : authError.message
        )
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setServerError("Login failed. Please try again.")
        setIsLoading(false)
        return
      }

      // 2. Fetch user role from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, full_name, plan, avatar_url, onboarding_complete")
        .eq("id", authData.user.id)
        .single()

      if (userError || !userData) {
        // User exists in auth but not in our users table — fallback to metadata
        const metaRole = authData.user.user_metadata?.role
        if (metaRole) {
          document.cookie = `nx-role=${metaRole}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
          document.cookie = `nx-onboarding=true; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
          setUser({
            id: authData.user.id,
            email: formData.email,
            role: metaRole,
            plan: "FREE",
            fullName: authData.user.user_metadata?.full_name || formData.email,
            onboardingCompleted: true,
            onboardingStep: 0,
          })
          router.push(dashboardMap[metaRole] || "/athlete/dashboard")
          return
        }
        setServerError("Account found but profile is missing. Please sign up again.")
        setIsLoading(false)
        return
      }

      // 3. Set role cookie for middleware
      document.cookie = `nx-role=${userData.role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
      document.cookie = `nx-onboarding=true; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`

      // 4. Update Zustand auth store
      setUser({
        id: authData.user.id,
        email: formData.email,
        role: userData.role as any,
        plan: (userData.plan || "FREE") as any,
        fullName: userData.full_name,
        avatarUrl: userData.avatar_url,
        onboardingCompleted: userData.onboarding_complete,
        onboardingStep: 0,
      })

      // 5. Update last_active_at
      await supabase
        .from("users")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", authData.user.id)

      // 6. Redirect to role-specific dashboard
      const redirectTo = searchParams.get("from")
      const dashboard = redirectTo || dashboardMap[userData.role] || "/athlete/dashboard"
      router.push(dashboard)

    } catch (err: any) {
      setServerError(err?.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setServerError(error.message)
      }
    } catch (err: any) {
      setServerError(err?.message || "Google login failed")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <NexusLogo size="lg" />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--nx-text1)] mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--nx-text3)]">
              Sign in to continue your sports journey
            </p>
          </div>

          {/* Error Banners */}
          {(serverError || callbackError) && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.25)] text-sm text-[var(--nx-red)]">
              {serverError || "Authentication failed. Please try again."}
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text1)] hover:border-[var(--nx-border2)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[var(--nx-border)]" />
            <span className="text-sm text-[var(--nx-text3)]">or continue with email</span>
            <div className="flex-1 h-px bg-[var(--nx-border)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-[var(--nx-red)]">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--nx-border)] bg-[var(--nx-bg4)] text-[var(--nx-green)] focus:ring-[var(--nx-green)] focus:ring-offset-0"
                />
                <span className="text-sm text-[var(--nx-text3)]">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--nx-green)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-[var(--nx-text3)]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[var(--nx-green)] hover:underline font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--nx-bg2)] items-center justify-center p-12">
        <div className="absolute inset-0 nx-green-radial opacity-40" />
        <div className="absolute inset-0 nx-dot-grid opacity-30" />

        <div className="relative max-w-lg text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] flex items-center justify-center">
            <NexusLogo size={48} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--nx-text1)] mb-4">
            India&apos;s Sports Intelligence Platform
          </h2>
          <p className="text-[var(--nx-text2)] mb-8">
            Join 50M+ athletes, scouts, and academies discovering talent through AI-powered matching.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-green)]">50M+</div>
              <div className="text-xs text-[var(--nx-text3)]">Athletes</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-cyan)]">2.4K+</div>
              <div className="text-xs text-[var(--nx-text3)]">Scouts</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="text-2xl font-[family-name:var(--font-display)] text-[var(--nx-gold)]">850+</div>
              <div className="text-xs text-[var(--nx-text3)]">Academies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--nx-bg)] flex items-center justify-center">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  )
}
