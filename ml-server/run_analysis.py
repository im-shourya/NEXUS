"""
Cricket Video Analyzer - Local Test Script
===========================================
Usage:
    python run_analysis.py --video data/batting.mp4 --output data/output.mp4 --type batting

Outputs:
    1. An annotated video with skeleton overlay only (no text clutter)
    2. A JSON file (same name as output + .json) with full analysis results
"""

import cv2
import json
import argparse
import os
import sys
import numpy as np

from cricket_analysis.config import CricketAnalysisConfig, AnalysisType, BowlerType
from cricket_analysis.cricket_analyzer import CricketVideoAnalyzer


def draw_landmarks(frame, landmarks_dict):
    """Draw skeleton overlay on frame."""
    h, w, _ = frame.shape

    connections = [
        (11, 12), (11, 13), (13, 15), (12, 14), (14, 16),  # arms
        (11, 23), (12, 24), (23, 24),                       # torso
        (23, 25), (24, 26), (25, 27), (26, 28),             # legs
        (27, 29), (27, 31), (28, 30), (28, 32),             # feet
        (0, 1), (1, 2), (2, 3), (3, 7),                     # face left
        (0, 4), (4, 5), (5, 6), (6, 8),                     # face right
    ]

    # Draw connections (white lines)
    for p1, p2 in connections:
        if p1 in landmarks_dict and p2 in landmarks_dict:
            lm1, lm2 = landmarks_dict[p1], landmarks_dict[p2]
            if lm1.get('visibility', 0) > 0.5 and lm2.get('visibility', 0) > 0.5:
                x1, y1 = int(lm1['x'] * w), int(lm1['y'] * h)
                x2, y2 = int(lm2['x'] * w), int(lm2['y'] * h)
                cv2.line(frame, (x1, y1), (x2, y2), (255, 255, 255), 2)

    # Draw joints (green dots)
    for idx, lm in landmarks_dict.items():
        if lm.get('visibility', 0) > 0.5:
            cx, cy = int(lm['x'] * w), int(lm['y'] * h)
            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)


