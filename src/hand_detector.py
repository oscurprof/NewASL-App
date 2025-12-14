"""
Hand detection module using MediaPipe
Detects whether a hand is present in the frame
"""
import cv2
import mediapipe as mp
import numpy as np
from typing import Optional, Tuple, Dict

class HandDetector:
    """Detects hands in images using MediaPipe"""
    
    def __init__(self, 
                 detection_confidence: float = 0.6,
                 tracking_confidence: float = 0.5,
                 max_num_hands: int = 1):
        """
        Initialize hand detector
        
        Args:
            detection_confidence: Minimum confidence for hand detection
            tracking_confidence: Minimum tracking confidence
            max_num_hands: Maximum number of hands to detect
        """
        self.detection_confidence = detection_confidence
        self.tracking_confidence = tracking_confidence
        self.max_num_hands = max_num_hands
        
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Create hands detector
        # Use static_image_mode=True for better detection on static images
        self.hands = self.mp_hands.Hands(
            static_image_mode=True,  # Better for static images/frozen frames
            max_num_hands=self.max_num_hands,
            min_detection_confidence=self.detection_confidence,
            min_tracking_confidence=self.tracking_confidence
        )
        
        self.hand_detected = False
        self.hand_landmarks = None
        
    def detect(self, image: np.ndarray) -> Tuple[bool, Optional[any]]:
        """
        Detect hand in image
        
        Args:
            image: Input image (BGR format)
        
        Returns:
            Tuple of (hand_detected: bool, hand_landmarks: Optional[any])
        """
        # Convert BGR to RGB
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process image
        results = self.hands.process(rgb_image)
        
        # Check if hand is detected
        if results.multi_hand_landmarks:
            self.hand_detected = True
            self.hand_landmarks = results.multi_hand_landmarks[0]  # Get first hand
            return True, self.hand_landmarks
        else:
            self.hand_detected = False
            self.hand_landmarks = None
            return False, None
    
    def get_hand_bbox(self, image: np.ndarray, padding: float = 0.2) -> Optional[Tuple[int, int, int, int]]:
        """
        Get bounding box of detected hand
        
        Args:
            image: Input image
            padding: Padding around hand (fraction)
        
        Returns:
            Bounding box (x1, y1, x2, y2) or None
        """
        if not self.hand_detected or self.hand_landmarks is None:
            return None
        
        h, w = image.shape[:2]
        
        # Get coordinates
        x_coords = [lm.x for lm in self.hand_landmarks.landmark]
        y_coords = [lm.y for lm in self.hand_landmarks.landmark]
        
        x_min, x_max = min(x_coords), max(x_coords)
        y_min, y_max = min(y_coords), max(y_coords)
        
        # Add padding
        width = x_max - x_min
        height = y_max - y_min
        x_min = max(0, x_min - width * padding)
        x_max = min(1, x_max + width * padding)
        y_min = max(0, y_min - height * padding)
        y_max = min(1, y_max + height * padding)
        
        # Convert to pixels
        x1, y1 = int(x_min * w), int(y_min * h)
        x2, y2 = int(x_max * w), int(y_max * h)
        
        return (x1, y1, x2, y2)
    
    def crop_hand_region(self, image: np.ndarray, padding: float = 0.2) -> Optional[np.ndarray]:
        """
        Crop hand region from image
        
        Args:
            image: Input image
            padding: Padding around hand
        
        Returns:
            Cropped hand region or None
        """
        bbox = self.get_hand_bbox(image, padding)
        if bbox is None:
            return None
        
        x1, y1, x2, y2 = bbox
        cropped = image[y1:y2, x1:x2]
        
        return cropped if cropped.size > 0 else None
    
    def draw_landmarks(self, image: np.ndarray) -> np.ndarray:
        """
        Draw hand landmarks on image
        
        Args:
            image: Input image
        
        Returns:
            Annotated image
        """
        if not self.hand_detected or self.hand_landmarks is None:
            return image
        
        annotated = image.copy()
        self.mp_drawing.draw_landmarks(
            annotated,
            self.hand_landmarks,
            self.mp_hands.HAND_CONNECTIONS,
            self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
            self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
        )
        return annotated
    
    def draw_bbox(self, image: np.ndarray, color: Tuple[int, int, int] = (0, 255, 0)) -> np.ndarray:
        """
        Draw bounding box around detected hand
        
        Args:
            image: Input image
            color: Box color (BGR)
        
        Returns:
            Image with bounding box
        """
        bbox = self.get_hand_bbox(image)
        if bbox is None:
            return image
        
        annotated = image.copy()
        x1, y1, x2, y2 = bbox
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
        cv2.putText(annotated, "Hand Detected", (x1, y1 - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        return annotated
    
    def get_detection_info(self) -> Dict:
        """
        Get information about current detection
        
        Returns:
            Dictionary with detection info
        """
        return {
            'hand_detected': self.hand_detected,
            'has_landmarks': self.hand_landmarks is not None,
            'num_landmarks': len(self.hand_landmarks.landmark) if self.hand_landmarks else 0
        }
    
    def close(self):
        """Release resources"""
        if self.hands is not None:
            try:
                self.hands.close()
            except Exception:
                pass  # Ignore cleanup errors
    
    def __del__(self):
        """Destructor"""
        try:
            self.close()
        except Exception:
            pass  # Ignore cleanup errors
