"""
Landmark-based ASL Alphabet Classifier using TFLite
Uses hand landmarks from MediaPipe to predict ASL letters A-Z
Mobile-ready TFLite model for React Native deployment
"""

import numpy as np
import tensorflow as tf
from pathlib import Path
from typing import Tuple, List, Optional

class LandmarkClassifier:
    """
    ASL Alphabet classifier using hand landmarks with TFLite model
    Optimized for mobile deployment
    """
    
    def __init__(self, model_path: str, confidence_threshold: float = 0.6):
        """
        Initialize landmark classifier
        
        Args:
            model_path: Path to trained TFLite model (.tflite file)
            confidence_threshold: Minimum confidence for predictions
        """
        self.model_path = Path(model_path)
        self.confidence_threshold = confidence_threshold
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.class_labels = None  # Will be loaded from .txt file
        
        self._load_model()
        self._load_class_labels()
    
    def _load_model(self):
        """Load the TFLite model"""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model not found at {self.model_path}\n"
                f"Please train the model first using: python train_landmark_model.py"
            )
        
        print(f"Loading TFLite landmark classifier from {self.model_path}...")
        
        # Load TFLite model
        self.interpreter = tf.lite.Interpreter(model_path=str(self.model_path))
        self.interpreter.allocate_tensors()
        
        # Get input and output details
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        
        print(f"✅ TFLite landmark classifier loaded successfully!")
        print(f"   Input shape: {self.input_details[0]['shape']}")
        print(f"   Output shape: {self.output_details[0]['shape']}")
    
    def _load_class_labels(self):
        """Load class labels from .txt file"""
        labels_path = self.model_path.with_suffix('.txt')
        
        if labels_path.exists():
            with open(labels_path, 'r') as f:
                self.class_labels = [line.strip() for line in f.readlines()]
            print(f"✅ Loaded {len(self.class_labels)} class labels: {self.class_labels}")
        else:
            # Fallback to A-Z if labels file not found
            self.class_labels = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
            print(f"⚠️  Labels file not found, using default A-Z")
    
    def normalize_landmarks(self, landmarks: np.ndarray) -> np.ndarray:
        """
        Normalize landmarks to be wrist-relative and scale-invariant
        
        Args:
            landmarks: Array of shape (63,) - [x1,y1,z1, ..., x21,y21,z21]
        
        Returns:
            Normalized landmarks
        """
        landmarks = landmarks.copy()
        
        # Reshape to (21, 3)
        landmarks_reshaped = landmarks.reshape(21, 3)
        
        # Get wrist position (landmark 0)
        wrist = landmarks_reshaped[0:1, :]  # Shape: (1, 3)
        
        # Make all landmarks relative to wrist
        landmarks_reshaped = landmarks_reshaped - wrist
        
        # Calculate hand size (max distance from wrist)
        distances = np.linalg.norm(landmarks_reshaped, axis=1)  # Shape: (21,)
        hand_size = np.max(distances)
        
        # Avoid division by zero
        hand_size = max(hand_size, 1e-6)
        
        # Normalize by hand size
        landmarks_reshaped = landmarks_reshaped / hand_size
        
        # Reshape back to (63,)
        return landmarks_reshaped.reshape(63)
    
    def landmarks_to_features(self, hand_landmarks) -> Optional[np.ndarray]:
        """
        Convert MediaPipe hand landmarks to feature array
        
        Args:
            hand_landmarks: MediaPipe hand landmarks object
        
        Returns:
            Feature array of shape (63,) or None if invalid
        """
        if hand_landmarks is None:
            return None
        
        # Extract all 21 landmarks (x, y, z)
        features = []
        for landmark in hand_landmarks.landmark:
            features.extend([landmark.x, landmark.y, landmark.z])
        
        return np.array(features)
    
    def predict(self, hand_landmarks) -> Tuple[str, float]:
        """
        Predict ASL letter from hand landmarks
        
        Args:
            hand_landmarks: MediaPipe hand landmarks object
        
        Returns:
            Tuple of (predicted_letter, confidence)
        """
        # Convert landmarks to features
        features = self.landmarks_to_features(hand_landmarks)
        
        if features is None:
            return None, 0.0
        
        # Normalize features
        features = self.normalize_landmarks(features)
        
        # Reshape for TFLite: (1, 63) and convert to float32
        features = features.reshape(1, -1).astype(np.float32)
        
        # Set input tensor
        self.interpreter.set_tensor(self.input_details[0]['index'], features)
        
        # Run inference
        self.interpreter.invoke()
        
        # Get output tensor (probabilities)
        output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
        probabilities = output_data[0]
        
        # Get predicted class and confidence
        predicted_class_idx = np.argmax(probabilities)
        confidence = float(probabilities[predicted_class_idx])
        predicted_letter = self.class_labels[predicted_class_idx]
        
        return predicted_letter, confidence
    
    def predict_top_k(self, hand_landmarks, k: int = 3) -> List[Tuple[str, float]]:
        """
        Get top K predictions with confidence scores
        
        Args:
            hand_landmarks: MediaPipe hand landmarks object
            k: Number of top predictions to return
        
        Returns:
            List of (letter, confidence) tuples
        """
        # Convert landmarks to features
        features = self.landmarks_to_features(hand_landmarks)
        
        if features is None:
            return []
        
        # Normalize features
        features = self.normalize_landmarks(features)
        
        # Reshape for TFLite: (1, 63) and convert to float32
        features = features.reshape(1, -1).astype(np.float32)
        
        # Set input tensor
        self.interpreter.set_tensor(self.input_details[0]['index'], features)
        
        # Run inference
        self.interpreter.invoke()
        
        # Get output tensor (probabilities)
        output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
        probabilities = output_data[0]
        
        # Get top K indices
        top_k_indices = np.argsort(probabilities)[-k:][::-1]
        
        # Create list of (letter, confidence) tuples
        top_k_predictions = [
            (self.class_labels[idx], float(probabilities[idx]))
            for idx in top_k_indices
        ]
        
        return top_k_predictions
    
    def is_confident(self, confidence: float) -> bool:
        """
        Check if confidence meets threshold
        
        Args:
            confidence: Confidence score
        
        Returns:
            True if confident enough
        """
        return confidence >= self.confidence_threshold

# Test function
if __name__ == "__main__":
    import mediapipe as mp
    import cv2
    
    # Test with a sample image
    print("Testing TFLite Landmark Classifier...")
    
    # Initialize classifier
    try:
        classifier = LandmarkClassifier('models/asl_landmark_model.tflite')
        
        # Initialize MediaPipe
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.3
        )
        
        # Test with webcam or image
        print("\n✅ TFLite Classifier loaded successfully!")
        print(f"Confidence threshold: {classifier.confidence_threshold}")
        print("\nReady to process hand landmarks.")
        print("📱 This model is ready for React Native mobile deployment!")
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nPlease train the model first:")
        print("1. Extract landmarks: python extract_landmarks.py")
        print("2. Train TFLite model: python train_landmark_model.py")