def _draw_info_panel(frame, result):
    """Draw a semi-transparent info panel with key stats on the video."""
    h, w, _ = frame.shape
    analysis_type = result.get('analysisType', 'bowling')

    overlay = frame.copy()
    panel_h = 250 if analysis_type == 'batting' else 200
    cv2.rectangle(overlay, (10, 10), (520, panel_h), (0, 0, 0), -1)
    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)

    # Title
    title = "BOWLING ANALYSIS" if analysis_type == 'bowling' else "BATTING ANALYSIS"
    cv2.putText(frame, title, (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # Score & Grade
    score = result.get('overallScore', 'N/A')
    grade = result.get('technicalGrade', '')
    cv2.putText(frame, f"Score: {score}  Grade: {grade}", (20, 75),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    actions = result.get('actions', [])
    y = 110

    if analysis_type == 'bowling':
        if actions and 'estimatedSpeed' in actions[0]:
            speed = actions[0]['estimatedSpeed']['value']
            unit = actions[0]['estimatedSpeed']['unit']
            conf = actions[0]['estimatedSpeed'].get('confidence', 0)
            cv2.putText(frame, f"Speed: {speed} {unit} (conf: {conf:.0%})", (20, y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 100, 100), 2)
            y += 35
        if actions and 'legality' in actions[0]:
            legal = actions[0]['legality']['overallLegal']
            color = (0, 255, 0) if legal else (0, 0, 255)
            text = "LEGAL ACTION" if legal else "ILLEGAL ACTION"
            cv2.putText(frame, text, (20, y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            y += 35

    elif analysis_type == 'batting':
        if actions and 'measurements' in actions[0]:
            m = actions[0]['measurements']
            bl = m.get('backliftAngle', {})
            cv2.putText(frame, f"Backlift: {bl.get('value', '?')}deg ({bl.get('rating', '')})",
                        (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 180, 50), 2)
            y += 30
            bs = m.get('batSwingSpeed', {})
            cv2.putText(frame, f"Bat Speed: {bs.get('value', '?')} ({bs.get('rating', '')})",
                        (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 100, 100), 2)
            y += 30
            hp = m.get('headPosition', {})
            hp_color = (0, 255, 0) if hp.get('stable') else (0, 0, 255)
            cv2.putText(frame, f"Head: {hp.get('description', '?')}",
                        (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, hp_color, 2)
            y += 30
            ea = m.get('elbowAngle', {})
            cv2.putText(frame, f"Elbow: {ea.get('value', '?')}deg ({ea.get('rating', '')})",
                        (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 100), 2)
            y += 30

    issues = result.get('biomechanicalIssues', [])
    cv2.putText(frame, f"Issues: {len(issues)}", (20, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)


def make_serializable(obj):
    """Convert numpy types to native Python for JSON serialization."""
    if isinstance(obj, (np.floating, np.integer)):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_serializable(i) for i in obj]
    return obj


def format_analysis_report(result):
    """
    Build a clean, human-readable report dict suitable for a website frontend.
    This is the JSON that your website will consume.
    """
    actions = result.get('actions', [])
    analysis_type = result.get('analysisType', 'unknown')

    # ── Overall Summary ──────────────────────────────────────────────
    report = {
        'analysisType': analysis_type,
        'overallScore': result.get('overallScore', 0),
        'technicalGrade': result.get('technicalGrade', 'N/A'),
        'totalShotsDetected': len(actions),
    }

    # ── Per-shot breakdown ───────────────────────────────────────────
    shots = []
    for i, action in enumerate(actions):
        shot = {
            'shotNumber': i + 1,
            'score': action.get('score', 0),
            'phases': action.get('phases', {}),
            'measurements': action.get('measurements', {}),
        }

        # Bowling-specific fields
        if analysis_type == 'bowling':
            shot['estimatedSpeed'] = action.get('estimatedSpeed', {})
            shot['legality'] = action.get('legality', {})

        # Per-shot issues
        shot['issues'] = action.get('issues', [])
        shots.append(shot)

    report['shots'] = shots

    # ── Unique issues across all shots ───────────────────────────────
    all_issues = result.get('biomechanicalIssues', [])
    # Deduplicate by type
    seen = set()
    unique_issues = []
    for issue in all_issues:
        t = issue.get('type', '')
        if t not in seen:
            seen.add(t)
            unique_issues.append(issue)
    report['uniqueIssues'] = unique_issues
    report['totalIssueCount'] = len(all_issues)

    # ── Recommendations ──────────────────────────────────────────────
    # Deduplicate recommendations by name
    seen_recs = set()
    unique_recs = []
    for rec in result.get('recommendations', []):
        name = rec.get('name', '')
        if name not in seen_recs:
            seen_recs.add(name)
            unique_recs.append(rec)
    report['recommendations'] = unique_recs

    # ── Injury Risks ─────────────────────────────────────────────────
    report['injuryRisks'] = result.get('injuryRisks', [])

    return report


def main():
    parser = argparse.ArgumentParser(
        description="Cricket Video Analyzer — outputs skeleton video + analysis JSON separately."
    )
    parser.add_argument('--video', type=str, required=True, help="Path to input video file")
    parser.add_argument('--output', type=str, default='output.mp4', help="Path to output annotated video")
    parser.add_argument('--type', type=str, choices=['bowling', 'batting', 'fielding'], default='bowling')
    parser.add_argument('--bowler-type', type=str, default='pace_fast',
                        choices=['pace_fast', 'pace_medium', 'spin_off', 'spin_leg', 'spin_orthodox'])

    args = parser.parse_args()

    if not os.path.exists(args.video):
        print(f"[ERROR] Video file not found: {args.video}")
        sys.exit(1)

    # JSON output path = same as video output but with .json extension
    json_path = os.path.splitext(args.output)[0] + '.json'

    print("=" * 60)
    print("  CRICKET VIDEO ANALYZER")
    print("=" * 60)
    print(f"  Input       : {args.video}")
    print(f"  Video Out   : {args.output}")
    print(f"  JSON Out    : {json_path}")
    print(f"  Type        : {args.type}")
    if args.type == 'bowling':
        print(f"  Bowler Type : {args.bowler_type}")
    print("=" * 60)

    # ── Step 1: Run ML Analysis ──────────────────────────────────────
    print("\n[1/3] Running ML analysis (pose detection + biomechanics)...")

    config = CricketAnalysisConfig(
        analysis_type=AnalysisType(args.type),
        bowler_type=BowlerType(args.bowler_type) if args.type == 'bowling' else None,
        camera_angle="side"
    )

    analyzer = CricketVideoAnalyzer(config)
    result = analyzer.analyze_video(args.video)

    print(f"      Score  : {result.get('overallScore', 'N/A')}")
    print(f"      Grade  : {result.get('technicalGrade', 'N/A')}")
    print(f"      Issues : {len(result.get('biomechanicalIssues', []))}")

    # ── Step 2: Generate Annotated Video + Separate JSON ────────────
    print("\n[2/3] Generating annotated video + JSON report...")

    cap = cv2.VideoCapture(args.video)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(args.output, fourcc, fps, (width, height))

    pose_detector = analyzer.pose_detector
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Draw skeleton
        landmarks = pose_detector.detect(frame)
        if landmarks:
            draw_landmarks(frame, landmarks)

        # Draw info panel with key stats
        _draw_info_panel(frame, result)

        out.write(frame)
        frame_idx += 1

        if frame_idx % 30 == 0:
            pct = (frame_idx / total_frames * 100) if total_frames > 0 else 0
            print(f"      Processing... {pct:.0f}%", end='\r')

    cap.release()
    out.release()

    # ── Step 3: Save Analysis JSON ───────────────────────────────────
    report = format_analysis_report(result)
    serializable_report = make_serializable(report)

    with open(json_path, 'w') as f:
        json.dump(serializable_report, f, indent=2)

    print(f"\n\n[3/3] Done!")
    print(f"      Video → {os.path.abspath(args.output)}")
    print(f"      JSON  → {os.path.abspath(json_path)}")
    print()

    # Quick preview of the report in terminal
    print("  ┌─────────────────────────────────────────┐")
    print(f"  │  Score: {report['overallScore']}  |  Grade: {report['technicalGrade']}  |  Shots: {report['totalShotsDetected']}")
    print("  ├─────────────────────────────────────────┤")

    if report['uniqueIssues']:
        print("  │  ISSUES:")
        for issue in report['uniqueIssues']:
            sev = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}.get(issue['severity'], '⚪')
            print(f"  │   {sev} [{issue['severity'].upper()}] {issue['type']}")
            print(f"  │      {issue['description']}")

    if report['recommendations']:
        print("  ├─────────────────────────────────────────┤")
        print("  │  RECOMMENDED DRILLS:")
        for r in report['recommendations']:
            print(f"  │   • {r['name']} ({r['sets']}x{r['reps']})")
            print(f"  │     {r['description']}")

    print("  └─────────────────────────────────────────┘")


if __name__ == "__main__":
    main()
