# Mediapipe Mobile Implementation Log

This file records the work done for the Android still-image on-device inference integration.

## 2025-12-18 — Initial repo audit

Findings:
- `mobile/Sign-Language-Translator-project/` contained screen JS files only.
- No full React Native project scaffold.

Requirements confirmed:
- UI/UX must remain exactly the same.
- No real-time camera detection (still image only).
- Android required.

Decision:
- Scaffold Expo app under `mobile/asl-expo/` and reuse screens.

## 2025-12-18 — Expo app scaffold (Android-first)

Actions:
- Created Expo app under `mobile/asl-expo/`.
- Copied screen JS files into `mobile/asl-expo/screens/`.
- Added navigation wiring in `mobile/asl-expo/App.js`.
- Added `ThemeContext.js` required by screens.
- Added placeholder assets referenced by screens.

## 2025-12-18 — Inference plumbing (no UX change)

- Added `mobile/asl-expo/src/config/inferenceConfig.js` to choose backend vs on-device.
- Added `mobile/asl-expo/src/inference/predictSignFromImageUri.js` as a single inference entry point.
- Updated SignToText screen to call the helper (UI unchanged).

## 2025-12-18 — Android build constraints (minSdk 26)

Issue:
- Dexing failure because MediaPipe Tasks dependency chain requires min API 26.

Fix:
- Set Android minSdkVersion to 26.
- Persisted minSdk via Expo build properties so it survives future prebuilds.

## 2025-12-18 — Removed camera/video libraries

Reason:
- Still-image inference did not need camera/video streaming libraries.
- Some camera stacks caused Windows native build issues.

## 2025-12-18 — Final working state

- Android debug build succeeded.
- On-device inference works via `SignPredictor` native module.
- Models are bundled in `android/app/src/main/assets/`.

Related docs:
- [03_TECHNICAL_ONDEVICE_INFERENCE.md](03_TECHNICAL_ONDEVICE_INFERENCE.md)
- [01_CLIENT_SHARING_GUIDE_WITH_SOURCE.md](01_CLIENT_SHARING_GUIDE_WITH_SOURCE.md)
- [02_RUN_APP_ONLY_GUIDE.md](02_RUN_APP_ONLY_GUIDE.md)
