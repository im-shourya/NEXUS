import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 2. Fetch base user profile (which contains the role)
        const { data: baseUser, error: userError } = await supabase
            .from("users")
            .select("id, email, full_name, role, avatar_url, phone, plan, is_verified")
            .eq("id", user.id)
            .single()

        if (userError || !baseUser) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 })
        }

        // 3. Fetch role-specific profile based on user role
        let profileData = null
        let profileError = null

        switch (baseUser.role) {
            case "ATHLETE":
                const { data: athlete, error: aError } = await supabase
                    .from("athlete_profiles")
                    .select("username, sport, position_role, city, state, height_cm, weight_kg, bio, visibility, nexus_score, profile_strength")
                    .eq("id", user.id)
                    .single()
                profileData = athlete
                profileError = aError
                break

            case "SCOUT":
                const { data: scout, error: sError } = await supabase
                    .from("scout_profiles")
                    .select("org_name, org_tier, sports_specialisation, preferred_regions, is_credential_verified")
                    .eq("id", user.id)
                    .single()
                profileData = scout
                profileError = sError
                break

            case "ACADEMY":
                const { data: academy, error: acError } = await supabase
                    .from("academies")
                    .select("slug, name, sports_offered, tier, location, total_athletes, reputation_score")
                    .eq("id", user.id)
                    .single()
                profileData = academy
                profileError = acError
                break

            default:
                return NextResponse.json({ error: "Invalid user role" }, { status: 400 })
        }

        if (profileError && profileError.code !== 'PGRST116') { // Ignore "Row not found" if they haven't finished onboarding
            return NextResponse.json({ error: profileError.message }, { status: 500 })
        }

        // 4. Return combined profile
        return NextResponse.json({
            user: baseUser,
            profile: profileData || {}
        })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
