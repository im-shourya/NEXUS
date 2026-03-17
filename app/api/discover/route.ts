import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const sport = searchParams.get('sport')
        const position = searchParams.get('position')
        const query = searchParams.get('query')

        let dbQuery = supabase
            .from("athlete_profiles")
            .select(`
                id,
                username,
                sport,
                position_role,
                city,
                state,
                nexus_score,
                profile_strength,
                height_cm,
                weight_kg,
                bio,
                users!inner (
                    id,
                    full_name,
                    avatar_url,
                    is_verified
                )
            `)
            .order('nexus_score', { ascending: false })

        // Show all registered athletes to scouts (no visibility filter)

        if (sport && sport !== 'All') {
            dbQuery = dbQuery.eq('sport', sport)
        }
        if (position) {
            dbQuery = dbQuery.ilike('position_role', `%${position}%`)
        }

        const { data: athletes, error } = await dbQuery

        if (error) throw error

        let results = athletes || []

        // Client-side search filtering for cross-table queries
        if (query) {
            const lowerQuery = query.toLowerCase()
            results = results.filter((a: any) =>
                (a.users?.full_name?.toLowerCase().includes(lowerQuery)) ||
                (a.city?.toLowerCase().includes(lowerQuery)) ||
                (a.position_role?.toLowerCase().includes(lowerQuery)) ||
                (a.username?.toLowerCase().includes(lowerQuery)) ||
                (a.sport?.toLowerCase().includes(lowerQuery))
            )
        }

        return NextResponse.json({ athletes: results })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
