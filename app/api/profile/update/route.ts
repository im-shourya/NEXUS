import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request) {
    try {
        const supabase = await createClient()

        // 1. Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { userUpdates, profileUpdates } = body

        if (!userUpdates && !profileUpdates) {
            return NextResponse.json({ error: "No updates provided" }, { status: 400 })
        }

        // 2. Fetch base user to determine role
        const { data: baseUser, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()

        if (userError || !baseUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { role } = baseUser
        let updatedBase = null
        let updatedProfile = null

        // 3. Update base user table (full_name, avatar_url, etc.)
        if (userUpdates && Object.keys(userUpdates).length > 0) {
            // Prevent updating system-critical fields like id, email, role via this endpoint
            delete userUpdates.id
            delete userUpdates.email
            delete userUpdates.role
            delete userUpdates.plan

            const { data, error } = await supabase
                .from("users")
                .update(userUpdates)
                .eq("id", user.id)
                .select()
                .single()

            if (error) {
                return NextResponse.json({ error: `User update failed: ${error.message}` }, { status: 500 })
            }
            updatedBase = data
        }

        // 4. Update the role-specific table
        if (profileUpdates && Object.keys(profileUpdates).length > 0) {
            // Prevent updating the ID constraint
            delete profileUpdates.id

            let targetTable = ""
            if (role === "ATHLETE") targetTable = "athlete_profiles"
            else if (role === "SCOUT") targetTable = "scout_profiles"
            else if (role === "ACADEMY") targetTable = "academies"
            else return NextResponse.json({ error: "Invalid role" }, { status: 400 })

            // First check if the profile exists, if not we might need to insert it
            // though our signup flow guarantees the row is created
            const { data, error: updateError } = await supabase
                .from(targetTable)
                .update(profileUpdates)
                .eq("id", user.id)
                .select()
                .single()

            if (updateError) {
                return NextResponse.json({ error: `Profile update failed: ${updateError.message}` }, { status: 500 })
            }
            updatedProfile = data
        }

        // 5. Return success result
        return NextResponse.json({
            success: true,
            user: updatedBase,
            profile: updatedProfile
        })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
