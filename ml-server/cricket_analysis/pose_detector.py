import cv2
import numpy as np
import os
import urllib.request
from typing import Dict, Optional

# ── Try old API first, fall back to new Tasks API ────────────────────
_USE_LEGACY = False
try:
    import mediapipe as mp
    # Quick check: does .solutions.pose exist?
    _pose_cls = mp.solutions.pose.Pose
    _USE_LEGACY = True
except (AttributeError, ImportError):
    _USE_LEGACY = False


# Where to cache the downloaded model
_MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
_MODEL_PATH = os.path.join(_MODEL_DIR, 'pose_landmarker_heavy.task')
_MODEL_URL = (
    'https://storage.googleapis.com/mediapipe-models/'
    'pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task'
)


def _ensure_model():
    """Download the PoseLandmarker model if not already cached."""
    if os.path.exists(_MODEL_PATH):
        return
    os.makedirs(_MODEL_DIR, exist_ok=True)
    print(f"  [Downloading pose model → {_MODEL_PATH}] ...")
    urllib.request.urlretrieve(_MODEL_URL, _MODEL_PATH)
    print("  [Download complete]")


class CricketPoseDetector:
    """
    Wrapper around MediaPipe Pose.
    Automatically uses the legacy `mp.solutions.pose` API on older mediapipe
    or the new Tasks-based `PoseLandmarker` API on mediapipe ≥ 0.10.14.
    """

    def __init__(self, min_detection_confidence: float = 0.5,
                 min_tracking_confidence: float = 0.5):

        self._legacy = _USE_LEGACY
        self._frame_ts = 0  # monotonic timestamp for VIDEO mode

        if self._legacy:
            # ---------- OLD API ----------
            self._pose = mp.solutions.pose.Pose(
                static_image_mode=False,
                model_complexity=1,
                smooth_landmarks=True,
                min_detection_confidence=min_detection_confidence,
                min_tracking_confidence=min_tracking_confidence,
            )
        else:
            # ---------- NEW TASKS API ----------
            _ensure_model()
            import mediapipe as mp2
            from mediapipe.tasks import python as mp_tasks
            from mediapipe.tasks.python import vision as mp_vision

            base_options = mp_tasks.BaseOptions(
                model_asset_path=_MODEL_PATH
            )
            options = mp_vision.PoseLandmarkerOptions(
                base_options=base_options,
                running_mode=mp_vision.RunningMode.VIDEO,
                num_poses=1,
                min_pose_detection_confidence=min_detection_confidence,
                min_pose_presence_confidence=min_tracking_confidence,
            )
            self._landmarker = mp_vision.PoseLandmarker.create_from_options(options)
            self._mp = mp2

    # ─────────────────────────────────────────────────────────
    def detect(self, image: np.ndarray) -> Optional[Dict[int, Dict[str, float]]]:
        """
        Detect pose in a BGR frame.
        Returns {landmark_index: {x, y, z, visibility}} or None.
        """
        if self._legacy:
            return self._detect_legacy(image)
        else:
            return self._detect_tasks(image)

    # ---------- legacy path ----------
    def _detect_legacy(self, image):
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self._pose.process(rgb)
        if not results.pose_landmarks:
            return None
        landmarks = {}
        for idx, lm in enumerate(results.pose_landmarks.landmark):
            landmarks[idx] = {
                'x': lm.x, 'y': lm.y, 'z': lm.z,
                'visibility': lm.visibility
            }
        return landmarks

    # ---------- tasks path ----------
    def _detect_tasks(self, image):
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        mp_image = self._mp.Image(
            image_format=self._mp.ImageFormat.SRGB, data=rgb
        )
        self._frame_ts += 33  # ≈ 30 fps in ms

        result = self._landmarker.detect_for_video(mp_image, self._frame_ts)

        if not result.pose_landmarks or len(result.pose_landmarks) == 0:
            return None

        pose = result.pose_landmarks[0]  # first person
        landmarks = {}
        for idx, lm in enumerate(pose):
            landmarks[idx] = {
                'x': lm.x, 'y': lm.y, 'z': lm.z,
                'visibility': lm.visibility
            }
        return landmarks
