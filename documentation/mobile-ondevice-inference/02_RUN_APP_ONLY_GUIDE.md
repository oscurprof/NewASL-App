# Sharing Guide (Run App Only — No Source Code)

This guide is for sharing the Android app to someone who will **not** build from source.

## 1) What to send

Prefer sending a **release APK** (standalone, no laptop/Metro required).

### If you have a release APK
Send:
- `app-release.apk`

### If you only have a debug APK
Send:
- `app-debug.apk`

Important:
- Some debug/dev builds show “Unable to load script… run Metro…”. If that happens, the recipient must run Metro on a laptop (so this is not truly “run-only”).

## 2) Device requirements
- Android 8.0+ (API 26+)

## 3) Install instructions (recipient)
1) Copy APK to phone (USB / Drive / email).
2) Enable unknown app installs:
   - Settings → Security/Privacy → Install unknown apps → allow your file manager/browser.
3) Tap APK and install.
4) Open the app.

## 4) If they see “Unable to load script … run Metro”
They were given a debug/dev build.

Fix options:
- Best: ask you for a **release APK** (no Metro required).
- Temporary (requires laptop): you run Metro on a laptop and connect the phone to the same Wi‑Fi or via USB.

## 5) Notes
- Debug APKs are fine for demos/testing.
- For production distribution, use a properly signed release build.
