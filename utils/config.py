"""
Configuration settings for ASL Recognition App
"""
import os

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
TESTS_DIR = os.path.join(BASE_DIR, "tests")

# Model settings
MODEL_PATH = os.path.join(MODELS_DIR, "american-sign-language.tflite")  # Image-based model
LANDMARK_MODEL_PATH = os.path.join(MODELS_DIR, "asl_landmark_model.tflite")  # Landmark-based TFLite model
USE_LANDMARK_CLASSIFIER = True  # Use landmark-based classifier (much more accurate!)
MODEL_INPUT_SIZE = (224, 224)  # Default size, will be determined from model
MODEL_INPUT_SHAPE = None  # Will be set dynamically

# Hand detection settings
HAND_DETECTION_CONFIDENCE = 0.3  # Minimum confidence for hand detection (lowered for better detection)
HAND_TRACKING_CONFIDENCE = 0.3   # Tracking confidence (lowered)
MAX_NUM_HANDS = 1                 # Process only one hand at a time

# ASL classification settings
ASL_CONFIDENCE_THRESHOLD = 0.5   # Minimum confidence to show prediction (lowered)
ASL_LABELS = [chr(i) for i in range(ord('A'), ord('Z') + 1)]  # A-Z labels

# Camera settings
CAMERA_INDEX = 0                  # Default camera
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
CAMERA_FPS = 30

# UI settings
WINDOW_TITLE = "ASL Alphabet Recognition"
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
PREDICTION_DISPLAY_SIZE = 100    # Size for prediction text
CONFIDENCE_DISPLAY_SIZE = 60     # Size for confidence text

# Performance settings
ENABLE_GPU = False                # Set to True if GPU is available
NUM_THREADS = 4                   # Number of CPU threads for inference

# Colors (BGR format for OpenCV)
COLOR_GREEN = (0, 255, 0)
COLOR_RED = (0, 0, 255)
COLOR_BLUE = (255, 0, 0)
COLOR_WHITE = (255, 255, 255)
COLOR_BLACK = (0, 0, 0)
COLOR_YELLOW = (0, 255, 255)

# Text settings
FONT = 'Arial'
FONT_SIZE_LARGE = 48
FONT_SIZE_MEDIUM = 24
FONT_SIZE_SMALL = 16
