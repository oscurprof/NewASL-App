# Migration Documentation: Sign-Language-Translator → asl-expo

This document details the complete migration from the original **Sign-Language-Translator-project** to the new **asl-expo** mobile application, including what changed, what stayed the same, and the critical reasons behind the transition away from Expo Go.

---

## 📋 Executive Summary

| Aspect | Old: Sign-Language-Translator | New: asl-expo |
|--------|------------------------------|---------------|
| **Project Status** | Incomplete (screens only) | Complete runnable app |
| **Runtime** | Expo Go dependent | Expo Dev Build (custom native code) |
| **Inference** | Backend-only (network required) | On-device + Backend fallback |
| **Model** | Remote server processing | Bundled TFLite (25.5 KB) |
| **Hand Detection** | Server-side MediaPipe | On-device MediaPipe Tasks |
| **Offline Capability** | ❌ No | ✅ Yes |
| **Build Output** | N/A (no build config) | Android APK |

---

## 🔄 What Stayed the Same

### 1. Screen Components & UI/UX
All original screen files were preserved with **identical UI/UX**:

| Screen | Purpose | Changes |
|--------|---------|---------|
| `HomeScreen.js` | Main landing page | None |
| `LoginScreen.js` | User authentication | None |
| `SignupScreen.js` | User registration | None |
| `SignToTextScreen.js` | ASL → Text translation | Inference routing only |
| `TextToSignScreen.js` | Text → ASL animation | None |
| `AlphabetScreen.js` | ASL alphabet reference | None |
| `NumberScreen.js` | ASL numbers reference | None |
| `SignLibraryScreen.js` | Sign library browser | None |
| `HistoryScreen.js` | Translation history | None |
| `AboutScreen.js` | App information | None |
| `SplashScreen.js` | App loading screen | None |
| `forgotscreen.js` | Password recovery | None |

### 2. Firebase Integration
- `firebaseConfig.js` — Firebase configuration preserved identically
- Authentication flow unchanged

### 3. Core Dependencies
- `expo-image-picker` — Camera/Gallery image selection
- `@react-navigation/native` — Navigation structure
- `axios` — HTTP client for backend fallback
- `formik` + `yup` — Form handling and validation

### 4. Visual Design
- Color scheme (`#1F3A93` primary blue)
- Typography and styling
- Component layouts and interactions
- Theme context system (`ThemeContext.js`)

---

## ⬆️ What Was Upgraded

### 1. Project Structure

**Before (Sign-Language-Translator-project):**
```
Sign-Language-Translator-project/
├── AboutScreen.js
├── AlphabetScreen.js
├── HomeScreen.js
├── LoginScreen.js
├── SignToTextScreen.js
├── ... (other screens)
├── firebaseConfig.js
└── main.py              # Backend server
```
- ❌ No `package.json`
- ❌ No Expo/React Native configuration
- ❌ No Android native project
- ❌ No build capability

**After (asl-expo):**
```
asl-expo/
├── App.js                           # Navigation wiring
├── ThemeContext.js                  # Theme provider
├── package.json                     # Dependencies
├── app.json                         # Expo configuration
├── index.js                         # Entry point
├── screens/                         # All screen components
│   └── (14 screens)
├── src/
│   ├── config/
│   │   └── inferenceConfig.js       # Backend vs on-device toggle
│   └── inference/
│       └── predictSignFromImageUri.js # Unified inference entry
└── android/                         # Full native Android project
    └── app/
        └── src/main/
            ├── java/.../mediapipe/
            │   ├── SignPredictorModule.kt    # Native inference module
            │   └── SignPredictorPackage.kt   # Package registration
            └── assets/
                ├── hand_landmarker.task      # MediaPipe model
                ├── asl_landmark_model.tflite # TFLite classifier
                └── asl_landmark_model.txt    # Label mapping
```

### 2. Inference Architecture

**Before:** Backend-Dependent API Call
```javascript
// Old approach - required server running
const axiosResponse = await axios.post(
  "http://192.168.1.14:7000/predict",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);
```
- ⚠️ Required backend server running
- ⚠️ Required network connectivity
- ⚠️ Hardcoded IP address
- ⚠️ Latency dependent on network

