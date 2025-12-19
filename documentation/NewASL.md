# NewASL-App — Complete Project Documentation

This document provides comprehensive details about every component of the NewASL-App project, including file purposes, locations, and how they interconnect.

---

## 📋 Project Overview

**NewASL-App** is a mobile application for **American Sign Language (ASL) alphabet recognition** with **on-device AI inference**. The app captures a photo of an ASL hand sign and instantly predicts the letter using MediaPipe + TensorFlow Lite running entirely on the phone.

### Key Highlights

| Feature | Description |
|---------|-------------|
| **On-Device AI** | No internet required, works offline |
| **Speed** | <100ms prediction time |
| **Privacy** | Images never leave the device |
| **Accuracy** | 99.38% using landmark-based classification |
| **Platform** | Android (API 26+) |

---

## 📁 Complete Project Structure

```
NewASL-App/
├── README.md                          # Project overview and quick start
├── REACT_NATIVE_GUIDE.md              # Deployment guide for React Native
├── .gitignore                         # Git ignore rules
├── documentation/                     # All project documentation
│   ├── NewASL.md                      # This file
│   ├── MIGRATION_SIGN_LANGUAGE_TO_ASL_EXPO.md
│   └── mobile-ondevice-inference/     # Technical docs
└── mobile/
    └── asl-expo/                      # Main React Native application
```

---

## 📚 Documentation Files

### Root-Level Documentation

| File | Purpose |
|------|---------|
| `/README.md` | Main project introduction providing quick start instructions, feature overview, tech stack summary, and build commands for developers to get the app running quickly |
| `/REACT_NATIVE_GUIDE.md` | Comprehensive step-by-step guide for integrating the TFLite model into React Native, including code examples for camera components, landmark normalization, and TFLite loading |

### Documentation Folder

| File | Purpose |
|------|---------|
| `/documentation/MIGRATION_SIGN_LANGUAGE_TO_ASL_EXPO.md` | Detailed migration documentation explaining the transition from the original Sign-Language-Translator project to asl-expo, covering what changed, what stayed the same, and why Expo Go was abandoned in favor of Dev Builds |
| `/documentation/mobile-ondevice-inference/00_INDEX.md` | Table of contents and navigation index for the on-device inference documentation folder, helping readers find specific technical documents |
| `/documentation/mobile-ondevice-inference/01_CLIENT_SHARING_GUIDE_WITH_SOURCE.md` | Instructions for sharing the complete source code with other developers or team members, including prerequisites and setup steps |
| `/documentation/mobile-ondevice-inference/02_RUN_APP_ONLY_GUIDE.md` | Simplified guide for users who just want to run the pre-built APK without setting up a development environment |
| `/documentation/mobile-ondevice-inference/03_TECHNICAL_ONDEVICE_INFERENCE.md` | Deep technical documentation of the on-device inference architecture, covering the native Kotlin module, MediaPipe integration, TFLite setup, and the complete prediction pipeline |
| `/documentation/mobile-ondevice-inference/04_DETAILED_PLAN.md` | Original implementation planning document outlining the approach, decisions, and architecture design before development began |
| `/documentation/mobile-ondevice-inference/05_IMPLEMENTATION_LOG.md` | Chronological development log tracking progress, issues encountered, and solutions applied during the implementation phase |
| `/documentation/mobile-ondevice-inference/06_CHANGES_FROM_ORIGINAL_HANDOFF.md` | Summary of modifications made from the original handoff requirements, documenting deviations and their justifications |

---

## 📱 Mobile Application (`/mobile/asl-expo/`)

The main React Native application containing all UI components, business logic, and native Android code for on-device AI inference.

### Entry Points & Configuration

These files initialize the application, configure Expo and React Native settings, and establish the foundational providers (theme, navigation) that wrap the entire app.

