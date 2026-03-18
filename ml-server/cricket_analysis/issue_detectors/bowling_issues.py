from typing import Dict, List

class BowlingIssueDetector:
    """Detects biomechanical and technique issues in bowling deliveries."""
    def detect(self, frames: List[Dict], phases: Dict, measurements: Dict) -> List[Dict]:
        issues = []
        if measurements.get('elbowFlexion', {}).get('maxFlexion', 0) > 15:
            issues.append({
                'type': 'chucking',
                'severity': 'critical',
                'description': 'Elbow flexion exceeds 15 degree ICC limit.'
            })
        if measurements.get('strideLength', {}).get('value', 1.0) < 1.0:
            issues.append({
                'type': 'short_stride',
                'severity': 'medium',
                'description': 'Bowling stride length is suboptimal.'
            })
        return issues
