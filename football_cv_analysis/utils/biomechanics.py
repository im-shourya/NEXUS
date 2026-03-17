import numpy as np

def calculate_angle(a, b, c):
    """
    Calculates the 2D angle (in degrees) formed by three points A, B, C with B as the vertex.
    Points are provided as (x,y) tuples.
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    # Calculate vectors
    ba = a - b
    bc = c - b
    
    # Cosine rule and clip to valid ranges floating point errors might introduce
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    
    angle = np.arccos(cosine_angle)
    
    # Return angle in degrees
    return np.degrees(angle)

def calculate_distance(a, b):
    """
    Calculates the Euclidean distance between point A and point B.
    Points are (x,y) tuples.
    """
    a = np.array(a)
    b = np.array(b)
    return np.linalg.norm(a - b)

def calculate_lean_angle(shoulder, hip):
    """
    Calculates the leaning forward angle given shoulder and hip keypoints.
    Treats straight vertical alignment (hip explicitly above foot usually) as 0 degrees.
    Angle is calculated relative to the vertical axis.
    """
    # Vector from hip to shoulder
    shoulder = np.array(shoulder)
    hip = np.array(hip)
    
    dx = shoulder[0] - hip[0]
    dy = shoulder[1] - hip[1]
    
    # Arc tangent 2 computes angle with respect to X axis by default.
    # To get deviation from straight vertical (y-axis straight down is +dy in img coordinates, 
    # but here hip is below shoulder so shoulder y < hip y)
    
    if dy == 0:
        return 90.0 # completely horizontal
    
    # Compute absolute lean angle away from straight vertical.
    # We just want the angle against the Y axis: tan(theta) = dx/dy
    angle_rad = np.arctan2(abs(dx), abs(dy))
    lean_angle_deg = np.degrees(angle_rad)
    
    return float(lean_angle_deg)