| File | Purpose |
|------|---------|
| `/mobile/asl-expo/App.js` | Root component that initializes the app, wraps everything in ThemeProvider for dark/light mode support, and defines the navigation stack with all screen routes using React Navigation |
| `/mobile/asl-expo/index.js` | Expo entry point that registers the main App component with AppRegistry, serving as the bootstrap file that Expo uses to launch the application |
| `/mobile/asl-expo/app.json` | Expo configuration file containing app metadata (name, slug, version), SDK version (54), build properties including minSdkVersion 26, and plugin configurations |
| `/mobile/asl-expo/package.json` | NPM manifest defining all project dependencies (React Native, Expo, Firebase, Navigation, etc.), scripts for running/building, and project metadata |
| `/mobile/asl-expo/ThemeContext.js` | React Context provider that manages theme state (dark/light mode) and exposes theme values to all child components throughout the app |

---

### Screens (`/mobile/asl-expo/screens/`)

All user-facing screens organized by functional category. Each screen is a React component that renders a specific view and handles user interactions for that feature.

#### Authentication Screens

Screens handling user identity management including login, registration, and password recovery. These are the first screens users encounter and gate access to the main app features.

| Screen | File | Purpose |
|--------|------|---------|
| **SplashScreen** | `/mobile/asl-expo/screens/SplashScreen.js` | Initial branded loading screen displayed on app launch while Firebase initializes and authentication state is checked, then navigates to Login or Home accordingly |
| **LoginScreen** | `/mobile/asl-expo/screens/LoginScreen.js` | User authentication form with email/password inputs, Firebase authentication integration, form validation using Formik/Yup, and navigation links to Signup and Forgot Password |
| **SignupScreen** | `/mobile/asl-expo/screens/SignupScreen.js` | New user registration form collecting email, password, and confirmation, with Firebase user creation, comprehensive validation, and automatic navigation to Home on success |
| **ForgotScreen** | `/mobile/asl-expo/screens/forgotscreen.js` | Password recovery flow that accepts user email, triggers Firebase password reset email, and provides feedback on submission status |

#### Core Feature Screens

The primary functionality of the app — ASL translation in both directions. These screens contain the main value proposition and are the most frequently used features.

| Screen | File | Purpose |
|--------|------|---------|
| **HomeScreen** | `/mobile/asl-expo/screens/HomeScreen.js` | Main dashboard displaying feature cards for all app capabilities (Sign to Text, Text to Sign, Sign Library, etc.), user greeting, and quick-access navigation to all major features |
| **SignToTextScreen** | `/mobile/asl-expo/screens/SignToTextScreen.js` | Primary ASL recognition screen where users capture/select an image of a hand sign, tap "Predict Sign" to run on-device inference via the native SignPredictor module, and view the predicted letter |
| **TextToSignScreen** | `/mobile/asl-expo/screens/TextToSignScreen.js` | Reverse translation screen where users type text and see corresponding ASL sign animations/images for each letter, helping users learn how to form signs |

#### Reference Screens

Educational and learning resources where users can browse and study ASL signs. These serve as a dictionary/reference guide for users learning sign language.

| Screen | File | Purpose |
|--------|------|---------|
| **SignLibraryScreen** | `/mobile/asl-expo/screens/SignLibraryScreen.js` | Navigation hub for browsing the sign library, providing access to alphabet signs and number signs categories |
| **AlphabetScreen** | `/mobile/asl-expo/screens/AlphabetScreen.js` | Visual reference displaying all 26 ASL alphabet letters (A-Z) with images showing correct hand positions for each letter |
| **NumberScreen** | `/mobile/asl-expo/screens/NumberScreen.js` | Visual reference displaying ASL number signs (0-9) with images showing correct hand positions for each number |

#### Utility Screens

Supporting screens that enhance user experience but are not core to the translation functionality. Includes history tracking and app information.

| Screen | File | Purpose |
|--------|------|---------|
| **HistoryScreen** | `/mobile/asl-expo/screens/HistoryScreen.js` | Displays user's past translation attempts, allowing them to review previous predictions and track their learning progress |
| **AboutScreen** | `/mobile/asl-expo/screens/AboutScreen.js` | App information screen showing version details, credits, technology used, and links to additional resources |

#### Screen Configuration

Shared configuration files used by screens, including third-party service initialization.

| File | Purpose |
|------|---------|
| `/mobile/asl-expo/screens/firebaseConfig.js` | Firebase initialization and configuration file containing API keys, project ID, and other Firebase settings required for authentication services |

---

