"""
NEXUS ML Analysis Server (Consolidated)
========================================
A Flask micro-server wrapping cricket-analyzer and football_cv_analysis.

Endpoints:
  POST /analyze   { "video_url": "...", "sport": "football|cricket", "subtype": "batting|bowling" }
  GET  /health

Deploy on Render with:
  gunicorn server:app --bind 0.0.0.0:$PORT --timeout 300 --workers 2
"""

import os
import sys
import json
import traceback
import tempfile
import shutil
import urllib.request
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Add current directory to path (all modules are now co-located)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


def download_video(url, dest_path):
    """Download a video from URL to a local temp file."""
    print(f"  Downloading video from: {url[:80]}...", flush=True)
    urllib.request.urlretrieve(url, dest_path)
    size_mb = os.path.getsize(dest_path) / (1024 * 1024)
    print(f"  Downloaded: {size_mb:.1f} MB", flush=True)


def analyze_football(video_path):
    """Run football CV analysis and return report dict."""
    from web_analyzer import analyze_video
    report = analyze_video(video_path, save_json=False)
    return report


def analyze_cricket(video_path, subtype="bowling", bowler_type="pace_fast"):
    """Run cricket analysis and return report dict."""
    import numpy as np
    from cricket_analysis.config import CricketAnalysisConfig, AnalysisType, BowlerType
    from cricket_analysis.cricket_analyzer import CricketVideoAnalyzer

    config = CricketAnalysisConfig(
        analysis_type=AnalysisType(subtype),
        bowler_type=BowlerType(bowler_type) if subtype == "bowling" else None,
        camera_angle="side"
    )

    analyzer = CricketVideoAnalyzer(config)
    result = analyzer.analyze_video(video_path)

    # Build formatted report
    actions = result.get('actions', [])
    analysis_type = result.get('analysisType', subtype)

    report = {
        'analysisType': analysis_type,
        'overallScore': result.get('overallScore', 0),
        'technicalGrade': result.get('technicalGrade', 'N/A'),
        'totalShotsDetected': len(actions),
    }

    shots = []
    for i, action in enumerate(actions):
        shot = {
            'shotNumber': i + 1,
            'score': action.get('score', 0),
            'phases': action.get('phases', {}),
            'measurements': action.get('measurements', {}),
        }
        if analysis_type == 'bowling':
            shot['estimatedSpeed'] = action.get('estimatedSpeed', {})
            shot['legality'] = action.get('legality', {})
        shot['issues'] = action.get('issues', [])
        shots.append(shot)

    report['shots'] = shots

    # Unique issues
    all_issues = result.get('biomechanicalIssues', [])
    seen = set()
    unique_issues = []
    for issue in all_issues:
        t = issue.get('type', '')
        if t not in seen:
            seen.add(t)
            unique_issues.append(issue)
    report['uniqueIssues'] = unique_issues
    report['totalIssueCount'] = len(all_issues)

    # Recommendations
    seen_recs = set()
    unique_recs = []
    for rec in result.get('recommendations', []):
        name = rec.get('name', '')
        if name not in seen_recs:
            seen_recs.add(name)
            unique_recs.append(rec)
    report['recommendations'] = unique_recs

    # Injury Risks
    report['injuryRisks'] = result.get('injuryRisks', [])

    # Make numpy types serializable
    def make_serializable(obj):
        if hasattr(obj, 'item'):  # numpy scalar
            return obj.item()
        elif isinstance(obj, dict):
            return {k: make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [make_serializable(i) for i in obj]
        return obj

    return make_serializable(report)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "nexus-ml", "models": ["football", "cricket"]})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    sport = data.get("sport", "football").lower()
    subtype = data.get("subtype", "bowling")  # for cricket

    # Support both: direct video_path (local) and video_url (remote / deployed)
    video_path = data.get("video_path")
    video_url = data.get("video_url")

    tmp_dir = None

    try:
        if video_url and not video_path:
            # Download video to temp file
            tmp_dir = tempfile.mkdtemp()
            video_path = os.path.join(tmp_dir, "input_video.mp4")
            download_video(video_url, video_path)
        
        if not video_path or not os.path.exists(video_path):
            return jsonify({"error": f"Video not found. Provide 'video_url' or 'video_path'."}), 400

        print(f"\n{'='*60}", flush=True)
        print(f"  ANALYZING: {os.path.basename(video_path)}", flush=True)
        print(f"  Sport: {sport} | Subtype: {subtype}", flush=True)
        print(f"{'='*60}\n", flush=True)

        if sport == "football":
            report = analyze_football(video_path)
        elif sport == "cricket":
            report = analyze_cricket(video_path, subtype=subtype)
        else:
            return jsonify({"error": f"Unsupported sport: {sport}"}), 400

        print(f"\n  ✅ Analysis complete!", flush=True)
        return jsonify({"status": "success", "report": report})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up temp download
        if tmp_dir and os.path.exists(tmp_dir):
            shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    print("=" * 60)
    print(f"  NEXUS ML Analysis Server")
    print(f"  http://localhost:{port}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=True)
