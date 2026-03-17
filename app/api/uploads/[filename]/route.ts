import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// GET /api/uploads/[filename] — Serve files from the uploads directory
export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params

        // Sanitize filename to prevent path traversal
        const safeName = path.basename(filename)
        const filePath = path.join(process.cwd(), "uploads", safeName)

        const data = await readFile(filePath)

        // Determine content type
        const ext = path.extname(safeName).toLowerCase()
        const contentTypes: Record<string, string> = {
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".avi": "video/x-msvideo",
            ".mov": "video/quicktime",
            ".mkv": "video/x-matroska",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
        }
        const contentType = contentTypes[ext] || "application/octet-stream"

        return new NextResponse(data, {
            headers: {
                "Content-Type": contentType,
                "Content-Length": data.length.toString(),
                "Cache-Control": "public, max-age=3600",
            },
        })
    } catch (err: any) {
        if (err?.code === "ENOENT") {
            return NextResponse.json({ error: "File not found" }, { status: 404 })
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
