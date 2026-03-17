import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Fetch user role and redirect to correct dashboard
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: userData } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", user.id)
                    .single()

                if (userData?.role) {
                    const dashboardMap: Record<string, string> = {
                        ATHLETE: "/athlete/dashboard",
                        SCOUT: "/scout/dashboard",
                        ACADEMY: "/academy/dashboard",
                    }
                    const dashboard = dashboardMap[userData.role] || next
                    const forwardedHost = request.headers.get("x-forwarded-host")
                    const isLocalEnv = process.env.NODE_ENV === "development"
                    if (isLocalEnv) {
                        return NextResponse.redirect(`${origin}${dashboard}`)
                    } else if (forwardedHost) {
                        return NextResponse.redirect(`https://${forwardedHost}${dashboard}`)
                    } else {
                        return NextResponse.redirect(`${origin}${dashboard}`)
                    }
                }
            }
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