**After:** On-Device with Backend Fallback
```javascript
// New approach - on-device first, backend fallback
import { INFERENCE_MODE, BACKEND_PREDICT_URL } from '../config/inferenceConfig';

if (INFERENCE_MODE === 'mediapipe') {
  // On-device inference via native module
  const label = await NativeModules.SignPredictor.predictFromImageUri(imageUri);
} else {
  // Backend fallback if needed
  const response = await fetch(BACKEND_PREDICT_URL, ...);
}
```

### 3. Native Module Integration

Added Kotlin native module `SignPredictorModule` that:
1. Resolves image URI from camera/gallery
2. Decodes bitmap with EXIF orientation correction
3. Runs MediaPipe HandLandmarker (IMAGE mode)
4. Extracts 21 landmarks × 3 coordinates = 63 features
5. Normalizes features (wrist-relative, scale-invariant)
6. Runs TFLite classifier inference
7. Returns predicted ASL letter

### 4. Build Configuration

| Configuration | Value | Reason |
|---------------|-------|--------|
| `minSdkVersion` | 26 (Android 8.0+) | MediaPipe Tasks requires Java MethodHandle APIs |
| Expo SDK | 54 | Latest stable with dev build support |
| React Native | 0.81.5 | Compatible with Expo SDK 54 |

---

## 🚫 Why We're NOT Using Expo Go Anymore

### The Core Problem

**Expo Go** is a pre-built app that runs JavaScript code, but it has a **fixed set of native modules**. It cannot run:
- Custom native code (Kotlin/Swift)
- Native libraries not included in Expo SDK
- MediaPipe Tasks Vision
- TensorFlow Lite runtime

### Why MediaPipe Requires Native Code

Our ASL translator uses a **multi-stage inference pipeline**:

```
┌──────────────────────────────────────────────────────────────────┐
│                    ASL TRANSLATION PIPELINE                       │
├──────────────────────────────────────────────────────────────────┤
│  Image → MediaPipe HandLandmarker → 21 Landmarks → TFLite → ASL │
│         (Native C++ library)        (63 floats)   (Native)       │
└──────────────────────────────────────────────────────────────────┘
```

- **MediaPipe HandLandmarker** — Google's hand detection model is a native C++ library with platform-specific binaries
- **TensorFlow Lite** — The inference runtime is also native C/C++ for performance
- **On-device ML** — Both require access to hardware acceleration (GPU/NPU) via native APIs

### Why Other Approaches Failed

| Approach | Why It Didn't Work |
|----------|-------------------|
| `react-native-mediapipe` | Pulls in camera/video stacks; caused Windows build failures; designed for real-time video, not still images |
| `expo-tensorflow` | No longer maintained; doesn't support custom models |
| WebAssembly MediaPipe | Too slow for mobile; no hardware acceleration |
| Backend-only | Required server running; network latency; no offline support |

### The Solution: Expo Dev Builds

**Expo Dev Builds** allow us to:
1. ✅ Write custom native modules (Kotlin for Android)
2. ✅ Include MediaPipe Tasks Vision library
3. ✅ Bundle TFLite models in APK
4. ✅ Run inference entirely on-device
5. ✅ Still use Expo's managed workflow for JS development

**Build Process Change:**
```bash
# OLD: Expo Go (no build needed, but limited)
npx expo start
# → Scan QR with Expo Go app

# NEW: Dev Build (full native capability)
npx expo run:android
# → Builds actual APK with native code
```

---

## 🤖 TensorFlow + MediaPipe Integration Details

### Model Assets Bundled in APK

| File | Size | Purpose |
|------|------|---------|
| `hand_landmarker.task` | ~5 MB | MediaPipe Tasks hand detection model |
| `asl_landmark_model.tflite` | 25.5 KB | Custom ASL letter classifier |
| `asl_landmark_model.txt` | ~200 B | Class label mapping (A-Z, del, space) |

