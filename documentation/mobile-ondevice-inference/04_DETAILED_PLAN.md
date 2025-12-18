# Mediapipe (React Native) Integration — Detailed Plan

Date: 2025-12-18
Repo: NewASL-App
Target UX constraints: keep current UI/UX exactly as-is
Target inference mode: still image (camera capture or gallery upload) — NOT real-time video
Target platforms: Android required, iOS is a nice-to-have

## 0) Current State (Audit Findings)

### What existed originally
- `mobile/Sign-Language-Translator-project/` contained screen-level JS files (e.g., SignToTextScreen.js, HomeScreen.js, etc.).

### What was missing
- No runnable React Native scaffold (no package.json at the mobile root)
- No android/ / ios/
- No Expo config

Impact: we had to scaffold a proper mobile project before integrating on-device inference.

## 1) Decision (Locked)

1) Scaffold an Expo-based React Native project inside this repo (Android-first)
2) Reuse existing screens without UI/UX changes
3) Replace the SignToText backend call with on-device inference using MediaPipe (still-image mode)

## 2) Target UX

Minimum shippable UX:
- SignToText supports Open Camera and Open Gallery
- User taps Predict Sign
- App runs on-device inference and displays the label

Non-goals:
- No real-time video inference
- No UI redesign

## 3) Technical Approach

### 3.1 Architecture
- JS inference entry point: `mobile/asl-expo/src/inference/predictSignFromImageUri.js`
- Config flag: `mobile/asl-expo/src/config/inferenceConfig.js`

### 3.2 Classification strategy
Hybrid approach:
- MediaPipe Tasks Vision HandLandmarker (IMAGE mode) → 21 landmarks
- Existing TFLite classifier (`asl_landmark_model.tflite`) → predicted class

### 3.3 Library constraint
The camera/video oriented `react-native-mediapipe` approach was rejected for this requirement (still images + no UX change). We implemented an Android-native wrapper around MediaPipe Tasks instead.

### 3.4 Android minSdk constraint
MediaPipe Tasks dependency chain requires minSdkVersion 26+. Project minSdkVersion was set to 26.

## 4) Milestones

A) Scaffold Expo app under `mobile/asl-expo/`
B) Add native dependencies (MediaPipe Tasks + TFLite) and bundle assets
C) Implement Android native `SignPredictor` module
D) Wire inference into SignToText without UI change
E) Document everything + sharing guides
