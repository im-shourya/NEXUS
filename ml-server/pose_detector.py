import cv2
import mediapipe as mp
import numpy as np

class PoseDetector:
    """
    Wrapper around MediaPipe Pose to detect body keypoints in video frames.
    Uses the new Tasks Vision API.
    """
    def __init__(self, model_path='models/pose_landmarker_full.task'):
        BaseOptions = mp.tasks.BaseOptions
        PoseLandmarker = mp.tasks.vision.PoseLandmarker
        PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
        VisionRunningMode = mp.tasks.vision.RunningMode

        options = PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=model_path),
            running_mode=VisionRunningMode.VIDEO)
            
        self.landmarker = PoseLandmarker.create_from_options(options)

    def process_frame(self, frame, timestamp_ms):
        """
        Processes an RGB frame and extracts pose landmarks.
        Returns the processed frame, list of landmarks, and a dictionary of key keypoints.
        """
        # Convert BGR (OpenCV) to RGB (MediaPipe)
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
        
        # Process frame
        self.results = self.landmarker.detect_for_video(mp_image, int(timestamp_ms))

        landmarks_dict = {}
        landmarks_list = []
        
        if self.results and hasattr(self.results, 'pose_landmarks') and len(self.results.pose_landmarks) > 0:
            h, w, c = frame.shape
            
            # Tasks API returns a list of detections (we assume 1 person for now)
            pose_landmarks = self.results.pose_landmarks[0]
            
            for id, lm in enumerate(pose_landmarks):
                # Convert normalized coordinates to pixel coordinates
                cx, cy = int(lm.x * w), int(lm.y * h)
                
                # visibility / presence
                visibility = lm.visibility if hasattr(lm, 'visibility') else 1.0
                
                landmarks_list.append([id, cx, cy, visibility])
                
                # Hardcoded list since we removed solutions
                pose_landmark_names = [
                    'NOSE', 'LEFT_EYE_INNER', 'LEFT_EYE', 'LEFT_EYE_OUTER', 'RIGHT_EYE_INNER', 
                    'RIGHT_EYE', 'RIGHT_EYE_OUTER', 'LEFT_EAR', 'RIGHT_EAR', 'MOUTH_LEFT', 'MOUTH_RIGHT',
                    'LEFT_SHOULDER', 'RIGHT_SHOULDER', 'LEFT_ELBOW', 'RIGHT_ELBOW', 'LEFT_WRIST', 
                    'RIGHT_WRIST', 'LEFT_PINKY', 'RIGHT_PINKY', 'LEFT_INDEX', 'RIGHT_INDEX', 'LEFT_THUMB', 
                    'RIGHT_THUMB', 'LEFT_HIP', 'RIGHT_HIP', 'LEFT_KNEE', 'RIGHT_KNEE', 'LEFT_ANKLE', 
                    'RIGHT_ANKLE', 'LEFT_HEEL', 'RIGHT_HEEL', 'LEFT_FOOT_INDEX', 'RIGHT_FOOT_INDEX'
                ]
                
                if 0 <= id < len(pose_landmark_names):
                    landmark_name = pose_landmark_names[id]
                    landmarks_dict[landmark_name] = (cx, cy, visibility)

        return landmarks_list, landmarks_dict

    def draw_skeleton(self, frame):
        """
        Draws the pose skeleton onto the frame visually if landmarks were found.
        Done via native OpenCV since the tasks API does not package `mp.solutions.drawing_utils`.
        """
        if self.results and hasattr(self.results, 'pose_landmarks') and len(self.results.pose_landmarks) > 0:
            pose_landmarks = self.results.pose_landmarks[0]
            
            h, w, c = frame.shape
            
            # Draw Points
            points = {}
            for id, lm in enumerate(pose_landmarks):
                cx, cy = int(lm.x * w), int(lm.y * h)
                points[id] = (cx, cy)
                cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

            # Draw typical connections
            connections = [
                (11, 12), (11, 13), (12, 14), (13, 15), (14, 16), # upper body / arms
                (11, 23), (12, 24), (23, 24), # torso
                (23, 25), (24, 26), (25, 27), (26, 28), # legs
                (27, 29), (28, 30), (29, 31), (30, 32), (27, 31), (28, 32) # feet
            ]
            
            for p1, p2 in connections:
                if p1 in points and p2 in points:
                    cv2.line(frame, points[p1], points[p2], (0, 255, 0), 2)
            
        return frame

