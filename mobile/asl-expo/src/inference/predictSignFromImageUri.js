import axios from 'axios';
import { NativeModules, Platform } from 'react-native';

import { BACKEND_PREDICT_URL, INFERENCE_MODE } from '../config/inferenceConfig';

export async function predictSignFromImageUri(imageUri) {
  if (!imageUri) {
    throw new Error('Missing imageUri');
  }

  if (INFERENCE_MODE === 'backend') {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, 'sign.jpg');

    const axiosResponse = await axios.post(BACKEND_PREDICT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 20000,
    });

    return {
      prediction: axiosResponse.data?.prediction ?? '',
      debug: { mode: 'backend' },
    };
  }

  if (INFERENCE_MODE === 'mediapipe') {
    if (Platform.OS !== 'android') {
      throw new Error('On-device mediapipe inference is currently implemented for Android only');
    }

    const native = NativeModules?.SignPredictor;
    if (!native?.predictFromImageUri) {
      throw new Error('Native module SignPredictor is not available (did you rebuild the native app?)');
    }

    const prediction = await native.predictFromImageUri(imageUri);
    return {
      prediction: prediction ?? '',
      debug: { mode: 'mediapipe' },
    };
  }

  throw new Error(`Unsupported INFERENCE_MODE: ${INFERENCE_MODE}`);
}
