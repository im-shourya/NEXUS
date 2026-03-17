"""
Bridge script for calling ML analysis from Node.js via subprocess.
Usage: python analyze_bridge.py <video_path> <sport> [subtype]

Outputs JSON to stdout with both report data and annotated video path.
"""

import sys
import os
import json
import traceback
import cv2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, "football_cv_analysis"))
sys.path.insert(0, os.path.join(BASE_DIR, "cricket-analyzer"))


def analyze_football(video_path, output_video_path):
    """Run football CV analysis, generate annotated video + report."""
    from pose_detector import PoseDetector
    from ball_detector import BallDetector
    from analysis_engine import AnalysisEngine
    from visualizer import Visualizer
    from report_generator import ReportGenerator

    pose_detector = PoseDetector()
    ball_detector = BallDetector(model_path='yolov8n.pt')
    analysis_engine = AnalysisEngine()
    visualizer = Visualizer()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    report_gen = ReportGenerator(video_path, fps, width, height, total_frames)

    # Setup video writer for annotated output
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        landmarks = pose_detector.detect(frame)
        ball_pos = ball_detector.detect(frame)
        analysis = analysis_engine.analyze_frame(landmarks, ball_pos, frame_count)

        # Write annotated frame
        annotated = visualizer.draw(frame, landmarks, ball_pos, analysis)
        out.write(annotated)

        # Collect for report
        report_gen.add_frame(frame_count, landmarks, ball_pos, analysis)

        if frame_count % 50 == 0:
            print(f"  Football: processed {frame_count}/{total_frames} frames", file=sys.stderr)

    cap.release()
    out.release()

    report = report_gen.generate()
    return report


