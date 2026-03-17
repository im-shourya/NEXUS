// store/auth-store.ts
// Hydrates from Supabase session; persisted to localStorage via zustand/persist
import { create } from "zustand"
import { persist } from "zustand/middleware"

type Role = "ATHLETE" | "SCOUT" | "ACADEMY" | null
type Plan = "FREE" | "PRO" | "SCOUT_BASIC" | "SCOUT_PRO" | "ACADEMY_STANDARD" | "ACADEMY_ELITE" | null

interface User {
  id: string
  email?: string
  phone?: string
  role: Role
  plan: Plan
  fullName: string
  avatarUrl?: string
  onboardingCompleted: boolean
  onboardingStep: number
  academyId?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  updatePlan: (plan: Plan) => void
  setLoading: (v: boolean) => void
  logout: () => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      updatePlan: (plan) => set(s => ({ user: s.user ? { ...s.user, plan } : null })),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
      signOut: async () => {
        try {
          // Dynamically import to avoid SSR issues
          const { createClient } = await import("@/lib/supabase/client")
          const supabase = createClient()
          await supabase.auth.signOut()
        } catch (e) {
          console.error("Supabase signOut error:", e)
        }
        // Clear cookies
        document.cookie = "nx-role=; path=/; max-age=0"
        document.cookie = "nx-onboarding=; path=/; max-age=0"
        // Reset store
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: "nx-auth", partialize: (s) => ({ user: s.user }) }
  )
)

// Convenience selectors
export const useUser = () => useAuthStore(s => s.user)
export const useRole = () => useAuthStore(s => s.user?.role)
export const usePlan = () => useAuthStore(s => s.user?.plan)
export const useIsAuthenticated = () => useAuthStore(s => s.isAuthenticated)
