"""
NEXUS ML Analysis Server
========================
A lightweight Flask micro-server wrapping cricket-analyzer and football_cv_analysis.
Run: python analyze_server.py
Listens on http://localhost:5050

Endpoints:
  POST /analyze  { "video_path": "...", "sport": "football|cricket", "subtype": "batting|bowling" }
  GET  /health
"""

import os
import sys
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Add model directories to path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, "football_cv_analysis"))
sys.path.insert(0, os.path.join(BASE_DIR, "cricket-analyzer"))


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

    # Build formatted report (reuse logic from run_analysis.py)
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

    # Make serializable (convert numpy types)
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
    return jsonify({"status": "ok", "models": ["football", "cricket"]})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    video_path = data.get("video_path")
    sport = data.get("sport", "football").lower()
    subtype = data.get("subtype", "bowling")  # for cricket

    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": f"Video not found: {video_path}"}), 400

    try:
        print(f"\n{'='*60}")
        print(f"  ANALYZING: {os.path.basename(video_path)}")
        print(f"  Sport: {sport} | Subtype: {subtype}")
        print(f"{'='*60}\n")

        if sport == "football":
            report = analyze_football(video_path)
        elif sport == "cricket":
            report = analyze_cricket(video_path, subtype=subtype)
        else:
            return jsonify({"error": f"Unsupported sport: {sport}"}), 400

        print(f"\n  ✅ Analysis complete!")
        return jsonify({"status": "success", "report": report})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("=" * 60)
    print("  NEXUS ML Analysis Server")
    print("  http://localhost:5050")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5050, debug=True)
