# Changes Compared to the Original Client Handoff

This document explains what was different in what you originally provided vs what exists now in this repo, and why those changes were required.

## 1) What the client originally provided

The folder:
- `mobile/Sign-Language-Translator-project/`

contained:
- Screen-level JavaScript files (multiple `*Screen.js` files)

It did NOT contain a runnable mobile app scaffold:
- No Expo / React Native project root with a `package.json`
- No Android native project (`android/`)
- No build configuration

## 2) Why we had to change structure

To integrate MediaPipe Tasks and ship an Android APK, we need a real Android project and a React Native runtime. Therefore, we created a proper Expo + Android project that can actually build and run.

## 3) What was added (high-level)

### Mobile app scaffold
- New runnable Expo app created under:
  - `mobile/asl-expo/`

### Navigation + glue (no UI redesign)
- Navigation was wired in:
  - `mobile/asl-expo/App.js`

### Inference routing layer
- Added a single inference entry point used by the UI:
  - `mobile/asl-expo/src/inference/predictSignFromImageUri.js`
- Added a config flag to choose backend vs on-device:
  - `mobile/asl-expo/src/config/inferenceConfig.js`

### Android native on-device inference
- Added Kotlin native module `SignPredictor`:
  - `mobile/asl-expo/android/app/src/main/java/.../mediapipe/SignPredictorModule.kt`
- Added model assets bundled into the APK:
  - `mobile/asl-expo/android/app/src/main/assets/hand_landmarker.task`
  - `mobile/asl-expo/android/app/src/main/assets/asl_landmark_model.tflite`
  - `mobile/asl-expo/android/app/src/main/assets/asl_landmark_model.txt`

## 4) Build/runtime constraints introduced

### Android minSdkVersion
- minSdkVersion was raised to **26** (Android 8.0+) because MediaPipe Tasks dependency chain requires it.

### Why no real-time camera inference
- The client requirement was still-image prediction only.
- We avoided camera/video streaming packages and implemented IMAGE-mode inference.

## 5) What did NOT change

- Screen UX/flow: still image capture/select → predict → display label.
- No new screens were introduced to change the flow.

## 6) Where to read the full details
- [03_TECHNICAL_ONDEVICE_INFERENCE.md](03_TECHNICAL_ONDEVICE_INFERENCE.md)
- [05_IMPLEMENTATION_LOG.md](05_IMPLEMENTATION_LOG.md)
