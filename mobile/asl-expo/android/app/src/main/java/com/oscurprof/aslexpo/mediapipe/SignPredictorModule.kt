package com.oscurprof.aslexpo.mediapipe

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.exifinterface.media.ExifInterface

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult

import org.tensorflow.lite.Interpreter

import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel

class SignPredictorModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SignPredictor"

  @Volatile private var handLandmarker: HandLandmarker? = null
  @Volatile private var interpreter: Interpreter? = null
  @Volatile private var labels: List<String>? = null

  @ReactMethod
  fun predictFromImageUri(imageUri: String, promise: Promise) {
    try {
      val bitmap = loadBitmapFromUri(imageUri)
        ?: return promise.reject("E_IMAGE", "Could not decode image")

      val rotatedBitmap = rotateBitmapIfNeeded(bitmap, imageUri)

      val handResult = detectHand(rotatedBitmap)
        ?: return promise.resolve("")

      val features = extractFeatures(handResult)
        ?: return promise.resolve("")

      val prediction = runAslClassifier(features)
      promise.resolve(prediction)
    } catch (e: Exception) {
      promise.reject("E_PREDICT", e.message, e)
    }
  }

  private fun detectHand(bitmap: Bitmap): HandLandmarkerResult? {
    val landmarker = ensureHandLandmarker()

    val mpImage = BitmapImageBuilder(bitmap).build()
    val result = landmarker.detect(mpImage)

    // No hands detected
    if (result.landmarks().isEmpty()) {
      return null
    }

    return result
  }

  private fun extractFeatures(result: HandLandmarkerResult): FloatArray? {
    // We only support a single hand for now (matches training assumptions)
    val handLandmarks: List<NormalizedLandmark> = result.landmarks()[0]
    if (handLandmarks.size < 21) return null

    // Flatten as [x1,y1,z1, ..., x21,y21,z21] (63 floats)
    val raw = FloatArray(63)
    for (i in 0 until 21) {
      val lm = handLandmarks[i]
      raw[i * 3 + 0] = lm.x()
      raw[i * 3 + 1] = lm.y()
      raw[i * 3 + 2] = lm.z()
    }

    return normalizeLandmarks(raw)
  }

  /**
   * Mirror of Python normalize_landmarks() used in training:
   * - wrist-relative
   * - scale-invariant (divide by max distance to wrist)
   */
  private fun normalizeLandmarks(landmarks: FloatArray): FloatArray {
    // landmarks: 63 floats
    val out = landmarks.copyOf()

    val wristX = out[0]
    val wristY = out[1]
    val wristZ = out[2]

    // Make relative to wrist
    for (i in 0 until 21) {
      out[i * 3 + 0] -= wristX
      out[i * 3 + 1] -= wristY
      out[i * 3 + 2] -= wristZ
    }

    // Max distance from wrist
    var maxDist = 0f
    for (i in 0 until 21) {
      val x = out[i * 3 + 0]
      val y = out[i * 3 + 1]
      val z = out[i * 3 + 2]
      val dist = kotlin.math.sqrt(x * x + y * y + z * z)
      if (dist > maxDist) maxDist = dist
    }

    if (maxDist < 1e-6f) maxDist = 1e-6f

    // Scale
    for (i in out.indices) {
      out[i] /= maxDist
    }

    return out
  }

  private fun runAslClassifier(features63: FloatArray): String {
    val tflite = ensureInterpreter()
    val labelList = ensureLabels()

    // Input: (1, 63)
    val input = ByteBuffer.allocateDirect(4 * 63).order(ByteOrder.nativeOrder())
    for (v in features63) input.putFloat(v)

    // Output: (1, numClasses)
    val output = Array(1) { FloatArray(labelList.size) }

    tflite.run(input, output)

    val probs = output[0]
    var bestIdx = 0
    var bestVal = probs[0]
    for (i in 1 until probs.size) {
      if (probs[i] > bestVal) {
        bestVal = probs[i]
        bestIdx = i
      }
    }

    return labelList[bestIdx]
  }

  private fun ensureHandLandmarker(): HandLandmarker {
    val cached = handLandmarker
    if (cached != null) return cached

    synchronized(this) {
      val cached2 = handLandmarker
      if (cached2 != null) return cached2

      val baseOptions = BaseOptions.builder()
        .setModelAssetPath("hand_landmarker.task")
        .build()

      val options = HandLandmarker.HandLandmarkerOptions.builder()
        .setBaseOptions(baseOptions)
        .setRunningMode(RunningMode.IMAGE)
        .setNumHands(1)
        .build()

      val created = HandLandmarker.createFromOptions(reactContext, options)
      handLandmarker = created
      return created
    }
  }

  private fun ensureInterpreter(): Interpreter {
    val cached = interpreter
    if (cached != null) return cached

    synchronized(this) {
      val cached2 = interpreter
      if (cached2 != null) return cached2

      val model = loadAssetMapped("asl_landmark_model.tflite")
      val created = Interpreter(model)
      interpreter = created
      return created
    }
  }

  private fun ensureLabels(): List<String> {
    val cached = labels
    if (cached != null) return cached

    synchronized(this) {
      val cached2 = labels
      if (cached2 != null) return cached2

      val list = readAssetLines("asl_landmark_model.txt")
      labels = list
      return list
    }
  }

  private fun readAssetLines(assetName: String): List<String> {
    reactContext.assets.open(assetName).use { inputStream ->
      BufferedReader(InputStreamReader(inputStream)).use { reader ->
        val lines = mutableListOf<String>()
        var line: String?
        while (reader.readLine().also { line = it } != null) {
          val trimmed = line!!.trim()
          if (trimmed.isNotEmpty()) lines.add(trimmed)
        }
        return lines
      }
    }
  }

  private fun loadAssetMapped(assetName: String): ByteBuffer {
    val assetFileDescriptor = reactContext.assets.openFd(assetName)
    val inputStream = assetFileDescriptor.createInputStream()
    val fileChannel = inputStream.channel
    val startOffset = assetFileDescriptor.startOffset
    val declaredLength = assetFileDescriptor.declaredLength

    return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
  }

  private fun loadBitmapFromUri(uriString: String): Bitmap? {
    val uri = Uri.parse(uriString)

    val inputStream: InputStream? = when (uri.scheme) {
      ContentResolver.SCHEME_CONTENT -> reactContext.contentResolver.openInputStream(uri)
      ContentResolver.SCHEME_FILE -> reactContext.contentResolver.openInputStream(uri)
      else -> reactContext.contentResolver.openInputStream(uri)
    }

    inputStream.use { stream ->
      if (stream == null) return null
      return BitmapFactory.decodeStream(stream)
    }
  }

  private fun rotateBitmapIfNeeded(bitmap: Bitmap, uriString: String): Bitmap {
    // Try to read EXIF. If we cannot, return original bitmap.
    return try {
      val uri = Uri.parse(uriString)
      val inputStream = reactContext.contentResolver.openInputStream(uri) ?: return bitmap
      inputStream.use { stream ->
        val exif = ExifInterface(stream)
        val orientation = exif.getAttributeInt(
          ExifInterface.TAG_ORIENTATION,
          ExifInterface.ORIENTATION_NORMAL
        )

        val matrix = android.graphics.Matrix()
        when (orientation) {
          ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
          ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
          ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
          else -> return bitmap
        }

        Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
      }
    } catch (_: Exception) {
      bitmap
    }
  }
}
