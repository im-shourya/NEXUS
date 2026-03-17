"""Convert existing analyzed videos from mp4v to H.264 for browser playback."""
import os
import shutil
import subprocess
import tempfile
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
uploads = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

count = 0
for f in sorted(os.listdir(uploads)):
    if f.startswith("analyzed_") and f.endswith(".mp4"):
        src = os.path.join(uploads, f)
        size = os.path.getsize(src)
        if size < 1000:
            print(f"SKIP {f}: empty ({size} bytes)")
            continue

        tmpdir = tempfile.mkdtemp()
        tmp_in = os.path.join(tmpdir, "input.mp4")
        tmp_out = os.path.join(tmpdir, "output.mp4")

        try:
            shutil.copy2(src, tmp_in)
            print(f"Converting {f} ({size//1024}KB)...")

            r = subprocess.run(
                [ffmpeg, "-y", "-i", tmp_in,
                 "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                 "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp_out],
                capture_output=True, timeout=120
            )

            if os.path.exists(tmp_out) and os.path.getsize(tmp_out) > 0:
                shutil.copy2(tmp_out, src)
                count += 1
                print(f"  OK ({os.path.getsize(src)//1024}KB)")
            else:
                err = r.stderr.decode("utf-8", errors="replace")[-200:]
                print(f"  FAIL: {err}")
        finally:
            shutil.rmtree(tmpdir, ignore_errors=True)

print(f"\nConverted {count} files to H.264")
