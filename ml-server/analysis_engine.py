from utils.biomechanics import calculate_angle, calculate_distance, calculate_lean_angle

class AnalysisEngine:
    """
    Computes biomechanical metrics and technique characteristics for football form.
    """
    def __init__(self):
        # We can store temporal data across frames here
        self.history = []

    def evaluate_frame(self, landmarks_dict, ball_center):
        """
        Calculates metrics for a single frame.
        Input: MediaPipe landmarks dictionary (mapped by name), YOLOv8 ball center.
        Output: Dictionary of calculated metrics.
        """
        metrics = {}

        if not landmarks_dict:
            return metrics

        # Helper to get (x, y) coordinates
        def get_coords(name):
            if name in landmarks_dict:
                return landmarks_dict[name][:2]
            return None

        # Keypoints
        l_hip = get_coords('LEFT_HIP')
        l_knee = get_coords('LEFT_KNEE')
        l_ankle = get_coords('LEFT_ANKLE')
        l_heel = get_coords('LEFT_HEEL')
        l_foot_index = get_coords('LEFT_FOOT_INDEX')

        r_hip = get_coords('RIGHT_HIP')
        r_knee = get_coords('RIGHT_KNEE')
        r_ankle = get_coords('RIGHT_ANKLE')
        r_heel = get_coords('RIGHT_HEEL')
        r_foot_index = get_coords('RIGHT_FOOT_INDEX')
        
        l_shoulder = get_coords('LEFT_SHOULDER')
        r_shoulder = get_coords('RIGHT_SHOULDER')

        # 1. Knee Angle (e.g. Right leg kicking)
        if r_hip and r_knee and r_ankle:
            r_knee_angle = calculate_angle(r_hip, r_knee, r_ankle)
            metrics['Right Knee Angle'] = round(r_knee_angle, 1)

        if l_hip and l_knee and l_ankle:
            l_knee_angle = calculate_angle(l_hip, l_knee, l_ankle)
            metrics['Left Knee Angle'] = round(l_knee_angle, 1)

        # 2. Forward Lean Angle (approximated midpoint shoulder to midpoint hip)
        if l_shoulder and r_shoulder and l_hip and r_hip:
            mid_shoulder = ((l_shoulder[0] + r_shoulder[0])/2, (l_shoulder[1] + r_shoulder[1])/2)
            mid_hip = ((l_hip[0] + r_hip[0])/2, (l_hip[1] + r_hip[1])/2)
            lean_angle = calculate_lean_angle(mid_shoulder, mid_hip)
            metrics['Forward Lean'] = round(lean_angle, 1)

        # 3. Ball Proximity / Plant Foot Distance
        # Depending on the action (shooting, dribbling), we see how close the feet are to the ball.
        if ball_center:
            if l_ankle:
                dist_l = calculate_distance(l_ankle, ball_center)
                metrics['L-Foot Dist (px)'] = round(dist_l, 1)
            
            if r_ankle:
                dist_r = calculate_distance(r_ankle, ball_center)
                metrics['R-Foot Dist (px)'] = round(dist_r, 1)
                
            # If both feet visible, identify the plant foot (closest foot to ball on ground)
            if l_ankle and r_ankle:
                # Assuming simple threshold or closest distance logic to determine plant foot
                plant_foot_dist = min(dist_l, dist_r)
                metrics['Plant Foot Dist'] = round(plant_foot_dist, 1)

        # Calculate a pseudo "Shot Quality Score" or "Form Score" based on some heuristics
        metrics['Quality Score'] = self._calculate_quality_score(metrics)

        # Store in temporal history
        self.history.append(metrics)
        return metrics

    def _calculate_quality_score(self, metrics):
        score = 100
        
        # Heuristic 1: Optimal Lean angle for shooting is often slightly forward, around 15-25 degrees
        if 'Forward Lean' in metrics:
            lean = metrics['Forward Lean']
            if lean < 10 or lean > 35:
                score -= 10
            elif 15 <= lean <= 25:
                score += 5 # Excellent lean
                
        # Heuristic 2: Knee angle during windup should be tight, around 90-110
        # (Very simplified logic, real logic would look at temporal phases like windup vs follow-through)
        if 'Right Knee Angle' in metrics:
            angle = metrics['Right Knee Angle']
            if angle > 160: # Too straight
                score -= 5

        # Heuristic 3: Plant foot distance. For a good shot, plant foot should not be too far or too close.
        if 'Plant Foot Dist' in metrics:
            dist = metrics['Plant Foot Dist']
            # Scale depends on video resolution, this is a placeholder heuristic
            if dist > 300: # pixels
                score -= 15

        return max(0, min(100, score)) # clamp between 0 and 100

    def detect_issues(self, metrics):
        """
        Check a frame's metrics against biomechanical thresholds and return
        a list of issue dicts.  Each dict: {id, severity, title, description, body_part}
        """
        issues = []

        # --- Forward Lean ---
        if 'Forward Lean' in metrics:
            lean = metrics['Forward Lean']
            if lean > 35:
                issues.append({
                    "id": "excessive_forward_lean",
                    "severity": "high",
                    "title": "Excessive Forward Lean",
                    "description": (
                        f"Torso is leaning {lean:.1f}° forward — optimal range is 15-25°. "
                        "This can cause the shot to go over the crossbar."
                    ),
                    "body_part": "torso",
                })
            elif lean < 10:
                issues.append({
                    "id": "insufficient_forward_lean",
                    "severity": "medium",
                    "title": "Insufficient Forward Lean",
                    "description": (
                        f"Torso lean is only {lean:.1f}° — leaning slightly forward (15-25°) "
                        "helps keep the ball low and adds power."
                    ),
                    "body_part": "torso",
                })

        # --- Knee Angle ---
        if 'Right Knee Angle' in metrics:
            angle = metrics['Right Knee Angle']
            if angle > 160:
                issues.append({
                    "id": "knee_too_straight",
                    "severity": "medium",
                    "title": "Kicking Knee Too Straight",
                    "description": (
                        f"Right knee angle is {angle:.1f}° — a locked knee reduces "
                        "power and control. Aim for 90-130° during the wind-up."
                    ),
                    "body_part": "right_knee",
                })

        # --- Plant Foot Distance ---
        if 'Plant Foot Dist' in metrics:
            dist = metrics['Plant Foot Dist']
            if dist > 300:
                issues.append({
                    "id": "plant_foot_too_far",
                    "severity": "high",
                    "title": "Plant Foot Too Far From Ball",
                    "description": (
                        f"Plant foot is {dist:.0f}px from the ball — this is too far and "
                        "often leads to mishits or weak contact."
                    ),
                    "body_part": "plant_foot",
                })

        # --- Overall Quality ---
        if 'Quality Score' in metrics:
            score = metrics['Quality Score']
            if score < 50:
                issues.append({
                    "id": "low_quality_score",
                    "severity": "high",
                    "title": "Low Overall Quality Score",
                    "description": (
                        f"Form quality score is {score}/100 — multiple technique problems detected."
                    ),
                    "body_part": "general",
                })

        return issues

