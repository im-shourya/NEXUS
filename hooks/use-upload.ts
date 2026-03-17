"use client"
import { useState, useCallback } from "react"

export type UploadStatus = "idle" | "initiating" | "uploading" | "processing" | "complete" | "error"

interface UploadState {
  status: UploadStatus
  progress: number
  videoId?: string
  error?: string
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle", progress: 0 })

  const upload = useCallback(async (file: File, meta: {
    title: string; sport: string; videoType: string; visibility?: string
  }) => {
    setState({ status: "initiating", progress: 0 })

    try {
      // Step 1: Get presigned URL + videoId from server
      // Production: const { uploadUrl, videoId, fields } = await fetch("/api/videos/upload-url", { ... }).json()
      const videoId = `vid_${Math.random().toString(36).slice(2, 10)}`

      setState({ status: "uploading", progress: 0, videoId })

      // Step 2: Upload to S3 directly (bypasses Next.js server)
      // Production: use XMLHttpRequest for progress tracking
      // const xhr = new XMLHttpRequest()
      // xhr.upload.addEventListener("progress", e => setState(s => ({ ...s, progress: e.loaded / e.total * 100 })))
      // xhr.open("PUT", uploadUrl); xhr.send(file)

      // Simulate upload progress for demo
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 80))
        setState(s => ({ ...s, progress: p }))
      }

      setState({ status: "processing", progress: 100, videoId })

      // Step 3: Notify server upload is complete
      // Production: await fetch("/api/videos/upload/complete", { method: "POST", body: JSON.stringify({ videoId }) })

      // Simulate processing
      await new Promise(r => setTimeout(r, 1500))
      setState({ status: "complete", progress: 100, videoId })

      return { videoId, success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Upload failed"
      setState({ status: "error", progress: 0, error })
      return { success: false, error }
    }
  }, [])

  const reset = useCallback(() => setState({ status: "idle", progress: 0 }), [])

  return { ...state, upload, reset }
}
