import cv2
import numpy as np
from typing import Dict, List, Optional

from .config import AnalysisType, BowlerType, CricketAnalysisConfig
from .pose_detector import CricketPoseDetector
from .analyzers import BowlingAnalyzer, BattingAnalyzer, FieldingAnalyzer
from .measurements import BowlingMeasurements, BattingMeasurements, AngleCalculator, SpeedEstimator
from .issue_detectors import BowlingIssueDetector, BattingIssueDetector, InjuryRiskDetector
from .recommendations import RecommendationEngine


class CricketVideoAnalyzer:
    """Main class for cricket video analysis."""

    def __init__(self, config: CricketAnalysisConfig):
        self.config = config
        self.pose_detector = CricketPoseDetector()
        self.angle_calc = AngleCalculator()
        self.speed_estimator = SpeedEstimator(fps=config.fps)

        if config.analysis_type == AnalysisType.BOWLING:
            self.analyzer = BowlingAnalyzer(config.bowler_type)
            self.issue_detector = BowlingIssueDetector()
        elif config.analysis_type == AnalysisType.BATTING:
            self.analyzer = BattingAnalyzer(config.shot_type)
            self.issue_detector = BattingIssueDetector()
        elif config.analysis_type == AnalysisType.FIELDING:
            self.analyzer = FieldingAnalyzer()
            self.issue_detector = None

        self.injury_detector = InjuryRiskDetector()
        self.recommendation_engine = RecommendationEngine()

    def analyze_video(self, video_path: str) -> Dict:
        """Main entry point. Returns comprehensive analysis dict."""
        landmarks_sequence = self._extract_landmarks(video_path)
        actions = self._segment_actions(landmarks_sequence)

        action_analyses = []
        for action_frames in actions:
            analysis = self._analyze_action(action_frames)
            action_analyses.append(analysis)

        summary = self._generate_summary(action_analyses)
        recommendations = self.recommendation_engine.generate(summary, self.config.analysis_type)

        return {
            'analysisType': self.config.analysis_type.value,
            'overallScore': summary['overallScore'],
            'technicalGrade': self._calculate_grade(summary['overallScore']),
            'actions': action_analyses,
            'summary': summary,
            'recommendations': recommendations,
            'biomechanicalIssues': summary['allIssues'],
            'injuryRisks': summary['injuryRisks']
        }

    # ── Landmark extraction ──────────────────────────────────────────
    def _extract_landmarks(self, video_path: str) -> List[Dict]:
        cap = cv2.VideoCapture(video_path)
        all_landmarks = []
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            landmarks = self.pose_detector.detect(frame)
            if landmarks:
                all_landmarks.append({
                    'frame': frame_count,
                    'landmarks': landmarks,
                    'timestamp': frame_count / self.config.fps
                })
            frame_count += 1
        cap.release()
        return all_landmarks

    # ── Action segmentation ──────────────────────────────────────────
    def _segment_actions(self, landmarks_sequence):
        if self.config.analysis_type == AnalysisType.BOWLING:
            return self._segment_bowling_deliveries(landmarks_sequence)
        elif self.config.analysis_type == AnalysisType.BATTING:
            return self._segment_batting_shots(landmarks_sequence)
        else:
            return self._segment_fielding_actions(landmarks_sequence)

    def _segment_bowling_deliveries(self, landmarks):
        deliveries = []
        i = 0
        while i < len(landmarks):
            stride_frame = self._detect_delivery_stride(landmarks, i)
            if stride_frame is None:
                i += 1
                continue
            start_frame = self._find_runup_start(landmarks, stride_frame)
            end_frame = self._find_followthrough_end(landmarks, stride_frame)
            deliveries.append(landmarks[start_frame:end_frame + 1])
            i = end_frame + 10
        return deliveries

    def _detect_delivery_stride(self, landmarks, start_idx):
        window = landmarks[start_idx:min(start_idx + 60, len(landmarks))]
        for i, frame in enumerate(window):
            lm = frame['landmarks']
            if i > 5:
                prev_lm = window[i - 1]['landmarks']
                ankle_movement = self._calculate_movement(prev_lm[27], lm[27])
                prev_movements = [
                    self._calculate_movement(window[i - j - 1]['landmarks'][27], window[i - j]['landmarks'][27])
                    for j in range(1, 5)
                ]
                avg_prev = np.mean(prev_movements)
                if ankle_movement < 0.3 * avg_prev and avg_prev > 0.02:
                    return start_idx + i
        return None

    def _find_runup_start(self, landmarks, stride_frame):
        search_start = max(0, stride_frame - 90)
        for i in range(stride_frame - 1, search_start, -1):
            lm = landmarks[i]['landmarks']
            shoulder_mid = self._midpoint(lm[11], lm[12])
            hip_mid = self._midpoint(lm[23], lm[24])
            if self._angle_from_vertical(shoulder_mid, hip_mid) < 15:
                return i
        return search_start

    def _find_followthrough_end(self, landmarks, stride_frame):
        search_end = min(len(landmarks), stride_frame + 60)
        for i in range(stride_frame + 1, search_end):
            if i < len(landmarks) - 5:
                wrist = landmarks[i]['landmarks'][16]
                movements = []
                for j in range(1, 6):
                    if i + j < len(landmarks):
                        movements.append(self._calculate_movement(wrist, landmarks[i + j]['landmarks'][16]))
                if movements and np.mean(movements) < 0.01:
                    return i
        return search_end - 1

    # ── Single-action analysis ───────────────────────────────────────
    def _analyze_action(self, action_frames):
        if self.config.analysis_type == AnalysisType.BOWLING:
            return self._analyze_bowling_delivery(action_frames)
        elif self.config.analysis_type == AnalysisType.BATTING:
            return self._analyze_batting_shot(action_frames)
        else:
            return {'score': 0, 'issues': []}

    def _analyze_bowling_delivery(self, frames):
        phases = self._segment_bowling_phases(frames)
        measurements = self._measure_bowling_biomechanics(frames, phases)
        issues = self.issue_detector.detect(frames, phases, measurements)
        legality = self._check_bowling_legality(measurements)
        speed = self.speed_estimator.estimate_bowling_speed(frames, phases['release'], self.config.bowler_type)
        score = self._calculate_bowling_score(measurements, issues, legality)
        return {
            'score': score,
            'phases': phases,
            'measurements': measurements,
            'issues': issues,
            'legality': legality,
            'estimatedSpeed': speed
        }

    def _segment_bowling_phases(self, frames):
        total = len(frames)
        stride = self._find_stride_in_sequence(frames)
        release = self._find_release_point(frames, stride)
        gather = self._find_gather_start(frames, stride)
        return {
            'runUp': {'startFrame': 0, 'endFrame': gather, 'name': 'Run-up'},
            'loading': {'startFrame': gather, 'endFrame': max(0, stride - 5), 'name': 'Loading Phase'},
            'deliveryStride': {'startFrame': max(0, stride - 5), 'endFrame': min(total - 1, stride + 5), 'name': 'Delivery Stride'},
            'release': {'startFrame': max(0, release - 3), 'endFrame': min(total - 1, release + 3), 'name': 'Release'},
            'followThrough': {'startFrame': min(total - 1, release + 3), 'endFrame': total - 1, 'name': 'Follow-through'}
        }

    def _measure_bowling_biomechanics(self, frames, phases):
        measurements = {}
        release_idx = min(phases['release']['startFrame'] + 3, len(frames) - 1)
        lm = frames[release_idx]['landmarks']

        shoulder_height = (lm[11]['y'] + lm[12]['y']) / 2
        measurements['releaseHeight'] = {'value': 2.0 - (shoulder_height * 2.0), 'unit': 'meters'}

        arm_angle = self.angle_calc.calculate_angle_from_vertical(lm[12], lm[16])
        measurements['armAngle'] = {'value': arm_angle, 'type': self._classify_arm_angle(arm_angle), 'unit': 'degrees'}

        elbow_flexion = self._measure_elbow_flexion(frames, phases)
        measurements['elbowFlexion'] = {
            'atCocking': elbow_flexion['cocking'], 'atRelease': elbow_flexion['release'],
            'maxFlexion': elbow_flexion['max'], 'legal': elbow_flexion['max'] < 15
        }

        stride_idx = min(phases['deliveryStride']['startFrame'] + 5, len(frames) - 1)
        front_foot = frames[stride_idx]['landmarks'][27]
        measurements['frontFootLanding'] = {'distanceFromCrease': 0.1, 'legal': True, 'angle': 0}
        measurements['hipRotation'] = {'value': self._measure_hip_rotation(frames, phases), 'unit': 'degrees'}
        measurements['shoulderAlignment'] = {'value': self._measure_shoulder_alignment(frames, phases),
                                              'alignment': 'chest_on' if self._measure_shoulder_alignment(frames, phases) < 30 else 'side_on'}
        stride_length = self._measure_stride_length(frames, phases)
        measurements['strideLength'] = {'value': stride_length, 'unit': 'meters',
                                         'rating': 'optimal' if stride_length > 1.2 else 'short'}
        return measurements

    def _measure_elbow_flexion(self, frames, phases):
        flexions = []
        start = phases['loading']['startFrame']
        end = min(phases['release']['endFrame'], len(frames))
        for frame in frames[start:end]:
            lm = frame['landmarks']
            angle = self.angle_calc.calculate_3point_angle(lm[12], lm[14], lm[16])
            flexions.append(180 - angle)
        if not flexions:
            return {'cocking': 0, 'release': 0, 'max': 0, 'straightening': 0}
        cocking = np.max(flexions[:max(1, len(flexions) // 2)])
        release = flexions[-3] if len(flexions) >= 3 else flexions[-1]
        mx = np.max(flexions)
        return {'cocking': float(cocking), 'release': float(release), 'max': float(mx), 'straightening': float(mx - release)}

    def _check_bowling_legality(self, measurements):
        legality = {
            'frontFootLegal': measurements['frontFootLanding']['legal'],
            'armActionLegal': measurements['elbowFlexion']['legal'],
            'heightLegal': True, 'overallLegal': False, 'warnings': []
        }
        if not legality['armActionLegal']:
            legality['warnings'].append(f"Elbow flexion of {measurements['elbowFlexion']['maxFlexion']:.1f}° exceeds 15°")
        if not legality['frontFootLegal']:
            legality['warnings'].append("Front foot beyond crease (no-ball)")
        legality['overallLegal'] = legality['frontFootLegal'] and legality['armActionLegal'] and legality['heightLegal']
        return legality

    def _calculate_bowling_score(self, measurements, issues, legality):
        score = 100
        if not legality['armActionLegal']: score -= 30
        if not legality['frontFootLegal']: score -= 20
        for issue in issues:
            s = issue.get('severity', 'low')
            score -= {'critical': 15, 'high': 10, 'medium': 5}.get(s, 2)
        if measurements['elbowFlexion']['max'] < 5: score += 5
        if measurements['hipRotation']['value'] > 60: score += 5
        return max(0, min(100, score))

    # ── Helpers ──────────────────────────────────────────────────────
    def _calculate_movement(self, p1, p2):
        return float(np.sqrt((p2['x'] - p1['x'])**2 + (p2['y'] - p1['y'])**2 + (p2.get('z', 0) - p1.get('z', 0))**2))

    def _midpoint(self, p1, p2):
        return {'x': (p1['x'] + p2['x']) / 2, 'y': (p1['y'] + p2['y']) / 2, 'z': (p1.get('z', 0) + p2.get('z', 0)) / 2}

    def _angle_from_vertical(self, p1, p2):
        return float(np.degrees(np.arctan2(abs(p2['x'] - p1['x']), abs(p2['y'] - p1['y']))))

    def _classify_arm_angle(self, angle):
        if angle < 30: return "over_the_top"
        elif angle < 60: return "high_arm"
        elif angle < 90: return "round_arm"
        else: return "sling_arm"

    def _calculate_grade(self, score):
        if score >= 95: return "A+"
        elif score >= 90: return "A"
        elif score >= 85: return "B+"
        elif score >= 80: return "B"
        elif score >= 75: return "C+"
        elif score >= 70: return "C"
        elif score >= 60: return "D"
        else: return "F"

    def _find_stride_in_sequence(self, frames): return max(0, len(frames) // 2)
    def _find_release_point(self, frames, stride): return min(len(frames) - 1, stride + 5)
    def _find_gather_start(self, frames, stride): return max(0, stride - 15)
    def _measure_hip_rotation(self, frames, phases): return 75
    def _measure_shoulder_alignment(self, frames, phases): return 45
    def _measure_stride_length(self, frames, phases): return 1.3
    def _segment_fielding_actions(self, landmarks): return []

    # ══════════════════════════════════════════════════════════════════
    #  BATTING ANALYSIS
    # ══════════════════════════════════════════════════════════════════

    def _segment_batting_shots(self, landmarks):
        """
        Segment batting video into individual shots.
        Detection: look for rapid wrist acceleration (bat swing),
        then find the stance start before and follow-through after.
        """
        if len(landmarks) < 10:
            # Too short — treat entire clip as one shot
            return [landmarks] if landmarks else []

        shots = []
        i = 0
        while i < len(landmarks):
            swing_frame = self._detect_bat_swing(landmarks, i)
            if swing_frame is None:
                i += 1
                continue
            # Go backward to find stance / trigger
            start = self._find_stance_start(landmarks, swing_frame)
            # Go forward to find follow-through end
            end = self._find_batting_followthrough_end(landmarks, swing_frame)
            shots.append(landmarks[start:end + 1])
            i = end + 10

        # Fallback: if no swing detected, treat entire video as one shot
        if not shots and landmarks:
            shots = [landmarks]
        return shots

    def _detect_bat_swing(self, landmarks, start_idx):
        """Detect rapid wrist movement indicating a bat swing."""
        window = landmarks[start_idx:min(start_idx + 90, len(landmarks))]
        for i in range(6, len(window)):
            lm = window[i]['landmarks']
            prev_lm = window[i - 1]['landmarks']
            # Right wrist (16) acceleration for right-handed batsman
            wrist_move = self._calculate_movement(prev_lm[16], lm[16])
            prev_moves = [
                self._calculate_movement(
                    window[i - j - 1]['landmarks'][16],
                    window[i - j]['landmarks'][16]
                ) for j in range(1, min(5, i))
            ]
            avg_prev = np.mean(prev_moves) if prev_moves else 0
            # Swing = sudden spike in wrist speed
            if wrist_move > 2.5 * avg_prev and avg_prev > 0.005:
                return start_idx + i
        return None

    def _find_stance_start(self, landmarks, swing_frame):
        """Go backward from swing to find the still stance."""
        search_start = max(0, swing_frame - 60)
        for i in range(swing_frame - 1, search_start, -1):
            lm = landmarks[i]['landmarks']
            # Check if body is upright and still
            shoulder_mid = self._midpoint(lm[11], lm[12])
            hip_mid = self._midpoint(lm[23], lm[24])
            if self._angle_from_vertical(shoulder_mid, hip_mid) < 12:
                return i
        return search_start

    def _find_batting_followthrough_end(self, landmarks, swing_frame):
        """Find end of batting follow-through."""
        search_end = min(len(landmarks), swing_frame + 45)
        for i in range(swing_frame + 1, search_end):
            if i < len(landmarks) - 5:
                wrist = landmarks[i]['landmarks'][16]
                movements = []
                for j in range(1, 6):
                    if i + j < len(landmarks):
                        movements.append(self._calculate_movement(wrist, landmarks[i + j]['landmarks'][16]))
                if movements and np.mean(movements) < 0.008:
                    return i
        return search_end - 1

    def _analyze_batting_shot(self, frames):
        """Full batting shot analysis — mirrors the bowling analysis depth."""
        phases = self._segment_batting_phases(frames)
        measurements = self._measure_batting_biomechanics(frames, phases)
        issues = self.issue_detector.detect(frames, phases, measurements)
        score = self._calculate_batting_score(measurements, issues)
        return {
            'score': score,
            'phases': phases,
            'measurements': measurements,
            'issues': issues,
        }

    def _segment_batting_phases(self, frames):
        """Segment a batting shot into 5 phases."""
        n = len(frames)
        # Use proportional splits as heuristic
        trigger = max(0, int(n * 0.15))
        backlift_end = max(trigger + 1, int(n * 0.35))
        impact = max(backlift_end + 1, int(n * 0.55))
        followthrough_start = max(impact + 1, int(n * 0.65))
        return {
            'stance':       {'startFrame': 0,                 'endFrame': trigger,            'name': 'Stance & Trigger'},
            'backlift':     {'startFrame': trigger,            'endFrame': backlift_end,       'name': 'Backlift'},
            'downswing':    {'startFrame': backlift_end,       'endFrame': impact,             'name': 'Downswing'},
            'impact':       {'startFrame': impact - 2,         'endFrame': min(n - 1, impact + 2), 'name': 'Impact'},
            'followThrough':{'startFrame': followthrough_start,'endFrame': n - 1,              'name': 'Follow-through'},
        }

    def _measure_batting_biomechanics(self, frames, phases):
        """Measure key batting biomechanical parameters."""
        measurements = {}

        # ── 1. Backlift angle ────────────────────────────────────────
        bl_end = min(phases['backlift']['endFrame'], len(frames) - 1)
        lm_bl = frames[bl_end]['landmarks']
        # Angle of wrist relative to shoulder from vertical
        backlift_angle = self.angle_calc.calculate_angle_from_vertical(lm_bl[12], lm_bl[16])
        measurements['backliftAngle'] = {
            'value': round(float(backlift_angle), 1),
            'unit': 'degrees',
            'rating': 'straight' if backlift_angle < 25 else ('angled' if backlift_angle < 50 else 'cross_bat')
        }

        # ── 2. Bat swing speed (wrist angular velocity) ──────────────
        ds_start = phases['downswing']['startFrame']
        ds_end = phases['downswing']['endFrame']
        if ds_end > ds_start and ds_end < len(frames):
            wrist_start = frames[ds_start]['landmarks'][16]
            wrist_end = frames[min(ds_end, len(frames) - 1)]['landmarks'][16]
            shoulder = frames[ds_start]['landmarks'][12]
            a1 = np.degrees(np.arctan2(wrist_start['y'] - shoulder['y'], wrist_start['x'] - shoulder['x']))
            a2 = np.degrees(np.arctan2(wrist_end['y'] - shoulder['y'], wrist_end['x'] - shoulder['x']))
            ang_vel = abs(a2 - a1) / max(1, ds_end - ds_start)
            swing_speed = ang_vel * 3.0 * self.config.fps / 10
        else:
            swing_speed = 0
        measurements['batSwingSpeed'] = {
            'value': round(float(swing_speed), 1),
            'unit': 'deg/s (scaled)',
            'rating': 'fast' if swing_speed > 80 else ('medium' if swing_speed > 40 else 'slow')
        }

        # ── 3. Head position at impact ───────────────────────────────
        impact_idx = min(phases['impact']['startFrame'] + 2, len(frames) - 1)
        lm_imp = frames[impact_idx]['landmarks']
        nose = lm_imp[0]
        hip_mid = self._midpoint(lm_imp[23], lm_imp[24])
        head_lean = abs(nose['x'] - hip_mid['x'])
        measurements['headPosition'] = {
            'value': round(float(head_lean), 4),
            'stable': head_lean < 0.08,
            'description': 'Eyes over the ball' if head_lean < 0.08 else 'Head falling away'
        }

        # ── 4. Front foot movement ───────────────────────────────────
        stance_lm = frames[0]['landmarks']
        impact_lm = frames[impact_idx]['landmarks']
        front_foot_move = self._calculate_movement(stance_lm[27], impact_lm[27])
        measurements['frontFootMovement'] = {
            'value': round(float(front_foot_move), 4),
            'rating': 'good_stride' if front_foot_move > 0.05 else 'planted'
        }

        # ── 5. Elbow angle at impact (top hand) ──────────────────────
        elbow_angle = self.angle_calc.calculate_3point_angle(
            lm_imp[12], lm_imp[14], lm_imp[16]  # shoulder-elbow-wrist
        )
        measurements['elbowAngle'] = {
            'value': round(float(elbow_angle), 1),
            'unit': 'degrees',
            'rating': 'good' if elbow_angle > 140 else 'bent'
        }

        # ── 6. Hip rotation ──────────────────────────────────────────
        hip_l_start = frames[ds_start]['landmarks'][23]
        hip_r_start = frames[ds_start]['landmarks'][24]
        hip_l_end = frames[min(ds_end, len(frames) - 1)]['landmarks'][23]
        hip_r_end = frames[min(ds_end, len(frames) - 1)]['landmarks'][24]
        start_angle = np.degrees(np.arctan2(hip_l_start['y'] - hip_r_start['y'], hip_l_start['x'] - hip_r_start['x']))
        end_angle = np.degrees(np.arctan2(hip_l_end['y'] - hip_r_end['y'], hip_l_end['x'] - hip_r_end['x']))
        hip_rotation = abs(end_angle - start_angle)
        measurements['hipRotation'] = {
            'value': round(float(hip_rotation), 1),
            'unit': 'degrees',
            'rating': 'good' if hip_rotation > 20 else 'limited'
        }

        return measurements

    def _calculate_batting_score(self, measurements, issues):
        """Calculate batting shot score (0-100)."""
        score = 100

        # Deduct for issues
        for issue in issues:
            s = issue.get('severity', 'low')
            score -= {'critical': 15, 'high': 10, 'medium': 5}.get(s, 2)

        # Deduct for bad head position
        if not measurements.get('headPosition', {}).get('stable', True):
            score -= 10

        # Deduct for bent elbow
        if measurements.get('elbowAngle', {}).get('rating') == 'bent':
            score -= 8

        # Deduct for cross-bat backlift
        if measurements.get('backliftAngle', {}).get('rating') == 'cross_bat':
            score -= 10

        # Bonus for good hip rotation
        if measurements.get('hipRotation', {}).get('rating') == 'good':
            score += 5

        # Bonus for fast bat speed
        if measurements.get('batSwingSpeed', {}).get('rating') == 'fast':
            score += 5

        return max(0, min(100, score))

    def _generate_summary(self, analyses):
        if not analyses:
            return {'overallScore': 0, 'allIssues': [], 'injuryRisks': []}
        return {
            'overallScore': round(float(np.mean([a.get('score', 0) for a in analyses])), 1),
            'allIssues': sum([a.get('issues', []) for a in analyses], []),
            'injuryRisks': []
        }
