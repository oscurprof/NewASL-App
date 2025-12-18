# Client Sharing Guide (With Source Code) — Full Detailed Guide

Audience: your client’s developer / IT person who will build and run the Android app from source.

This project contains:
- A React Native (Expo) app at [mobile/asl-expo/](../../mobile/asl-expo/)
- An Android native module (Kotlin) that runs:
  - MediaPipe Tasks Vision HandLandmarker (IMAGE mode)
  - TensorFlow Lite classifier (your `asl_landmark_model.tflite`)

The UX is unchanged: **select/capture image → tap Predict → show label**.

---

## 1) What the client must install (Windows)

### Required
1) **Git**
- Verify: `git --version`

2) **Node.js LTS** (recommended)
- Verify: `node -v` and `npm -v`

3) **Android Studio**
Install Android Studio and then open:
- Android Studio → **SDK Manager**
  - **SDK Platforms**: install at least **Android 14 (API 34)** (or any modern platform)
  - **SDK Tools**:
    - Android SDK Build-Tools
    - Android SDK Platform-Tools (adb)
    - Android SDK Command-line Tools (latest)
    - **NDK (Side by side)** (required)

4) **Java/JDK**
- Android Studio includes a bundled JDK; that is usually enough.

### Important requirement
- The Android app min SDK is **26** (Android 8.0+). Devices below Android 8.0 will not run this build.

---

## 2) What they will receive from you

Send them:
- The full repository folder `NewASL-App/` (zip or git repo access)

The mobile app they should work in is:
- [mobile/asl-expo/](../../mobile/asl-expo/)

---

## 3) How to run the app from source (recommended dev workflow)

### 3.1 Clone / open
1) Clone to a short path (Windows path issues are common):
- Example: `C:\dev\NewASL-App`

2) Open a terminal at:
- `NewASL-App\mobile\asl-expo`

### 3.2 Install JavaScript dependencies
From `mobile/asl-expo`:
- `npm install`

### 3.3 Build + install on a device (no emulator required)
Option A (physical Android phone):
1) Enable Developer Mode on the phone
2) Enable **USB debugging**
3) Plug in the phone via USB
4) Verify adb sees the device:
- `adb devices`

Then from `mobile/asl-expo` run:
- `npx expo run:android`

This compiles the native Android app and installs it on the device.

### 3.4 Start Metro (only when using a debug/dev build)
If the installed app shows:
- “Unable to load script. Make sure you’re either running Metro…”

That means the installed app is a **debug/dev build** and it needs Metro running on the laptop.

Start Metro from `mobile/asl-expo`:
- `npx expo start --dev-client`

Connectivity requirements:
- Phone and laptop must be on the **same Wi‑Fi**, OR use USB + adb reverse.

USB reverse (often simplest):
- `adb reverse tcp:8081 tcp:8081`

Then re-open the app.

---

## 4) How to produce an APK for the client (two choices)

### Choice 1: Debug APK (easy, but usually requires Metro)
From:
- `mobile/asl-expo/android`

Build:
- `gradlew.bat :app:assembleDebug`

APK output:
- `mobile/asl-expo/android/app/build/outputs/apk/debug/app-debug.apk`

Notes:
- This is signed with a debug key.
- If the debug APK is built as a dev client / debug variant, it may still require Metro.

### Choice 2: Release APK (standalone, no Metro)
From:
- `mobile/asl-expo/android`

Build:
- `gradlew.bat :app:assembleRelease`

APK output (typical):
- `mobile/asl-expo/android/app/build/outputs/apk/release/app-release.apk`

Important:
- A release APK used for real distribution should be **signed with the client’s own keystore**.
- If they want Play Store distribution, they should build an **AAB** and use proper signing.

---

## 5) Where the on-device models live

Android assets folder:
- [mobile/asl-expo/android/app/src/main/assets/](../../mobile/asl-expo/android/app/src/main/assets/)

Bundled files:
- `hand_landmarker.task`
- `asl_landmark_model.tflite`
- `asl_landmark_model.txt`

---

## 6) Quick “what to do if it doesn’t work” checklist

1) Metro error on phone
- Run: `npx expo start --dev-client`
- Ensure same Wi‑Fi OR run `adb reverse tcp:8081 tcp:8081`

2) Build fails with messages about `MethodHandle` / `min-api 26`
- Confirm minSdkVersion is 26 (this repo is already configured that way)

3) Build fails with NDK `source.properties` missing
- Install NDK (Side by side) from Android Studio → SDK Tools

4) JS says `SignPredictor` is not available
- They installed an old APK. Rebuild & reinstall:
  - `npx expo run:android`

---

## 7) What changed compared to what you originally provided

The original folder you provided (`mobile/Sign-Language-Translator-project/`) contained only screen JS files (no runnable React Native/Expo project). To make it runnable and integrate on-device inference:

- Created a complete Expo React Native app under [mobile/asl-expo/](../../mobile/asl-expo/)
- Copied your screens into [mobile/asl-expo/screens/](../../mobile/asl-expo/screens/)
- Added navigation wiring in [mobile/asl-expo/App.js](../../mobile/asl-expo/App.js)
- Added an inference routing layer:
  - [mobile/asl-expo/src/config/inferenceConfig.js](../../mobile/asl-expo/src/config/inferenceConfig.js)
  - [mobile/asl-expo/src/inference/predictSignFromImageUri.js](../../mobile/asl-expo/src/inference/predictSignFromImageUri.js)
- Implemented Android native on-device pipeline (MediaPipe Tasks + TFLite):
  - Kotlin module under [mobile/asl-expo/android/app/src/main/java/](../../mobile/asl-expo/android/app/src/main/java/)
  - Bundled models under [mobile/asl-expo/android/app/src/main/assets/](../../mobile/asl-expo/android/app/src/main/assets/)
- Increased Android minSdkVersion to **26** to satisfy MediaPipe Tasks dependency constraints
- Removed camera/video oriented dependencies (not needed for still-image inference)

For the technical details, see:
- [03_TECHNICAL_ONDEVICE_INFERENCE.md](03_TECHNICAL_ONDEVICE_INFERENCE.md)
- [05_IMPLEMENTATION_LOG.md](05_IMPLEMENTATION_LOG.md)
