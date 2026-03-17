import json
import os
from datetime import timedelta


class ReportGenerator:
    """
    Collects per-frame analysis data and produces a structured JSON report
    with summary, timeline, detected issues, and coaching recommendations.
    Designed for web integration — no video annotation involved.
    """

    def __init__(self, video_path, fps, width, height, total_frames):
        self.video_path = video_path
        self.fps = fps
        self.width = width
        self.height = height
        self.total_frames = total_frames
        self.duration_s = total_frames / fps if fps > 0 else 0

        # Per-frame collected data
        self.timeline = []
        # Accumulated issues (raw flags per frame, consolidated later)
        self._raw_issues = []

    # ------------------------------------------------------------------
    # Collection (called once per frame during processing)
    # ------------------------------------------------------------------

    def add_frame(self, frame_number, metrics, issues):
        """
        Record the analysis for a single frame.

        Args:
            frame_number: 1-indexed frame number
            metrics: dict of metric_name -> value (from AnalysisEngine.evaluate_frame)
            issues: list of issue dicts (from AnalysisEngine.detect_issues)
        """
        timestamp_s = round(frame_number / self.fps, 3) if self.fps > 0 else 0.0

        self.timeline.append({
            "frame": frame_number,
            "timestamp_s": timestamp_s,
            "timestamp_display": str(timedelta(seconds=round(timestamp_s, 1))),
            "metrics": metrics,
        })

        for issue in issues:
            self._raw_issues.append({
                **issue,
                "frame": frame_number,
                "timestamp_s": timestamp_s,
            })

    # ------------------------------------------------------------------
    # Report generation
    # ------------------------------------------------------------------

    def generate(self):
        """
        Consolidate all collected data into a final report dict.
        Returns a JSON-serializable dictionary.
        """
        consolidated_issues = self._consolidate_issues()
        recommendations = self._generate_recommendations(consolidated_issues)
        summary = self._build_summary(consolidated_issues)

        report = {
            "summary": summary,
            "issues": consolidated_issues,
            "recommendations": recommendations,
            "timeline": self.timeline,
        }
        return report

    def save(self, output_path=None):
        """Generate and save the report to a JSON file."""
        report = self.generate()

        if output_path is None:
            base, _ = os.path.splitext(self.video_path)
            output_path = f"{base}_report.json"

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        return output_path, report

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _build_summary(self, consolidated_issues):
        """Build the top-level summary section."""
        # Average quality score across all frames that have one
        quality_scores = [
            entry["metrics"].get("Quality Score")
            for entry in self.timeline
            if entry["metrics"].get("Quality Score") is not None
        ]
        avg_quality = round(sum(quality_scores) / len(quality_scores), 1) if quality_scores else None

        return {
            "video_file": os.path.basename(self.video_path),
            "resolution": f"{self.width}x{self.height}",
            "fps": self.fps,
            "total_frames": self.total_frames,
            "frames_analyzed": len(self.timeline),
            "duration_s": round(self.duration_s, 2),
            "duration_display": str(timedelta(seconds=round(self.duration_s))),
            "average_quality_score": avg_quality,
            "total_issues_detected": len(consolidated_issues),
            "overall_assessment": self._overall_assessment(avg_quality, consolidated_issues),
        }

    def _overall_assessment(self, avg_quality, issues):
        """One-liner human assessment based on score + issue count."""
        if avg_quality is None:
            return "Insufficient data to assess form."
        if avg_quality >= 90 and len(issues) <= 1:
            return "Excellent form — minor tweaks possible."
        if avg_quality >= 75:
            return "Good form with some areas for improvement."
        if avg_quality >= 50:
            return "Average form — several technique issues detected."
        return "Poor form — significant corrections recommended."

    def _consolidate_issues(self):
        """
        Merge consecutive per-frame issue flags of the same type into
        time-range entries so the report reads naturally.
        Example: "Excessive forward lean" flagged on frames 30-90 becomes
        one issue entry spanning 1.0s – 3.0s.
        """
        if not self._raw_issues:
            return []

        # Group by issue id
        groups = {}
        for raw in self._raw_issues:
            key = raw["id"]
            groups.setdefault(key, []).append(raw)

        consolidated = []
        for issue_id, entries in groups.items():
            entries.sort(key=lambda e: e["frame"])

            # Walk through and merge consecutive / near-consecutive frames
            ranges = []
            current_start = entries[0]
            current_end = entries[0]

            for entry in entries[1:]:
                # Allow a gap of up to 5 frames before starting a new range
                if entry["frame"] - current_end["frame"] <= 5:
                    current_end = entry
                else:
                    ranges.append((current_start, current_end))
                    current_start = entry
                    current_end = entry
            ranges.append((current_start, current_end))

            for start, end in ranges:
                consolidated.append({
                    "id": issue_id,
                    "severity": start["severity"],
                    "title": start["title"],
                    "description": start["description"],
                    "body_part": start.get("body_part", "general"),
                    "frame_start": start["frame"],
                    "frame_end": end["frame"],
                    "time_start_s": start["timestamp_s"],
                    "time_end_s": end["timestamp_s"],
                    "time_range_display": (
                        f"{timedelta(seconds=round(start['timestamp_s'], 1))} – "
                        f"{timedelta(seconds=round(end['timestamp_s'], 1))}"
                    ),
                    "occurrences": sum(
                        1 for e in entries
                        if start["frame"] <= e["frame"] <= end["frame"]
                    ),
                })

        # Sort by earliest appearance
        consolidated.sort(key=lambda x: x["frame_start"])
        return consolidated

    def _generate_recommendations(self, consolidated_issues):
        """
        Map detected issues to actionable coaching recommendations.
        """
        # Mapping from issue id to recommendation text
        RECOMMENDATION_MAP = {
            "excessive_forward_lean": {
                "tip": "Keep your torso more upright when striking the ball. "
                       "Excessive forward lean shifts weight over the ball and reduces power.",
                "drill": "Practice standing shots focusing on keeping your chest up and eyes on the target.",
            },
            "insufficient_forward_lean": {
                "tip": "Lean slightly forward (15-25°) when shooting to keep the ball low and controlled.",
                "drill": "Place a cone 1 meter behind you and practice leaning into your shots without toppling.",
            },
            "knee_too_straight": {
                "tip": "Bend your kicking knee more during the wind-up phase. "
                       "A straight leg reduces power and accuracy.",
                "drill": "Slow-motion kick practice: freeze at the wind-up point and check your knee bend.",
            },
            "plant_foot_too_far": {
                "tip": "Place your plant foot closer to the ball — ideally 15-30 cm to the side. "
                       "A distant plant foot causes mishits.",
                "drill": "Mark a spot with chalk next to the ball and aim to land your plant foot there every shot.",
            },
            "low_quality_score": {
                "tip": "Your overall technique needs work. Focus on one issue at a time from the list above.",
                "drill": "Film yourself from the side and compare your form with professional players.",
            },
        }

        recommendations = []
        seen_ids = set()

        for issue in consolidated_issues:
            iid = issue["id"]
            if iid in seen_ids:
                continue
            seen_ids.add(iid)

            rec = RECOMMENDATION_MAP.get(iid)
            if rec:
                recommendations.append({
                    "for_issue": iid,
                    "severity": issue["severity"],
                    "tip": rec["tip"],
                    "drill": rec["drill"],
                })

        return recommendations
