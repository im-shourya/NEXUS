# NEXUS ML Analysis Server

Standalone ML microservice for cricket and football video analysis using MediaPipe and YOLO.

## Structure

```
ml-server/
├── server.py              # Flask API (main entry point)
├── Dockerfile             # For containerized deployment
├── requirements.txt       # Python dependencies
├── cricket_analysis/      # Cricket batting/bowling analyzer
├── analysis_engine.py     # Football analysis engine
├── ball_detector.py       # YOLO ball detection
├── pose_detector.py       # MediaPipe pose detection
├── report_generator.py    # Football report builder
├── visualizer.py          # Frame annotation
├── web_analyzer.py        # High-level football wrapper
└── utils/                 # Biomechanics utilities
```

## API Endpoints

### `GET /health`
Returns server status.

### `POST /analyze`
```json
{
  "video_url": "https://...",
  "sport": "football" | "cricket",
  "subtype": "batting" | "bowling"
}
```

## Deploy on Render

1. Create a **New Web Service** on [Render](https://render.com)
2. Connect your GitHub repo (`im-shourya/NEXUS`)
3. Set:
   - **Root Directory**: `ml-server`
   - **Runtime**: Docker
   - **Health Check Path**: `/health`
4. Deploy! Render will build the Docker image and start the server.

## Run Locally

```bash
cd ml-server
pip install -r requirements.txt
python server.py
# Server starts at http://localhost:5050
```

## Notes

- ML model files (`.task`, `.pt`) are **not** included in the repo due to size. On first run, MediaPipe downloads models automatically. For YOLO, you may need to download `yolov8n.pt` to the `ml-server/` directory.
- Video analysis can take 30-120 seconds depending on video length.
- The server supports both `video_path` (local file) and `video_url` (remote URL) for input.
