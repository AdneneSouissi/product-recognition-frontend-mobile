import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import BoundingBoxOverlay from './src/components/BoundingBoxOverlay';
import PredictionService from './src/services/PredictionService';
import { styles } from './src/styles/AppStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [isRealTimePrediction, setIsRealTimePrediction] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  const cameraRef = useRef();
  const wsRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    onHandlePermission();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
    setImageUri(null);
    setPredictions([]);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setImageUri(source);
        // Auto-predict the captured image
        await predictImage(source);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        const source = result.assets[0].uri;
        setImageUri(source);
        setUseCamera(false);
        setPredictions([]);
        await predictImage(source);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const predictImage = async (uri) => {
    try {
      setLoading(true);
      const predictions = await PredictionService.predictImage(uri);
      setPredictions(predictions || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to predict image');
    } finally {
      setLoading(false);
    }
  };

  const startRealTimePrediction = async () => {
    try {
      const connected = await PredictionService.connectWebSocket((predictions) => {
        setPredictions(predictions || []);
      });
      
      if (connected) {
        setWsConnected(true);
        setIsRealTimePrediction(true);
        
        // Start capturing frames periodically
        intervalRef.current = setInterval(async () => {
          if (cameraRef.current && isRealTimePrediction) {
            try {
              const photo = await cameraRef.current.takePictureAsync({
                quality: 0.3,
                base64: false,
              });
              await PredictionService.sendFrameToWebSocket(photo.uri);
            } catch (error) {
              console.log('Frame capture error:', error);
            }
          }
        }, 1000); // Capture every second
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start real-time prediction');
    }
  };

  const stopRealTimePrediction = () => {
    setIsRealTimePrediction(false);
    setWsConnected(false);
    setPredictions([]);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    PredictionService.disconnectWebSocket();
  };

  const saveToDatabase = async () => {
    if (!imageUri || predictions.length === 0) {
      Alert.alert('Error', 'No image or predictions to save');
      return;
    }

    try {
      setLoading(true);
      await PredictionService.saveToDatabase(imageUri, predictions);
      Alert.alert('Success', 'Products saved to database!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to database');
    } finally {
      setLoading(false);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={Camera.Constants.FlashMode.off}
          onCameraReady={onCameraReady}
          onMountError={(error) => {
            console.log('camera error', error);
          }}
        />
        <BoundingBoxOverlay 
          predictions={predictions} 
          containerStyle={styles.camera}
        />
        
        <View style={styles.cameraControls}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onPress={switchCamera}
            style={styles.controlButton}
          >
            <Text style={styles.buttonText}>🔄</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onPress={takePicture}
            style={[styles.captureButton, !isCameraReady && styles.disabledButton]}
          >
            <Text style={styles.buttonText}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onPress={isRealTimePrediction ? stopRealTimePrediction : startRealTimePrediction}
            style={[styles.controlButton, isRealTimePrediction && styles.activeButton]}
          >
            <Text style={styles.buttonText}>
              {isRealTimePrediction ? '⏹️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>

        {wsConnected && (
          <View style={styles.connectionStatus}>
            <Text style={styles.connectedText}>🟢 Connected</Text>
          </View>
        )}
      </View>
    );
  };

  const renderImagePreview = () => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <BoundingBoxOverlay 
            predictions={predictions} 
            containerStyle={styles.imagePreview}
          />
        </View>
        
        <View style={styles.previewControls}>
          <TouchableOpacity onPress={cancelPreview} style={styles.controlButton}>
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={takePicture} style={styles.controlButton}>
            <Text style={styles.buttonText}>🔄</Text>
          </TouchableOpacity>
          
          {predictions.length > 0 && (
            <TouchableOpacity onPress={saveToDatabase} style={styles.saveButton}>
              <Text style={styles.buttonText}>💾</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderImageSelection = () => {
    return (
      <View style={styles.container}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <BoundingBoxOverlay 
              predictions={predictions} 
              containerStyle={styles.imagePreview}
            />
          </View>
        )}
        
        <View style={styles.selectionControls}>
          <TouchableOpacity onPress={pickImage} style={styles.primaryButton}>
            <Text style={styles.buttonText}>📁 Pick Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setUseCamera(true)} 
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>📱 Use Camera</Text>
          </TouchableOpacity>
        </View>
        
        {predictions.length > 0 && (
          <TouchableOpacity onPress={saveToDatabase} style={styles.saveButtonLarge}>
            <Text style={styles.buttonText}>💾 Save to Database</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPredictions = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
          <Text style={styles.loadingText}>Predicting...</Text>
        </View>
      );
    }

    if (predictions.length === 0) {
      return null;
    }

    return (
      <View style={styles.predictionsContainer}>
        <Text style={styles.predictionsTitle}>🎯 Predictions</Text>
        <ScrollView style={styles.predictionsList}>
          {predictions.map((pred, idx) => (
            <View key={idx} style={styles.predictionItem}>
              <Text style={styles.predictionClass}>{pred.class}</Text>
              <Text style={styles.predictionConfidence}>
                ({(pred.confidence * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#0078d4" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission not granted</Text>
        <TouchableOpacity onPress={onHandlePermission} style={styles.primaryButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Product Recognition</Text>
      </View>

      {useCamera ? (
        isPreview ? renderImagePreview() : renderCamera()
      ) : (
        renderImageSelection()
      )}

      {renderPredictions()}
    </View>
  );
}
