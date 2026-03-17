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

        const { conversationId, content, type = 'TEXT' } = await request.json()

        if (!conversationId || !content) {
            return NextResponse.json({ error: "Conversation ID and content are required" }, { status: 400 })
        }

        // Verify user is part of the conversation
        const { data: conv, error: convError } = await supabase
            .from("conversations")
            .select("participant_a_id, participant_b_id, unread_a, unread_b")
            .eq("id", conversationId)
            .single()

        if (convError || !conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }

        if (conv.participant_a_id !== user.id && conv.participant_b_id !== user.id) {
            return NextResponse.json({ error: "Not part of this conversation" }, { status: 403 })
        }

        // Insert the message
        const { data: message, error: msgError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content,
                type
            })
            .select()
            .single()

        if (msgError) {
            return NextResponse.json({ error: msgError.message }, { status: 500 })
        }

        // Update conversation stats (last message and unread count for the OTHER person)
        const isUserA = conv.participant_a_id === user.id
        const previewText = type === 'TEXT' ? content.substring(0, 50) : `[${type}]`

        await supabase
            .from("conversations")
            .update({
                last_message_at: new Date().toISOString(),
                last_message_preview: previewText,
                ...(isUserA ? { unread_b: conv.unread_b + 1 } : { unread_a: conv.unread_a + 1 })
            })
            .eq("id", conversationId)

        return NextResponse.json({ message })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
