/**
 * Configuration file for the Product Recognition Mobile App
 * 
 * Update the API_BASE_URL to match your backend server IP address
 * For local development, replace with your computer's IP address
 */

export const CONFIG = {
  // Update this with your actual backend IP address
  // You can find your IP by running 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
  API_BASE_URL: 'http://192.168.1.100:8000',
  
  // Alternative configurations for different environments
  DEVELOPMENT: {
    API_BASE_URL: 'http://192.168.1.100:8000',
  },
  
  PRODUCTION: {
    API_BASE_URL: 'https://your-production-api.com',
  },
  
  // WebSocket configuration
  WS_RECONNECT_INTERVAL: 3000,
  WS_MAX_RECONNECT_ATTEMPTS: 5,
  
  // Camera configuration
  CAMERA_QUALITY: 0.7,
  REAL_TIME_CAPTURE_INTERVAL: 1000, // milliseconds
  
  // Image processing configuration
  MAX_IMAGE_WIDTH: 800,
  MAX_IMAGE_HEIGHT: 600,
  COMPRESSION_QUALITY: 0.8,
};

/**
 * Get API base URL based on environment
 */
export const getApiBaseUrl = () => {
  // You can add environment detection logic here
  return CONFIG.API_BASE_URL;
};

/**
 * Helper function to construct API endpoints
 */
export const API_ENDPOINTS = {
  PREDICT: `${getApiBaseUrl()}/predict`,
  WS_PREDICT: `ws://${getApiBaseUrl().replace('http://', '')}/ws/predict`,
  ADD_TO_DATABASE: `${getApiBaseUrl()}/add_to_database`,
};
