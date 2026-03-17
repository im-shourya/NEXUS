import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { participantId } = await request.json()
        if (!participantId) {
            return NextResponse.json({ error: "Participant ID is required" }, { status: 400 })
        }

        if (user.id === participantId) {
            return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 })
        }

        // Determine roles to set conversation type (optional, based on our schema)
        const { data: usersData } = await supabase
            .from('users')
            .select('id, role')
            .in('id', [user.id, participantId])

        let type = null
        if (usersData?.length === 2) {
            const roles = usersData.map(u => u.role).sort()
            if (roles.includes('SCOUT') && roles.includes('ATHLETE')) type = 'SCOUT_ATHLETE'
            else if (roles.includes('SCOUT') && roles.includes('ACADEMY')) type = 'SCOUT_ACADEMY'
            else if (roles.includes('ACADEMY') && roles.includes('ATHLETE')) type = 'ACADEMY_ATHLETE'
        }

        // Ensure Participant A is always the smaller UUID to prevent duplicate rows (A-B vs B-A)
        const [participant_a_id, participant_b_id] = [user.id, participantId].sort()

        // Query existing conversation
        const { data: existingConv } = await supabase
            .from("conversations")
            .select("*")
            .eq("participant_a_id", participant_a_id)
            .eq("participant_b_id", participant_b_id)
            .single()

        if (existingConv) {
            return NextResponse.json({ conversation: existingConv })
        }

        // Create new conversation
        const { data: newConv, error: insertError } = await supabase
            .from("conversations")
            .insert({
                participant_a_id,
                participant_b_id,
                type,
                unread_a: 0,
                unread_b: 0
            })
            .select()
            .single()

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ conversation: newConv }, { status: 201 })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
