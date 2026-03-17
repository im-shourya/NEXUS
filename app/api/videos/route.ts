import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch videos with their latest analysis status
        const { data: videos, error } = await supabase
            .from("videos")
            .select("*, video_analyses(id, status, overall_score, grade, completed_at)")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json({ videos: videos || [] })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Ensure user exists in public.users table (FK requirement)
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single()

        if (!existingUser) {
            await supabase.from("users").upsert({
                id: user.id,
                email: user.email || "",
                full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Athlete",
                role: "ATHLETE",
                plan: "FREE",
                onboarding_complete: false,
            }, { onConflict: "id" })
        }

        // Ensure athlete_profiles row exists (so athlete appears in scout discover)
        const { data: existingProfile } = await supabase
            .from("athlete_profiles")
            .select("id")
            .eq("id", user.id)
            .single()

        if (!existingProfile) {
            const username = user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_-]/g, "-") || `athlete-${Date.now()}`
            await supabase.from("athlete_profiles").upsert({
                id: user.id,
                username: `${username}-${Date.now().toString(36)}`,
                sport: "FOOTBALL",
                city: "",
                state: "",
                visibility: "PUBLIC",
                profile_strength: 30,
                nexus_score: 50,
            }, { onConflict: "id" })
        }

        const formData = await request.formData()
        const title = formData.get("title") as string
        const type = formData.get("type") as string || "Training"
        const file = formData.get("file") as File
        const analysisSport = formData.get("analysisSport") as string || ""
        const analysisSubtype = formData.get("analysisSubtype") as string || ""

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 })
        }

        // Save file locally if provided
        let filePath = `dummy/video_${Date.now()}.mp4`
        let videoUrl = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"

        if (file && file.size > 0) {
            const uploadsDir = path.join(process.cwd(), "uploads")
            await mkdir(uploadsDir, { recursive: true })

            const safeFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
            filePath = path.join(uploadsDir, safeFilename)

            const buffer = Buffer.from(await file.arrayBuffer())
            await writeFile(filePath, buffer)

            videoUrl = `/uploads/${safeFilename}`
        }

        // Insert into videos table
        const { data: newVideo, error } = await supabase
            .from("videos")
            .insert({
                owner_id: user.id,
                title: title,
                hls_playlist_url: videoUrl,
                s3_key: filePath,
                status: 'READY',
                is_ai_reel: type === "AI Reel",
                sport_tags: [type],
                duration_secs: 10,
                total_views: 0,
                scout_plays: 0,
                analysis_sport: analysisSport || null,
                analysis_subtype: analysisSubtype || null
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ video: newVideo })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
