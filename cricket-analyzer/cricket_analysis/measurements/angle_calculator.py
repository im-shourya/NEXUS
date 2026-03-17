import numpy as np
from typing import Dict

class AngleCalculator:
    """Utility class for calculating biomechanical angles from pose landmarks."""
    
    def calculate_angle_from_vertical(self, point1: Dict[str, float], point2: Dict[str, float]) -> float:
        dx = point2['x'] - point1['x']
        dy = point2['y'] - point1['y']
        angle = np.degrees(np.arctan2(abs(dx), abs(dy)))
        return float(angle)
        
    def calculate_3point_angle(self, point1: Dict[str, float], point2: Dict[str, float], point3: Dict[str, float]) -> float:
        """Calculate the interior angle at point2 formed by segments point1-point2 and point3-point2."""
        v1 = np.array([point1['x'] - point2['x'], point1['y'] - point2['y']])
        v2 = np.array([point3['x'] - point2['x'], point3['y'] - point2['y']])
        
        dot_prod = np.dot(v1, v2)
        mag_v1 = np.linalg.norm(v1)
        mag_v2 = np.linalg.norm(v2)
        
        if mag_v1 == 0 or mag_v2 == 0:
            return 0.0
            
        cos_angle = np.clip(dot_prod / (mag_v1 * mag_v2), -1.0, 1.0)
        return float(np.degrees(np.arccos(cos_angle)))
