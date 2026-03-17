import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: videoId } = await params
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch latest analysis for this video
        const { data: analysis, error } = await supabase
            .from("video_analyses")
            .select("*")
            .eq("video_id", videoId)
            .eq("athlete_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== "PGRST116") throw error

        return NextResponse.json({ analysis: analysis || null })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
