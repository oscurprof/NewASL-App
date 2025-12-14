"""
Extract hand landmarks from ASL alphabet images and save to CSV
This processes all images in the dataset and extracts MediaPipe landmarks
"""

import os
import csv
import cv2
import mediapipe as mp
from pathlib import Path
from tqdm import tqdm

def extract_landmarks_from_image(image_path, hands):
    """
    Extract hand landmarks from a single image
    
    Args:
        image_path: Path to image file
        hands: MediaPipe Hands object
    
    Returns:
        List of 63 landmark coordinates [x1,y1,z1, ..., x21,y21,z21] or None
    """
    # Read image
    image = cv2.imread(str(image_path))
    if image is None:
        return None
    
    # Convert to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process with MediaPipe
    results = hands.process(image_rgb)
    
    if results.multi_hand_landmarks:
        # Get first hand detected
        hand_landmarks = results.multi_hand_landmarks[0]
        
        # Extract all 21 landmarks (x, y, z)
        landmarks = []
        for landmark in hand_landmarks.landmark:
            landmarks.extend([landmark.x, landmark.y, landmark.z])
        
        return landmarks
    
    return None

def extract_landmarks_from_dataset(dataset_path, output_csv, max_per_class=None):
    """
    Extract landmarks from entire ASL alphabet dataset
    
    Args:
        dataset_path: Path to dataset folder containing A-Z folders
        output_csv: Output CSV file path
        max_per_class: Maximum samples per class (None = all)
    """
    dataset_path = Path(dataset_path)
    
    # Initialize MediaPipe Hands
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.3
    )
    
    # Get all letter folders (A-Z)
    letter_folders = sorted([f for f in dataset_path.iterdir() if f.is_dir()])
    
    print(f"🔍 Found {len(letter_folders)} letter folders")
    print(f"📁 Dataset path: {dataset_path}")
    print(f"💾 Output CSV: {output_csv}")
    print(f"🎯 Max samples per class: {max_per_class or 'All'}\n")
    
    # Prepare CSV
    csv_file = open(output_csv, 'w', newline='')
    csv_writer = csv.writer(csv_file)
    
    # Write header: label, x1, y1, z1, ..., x21, y21, z21
    header = ['label']
    for i in range(21):
        header.extend([f'x{i}', f'y{i}', f'z{i}'])
    csv_writer.writerow(header)
    
    # Statistics
    total_processed = 0
    total_success = 0
    total_failed = 0
    
    # Process each letter folder
    for letter_folder in letter_folders:
        letter = letter_folder.name
        print(f"\n📝 Processing letter: {letter}")
        
        # Get all images in folder
        image_files = list(letter_folder.glob('*.jpg')) + list(letter_folder.glob('*.png'))
        
        # Limit if specified
        if max_per_class:
            image_files = image_files[:max_per_class]
        
        success_count = 0
        fail_count = 0
        
        # Process each image with progress bar
        for image_path in tqdm(image_files, desc=f"  {letter}", unit="img"):
            total_processed += 1
            
            # Extract landmarks
            landmarks = extract_landmarks_from_image(image_path, hands)
            
            if landmarks:
                # Write to CSV: [label, x1, y1, z1, ..., x21, y21, z21]
                row = [letter] + landmarks
                csv_writer.writerow(row)
                success_count += 1
                total_success += 1
            else:
                fail_count += 1
                total_failed += 1
        
        print(f"  ✅ Success: {success_count} | ❌ Failed: {fail_count}")
    
    # Cleanup
    csv_file.close()
    hands.close()
    
    # Print summary
    print("\n" + "="*60)
    print("📊 EXTRACTION SUMMARY")
    print("="*60)
    print(f"Total images processed: {total_processed}")
    print(f"✅ Successful extractions: {total_success}")
    print(f"❌ Failed extractions: {total_failed}")
    print(f"Success rate: {total_success/total_processed*100:.1f}%")
    print(f"\n💾 Landmarks saved to: {output_csv}")
    print("="*60)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Extract landmarks from ASL alphabet images')
    parser.add_argument('--dataset', type=str, default='data/asl_alphabet',
                        help='Path to ASL alphabet dataset')
    parser.add_argument('--output', type=str, default='data/landmarks.csv',
                        help='Output CSV file')
    parser.add_argument('--max-per-class', type=int, default=None,
                        help='Maximum samples per class (default: all)')
    
    args = parser.parse_args()
    
    # Check if dataset exists
    if not os.path.exists(args.dataset):
        print(f"❌ Error: Dataset not found at {args.dataset}")
        print(f"\n📁 Please place your ASL Alphabet dataset at:")
        print(f"   {os.path.abspath(args.dataset)}")
        print(f"\nFolder structure should be:")
        print(f"   {args.dataset}/")
        print(f"   ├── A/")
        print(f"   ├── B/")
        print(f"   ├── C/")
        print(f"   └── ...")
        exit(1)
    
    # Run extraction
    extract_landmarks_from_dataset(args.dataset, args.output, args.max_per_class)
