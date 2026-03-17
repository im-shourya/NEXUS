import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const supabase = await createClient()

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const resolvedParams = await params
        const conversationId = resolvedParams.conversationId

        // Verify user is part of the conversation
        const { data: conv, error: convError } = await supabase
            .from("conversations")
            .select("participant_a_id, participant_b_id")
            .eq("id", conversationId)
            .single()

        if (convError || !conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }

        if (conv.participant_a_id !== user.id && conv.participant_b_id !== user.id) {
            return NextResponse.json({ error: "Not part of this conversation" }, { status: 403 })
        }

        // Fetch messages sorted by time
        const { data: messages, error: msgError } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("sent_at", { ascending: true })

        if (msgError) {
            return NextResponse.json({ error: msgError.message }, { status: 500 })
        }

        // Optionally mark messages as read by resetting the user's unread counter
        const isUserA = conv.participant_a_id === user.id
        await supabase
            .from("conversations")
            .update(isUserA ? { unread_a: 0 } : { unread_b: 0 })
            .eq("id", conversationId)

        return NextResponse.json({ messages })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