### Source Code (`/mobile/asl-expo/src/`)

Core application logic separated from UI components. Contains configuration and inference modules that power the app's AI capabilities.

#### Configuration (`/mobile/asl-expo/src/config/`)

Centralized settings controlling app behavior. Currently manages the inference mode toggle between on-device and backend processing.

| File | Purpose |
|------|---------|
| `/mobile/asl-expo/src/config/inferenceConfig.js` | Central configuration file that controls which inference path the app uses: 'mediapipe' for on-device AI or 'backend' for server-based prediction. Also stores the backend URL for fallback mode |

**Configuration Options:**
```javascript
export const INFERENCE_MODE = 'mediapipe'; // or 'backend'
export const BACKEND_PREDICT_URL = 'http://192.168.1.14:7000/predict';
```

#### Inference (`/mobile/asl-expo/src/inference/`)

Abstraction layer for AI prediction logic. Provides a unified interface for screens to request predictions without knowing whether processing happens on-device or server-side.

| File | Purpose |
|------|---------|
| `/mobile/asl-expo/src/inference/predictSignFromImageUri.js` | Unified inference entry point that abstracts the prediction logic. Routes to either the native SignPredictor module (for on-device MediaPipe inference) or HTTP backend (for server-side processing) based on INFERENCE_MODE config. Returns prediction result to calling screen |

**Key Functionality:**
- If `INFERENCE_MODE === 'mediapipe'`: Calls native `NativeModules.SignPredictor.predictFromImageUri()`
- If `INFERENCE_MODE === 'backend'`: Uploads image via HTTP POST to backend server

---

### Android Native Code (`/mobile/asl-expo/android/`)

Native Android implementation using Kotlin. Contains the custom native module that bridges React Native to MediaPipe and TensorFlow Lite for on-device AI inference.

#### Native Module (Kotlin)

Kotlin classes implementing the SignPredictor native module. This bridges JavaScript calls to native Android ML libraries that cannot run in JavaScript.

| File | Purpose |
|------|---------|
| `/mobile/asl-expo/android/app/src/main/java/.../mediapipe/SignPredictorModule.kt` | Core native module implementing the entire on-device inference pipeline: resolves image URIs, decodes bitmaps with EXIF orientation correction, runs MediaPipe HandLandmarker to extract 21 landmarks, normalizes 63 features, runs TFLite classifier, and returns the predicted ASL letter to JavaScript |
| `/mobile/asl-expo/android/app/src/main/java/.../mediapipe/SignPredictorPackage.kt` | React Native package class that registers SignPredictorModule with the React Native bridge, making the native methods accessible from JavaScript via NativeModules |
| `/mobile/asl-expo/android/app/src/main/java/.../MainApplication.kt` | Android application class that includes SignPredictorPackage in the list of React Native packages, ensuring the native module is loaded when the app starts |

#### AI Model Assets (`/mobile/asl-expo/android/app/src/main/assets/`)

Pre-trained AI models bundled directly into the APK for offline inference. These are the brain of the on-device prediction system.

| File | Size | Purpose |
|------|------|---------|
| `hand_landmarker.task` | ~5 MB | Google's MediaPipe Tasks hand detection model that locates hands in images and extracts 21 precise landmark points (fingertips, joints, wrist) with x, y, z coordinates |
| `asl_landmark_model.tflite` | 25.5 KB | Custom-trained TensorFlow Lite classifier that takes 63 normalized landmark features and outputs probability scores for 28 ASL classes (A-Z plus 'del' and 'space') |
| `asl_landmark_model.txt` | ~200 B | Plain text file mapping output indices to human-readable class labels, used to convert the model's numeric predictions to letter strings |

---

