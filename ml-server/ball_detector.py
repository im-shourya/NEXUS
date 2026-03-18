from ultralytics import YOLO
import cv2

class BallDetector:
    """
    Wrapper around YOLOv8 to detect and track a football.
    """
    def __init__(self, model_path='yolov8n.pt', confidence_threshold=0.3):
        # Load YOLOv8 nano model by default. It will download automatically if not present.
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        # COCO class 32 corresponds to 'sports ball'
        self.ball_class_id = 32

    def detect(self, frame):
        """
        Runs YOLOv8 object detection on a given frame.
        Returns the bounding box coordinates of the ball if found, else None.
        Format: (x1, y1, x2, y2, confidence)
        """
        results = self.model(frame, verbose=False)
        
        best_ball_bbox = None
        max_conf = 0.0

        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Class ID
                cls_id = int(box.cls[0].item())
                conf = box.conf[0].item()
                
                if cls_id == self.ball_class_id and conf > self.confidence_threshold:
                    if conf > max_conf:
                        max_conf = conf
                        # x1, y1, x2, y2 format
                        coords = box.xyxy[0].cpu().numpy()
                        best_ball_bbox = (int(coords[0]), int(coords[1]), 
                                          int(coords[2]), int(coords[3]), conf)

        return best_ball_bbox

    def get_ball_center(self, bbox):
        """
        Calculates the center (x,y) of a bounding box.
        """
        if bbox is None:
            return None
        
        x1, y1, x2, y2, _ = bbox
        cx = int((x1 + x2) / 2)
        cy = int((y1 + y2) / 2)
        return (cx, cy)

    def draw_ball(self, frame, bbox):
        """
        Draws a bounding box and dot around the detected ball.
        """
        if bbox is not None:
            x1, y1, x2, y2, conf = bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 105, 180), 2)
            cv2.putText(frame, f"Ball {conf:.2f}", (x1, max(y1-10, 0)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 105, 180), 2)
            
            # Draw center point
            cx, cy = self.get_ball_center(bbox)
            cv2.circle(frame, (cx, cy), 4, (0, 0, 255), -1)

        return frame
