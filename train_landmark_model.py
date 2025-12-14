"""
Train ASL alphabet classifier using hand landmarks with Neural Network
Exports as TFLite model for mobile deployment (React Native)
"""

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns

def normalize_landmarks(landmarks):
    """
    Normalize landmarks to be wrist-relative and scale-invariant
    
    Args:
        landmarks: Array of shape (n_samples, 63) - [x1,y1,z1, ..., x21,y21,z21]
    
    Returns:
        Normalized landmarks
    """
    landmarks = landmarks.copy()
    n_samples = landmarks.shape[0]
    
    # Reshape to (n_samples, 21, 3)
    landmarks_reshaped = landmarks.reshape(n_samples, 21, 3)
    
    # Get wrist position (landmark 0)
    wrist = landmarks_reshaped[:, 0:1, :]  # Shape: (n_samples, 1, 3)
    
    # Make all landmarks relative to wrist
    landmarks_reshaped = landmarks_reshaped - wrist
    
    # Calculate hand size (max distance from wrist)
    distances = np.linalg.norm(landmarks_reshaped, axis=2)  # Shape: (n_samples, 21)
    hand_size = np.max(distances, axis=1, keepdims=True)  # Shape: (n_samples, 1)
    
    # Avoid division by zero
    hand_size = np.maximum(hand_size, 1e-6)
    
    # Normalize by hand size
    landmarks_reshaped = landmarks_reshaped / hand_size[:, :, np.newaxis]
    
    # Reshape back to (n_samples, 63)
    return landmarks_reshaped.reshape(n_samples, 63)

