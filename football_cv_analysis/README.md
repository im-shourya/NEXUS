# Football Computer Vision Form Analysis

A computer vision pipeline to analyze football player technique from video using Pose Estimation (MediaPipe) and Object Detection (YOLOv8).

## Features
- **Pose Estimation**: Extracts 33 2D full-body landmarks per frame using MediaPipe.
- **Ball Detection**: Tracks the football using YOLOv8 object detection.
- **Biomechanics Calculations**: Computes key joint angles (knee bending, hip alignment, lean angle) and distances (plant foot to ball).
- **Form Analysis**:
    - **Shooting**: Plant foot placement, knee angles, and follow-through.
    - **Sprint Mechanics**: Forward lean, arm drive, stride length approximation.
- **Visualization**: Generates videos with skeletal overlays, ball bounding boxes, and real-time biometric metrics rendered on-screen.

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd football_cv_analysis
   ```

2. **Create a virtual environment (Optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Place any target training video (e.g. `sample.mp4`) inside the `data` directory. 

Run the main pipeline:

```bash
python main.py --source data/sample.mp4
```

This will run the detection and analysis logic and save an output video with overlaid analytics in the root folder, typically named `output_<original_name>.mp4`.

## Modules Overview
- `utils/biomechanics.py`: Math geometry utilities covering vector operations relative to 2D landmarks.
- `pose_detector.py`: Processes frames through MediaPipe Pose to extract body keypoints.
- `ball_detector.py`: Operates YOLOv8 inferences on target frames to detect the "sports ball" bounding boxes.
- `analysis_engine.py`: Defines the business logic. Consumes pose footprints and ball positions over time to measure actions such as shooting quality footprint metrics. 
- `visualizer.py`: OpenCV drawing utilities to embed real-time feedback over processed frames.
