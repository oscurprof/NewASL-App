"""
Combined pipeline: Hand Detection + ASL Landmark Classification
Uses MediaPipe hand detection + TFLite landmark classifier
"""
import os
import sys
import cv2
import numpy as np
from typing import Tuple, Optional, Dict
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from src.hand_detector import HandDetector
from src.landmark_classifier import LandmarkClassifier
from utils import config


class ASLPipeline:
    """Complete ASL recognition pipeline using landmark-based classification"""
    
    def __init__(self, 
                 model_path: Optional[str] = None,
                 hand_confidence: float = 0.6,
                 asl_confidence: float = 0.7):
        """
        Initialize ASL pipeline
        
        Args:
            model_path: Path to landmark model (if None, uses config default)
            hand_confidence: Confidence threshold for hand detection
            asl_confidence: Confidence threshold for ASL classification
        """
        print("Initializing ASL Recognition Pipeline...")
        
        # Initialize hand detector
        print("  Loading hand detector...")
        self.hand_detector = HandDetector(
            detection_confidence=hand_confidence,
            tracking_confidence=config.HAND_TRACKING_CONFIDENCE,
            max_num_hands=config.MAX_NUM_HANDS
        )
        print("  ✅ Hand detector ready")
        
        # Initialize landmark classifier
        print("  Loading landmark-based ASL classifier...")
        landmark_model_path = model_path or config.LANDMARK_MODEL_PATH
        
        if not Path(landmark_model_path).exists():
            raise FileNotFoundError(
                f"Landmark model not found at {landmark_model_path}\n"
                f"Please train the model first: python train_landmark_model.py"
            )
        
        self.landmark_classifier = LandmarkClassifier(
            model_path=landmark_model_path,
            confidence_threshold=asl_confidence
        )
        print("  ✅ Landmark classifier ready")
        print("\n🎯 Using LANDMARK-BASED classification (high accuracy!)\n")
        
        # State variables
        self.last_prediction = None
        self.last_confidence = 0.0
        self.hand_detected = False
        
        print("✅ Pipeline initialized successfully!\n")
    
    def process_frame(self, frame: np.ndarray, use_hand_detection: bool = True) -> Dict:
        """
        Process a single frame through the pipeline
        
        Args:
            frame: Input frame (BGR format)
            use_hand_detection: Whether to use MediaPipe hand detection (for image-based only)
        
        Returns:
            Dictionary with results
        """
        result = {
            'hand_detected': False,
            'predicted_letter': None,
            'confidence': 0.0,
            'message': 'No hand detected',
            'bbox': None,
            'annotated_frame': frame.copy()
        }
        
        # Detect hand with MediaPipe
        hand_detected, hand_landmarks = self.hand_detector.detect(frame)
        result['hand_detected'] = hand_detected
        
        if not hand_detected:
            # No hand detected
            result['message'] = 'No hand detected'
            self._add_text_overlay(result['annotated_frame'], "No Hand Detected", (255, 0, 0))
            return result
        
        # Draw hand detection
        result['annotated_frame'] = self.hand_detector.draw_landmarks(frame)
        bbox = self.hand_detector.get_hand_bbox(frame)
        result['bbox'] = bbox
        result['annotated_frame'] = self.hand_detector.draw_bbox(result['annotated_frame'])
        
        # LANDMARK-BASED CLASSIFICATION
        try:
            predicted_letter, confidence = self.landmark_classifier.predict(hand_landmarks)
            
            result['predicted_letter'] = predicted_letter
            result['confidence'] = confidence
            result['method'] = "landmarks"
            result['hand_detected'] = True
            
        except Exception as e:
            result['message'] = f'Classification error: {str(e)}'
            print(f"Error in classification: {str(e)}")
            return result
        
        # Check confidence and add visualization
        if result['predicted_letter']:            
            predicted_letter = result['predicted_letter']
            confidence = result['confidence']
            
            # Check if confidence meets threshold
            is_confident = self.landmark_classifier.is_confident(confidence)
            
            # Add visualization
            if is_confident:
                result['message'] = f'Predicted: {predicted_letter}'
                self._add_prediction_overlay(
                    result['annotated_frame'], 
                    predicted_letter, 
                    confidence,
                    (0, 255, 0)
                )
            else:
                result['message'] = f'Low confidence: {predicted_letter} ({confidence:.1%})'
                self._add_prediction_overlay(
                    result['annotated_frame'], 
                    predicted_letter, 
                    confidence,
                    (0, 165, 255)  # Orange
                )
            
            # Update state
            self.last_prediction = predicted_letter
            self.last_confidence = confidence
            self.hand_detected = True
        
        return result
    
    def _add_text_overlay(self, frame: np.ndarray, text: str, color: Tuple[int, int, int]):
        """Add text overlay to frame"""
        h, w = frame.shape[:2]
        
        # Add semi-transparent background
        overlay = frame.copy()
        cv2.rectangle(overlay, (10, 10), (w - 10, 80), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)
        
        # Add text
        cv2.putText(frame, text, (20, 55),
                   cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    
    def _add_prediction_overlay(self, frame: np.ndarray, letter: str, 
                                confidence: float, color: Tuple[int, int, int]):
        """Add prediction overlay with letter and confidence"""
        h, w = frame.shape[:2]
        
        # Position for prediction display (top-right)
        x_pos = w - 150
        y_pos = 30
        
        # Add semi-transparent background
        overlay = frame.copy()
        cv2.rectangle(overlay, (x_pos - 20, y_pos - 25), (w - 10, y_pos + 70), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.4, frame, 0.6, 0, frame)
        
        # Add letter (large)
        cv2.putText(frame, letter, (x_pos, y_pos + 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 2.0, color, 4)
        
        # Add confidence (small)
        conf_text = f"{confidence:.1%}"
        cv2.putText(frame, conf_text, (x_pos, y_pos + 60),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    
    def get_top_predictions(self, frame: np.ndarray, k: int = 3) -> list:
        """
        Get top K predictions for current frame
        
        Args:
            frame: Input frame
            k: Number of top predictions
        
        Returns:
            List of (letter, confidence) tuples
        """
        hand_detected, _ = self.hand_detector.detect(frame)
        
        if not hand_detected:
            return []
        
        hand_region = self.hand_detector.crop_hand_region(frame)
        if hand_region is None:
            return []
        
        return self.asl_classifier.predict_top_k(hand_region, k)
    
    def get_status(self) -> Dict:
        """Get current pipeline status"""
        return {
            'hand_detected': self.hand_detected,
            'last_prediction': self.last_prediction,
            'last_confidence': self.last_confidence,
            'hand_detector_info': self.hand_detector.get_detection_info(),
            'classifier_info': self.asl_classifier.get_model_info()
        }
    
    def reset(self):
        """Reset pipeline state"""
        self.last_prediction = None
        self.last_confidence = 0.0
        self.hand_detected = False
    
    def close(self):
        """Release resources"""
        self.hand_detector.close()


if __name__ == "__main__":
    # Test pipeline
    print("Testing ASL Pipeline...")
    try:
        pipeline = ASLPipeline()
        print("\n✅ Pipeline test successful!")
    except Exception as e:
        print(f"\n❌ Pipeline test failed: {str(e)}")
