import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch latest COMPLETED analysis for this athlete
        const { data: analysis, error } = await supabase
            .from("video_analyses")
            .select("*, videos(title, created_at)")
            .eq("athlete_id", user.id)
            .eq("status", "COMPLETED")
            .order("completed_at", { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== "PGRST116") throw error

        return NextResponse.json({ analysis: analysis || null })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
