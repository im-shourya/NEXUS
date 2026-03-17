import cv2
import argparse
import os
from pose_detector import PoseDetector
from ball_detector import BallDetector
from analysis_engine import AnalysisEngine
from visualizer import Visualizer
from report_generator import ReportGenerator

def main():
    parser = argparse.ArgumentParser(description="Football CV Form Analysis")
    parser.add_argument('--source', type=str, required=True, help="Path to the input video file")
    parser.add_argument('--output', type=str, default='output_', help="Prefix for the output video file")
    parser.add_argument('--mode', type=str, default='annotated',
                        choices=['annotated', 'report'],
                        help="'annotated' = overlay video (default), 'report' = JSON text report only")
    
    args = parser.parse_args()

    # In case the source doesn't exist, exit gracefully
    if not os.path.exists(args.source):
        print(f"Error: Could not find video at {args.source}")
        return

    # Initialize Modules
    print("Initializing Modules...")
    pose_detector = PoseDetector()
    ball_detector = BallDetector(model_path='yolov8n.pt') 
    analysis_engine = AnalysisEngine()
    
    # Open Video
    print(f"Opening video: {args.source}")
    cap = cv2.VideoCapture(args.source)
    if not cap.isOpened():
        print(f"Error: Cannot open video stream for {args.source}")
        return

    # Video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Mode-specific setup
    out = None
    visualizer = None
    report_gen = None

    if args.mode == 'annotated':
        visualizer = Visualizer()
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        base_name = os.path.basename(args.source)
        output_filename = f"{args.output}{base_name}"
        out = cv2.VideoWriter(output_filename, fourcc, fps, (width, height))
        print(f"Writing annotated video to: {output_filename}")
    else:
        report_gen = ReportGenerator(args.source, fps, width, height, total_frames)
        print("Running in REPORT mode — no output video will be created.")

    frame_count = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("End of video stream or cannot fetch frame.")
                break

            frame_count += 1
            
            # --- Detection Pipeline ---
            timestamp_ms = frame_count * (1000 / fps)
            landmarks_list, landmarks_dict = pose_detector.process_frame(frame, timestamp_ms)
            
            ball_bbox = ball_detector.detect(frame)
            ball_center = ball_detector.get_ball_center(ball_bbox)

            # --- Analysis ---
            metrics = analysis_engine.evaluate_frame(landmarks_dict, ball_center)

            if args.mode == 'annotated':
                # --- Visualization (existing behavior) ---
                annotated_frame = pose_detector.draw_skeleton(frame)
                annotated_frame = ball_detector.draw_ball(annotated_frame, ball_bbox)
                annotated_frame = visualizer.draw_metrics(annotated_frame, metrics)
                annotated_frame = visualizer.draw_status(annotated_frame, f"Football Form Analysis - Frame: {frame_count}")
                out.write(annotated_frame)
            else:
                # --- Report mode: collect data, no annotation ---
                issues = analysis_engine.detect_issues(metrics)
                report_gen.add_frame(frame_count, metrics, issues)

    except KeyboardInterrupt:
        print("\nProcessing interrupted by user.")
    
    finally:
        # Cleanup
        print("\nReleasing resources...")
        cap.release()
        if out:
            out.release()
        cv2.destroyAllWindows()

        if args.mode == 'annotated':
            print(f"Finished processing. Output saved to {output_filename}")
        else:
            # Save and display the report
            json_path, report = report_gen.save()
            _print_report(report)
            print(f"\nFull report saved to: {json_path}")


def _print_report(report):
    """Pretty-print the report summary to console."""
    print("\n" + "=" * 60)
    print("  FOOTBALL FORM ANALYSIS REPORT")
    print("=" * 60)

    s = report["summary"]
    print(f"\n  Video:       {s['video_file']}")
    print(f"  Resolution:  {s['resolution']}")
    print(f"  Duration:    {s['duration_display']}")
    print(f"  Frames:      {s['frames_analyzed']} / {s['total_frames']}")
    print(f"  Avg Quality: {s['average_quality_score']}")
    print(f"  Assessment:  {s['overall_assessment']}")

    if report["issues"]:
        print(f"\n  ISSUES DETECTED ({len(report['issues'])}):")
        for i, issue in enumerate(report["issues"], 1):
            sev = issue["severity"].upper()
            print(f"    {i}. [{sev}] {issue['title']}")
            print(f"       Time: {issue['time_range_display']}")
            print(f"       {issue['description']}")
    else:
        print("\n  No issues detected — great form!")

    if report["recommendations"]:
        print(f"\n  RECOMMENDATIONS:")
        for i, rec in enumerate(report["recommendations"], 1):
            print(f"    {i}. {rec['tip']}")
            print(f"       Drill: {rec['drill']}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