def analyze_cricket(video_path, output_video_path, subtype="bowling"):
    """Run cricket analysis, generate annotated video + report."""
    import numpy as np
    from cricket_analysis.config import CricketAnalysisConfig, AnalysisType, BowlerType
    from cricket_analysis.cricket_analyzer import CricketVideoAnalyzer

    config = CricketAnalysisConfig(
        analysis_type=AnalysisType(subtype),
        bowler_type=BowlerType("pace_fast") if subtype == "bowling" else None,
        camera_angle="side"
    )

    analyzer = CricketVideoAnalyzer(config)
    result = analyzer.analyze_video(video_path)

    # Now generate the annotated video using the cricket analyzer's own PoseDetector
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    # Use the cricket analyzer's own pose detector (which already works)
    pose_detector = None
    try:
        from cricket_analysis.pose_detector import PoseDetector as CricketPoseDetector
        pose_detector = CricketPoseDetector()
        print("  Using CricketPoseDetector for overlay", file=sys.stderr)
    except Exception as e:
        print(f"  PoseDetector init failed ({e}), will copy raw video", file=sys.stderr)

    CONNECTIONS = [
        (11, 12), (11, 13), (13, 15), (12, 14), (14, 16),
        (11, 23), (12, 24), (23, 24),
        (23, 25), (24, 26), (25, 27), (26, 28),
        (27, 29), (27, 31), (28, 30), (28, 32),
    ]

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        if pose_detector:
            try:
                landmarks = pose_detector.detect(frame)
                h, w_f = frame.shape[:2]

                if landmarks:
                    # landmarks could be a dict {idx: {x,y,visibility}} or list
                    lm_dict = {}
                    if isinstance(landmarks, dict):
                        lm_dict = landmarks
                    elif isinstance(landmarks, list):
                        for idx, lm in enumerate(landmarks):
                            if isinstance(lm, dict):
                                lm_dict[idx] = lm
                            elif hasattr(lm, 'x'):
                                lm_dict[idx] = {'x': lm.x, 'y': lm.y, 'visibility': getattr(lm, 'visibility', 1.0)}

                    # Draw skeleton connections (white lines)
                    for p1, p2 in CONNECTIONS:
                        if p1 in lm_dict and p2 in lm_dict:
                            lm1, lm2 = lm_dict[p1], lm_dict[p2]
                            v1 = lm1.get('visibility', 1.0)
                            v2 = lm2.get('visibility', 1.0)
                            if (v1 if isinstance(v1, (int, float)) else 0.6) > 0.5 and \
                               (v2 if isinstance(v2, (int, float)) else 0.6) > 0.5:
                                x1 = int(float(lm1.get('x', 0)) * w_f)
                                y1 = int(float(lm1.get('y', 0)) * h)
                                x2 = int(float(lm2.get('x', 0)) * w_f)
                                y2 = int(float(lm2.get('y', 0)) * h)
                                cv2.line(frame, (x1, y1), (x2, y2), (255, 255, 255), 2)

                    # Draw green dots on joints
                    for idx, lm in lm_dict.items():
                        v = lm.get('visibility', 1.0)
                        if (v if isinstance(v, (int, float)) else 0.6) > 0.5:
                            cx = int(float(lm.get('x', 0)) * w_f)
                            cy = int(float(lm.get('y', 0)) * h)
                            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
            except Exception:
                pass  # Just write the raw frame if overlay fails

        out.write(frame)

        if frame_count % 50 == 0:
            print(f"  Cricket: processed {frame_count}/{total_frames} frames", file=sys.stderr)

    cap.release()
    out.release()

    # Build report
    actions = result.get('actions', [])
    report = {
        'analysisType': result.get('analysisType', subtype),
        'overallScore': result.get('overallScore', 0),
        'technicalGrade': result.get('technicalGrade', 'N/A'),
        'totalShotsDetected': len(actions),
        'shots': [],
        'uniqueIssues': [],
        'totalIssueCount': 0,
        'recommendations': [],
        'injuryRisks': result.get('injuryRisks', []),
    }

    for i, action in enumerate(actions):
        shot = {
            'shotNumber': i + 1,
            'score': action.get('score', 0),
            'phases': action.get('phases', {}),
            'measurements': action.get('measurements', {}),
            'issues': action.get('issues', []),
        }
        if subtype == 'bowling':
            shot['estimatedSpeed'] = action.get('estimatedSpeed', {})
            shot['legality'] = action.get('legality', {})
        report['shots'].append(shot)

    all_issues = result.get('biomechanicalIssues', [])
    seen = set()
    for issue in all_issues:
        t = issue.get('type', '')
        if t not in seen:
            seen.add(t)
            report['uniqueIssues'].append(issue)
    report['totalIssueCount'] = len(all_issues)

    seen_recs = set()
    for rec in result.get('recommendations', []):
        name = rec.get('name', '')
        if name not in seen_recs:
            seen_recs.add(name)
            report['recommendations'].append(rec)

    def make_serializable(obj):
        if hasattr(obj, 'item'):
            return obj.item()
        elif isinstance(obj, dict):
            return {k: make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [make_serializable(i) for i in obj]
        return obj

    return make_serializable(report)


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python analyze_bridge.py <video_path> <sport> [subtype]"}))
        sys.exit(1)

    video_path = sys.argv[1]
    sport = sys.argv[2].lower()
    subtype = sys.argv[3] if len(sys.argv) > 3 else "bowling"

    if not os.path.exists(video_path):
        print(json.dumps({"error": f"Video not found: {video_path}"}))
        sys.exit(1)

    # Generate output video path
    uploads_dir = os.path.join(BASE_DIR, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    base = os.path.splitext(os.path.basename(video_path))[0]
    output_video_path = os.path.join(uploads_dir, f"analyzed_{base}.mp4")

    try:
        print(f"Analyzing: {os.path.basename(video_path)} ({sport})", file=sys.stderr)

        if sport == "football":
            report = analyze_football(video_path, output_video_path)
        elif sport == "cricket":
            report = analyze_cricket(video_path, output_video_path, subtype)
        else:
            print(json.dumps({"error": f"Unsupported sport: {sport}"}))
            sys.exit(1)

        print(f"Annotated video (raw) saved to: {output_video_path}", file=sys.stderr)

        # Re-encode to H.264 so browsers can play it
        # Uses temp dir to avoid issues with parentheses in path
        final_video_path = output_video_path
        try:
            import imageio_ffmpeg
            import shutil
            import tempfile
            import subprocess as sp

            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
            tmpdir = tempfile.mkdtemp()
            tmp_in = os.path.join(tmpdir, "input.mp4")
            tmp_out = os.path.join(tmpdir, "output.mp4")

            shutil.copy2(output_video_path, tmp_in)

            conv_cmd = [
                ffmpeg_exe, "-y",
                "-i", tmp_in,
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                tmp_out
            ]
            print(f"  Converting to H.264 (via temp)...", file=sys.stderr)
            sp.run(conv_cmd, capture_output=True, timeout=120)

            if os.path.exists(tmp_out) and os.path.getsize(tmp_out) > 0:
                shutil.copy2(tmp_out, output_video_path)
                print(f"  H.264 conversion done", file=sys.stderr)
            else:
                print(f"  H.264 conversion produced empty file, using raw", file=sys.stderr)

            shutil.rmtree(tmpdir, ignore_errors=True)
        except Exception as conv_err:
            print(f"  H.264 conversion failed ({conv_err}), using raw mp4v", file=sys.stderr)

        print(json.dumps({
            "status": "success",
            "report": report,
            "annotated_video_path": final_video_path
        }))

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
