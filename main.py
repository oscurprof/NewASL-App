"""
ASL Alphabet Recognition App
Main entry point for the application

Author: ASL Recognition Team
Date: December 2025
"""
import os
import sys

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.ui import ASLRecognitionUI


def check_model_exists():
    """Check if model file exists"""
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    
    # Check for any .tflite file
    if os.path.exists(models_dir):
        tflite_files = [f for f in os.listdir(models_dir) if f.endswith('.tflite')]
        if tflite_files:
            return True
    
    return False


def print_welcome():
    """Print welcome message"""
    print("=" * 70)
    print("    ASL ALPHABET RECOGNITION APP")
    print("=" * 70)
    print("\nFeatures:")
    print("  • Real-time hand detection using MediaPipe")
    print("  • ASL alphabet recognition (A-Z)")
    print("  • Two-stage pipeline for accurate predictions")
    print("  • Live camera feed with annotations")
    print("  • Confidence scoring")
    print("\n" + "=" * 70)


def main():
    """Main function"""
    print_welcome()
    
    # Check if model exists
    if not check_model_exists():
        print("\n⚠️  MODEL NOT FOUND!")
        print("\nPlease train the model first by running:")
        print("  1. python extract_landmarks.py")
        print("  2. python train_landmark_model.py")
        print("\nFor detailed instructions, see TRAINING_DOCUMENTATION.md")
        print("\nMake sure dependencies are installed:")
        print("  pip install -r requirements.txt")
        print("\n" + "=" * 70)
        print("\nExiting... Please train the model and try again.")
        return
    
    # Launch application
    print("\n🚀 Launching application...")
    print("\nInstructions:")
    print("  1. Click 'Start Camera' to begin")
    print("  2. Show ASL hand signs (A-Z) to the camera")
    print("  3. The app will detect your hand and predict the letter")
    print("  4. Green = High confidence, Orange = Medium, Red = Low")
    print("  5. Click 'Capture Image' to save a frame")
    print("  6. Click 'Stop Camera' when done")
    print("\n" + "=" * 70 + "\n")
    
    try:
        app = ASLRecognitionUI()
        app.run()
    except Exception as e:
        print(f"\n❌ Error running application: {str(e)}")
        print("\nTroubleshooting:")
        print("  1. Make sure all dependencies are installed:")
        print("     pip install -r requirements.txt")
        print("  2. Check if your camera is working")
        print("  3. Check if the model file exists in models/")
        return
    
    print("\n✅ Application closed successfully!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
