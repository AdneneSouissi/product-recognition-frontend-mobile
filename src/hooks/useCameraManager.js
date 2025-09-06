import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';

/**
 * Custom hook for managing camera functionality
 */
export const useCameraManager = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const cameraRef = useRef();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async (options = {}) => {
    if (cameraRef.current && isCameraReady) {
      const defaultOptions = {
        quality: 0.7,
        base64: false,
        skipProcessing: false,
      };
      
      try {
        const result = await cameraRef.current.takePictureAsync({
          ...defaultOptions,
          ...options,
        });
        return result;
      } catch (error) {
        console.error('Error taking picture:', error);
        throw error;
      }
    }
    return null;
  };

  const pausePreview = async () => {
    if (cameraRef.current) {
      await cameraRef.current.pausePreview();
    }
  };

  const resumePreview = async () => {
    if (cameraRef.current) {
      await cameraRef.current.resumePreview();
    }
  };

  return {
    hasPermission,
    cameraType,
    isCameraReady,
    isRecording,
    cameraRef,
    requestPermissions,
    switchCamera,
    takePicture,
    pausePreview,
    resumePreview,
    setIsCameraReady,
    setIsRecording,
  };
};
