// Central place to control which inference path SignToText uses.
// UI/UX stays unchanged; only the implementation behind the Predict button changes.

/**
 * Possible values:
 * - 'backend': current behavior (uploads image to server and reads prediction)
 * - 'mediapipe': on-device pipeline (Android native MediaPipe Tasks + TFLite)
 */
export const INFERENCE_MODE = 'mediapipe';

// Keep your existing endpoint as default to avoid breaking behavior while
// we integrate on-device mediapipe.
export const BACKEND_PREDICT_URL = 'http://192.168.1.14:7000/predict';
