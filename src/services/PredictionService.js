import * as FileSystem from 'expo-file-system';
import { CONFIG, API_ENDPOINTS } from '../config/config';

class PredictionService {
  constructor() {
    this.API_BASE_URL = CONFIG.API_BASE_URL;
    this.ws = null;
    this.onPredictionCallback = null;
  }

  /**
   * Predict image using the FastAPI backend
   */
  async predictImage(imageUri) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(API_ENDPOINTS.PREDICT, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.predictions || [];
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Connect to WebSocket for real-time predictions
   */
  async connectWebSocket(onPredictionReceived) {
    return new Promise((resolve, reject) => {
      try {
        this.onPredictionCallback = onPredictionReceived;
        this.ws = new WebSocket(API_ENDPOINTS.WS_PREDICT);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.predictions && this.onPredictionCallback) {
              this.onPredictionCallback(data.predictions);
            }
          } catch (error) {
            console.error('WebSocket message parse error:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.ws = null;
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send frame to WebSocket for real-time prediction
   */
  async sendFrameToWebSocket(imageUri) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      // Read the image file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob-like data for WebSocket
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      this.ws.send(bytes.buffer);
    } catch (error) {
      console.error('Error sending frame to WebSocket:', error);
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onPredictionCallback = null;
  }

  /**
   * Save detected products to database
   */
  async saveToDatabase(imageUri, predictions) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'detected_products.jpg',
      });
      formData.append('predictions', JSON.stringify(predictions));

      const response = await fetch(API_ENDPOINTS.ADD_TO_DATABASE, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.saved_products || [];
    } catch (error) {
      console.error('Save to database error:', error);
      throw error;
    }
  }

  /**
   * Update API base URL (for different network configurations)
   */
  setApiBaseUrl(url) {
    this.API_BASE_URL = url;
  }
}

export default new PredictionService();
