from typing import Dict, List

class BattingIssueDetector:
    """Detects technique flaws in batting shots."""
    def detect(self, frames: List[Dict], phases: Dict, measurements: Dict) -> List[Dict]:
        issues = []

        # Head falling away
        if not measurements.get('headPosition', {}).get('stable', True):
            issues.append({
                'type': 'head_falling_away',
                'severity': 'high',
                'description': 'Head is not over the ball at impact — reduces timing and control.'
            })

        # Cross-bat backlift
        bl_rating = measurements.get('backliftAngle', {}).get('rating', '')
        if bl_rating == 'cross_bat':
            issues.append({
                'type': 'crooked_backlift',
                'severity': 'medium',
                'description': 'Backlift angle too wide — increases chance of playing across the line.'
            })

        # Bent elbow
        if measurements.get('elbowAngle', {}).get('rating') == 'bent':
            issues.append({
                'type': 'bent_elbow',
                'severity': 'medium',
                'description': 'Top-hand elbow too bent at impact — reduces power through the shot.'
            })

        # Poor footwork (planted feet)
        if measurements.get('frontFootMovement', {}).get('rating') == 'planted':
            issues.append({
                'type': 'poor_footwork',
                'severity': 'medium',
                'description': 'Front foot did not stride to the pitch of the ball.'
            })

        # Limited hip rotation
        if measurements.get('hipRotation', {}).get('rating') == 'limited':
            issues.append({
                'type': 'limited_hip_rotation',
                'severity': 'low',
                'description': 'Hip rotation is limited — reduces power generation.'
            })

        return issues
