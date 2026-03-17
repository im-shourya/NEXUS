import cv2

class Visualizer:
    """
    Handles drawing textual and graphical overlays of metrics onto video frames.
    """
    def __init__(self):
        self.font = cv2.FONT_HERSHEY_SIMPLEX
        self.font_scale = 0.6
        self.font_color = (255, 255, 255) # White
        self.bg_color = (0, 0, 0) # Black
        self.font_thickness = 2

    def draw_metrics(self, frame, metrics):
        """
        Draws the computed metrics on the top left corner of the frame.
        """
        if not metrics:
            return frame
        
        y_offset = 30
        x_offset = 20
        line_height = 30

        # Draw a semi-transparent background box for readability
        overlay = frame.copy()
        box_width = 300
        box_height = 20 + len(metrics) * line_height
        cv2.rectangle(overlay, (10, 10), (10 + box_width, 10 + box_height), self.bg_color, -1)
        
        # Alpha blending
        alpha = 0.6
        frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)

        for key, value in metrics.items():
            text = f"{key}: {value}"
            
            # Highlight Quality Score in a different color
            color = self.font_color
            if key == 'Quality Score':
                if value >= 90:
                    color = (0, 255, 0) # Green
                elif value >= 70:
                    color = (0, 255, 255) # Yellow
                else:
                    color = (0, 0, 255) # Red
            
            cv2.putText(
                frame, 
                text, 
                (x_offset, y_offset), 
                self.font, 
                self.font_scale, 
                color, 
                self.font_thickness, 
                cv2.LINE_AA
            )
            y_offset += line_height

        return frame

    def draw_status(self, frame, status_text):
        """
        Draws a large status message at the bottom of the screen.
        """
        h, w, _ = frame.shape
        cv2.putText(
            frame, 
            status_text, 
            (20, h - 30), 
            cv2.FONT_HERSHEY_DUPLEX, 
            1.0, 
            (0, 255, 255), 
            2, 
            cv2.LINE_AA
        )
        return frame
