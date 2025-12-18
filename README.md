# 🤟 ASL Translator Mobile App

A mobile application for **American Sign Language (ASL) alphabet recognition** with **on-device AI inference**. Captures a photo of an ASL hand sign and instantly predicts the letter using MediaPipe + TensorFlow Lite running entirely on your phone.

## ✨ Key Features

- 📱 **On-Device Inference** — No internet required, works offline
- ⚡ **Fast** — <100ms prediction time
- 🔒 **Private** — Images never leave your device
- 🎯 **99.38% Accuracy** — Advanced landmark-based AI model
- 📷 **Camera & Gallery** — Capture or select images

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [Android Studio](https://developer.android.com/studio) with SDK
- Physical Android device or emulator (API 26+)

### Run the App

```bash
# Navigate to mobile app
cd mobile/asl-expo

# Install dependencies
npm install

# Run on Android (builds APK and launches)
npx expo run:android
```

### Build APK Only

```bash
cd mobile/asl-expo/android
./gradlew.bat :app:assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 How It Works

1. **Capture** — Take a photo of your hand sign or select from gallery
2. **Detect** — MediaPipe finds and tracks 21 hand landmarks
3. **Classify** — TensorFlow Lite model predicts the ASL letter
4. **Display** — Result shown instantly on screen

```
┌─────────────────────────────────────────────────────────────────┐
│                    ON-DEVICE INFERENCE                           │
├─────────────────────────────────────────────────────────────────┤
│  Photo → MediaPipe → 21 Landmarks → TFLite → ASL Letter (A-Z)  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
NewASL-App/
├── mobile/
│   └── asl-expo/                    # React Native + Expo app
│       ├── screens/                 # UI screens
│       ├── src/
│       │   ├── config/             # Inference mode config
│       │   └── inference/          # Prediction logic
│       └── android/                # Native Android code
│           └── app/src/main/
│               ├── java/.../mediapipe/  # Kotlin native module
│               └── assets/              # AI models
│                   ├── hand_landmarker.task
│                   ├── asl_landmark_model.tflite
│                   └── asl_landmark_model.txt
├── documentation/                   # Full documentation
└── REACT_NATIVE_GUIDE.md           # Development guide
```

## 📚 Documentation

- [Migration Documentation](documentation/MIGRATION_SIGN_LANGUAGE_TO_ASL_EXPO.md) — Why this architecture
- [Technical Details](documentation/mobile-ondevice-inference/03_TECHNICAL_ONDEVICE_INFERENCE.md)
- [Client Sharing Guide](documentation/mobile-ondevice-inference/01_CLIENT_SHARING_GUIDE_WITH_SOURCE.md)
- [React Native Guide](REACT_NATIVE_GUIDE.md)

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native + Expo |
| Navigation | React Navigation |
| AI Detection | MediaPipe Tasks Vision |
| AI Classification | TensorFlow Lite |
| Native Code | Kotlin (Android) |
| Min Android | API 26 (Android 8.0) |

## 📝 Notes

- **Expo Go not supported** — Requires native code for MediaPipe/TFLite
- **Android only** — iOS native module not yet implemented
- **Still images only** — Real-time video inference not implemented

---

*Built with MediaPipe and TensorFlow Lite for on-device AI*
