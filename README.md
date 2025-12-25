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

- Node.js (LTS)
- Java JDK 17 (Temurin or Oracle)
- Android Studio (SDK, NDK, CMake)
- Physical Android device or emulator (API 26+)

## 🧰 Installation Guide (Windows)

Follow these steps to set up your environment on Windows for building and running the app.

### 1) Install Node.js (LTS)

- Download and install from https://nodejs.org
- Verify:

```powershell
node -v
npm -v
```

### 2) Install Java JDK 17

- Recommended: Eclipse Temurin (OpenJDK) 17 from https://adoptium.net
- Alternatively, Oracle JDK 17 from https://www.oracle.com/java/technologies/downloads/
- Verify:

```powershell
java -version
```

Set JAVA_HOME (adjust the path to your JDK install):

```powershell
# Example path - update if different on your machine
setx JAVA_HOME "C:\\Program Files\\Eclipse Adoptium\\jdk-17"
setx PATH "%PATH%;%JAVA_HOME%\\bin"
```

### 3) Install Android Studio

- Download from https://developer.android.com/studio and complete installation
- Launch Android Studio once to initialize the SDK

Install SDK/NDK/CMake via Settings:

1. Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
2. Tab “SDK Platforms”: install latest Android API (API 26+ supported; latest recommended i.e. Android 16.0 ("Baklava"))
3. Tab “SDK Tools”: check and install:
	- Android SDK Build-Tools
	- NDK (Side by side)
	- Android SDK Command-line Tools (latest)
	- CMake
    - Android Emulator
    - Android Emulator Hypervisor Driver (installer)
	- Android SDK Platform-Tools

Default SDK path (for ANDROID_HOME):

- C:\\Users\\<YourUser>\\AppData\\Local\\Android\\Sdk

Set ANDROID_HOME and add tools to PATH:

```powershell
setx ANDROID_HOME "%USERPROFILE%\\AppData\\Local\\Android\\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\\platform-tools;%ANDROID_HOME%\\cmdline-tools\\latest\\bin"
```

### 4) Set up an Emulator or Device

- Emulator: Android Studio → More Actions → Virtual Device Manager →  Create Virtual Device (+ button on top) → choose a device (i.e. Pixel 6) + next → Download (name and finish)  → Click start on right side of device name (and wait till it starts)
- Physical device: Enable Developer Options + USB Debugging; connect via USB and accept the debug prompt
- Verify device visibility:

```powershell
adb devices
```

### 5) Install project dependencies

```powershell
cd mobile/asl-expo
npm install
```

### 6) Build and Run on Android
make sure to have internet connection on first build & also it required to run the emulator and start mobile from android studio before starting app (and if you are using mobile make sure its unlocked & usb debugging is turned on)
```powershell
cd mobile/asl-expo
npx expo run:android
```

Build APK without running:

```powershell
cd mobile/asl-expo/android
./gradlew.bat :app:assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Troubleshooting

- Gradle JDK mismatch: Use JDK 17. In Android Studio, set Project Settings → Gradle JDK to your JDK 17 install.
- Missing NDK/CMake: Revisit Settings → Android SDK → SDK Tools and install NDK (Side by side) and CMake.
- Device not detected: Install OEM drivers; run `adb kill-server` then `adb start-server`; ensure USB debugging enabled.
- Permissions error on Windows: Run terminal as Administrator for initial environment variable setup.

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
