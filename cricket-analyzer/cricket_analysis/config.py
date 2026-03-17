from enum import Enum
from dataclasses import dataclass
from typing import Optional

class AnalysisType(Enum):
    BOWLING = "bowling"
    BATTING = "batting"
    FIELDING = "fielding"
    FITNESS = "fitness"

class BowlerType(Enum):
    PACE_FAST = "pace_fast"
    PACE_MEDIUM = "pace_medium"
    SPIN_OFF = "spin_off"
    SPIN_LEG = "spin_leg"
    SPIN_ORTHODOX = "spin_orthodox"

@dataclass
class CricketAnalysisConfig:
    analysis_type: AnalysisType
    bowler_type: Optional[BowlerType] = None
    shot_type: Optional[str] = None
    camera_angle: str = "side"
    fps: int = 30