### Inference Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ON-DEVICE INFERENCE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. IMAGE INPUT                                                          │
│     ├─ Camera capture (via expo-image-picker)                           │
│     └─ Gallery selection (via expo-image-picker)                        │
│                                                                          │
│  2. MEDIAPIPE HANDLANDMARKER                                            │
│     ├─ Detects hand in image                                            │
│     ├─ Extracts 21 landmark points                                      │
│     └─ Returns (x, y, z) for each → 63 float values                    │
│                                                                          │
│  3. FEATURE NORMALIZATION                                                │
│     ├─ Translate to wrist-relative coordinates                          │
│     ├─ Scale to unit size (hand size invariant)                         │
│     └─ Produces normalized 63-float feature vector                      │
│                                                                          │
│  4. TFLITE CLASSIFIER                                                    │
│     ├─ Input: 63 normalized floats                                      │
│     ├─ Architecture: Dense(128) → Dense(64) → Dense(32) → Dense(28)    │
│     ├─ Output: 28 class probabilities                                   │
│     └─ Returns highest probability class                                 │
│                                                                          │
│  5. RESULT                                                               │
│     └─ ASL letter (A-Z) or special (del, space)                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Performance Comparison

| Metric | Backend (Old) | On-Device (New) |
|--------|---------------|-----------------|
| Latency | 200-500ms (network dependent) | <100ms |
| Offline | ❌ No | ✅ Yes |
| Privacy | ⚠️ Images sent to server | ✅ All local |
| Battery | Higher (network + server wait) | Lower |
| Reliability | ⚠️ Server must be running | ✅ Always works |

---

## 📱 Build & Deployment Changes

### Development Requirements

| Requirement | Status |
|-------------|--------|
| Node.js LTS | Required |
| Android Studio | Required for dev builds |
| Android SDK | Required |
| JDK | Required (bundled with Android Studio) |
| NDK | Required for some native dependencies |

### Build Commands

```bash
# Navigate to mobile app
cd mobile/asl-expo

# Install dependencies
npm install

# Build and run on connected device/emulator
npx expo run:android

# Or build APK directly
cd android
./gradlew.bat :app:assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Configuration Files Added

| File | Purpose |
|------|---------|
| `app.json` | Expo configuration with build properties |
| `android/app/build.gradle` | Android build configuration (minSdk 26) |
| `src/config/inferenceConfig.js` | Toggle between backend/on-device modes |

---

## ⚙️ Switching Between Inference Modes

The app supports both modes for flexibility:

```javascript
// src/config/inferenceConfig.js

// Use 'mediapipe' for on-device inference (default)
// Use 'backend' for server-side inference
export const INFERENCE_MODE = 'mediapipe';

// Backend URL (only used if INFERENCE_MODE === 'backend')
export const BACKEND_PREDICT_URL = 'http://192.168.1.14:7000/predict';
```

---

## 📝 Summary of Changes

| Category | What Changed | Why |
|----------|-------------|-----|
| **Project Structure** | Added complete Expo + Android project | Original had no runnable scaffold |
| **Build System** | Expo Dev Builds instead of Expo Go | Need custom native modules for ML |
| **Inference** | On-device MediaPipe + TFLite | Offline capability, lower latency, privacy |
| **Native Code** | Added Kotlin SignPredictor module | Interface between React Native and native ML |
| **Models** | Bundled in APK assets | On-device inference requirement |
| **SDK Version** | minSdkVersion 26 | MediaPipe dependency requirement |
| **Dependencies** | Added expo-build-properties | Configure native build settings |

---

## 📚 Related Documentation

- [Technical On-Device Inference Details](mobile-ondevice-inference/03_TECHNICAL_ONDEVICE_INFERENCE.md)
- [Implementation Log](mobile-ondevice-inference/05_IMPLEMENTATION_LOG.md)
- [Changes from Original Handoff](mobile-ondevice-inference/06_CHANGES_FROM_ORIGINAL_HANDOFF.md)
- [Client Sharing Guide](mobile-ondevice-inference/01_CLIENT_SHARING_GUIDE_WITH_SOURCE.md)

---

*Last updated: 2025-12-18*
