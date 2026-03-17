import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch conversations where the user is either participant A or B
        const { data: conversations, error: fetchError } = await supabase
            .from("conversations")
            .select("*")
            .or(`participant_a_id.eq.${user.id},participant_b_id.eq.${user.id}`)
            .order("last_message_at", { ascending: false, nullsFirst: false })

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        // Enhance with other participant details (name, avatar, etc.)
        const enhancedConversations = await Promise.all(
            (conversations || []).map(async (conv) => {
                const otherId = conv.participant_a_id === user.id ? conv.participant_b_id : conv.participant_a_id
                const { data: otherUser } = await supabase
                    .from("users")
                    .select("id, full_name, avatar_url, role")
                    .eq("id", otherId)
                    .single()

                return {
                    ...conv,
                    other_user: otherUser,
                    unread_count: conv.participant_a_id === user.id ? conv.unread_a : conv.unread_b
                }
            })
        )

        return NextResponse.json({ conversations: enhancedConversations })

    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
    }
}