## 🔄 Inference Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ON-DEVICE INFERENCE FLOW                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User taps "Open Camera" or "Open Gallery"                           │
│     └─ SignToTextScreen.js (expo-image-picker)                          │
│                                                                          │
│  2. User taps "Predict Sign"                                             │
│     └─ SignToTextScreen.js calls predictSignFromImageUri()              │
│                                                                          │
│  3. JS routes to native module                                           │
│     └─ predictSignFromImageUri.js → NativeModules.SignPredictor         │
│                                                                          │
│  4. Native module processes image                                        │
│     └─ SignPredictorModule.kt:                                          │
│        a) Resolve image URI                                              │
│        b) Decode bitmap with EXIF correction                            │
│        c) Run MediaPipe HandLandmarker                                   │
│        d) Extract 21 landmarks × 3 coords = 63 features                 │
│        e) Normalize features (wrist-relative, scale-invariant)          │
│        f) Run TFLite classifier                                          │
│        g) Return predicted letter                                        │
│                                                                          │
│  5. Result displayed in UI                                               │
│     └─ SignToTextScreen.js shows prediction                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React Native + Expo SDK 54 | Cross-platform mobile development framework providing JavaScript runtime and native APIs |
| **Navigation** | React Navigation 7.x | Stack-based screen navigation with gesture support and deep linking |
| **UI Components** | React Native built-in + Vector Icons | Core UI primitives (View, Text, Image) plus icon library for visual elements |
| **Theme** | ThemeContext (custom) | Centralized theme management enabling dark/light mode switching |
| **Authentication** | Firebase Auth | Secure user authentication with email/password, session management |
| **Forms** | Formik + Yup | Declarative form state management and schema-based validation |
| **HTTP** | Axios | Promise-based HTTP client for backend API communication in fallback mode |
| **Image Picker** | expo-image-picker | Native camera and gallery access for capturing/selecting images |
| **AI Detection** | MediaPipe Tasks Vision | Google's on-device hand landmark detection extracting 21 keypoints |
| **AI Classification** | TensorFlow Lite | Lightweight on-device ML inference for ASL letter prediction |
| **Native Code** | Kotlin (Android) | Native module bridging React Native to Android-specific ML libraries |

---

## 📦 Dependencies

From `/mobile/asl-expo/package.json`:

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.26",
  "@react-navigation/native-stack": "^7.9.0",
  "axios": "^1.13.2",
  "expo": "~54.0.30",
  "expo-build-properties": "^1.0.10",
  "expo-image-picker": "~17.0.10",
  "expo-status-bar": "~3.0.9",
  "firebase": "^12.7.0",
  "formik": "^2.4.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "^2.29.1",
  "react-native-safe-area-context": "^5.6.2",
  "react-native-screens": "^4.19.0",
  "react-native-vector-icons": "^10.3.0",
  "yup": "^1.7.1"
}
```

---

## 🚀 Build & Run Commands

### Development

```bash
# Navigate to app directory
cd mobile/asl-expo

# Install dependencies
npm install

# Run on Android device/emulator
npx expo run:android
```

### Build Debug APK

```bash
cd mobile/asl-expo/android
./gradlew.bat :app:assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Build Release APK

Release APKs are optimized, minified, and must be signed for distribution.

```bash
cd mobile/asl-expo/android
./gradlew.bat :app:assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

> **Note:** For release builds, you need to configure signing. Add your keystore to `android/app` and update `android/app/build.gradle` with signing config, or sign manually using:
> ```bash
> # Sign with your keystore
> jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore your-keystore.jks app-release-unsigned.apk your-key-alias
> 
> # Align the APK
> zipalign -v 4 app-release-unsigned.apk app-release-signed.apk
> ```

---

## ⚠️ Important Notes

1. **Expo Go Not Supported** — This app requires custom native code (MediaPipe + TFLite) which cannot run in Expo Go. Use `npx expo run:android` instead.

2. **Android Only** — iOS native module is not yet implemented.

3. **Still Images Only** — Real-time video inference is not implemented; uses camera capture or gallery selection.

4. **Min SDK 26** — MediaPipe Tasks requires Android 8.0+ (API 26) due to Java MethodHandle dependencies.

---

## 🔗 Related Documentation

- [Migration Documentation](/documentation/MIGRATION_SIGN_LANGUAGE_TO_ASL_EXPO.md) — Why this architecture
- [Technical Details](/documentation/mobile-ondevice-inference/03_TECHNICAL_ONDEVICE_INFERENCE.md) — Full on-device inference documentation
- [React Native Guide](/REACT_NATIVE_GUIDE.md) — Deployment guide

---

*Last updated: 2025-12-20*