def load_and_prepare_data(csv_path):
    """
    Load landmarks CSV and prepare for training
    
    Args:
        csv_path: Path to landmarks.csv
    
    Returns:
        X_train, X_test, y_train, y_test, label_encoder
    """
    print(f"📂 Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    print(f"✅ Loaded {len(df)} samples")
    print(f"📊 Classes: {sorted(df['label'].unique())}")
    print(f"📈 Samples per class:\n{df['label'].value_counts().sort_index()}\n")
    
    # Separate features and labels
    X = df.drop('label', axis=1).values
    y = df['label'].values
    
    # Encode labels to integers for neural network
    print("🔢 Encoding labels...")
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Normalize landmarks
    print("🔄 Normalizing landmarks...")
    X = normalize_landmarks(X)
    
    # Split data
    print("✂️ Splitting into train/test (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"✅ Training samples: {len(X_train)}")
    print(f"✅ Testing samples: {len(X_test)}\n")
    
    return X_train, X_test, y_train, y_test, label_encoder

def build_model(input_shape, num_classes):
    """
    Build Neural Network model for ASL classification
    
    Args:
        input_shape: Shape of input features (63,)
        num_classes: Number of output classes
    
    Returns:
        Compiled Keras model
    """
    print("🧠 Building Neural Network...")
    print(f"   Input shape: {input_shape}")
    print(f"   Output classes: {num_classes}\n")
    
    model = keras.Sequential([
        layers.Input(shape=(input_shape,)),
        
        # First hidden layer
        layers.Dense(128, activation='relu', name='dense1'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        
        # Second hidden layer
        layers.Dense(64, activation='relu', name='dense2'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        
        # Third hidden layer
        layers.Dense(32, activation='relu', name='dense3'),
        layers.Dropout(0.2),
        
        # Output layer
        layers.Dense(num_classes, activation='softmax', name='output')
    ])
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("✅ Model architecture:")
    model.summary()
    
    return model

def train_model(model, X_train, y_train, X_test, y_test):
    """
    Train Neural Network model
    
    Args:
        model: Compiled Keras model
        X_train: Training features
        y_train: Training labels
        X_test: Test features
        y_test: Test labels
    
    Returns:
        Trained model and history
    """
    print("\n🏋️ Training Neural Network...")
    print("   This may take a few minutes on CPU...\n")
    
    # Early stopping to prevent overfitting
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    # Train model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=100,
        batch_size=32,
        callbacks=[early_stopping],
        verbose=1
    )
    
    print("\n✅ Training complete!")
    return model, history

def evaluate_model(model, X_test, y_test, label_encoder, save_confusion_matrix=True):
    """
    Evaluate model performance
    
    Args:
        model: Trained Keras model
        X_test: Test features
        y_test: Test labels (encoded)
        label_encoder: LabelEncoder for class names
        save_confusion_matrix: Whether to save confusion matrix plot
    """
    print("\n" + "="*60)
    print("📊 MODEL EVALUATION")
    print("="*60)
    
    # Make predictions
    y_pred_probs = model.predict(X_test, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n🎯 Overall Accuracy: {accuracy*100:.2f}%\n")
    
    # Get class names
    class_names = label_encoder.classes_
    
    # Classification report
    print("📋 Detailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=class_names))
    
    # Confusion matrix
    if save_confusion_matrix:
        print("📊 Generating confusion matrix...")
        cm = confusion_matrix(y_test, y_pred)
        
        # Plot
        plt.figure(figsize=(16, 14))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                    xticklabels=class_names,
                    yticklabels=class_names)
        plt.title('ASL Alphabet Classification - Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        
        output_path = 'confusion_matrix.png'
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"✅ Confusion matrix saved to: {output_path}")
    
    print("="*60)

def save_model(model, label_encoder, output_path):
    """
    Save trained model as TFLite for mobile deployment
    
    Args:
        model: Trained Keras model
        label_encoder: LabelEncoder for class names
        output_path: Output file path (.tflite)
    """
    print(f"\n💾 Converting model to TFLite format...")
    
    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optimize for mobile (size and speed)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Convert
    tflite_model = converter.convert()
    
    # Save TFLite model
    output_path = Path(output_path)
    output_path = output_path.with_suffix('.tflite')  # Ensure .tflite extension
    
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    # Check file size
    file_size = output_path.stat().st_size / 1024  # KB
    print(f"✅ TFLite model saved! Size: {file_size:.1f} KB")
    print(f"📱 Ready for mobile deployment!")
    
    # Save label encoder classes for reference
    labels_path = output_path.with_suffix('.txt')
    with open(labels_path, 'w') as f:
        f.write('\n'.join(label_encoder.classes_))
    print(f"✅ Class labels saved to: {labels_path}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train ASL landmark classifier with Neural Network')
    parser.add_argument('--data', type=str, default='data/landmarks.csv',
                        help='Path to landmarks CSV file')
    parser.add_argument('--output', type=str, default='models/asl_landmark_model.tflite',
                        help='Output TFLite model file path')
    parser.add_argument('--skip-plot', action='store_true',
                        help='Skip confusion matrix plot')
    
    args = parser.parse_args()
    
    # Check if data exists
    if not Path(args.data).exists():
        print(f"❌ Error: Landmarks file not found at {args.data}")
        print(f"\n📝 Please run landmark extraction first:")
        print(f"   python extract_landmarks.py")
        exit(1)
    
    # Load and prepare data
    X_train, X_test, y_train, y_test, label_encoder = load_and_prepare_data(args.data)
    
    # Build model
    input_shape = X_train.shape[1]  # 63 features
    num_classes = len(label_encoder.classes_)
    model = build_model(input_shape, num_classes)
    
    # Train model
    model, history = train_model(model, X_train, y_train, X_test, y_test)
    
    # Evaluate model
    evaluate_model(model, X_test, y_test, label_encoder, save_confusion_matrix=not args.skip_plot)
    
    # Save model as TFLite
    save_model(model, label_encoder, args.output)
    
    print("\n✅ All done! TFLite model is ready for mobile deployment.")
    print(f"📦 Model location: {args.output}")
    print(f"📱 Use this model in React Native app!")
