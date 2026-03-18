"""
Web Analyzer — Clean API entry-point for website integration.

Usage from your backend (Flask / FastAPI / Django / etc.):

    from web_analyzer import analyze_video
    result = analyze_video("uploads/user_video.mp4")
    # result is a JSON-serializable dict with keys:
    #   summary, issues, recommendations, timeline

The original video is NEVER modified — serve it back to the user as-is.
"""

import os
import cv2
from pose_detector import PoseDetector
from ball_detector import BallDetector
from analysis_engine import AnalysisEngine
from report_generator import ReportGenerator


def analyze_video(video_path, save_json=True):
    """
    Analyze a football video and return a structured report.

    Args:
        video_path: Path to the input video file.
        save_json:  If True, also write the report to a .json file next to the input.

    Returns:
        dict with keys: summary, issues, recommendations, timeline

    Raises:
        FileNotFoundError: If video_path does not exist.
        RuntimeError:      If OpenCV cannot open the video.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video not found: {video_path}")

    # --- Initialize modules ---
    pose_detector = PoseDetector()
    ball_detector = BallDetector(model_path='yolov8n.pt')
    analysis_engine = AnalysisEngine()

    # --- Open video ---
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    report_gen = ReportGenerator(video_path, fps, width, height, total_frames)

    # --- Process frames ---
    frame_count = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            timestamp_ms = frame_count * (1000 / fps)

            # 1. Pose detection
            landmarks_list, landmarks_dict = pose_detector.process_frame(frame, timestamp_ms)

            # 2. Ball detection
            ball_bbox = ball_detector.detect(frame)
            ball_center = ball_detector.get_ball_center(ball_bbox)

            # 3. Analysis
            metrics = analysis_engine.evaluate_frame(landmarks_dict, ball_center)

            # 4. Issue detection
            issues = analysis_engine.detect_issues(metrics)

            # 5. Collect into report
            report_gen.add_frame(frame_count, metrics, issues)

    finally:
        cap.release()

    # --- Generate report ---
    if save_json:
        json_path, report = report_gen.save()
        print(f"Report saved to: {json_path}")
    else:
        report = report_gen.generate()

    return report


# --- CLI convenience ---
if __name__ == "__main__":
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Analyze a football video (web mode)")
    parser.add_argument("--source", type=str, required=True, help="Path to input video")
    parser.add_argument("--no-save", action="store_true", help="Don't write .json file")
    args = parser.parse_args()

    result = analyze_video(args.source, save_json=not args.no_save)

    # Pretty-print summary to console
    print("\n" + "=" * 60)
    print("  FOOTBALL FORM ANALYSIS REPORT")
    print("=" * 60)

    s = result["summary"]
    print(f"\n  Video:       {s['video_file']}")
    print(f"  Resolution:  {s['resolution']}")
    print(f"  Duration:    {s['duration_display']}")
    print(f"  Frames:      {s['frames_analyzed']} / {s['total_frames']}")
    print(f"  Avg Quality: {s['average_quality_score']}")
    print(f"  Assessment:  {s['overall_assessment']}")

    if result["issues"]:
        print(f"\n  ISSUES DETECTED ({len(result['issues'])}):")
        for i, issue in enumerate(result["issues"], 1):
            sev = issue["severity"].upper()
            print(f"    {i}. [{sev}] {issue['title']}")
            print(f"       Time: {issue['time_range_display']}")
            print(f"       {issue['description']}")
    else:
        print("\n  No issues detected — great form!")

    if result["recommendations"]:
        print(f"\n  RECOMMENDATIONS:")
        for i, rec in enumerate(result["recommendations"], 1):
            print(f"    {i}. {rec['tip']}")
            print(f"       Drill: {rec['drill']}")

    print("\n" + "=" * 60)
