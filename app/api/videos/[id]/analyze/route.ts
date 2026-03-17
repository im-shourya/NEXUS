import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { execSync } from "child_process"
import path from "path"

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: videoId } = await params
        const supabase = await createClient()

        // 1. Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 2. Fetch video record
        const { data: video, error: videoError } = await supabase
            .from("videos")
            .select("*")
            .eq("id", videoId)
            .eq("owner_id", user.id)
            .single()

        if (videoError || !video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 })
        }

        // 3. Get athlete profile for sport
        const { data: profile } = await supabase
            .from("athlete_profiles")
            .select("sport")
            .eq("id", user.id)
            .single()

        const sport = (video.analysis_sport || profile?.sport || "FOOTBALL").toLowerCase()
        const subtype = video.analysis_subtype || "bowling"

        // 4. Create analysis record
        const { data: analysis, error: insertError } = await supabase
            .from("video_analyses")
            .insert({
                video_id: videoId,
                athlete_id: user.id,
                sport: sport.toUpperCase(),
                analysis_subtype: subtype,
                status: "RUNNING"
            })
            .select()
            .single()

        if (insertError) throw insertError

        // 5. Run Python analysis via subprocess (no network needed)
        const videoFilePath = video.s3_key
        const bridgeScript = path.join(process.cwd(), "analyze_bridge.py")

        try {
            const cmd = `python "${bridgeScript}" "${videoFilePath}" "${sport}" "${subtype}"`
            console.log(`[ANALYZE] Running: ${cmd}`)

            const stdout = execSync(cmd, {
                cwd: process.cwd(),
                timeout: 300000, // 5 min timeout
                maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large reports
                encoding: "utf-8",
            })

            // Parse the JSON output from Python
            const mlResult = JSON.parse(stdout.trim())

            if (mlResult.error) {
                throw new Error(mlResult.error)
            }

            const report = mlResult.report
            const annotatedVideoPath = mlResult.annotated_video_path || null

            // 6. Extract score and grade
            let overallScore = 0
            let grade = "N/A"

            if (sport === "football") {
                overallScore = report?.summary?.average_quality_score || 0
                grade = report?.summary?.overall_assessment || "N/A"
            } else if (sport === "cricket") {
                overallScore = report?.overallScore || 0
                grade = report?.technicalGrade || "N/A"
            }

            // 7. Build annotated video URL for serving
            let annotatedVideoUrl = null
            if (annotatedVideoPath) {
                const filename = annotatedVideoPath.split(/[\\/]/).pop()
                annotatedVideoUrl = `/api/uploads/${filename}`
            }

            // 8. Update analysis record with results
            await supabase
                .from("video_analyses")
                .update({
                    status: "COMPLETED",
                    analysis_json: { ...report, annotated_video_url: annotatedVideoUrl },
                    overall_score: overallScore,
                    grade: grade,
                    completed_at: new Date().toISOString()
                })
                .eq("id", analysis.id)

            return NextResponse.json({
                status: "completed",
                analysis_id: analysis.id,
                report,
                annotated_video_url: annotatedVideoUrl
            })

        } catch (mlError: any) {
            console.error("[ANALYZE] Error:", mlError.message)

            // Mark analysis as failed
            await supabase
                .from("video_analyses")
                .update({
                    status: "FAILED",
                    error_message: mlError.message?.substring(0, 500)
                })
                .eq("id", analysis.id)

            return NextResponse.json({
                status: "failed",
                error: mlError.message
            }, { status: 500 })
        }

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
