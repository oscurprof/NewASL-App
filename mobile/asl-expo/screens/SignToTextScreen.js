import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../ThemeContext";

import { predictSignFromImageUri } from "../src/inference/predictSignFromImageUri";

const SignToTextScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  //  Open Camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setPrediction("");
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Gallery access is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setPrediction("");
    }
  };

  const predictSign = async () => {
    if (!imageUri) return;

    setLoading(true);

    try {
      const result = await predictSignFromImageUri(imageUri);
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Prediction error:", error);

      if (error.message.includes("Network Error") || error.code === "ECONNREFUSED") {
        Alert.alert(
          "Backend Not Running",
          "Cannot connect to the backend. Please make sure your backend server is running and reachable."
        );
      } else {
        Alert.alert(
          "Prediction Failed",
          "Failed to predict sign. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageUri(null);
    setPrediction("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {}
      <View style={styles.header}>
        <View style={styles.headerBox}>
          <Text style={styles.headerBoxText}>Sign to Text</Text>
        </View>
      </View>

      {}
      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <Text style={[styles.instructionText, { color: theme.textColor }]}>
          Capture or select an image of ASL sign to detect the letter
        </Text>

        {}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={openCamera}
          >
            <Text style={styles.optionButtonText}> Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={openGallery}
          >
            <Text style={styles.optionButtonText}> Open Gallery</Text>
          </TouchableOpacity>
        </View>

        {}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.capturedImage} />
          </View>
        )}

        {}
        {imageUri && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.predictButton]} 
              onPress={predictSign}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? "Processing..." : "Predict Sign"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.clearButton]} 
              onPress={clearImage}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}> Clear Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1F3A93" />
            <Text style={[styles.loadingText, { color: theme.textColor }]}>
              Analyzing sign...
            </Text>
          </View>
        )}

        {}
        {prediction !== "" && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Detected Letter:</Text>
            <Text style={styles.resultLetter}>
              {prediction}
            </Text>
          </View>
        )}
      </ScrollView>

      {}
      <View style={styles.bottomButtonContainer}>
        <View style={styles.rowButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: '#1F3A93',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center', 
    alignItems: 'center',     
    marginBottom: 20,
  },
  headerBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBoxText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#1F3A93',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 140,
    elevation: 3,
  },
  optionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  capturedImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#1F3A93',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 15,
    width: '100%',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  predictButton: {
    backgroundColor: '#1F3A93',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(31, 58, 147, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#1F3A93',
    width: '100%',
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1F3A93',
  },
  resultLetter: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1F3A93',
  },
  bottomButtonContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#1F3A93',
    padding: 12,
    borderRadius: 20,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});

export default SignToTextScreen;