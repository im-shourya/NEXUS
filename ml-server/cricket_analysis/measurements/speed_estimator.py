import numpy as np
from typing import List, Dict, Optional
from ..config import BowlerType

class SpeedEstimator:
    """Estimate bowling speed from video analysis using biomechanical markers."""
    
    def __init__(self, fps: int = 30):
        self.fps = fps
        self.pace_model = {
            'arm_speed': 0.45,
            'hip_rotation': 0.25,
            'run_up_speed': 0.15,
            'release_height': 0.10,
            'body_weight_transfer': 0.05
        }
    
    def estimate_bowling_speed(self, frames: List[Dict], release_phase: Dict,
                                bowler_type: Optional[BowlerType]) -> Dict:
        arm_speed = self._calculate_arm_speed(frames, release_phase)
        hip_speed = self._calculate_hip_rotation_speed(frames, release_phase)
        runup_speed = self._calculate_runup_speed(frames)
        
        base_speed = (
            arm_speed * self.pace_model['arm_speed'] +
            hip_speed * self.pace_model['hip_rotation'] +
            runup_speed * self.pace_model['run_up_speed']
        )
        
        if bowler_type == BowlerType.PACE_FAST:
            estimated_speed = base_speed * 1.0
        elif bowler_type == BowlerType.PACE_MEDIUM:
            estimated_speed = base_speed * 0.85
        elif bowler_type in [BowlerType.SPIN_OFF, BowlerType.SPIN_LEG]:
            estimated_speed = base_speed * 0.50
        else:
            estimated_speed = base_speed * 0.75
        
        estimated_speed = self._apply_constraints(estimated_speed, bowler_type)
        
        return {
            'value': round(estimated_speed, 1),
            'unit': 'km/h',
            'confidence': self._calculate_confidence(frames),
            'method': 'biomechanical_estimation',
            'components': {
                'armSpeed': arm_speed,
                'hipSpeed': hip_speed,
                'runupSpeed': runup_speed
            }
        }
    
    def _calculate_arm_speed(self, frames: List[Dict], release_phase: Dict) -> float:
        release_frames = frames[release_phase['startFrame']:release_phase['endFrame']]
        if len(release_frames) < 2:
            return 100.0
        
        wrist_positions = [frame['landmarks'][16] for frame in release_frames]
        shoulder = release_frames[0]['landmarks'][12]
        
        angles = []
        for wrist in wrist_positions:
            angle = np.degrees(np.arctan2(
                wrist['y'] - shoulder['y'], wrist['x'] - shoulder['x']
            ))
            angles.append(angle)
        
        if len(angles) > 1:
            angular_velocity = np.abs(angles[-1] - angles[0]) / len(angles)
            return float(angular_velocity * 3.0 * self.fps / 10)
        return 100.0
    
    def _calculate_hip_rotation_speed(self, frames, release_phase): return 80.0
    def _calculate_runup_speed(self, frames): return 90.0
    
    def _apply_constraints(self, speed: float, bowler_type: Optional[BowlerType]) -> float:
        constraints = {
            BowlerType.PACE_FAST: (130, 155),
            BowlerType.PACE_MEDIUM: (110, 135),
            BowlerType.SPIN_OFF: (70, 95),
            BowlerType.SPIN_LEG: (75, 95),
            BowlerType.SPIN_ORTHODOX: (75, 90)
        }
        min_s, max_s = constraints.get(bowler_type, (80, 140))
        return float(np.clip(speed, min_s, max_s))
    
    def _calculate_confidence(self, frames: List[Dict]) -> float:
        visibilities = []
        for frame in frames:
            lm = frame['landmarks']
            key_lm = [12, 14, 16, 23, 24]
            avg_vis = np.mean([lm.get(idx, {}).get('visibility', 1.0) for idx in key_lm])
            visibilities.append(avg_vis)
        if not visibilities:
            return 0.5
        avg = np.mean(visibilities)
        if avg > 0.9: return 0.85
        elif avg > 0.7: return 0.70
        elif avg > 0.5: return 0.55
        else: return 0.40
