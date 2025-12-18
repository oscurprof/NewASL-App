# On‑Device ASL Inference (Android) — Full Documentation

Date: 2025-12-18
Repo: NewASL-App
Mobile app folder: mobile/asl-expo/

## 1) Goal and Constraints

### Goal
Enable **on-device** sign prediction from a **single still image** (camera capture or gallery selection) using:
- MediaPipe Tasks Vision **HandLandmarker (IMAGE mode)** to extract 21 hand landmarks
- Existing custom **TFLite classifier** (asl_landmark_model.tflite) to predict an ASL label

### Non-negotiable constraints
- **UI/UX must remain exactly the same** (no new screens, no new flows)
- **No real-time camera/video inference** (only: select/capture → tap Predict)
- **Android is required** (iOS is optional, not implemented here)

## 2) High-level Architecture

User flow (unchanged):
1. User taps **Open Camera** or **Open Gallery** on SignToText
2. App stores the image URI
3. User taps **Predict Sign**
4. Prediction runs locally and returns a label
5. UI displays the predicted label

Implementation split:
- JS layer: keeps UI unchanged and calls a single inference helper
- Android native layer (Kotlin): loads image, runs MediaPipe Tasks, runs TFLite, returns label

### 2.1 JS-side routing
File: mobile/asl-expo/src/inference/predictSignFromImageUri.js
- `INFERENCE_MODE = 'backend' | 'mediapipe'`
- Backend mode: uploads image to server endpoint and reads `{prediction}`
- Mediapipe mode (Android-only): calls `NativeModules.SignPredictor.predictFromImageUri(imageUri)`

Config:
- mobile/asl-expo/src/config/inferenceConfig.js
  - `INFERENCE_MODE` is currently set to `mediapipe`
  - `BACKEND_PREDICT_URL` remains available for fallback

### 2.2 Android native module
Native module name: `SignPredictor`
- Exposed method: `predictFromImageUri(imageUri: String): Promise<String>`

Key responsibilities:
1. Resolve/parse URI
2. Decode bitmap
3. Correct orientation via EXIF
4. Run MediaPipe HandLandmarker (IMAGE mode)
5. Extract landmark features (63 floats = 21 × xyz)
6. Normalize features (wrist-relative + scale-invariant)
7. Run TFLite classifier with 63-float input
8. Map output index → label string
9. Return label to JS

## 3) Where the Code Lives

### 3.1 React Native / Expo app
- mobile/asl-expo/App.js
  - Navigation wiring for existing screens
  - ThemeProvider wrapper
- mobile/asl-expo/screens/SignToTextScreen.js
  - UI unchanged
  - Prediction call routed through `predictSignFromImageUri(imageUri)`
- mobile/asl-expo/src/inference/predictSignFromImageUri.js
  - Single entry point for inference

### 3.2 Android native module (Kotlin)
- mobile/asl-expo/android/app/src/main/java/com/oscurprof/aslexpo/mediapipe/SignPredictorModule.kt
- mobile/asl-expo/android/app/src/main/java/com/oscurprof/aslexpo/mediapipe/SignPredictorPackage.kt
- mobile/asl-expo/android/app/src/main/java/com/oscurprof/aslexpo/MainApplication.kt
  - Package registration

### 3.3 Android assets (bundled models)
All are placed in:
- mobile/asl-expo/android/app/src/main/assets/

Required files:
- hand_landmarker.task
- asl_landmark_model.tflite
- asl_landmark_model.txt

## 4) Why MediaPipe Tasks (Not react-native-mediapipe)

The `react-native-mediapipe` ecosystem is primarily camera/video oriented and typically pulls in native camera stacks. This project requires **still-image** inference and must avoid changing UX.

So the implementation uses:
- MediaPipe **Tasks Vision** HandLandmarker (IMAGE mode)
- A small Android native module to accept an image URI

## 5) Android Build Constraints (Important)

### 5.1 minSdkVersion must be 26+
MediaPipe Tasks Vision pulls in Guice 5.x, which uses Java `MethodHandle` APIs. D8 requires API 26+ for that usage.

Therefore:
- Android minSdkVersion is set to **26**.

Files:
- mobile/asl-expo/android/app/build.gradle
  - `minSdkVersion 26`
- mobile/asl-expo/app.json
  - expo-build-properties plugin sets minSdkVersion to 26 for future prebuilds

### 5.2 Windows native build gotcha (camera stacks)
When `react-native-mediapipe` was present it pulled `react-native-vision-camera` which failed to build on Windows. Since still-image inference does not need it, `react-native-mediapipe` was removed.

## 6) Build + Run (Developer)

### 6.1 Prerequisites
- Node.js LTS
- Android Studio + Android SDK
- JDK (Android Studio bundled JDK works)
- NDK installed (Gradle will report if missing)

### 6.2 Install dependencies
From mobile/asl-expo:
- `npm install`

### 6.3 Build Android debug APK
From mobile/asl-expo/android:
- `gradlew.bat :app:assembleDebug`

APK output:
- mobile/asl-expo/android/app/build/outputs/apk/debug/app-debug.apk

### 6.4 Run on device/emulator
From mobile/asl-expo:
- `npx expo run:android`

## 7) Verification Checklist

1. App launches
2. Navigate to SignToText
3. Pick an image or take a photo
4. Tap Predict Sign
5. Result shows a letter/label

## 8) Troubleshooting

### 8.1 “Native module SignPredictor is not available”
Cause: running an old build without the native module.
Fix:
- Rebuild Android (`npx expo run:android` or `gradlew.bat :app:assembleDebug`).

### 8.2 Dexing error mentioning MethodHandle / min-api 26
Cause: minSdkVersion too low.
Fix:
- Ensure minSdkVersion is 26 in android/app/build.gradle.

### 8.3 NDK missing source.properties
Cause: Android NDK not installed correctly.
Fix:
- Install the NDK from Android Studio SDK Manager.

## 9) What Was Not Implemented
- iOS native module
- Real-time video inference
- Any UI changes

## 10) Switch Back to Backend (No UI changes)
Edit:
- mobile/asl-expo/src/config/inferenceConfig.js
Set:
- `INFERENCE_MODE = 'backend'`
And ensure `BACKEND_PREDICT_URL` points to a reachable server.
