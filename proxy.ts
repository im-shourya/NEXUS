import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Paths that require authentication
const PROTECTED_PREFIXES = ["/athlete/", "/scout/", "/academy/", "/payment"]

// Paths that are always public
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/success",
  "/auth/otp",
  "/pricing",
  "/discover",
  "/trials",
]

// Role → default dashboard
const ROLE_DASHBOARD: Record<string, string> = {
  ATHLETE: "/athlete/dashboard",
  SCOUT: "/scout/dashboard",
  ACADEMY: "/academy/dashboard",
}

// Which path prefixes belong to which role
const ROLE_PATH_MAP: Record<string, string> = {
  "/athlete/": "ATHLETE",
  "/scout/": "SCOUT",
  "/academy/": "ACADEMY",
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static files, API routes, public paths, and public profiles
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/join") ||
    pathname.match(/^\/athlete\/[^/]+$/) ||
    pathname.match(/^\/academy\/[^/]+$/) ||
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))
  ) {
    // Still refresh Supabase session if it exists
    try {
      const { supabaseResponse } = await updateSession(request)
      return supabaseResponse
    } catch {
      return NextResponse.next()
    }
  }

  // Refresh Supabase session and get current user
  let user = null
  let supabase: any = null
  let supabaseResponse = NextResponse.next({ request })

  try {
    const result = await updateSession(request)
    user = result.user
    supabase = result.supabase
    supabaseResponse = result.supabaseResponse
  } catch {
    // If Supabase is not configured, fall back to cookie-only auth
  }

  // Read role from cookie (set during login/signup)
  const roleFromCookie = request.cookies.get("nx-role")?.value
  const onboardingDone = request.cookies.get("nx-onboarding")?.value === "true"

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))

  // ── Not authenticated ─────────────────────────────────────────────
  if (isProtected && !user && !roleFromCookie) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Determine role: from cookie or from DB
  let userRole = roleFromCookie
  if (user && !userRole && supabase) {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()
      userRole = userData?.role || null
    } catch {
      // DB query failed — use metadata fallback
      userRole = user.user_metadata?.role || null
    }

    if (userRole) {
      supabaseResponse.cookies.set("nx-role", userRole, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
        sameSite: "lax",
      })
    }
  }

  // ── Incomplete onboarding ─────────────────────────────────────────
  if (isProtected && userRole && !onboardingDone && !pathname.startsWith("/onboarding")) {
    // Skip onboarding redirect for now (onboarding_complete set to true in signup)
  }

  // ── Role path guard ───────────────────────────────────────────────
  if (userRole) {
    for (const [prefix, requiredRole] of Object.entries(ROLE_PATH_MAP)) {
      if (pathname.startsWith(prefix) && userRole !== requiredRole) {
        const correctDashboard = ROLE_DASHBOARD[userRole] || "/"
        return NextResponse.redirect(new URL(correctDashboard, request.url))
      }
    }
  }

  // ── Root redirect for authenticated users ────────────────────────
  if (pathname === "/" && (user || roleFromCookie) && userRole) {
    const dashboard = ROLE_DASHBOARD[userRole]
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url))
    }
  }

  // ── Geo-based localisation header ────────────────────────────────
  const city = request.geo?.city || request.headers.get("x-vercel-ip-city") || ""
  const region = request.geo?.region || request.headers.get("x-vercel-ip-country-region") || ""
  supabaseResponse.headers.set("x-nx-city", city)
  supabaseResponse.headers.set("x-nx-region", region)

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
