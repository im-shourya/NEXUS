"use client"
import { useEffect, useCallback, useRef } from "react"

// Lightweight realtime hook — works with or without Supabase client
// In production, replace the mock with supabase.channel().on().subscribe()
type RealtimeEvent = { type: string; table: string; payload: Record<string, unknown> }
type Handler = (payload: Record<string, unknown>) => void

export function useRealtimeTable(
  table: string,
  filter: string,
  onInsert: Handler,
  onUpdate?: Handler
) {
  const handlerRef = useRef(onInsert)
  handlerRef.current = onInsert

  useEffect(() => {
    // Production: replace with supabase.channel(...)
    // const channel = supabase.channel(`realtime:${table}`)
    //   .on("postgres_changes", { event: "INSERT", schema: "public", table, filter }, onInsert)
    //   .subscribe()
    // return () => supabase.removeChannel(channel)

    // For demo: no-op cleanup
    return () => {}
  }, [table, filter])
}

export function useRealtimeNotifications(userId: string, onNew: Handler) {
  useEffect(() => {
    if (!userId) return
    // Production: supabase realtime subscription on notifications table
    return () => {}
  }, [userId])
}

export function useRealtimeLiveScore(tournamentId: string, onEvent: Handler) {
  useEffect(() => {
    if (!tournamentId) return
    return () => {}
  }, [tournamentId])
}

export function useRealtimeMessages(conversationKey: string, onMessage: Handler) {
  useEffect(() => {
    if (!conversationKey) return
    return () => {}
  }, [conversationKey])
}
