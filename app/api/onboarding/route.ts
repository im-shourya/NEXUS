import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST /api/onboarding — Save onboarding profile data
export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { role, ...profileData } = body

        if (!role || !["athlete", "scout", "academy"].includes(role)) {
            return NextResponse.json({ error: "Valid role required (athlete, scout, academy)" }, { status: 400 })
        }

        // Map sport IDs to the sport_type enum values
        const sportMap: Record<string, string> = {
            football: "FOOTBALL", cricket: "CRICKET", kabaddi: "KABADDI",
            athletics: "ATHLETICS", badminton: "BADMINTON", hockey: "HOCKEY",
            wrestling: "WRESTLING", basketball: "BASKETBALL", volleyball: "VOLLEYBALL",
            tabletennis: "TABLE_TENNIS", archery: "ARCHERY", kho: "KHO_KHO",
        }

        const roleMap: Record<string, string> = {
            athlete: "ATHLETE", scout: "SCOUT", academy: "ACADEMY",
        }

        // 1. Update user record
        const fullName = `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim()
        await supabase.from("users").upsert({
            id: user.id,
            email: user.email || "",
            full_name: fullName || user.email?.split("@")[0] || "User",
            role: roleMap[role],
            plan: "FREE",
            onboarding_complete: true,
            phone: profileData.phone || null,
        }, { onConflict: "id" })

        // 2. Create role-specific profile
        if (role === "athlete") {
            const sportEnum = sportMap[profileData.sport] || "FOOTBALL"
            const username =
                (profileData.firstName || "").toLowerCase().replace(/[^a-z0-9]/g, "") +
                (profileData.lastName || "").toLowerCase().replace(/[^a-z0-9]/g, "") +
                "-" + Date.now().toString(36)

            await supabase.from("athlete_profiles").upsert({
                id: user.id,
                username,
                sport: sportEnum,
                position_role: profileData.position || null,
                dob: profileData.dob || null,
                gender: profileData.gender || null,
                city: profileData.city || "",
                state: profileData.state || "",
                height_cm: profileData.height ? parseFloat(profileData.height) : null,
                weight_kg: profileData.weight ? parseFloat(profileData.weight) : null,
                visibility: "PUBLIC",
                is_looking_for_trial: true,
                nexus_score: 50,
                profile_strength: profileData.bio ? 60 : 40,
                sport_data: JSON.stringify({
                    academy: profileData.academy || null,
                    lookingFor: profileData.lookingFor || [],
                    bio: profileData.bio || "",
                    preferredFoot: profileData.preferredFoot || null,
                    disciplines: profileData.disciplines || [],
                    weightCategory: profileData.weightCategory || null,
                }),
            }, { onConflict: "id" })

        } else if (role === "scout") {
            const sportArr = profileData.sport
                ? [sportMap[profileData.sport] || profileData.sport]
                : []

            await supabase.from("scout_profiles").upsert({
                id: user.id,
                org_name: profileData.orgName || "",
                org_tier: profileData.tier || null,
                sports_specialisation: sportArr,
                preferred_regions: profileData.region ? [profileData.region] : [],
            }, { onConflict: "id" })

        } else if (role === "academy") {
            const slug =
                (profileData.academyName || "academy")
                    .toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") +
                "-" + Date.now().toString(36)

            const sportsOffered = (profileData.sports || [])
                .map((s: string) => sportMap[s] || s)
                .filter(Boolean)

            await supabase.from("academies").upsert({
                id: user.id,
                slug,
                name: profileData.academyName || "Academy",
                sports_offered: sportsOffered.length > 0 ? sportsOffered : ["FOOTBALL"],
                tier: profileData.tier || null,
            }, { onConflict: "id" })
        }

        return NextResponse.json({
            success: true,
            redirect: role === "athlete" ? "/athlete/dashboard"
                : role === "scout" ? "/scout/dashboard"
                    : "/academy/dashboard"
        })

    } catch (err: any) {
        console.error("[ONBOARDING ERROR]", err)
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
