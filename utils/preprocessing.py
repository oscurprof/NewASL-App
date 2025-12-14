"""
Image preprocessing utilities for ASL model
"""
import cv2
import numpy as np
from typing import Tuple

def preprocess_image(image: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess image for model input
    
    Args:
        image: Input image (BGR format from OpenCV)
        target_size: Target size for the model (width, height)
    
    Returns:
        Preprocessed image ready for model input
    """
    # Resize image
    resized = cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)
    
    # Convert BGR to RGB
    rgb_image = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    
    # Normalize to [0, 1]
    normalized = rgb_image.astype(np.float32) / 255.0
    
    # Add batch dimension
    batched = np.expand_dims(normalized, axis=0)
    
    return batched


def preprocess_for_hand_detection(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for MediaPipe hand detection
    
    Args:
        image: Input image (BGR format from OpenCV)
    
    Returns:
        RGB image ready for MediaPipe
    """
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)


def crop_hand_region(image: np.ndarray, hand_landmarks, padding: float = 0.2) -> np.ndarray:
    """
    Crop the hand region from the image based on landmarks
    
    Args:
        image: Input image
        hand_landmarks: MediaPipe hand landmarks
        padding: Padding around hand region (fraction of width/height)
    
    Returns:
        Cropped hand region
    """
    h, w = image.shape[:2]
    
    # Get bounding box from landmarks
    x_coords = [lm.x for lm in hand_landmarks.landmark]
    y_coords = [lm.y for lm in hand_landmarks.landmark]
    
    x_min, x_max = min(x_coords), max(x_coords)
    y_min, y_max = min(y_coords), max(y_coords)
    
    # Add padding
    width = x_max - x_min
    height = y_max - y_min
    x_min = max(0, x_min - width * padding)
    x_max = min(1, x_max + width * padding)
    y_min = max(0, y_min - height * padding)
    y_max = min(1, y_max + height * padding)
    
    # Convert to pixel coordinates
    x1, y1 = int(x_min * w), int(y_min * h)
    x2, y2 = int(x_max * w), int(y_max * h)
    
    # Crop
    cropped = image[y1:y2, x1:x2]
    
    return cropped


def draw_hand_landmarks(image: np.ndarray, hand_landmarks, mp_hands, mp_drawing) -> np.ndarray:
    """
    Draw hand landmarks on image
    
    Args:
        image: Input image
        hand_landmarks: MediaPipe hand landmarks
        mp_hands: MediaPipe hands module
        mp_drawing: MediaPipe drawing utilities
    
    Returns:
        Image with drawn landmarks
    """
    annotated_image = image.copy()
    mp_drawing.draw_landmarks(
        annotated_image,
        hand_landmarks,
        mp_hands.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
        mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
    )
    return annotated_image
