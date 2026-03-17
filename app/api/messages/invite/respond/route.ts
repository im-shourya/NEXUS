import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH /api/messages/invite/respond — Accept or decline a trial invite
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { messageId, action } = await request.json()

        if (!messageId || !["accepted", "declined"].includes(action)) {
            return NextResponse.json({ error: "Message ID and valid action (accepted/declined) required" }, { status: 400 })
        }

        // Fetch the message
        const { data: msg, error: msgError } = await supabase
            .from("messages")
            .select("*, conversations!inner(participant_a_id, participant_b_id)")
            .eq("id", messageId)
            .eq("type", "TRIAL_INVITE")
            .single()

        if (msgError || !msg) {
            return NextResponse.json({ error: "Invite message not found" }, { status: 404 })
        }

        // Verify the user is the recipient (not the sender)
        const conv = (msg as any).conversations
        if (conv.participant_a_id !== user.id && conv.participant_b_id !== user.id) {
            return NextResponse.json({ error: "Not part of this conversation" }, { status: 403 })
        }

        if (msg.sender_id === user.id) {
            return NextResponse.json({ error: "Cannot respond to your own invite" }, { status: 400 })
        }

        // Update the invite metadata
        const updatedMetadata = { ...msg.metadata, status: action }

        const { error: updateError } = await supabase
            .from("messages")
            .update({ metadata: updatedMetadata })
            .eq("id", messageId)

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        // Send a system message about the response
        await supabase
            .from("messages")
            .insert({
                conversation_id: msg.conversation_id,
                sender_id: user.id,
                content: action === "accepted"
                    ? `✅ Invitation accepted! Looking forward to the trial.`
                    : `Invitation declined.`,
                type: "SYSTEM"
            })

        return NextResponse.json({ status: action })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
