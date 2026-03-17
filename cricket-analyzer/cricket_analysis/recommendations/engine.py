import yaml
import os
from typing import Dict, List
from ..config import AnalysisType

class RecommendationEngine:
    """Provides feedback and drill recommendations based on biomechanical issues."""
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), 'drill_database.yaml')
        with open(db_path, 'r') as f:
            self.drills_db = yaml.safe_load(f)

    def generate(self, summary: Dict, analysis_type: AnalysisType) -> List[Dict]:
        recommendations = []
        issues = summary.get('allIssues', [])
        
        if analysis_type == AnalysisType.BOWLING:
            drills = self.drills_db.get('bowling_drills', {})
            for issue in issues:
                if issue.get('type') == 'chucking':
                    recommendations.extend(drills.get('arm_action', []))
                elif issue.get('type') == 'short_stride':
                    recommendations.extend(drills.get('front_foot', []))
        elif analysis_type == AnalysisType.BATTING:
            drills = self.drills_db.get('batting_drills', {})
            for issue in issues:
                if issue.get('type') == 'poor_footwork':
                    recommendations.extend(drills.get('footwork', []))
                elif issue.get('type') == 'crooked_backlift':
                    recommendations.extend(drills.get('backlift', []))
        elif analysis_type == AnalysisType.FIELDING:
            drills = self.drills_db.get('fielding_drills', {})
            recommendations.extend(drills.get('catching', []))
        return recommendations
