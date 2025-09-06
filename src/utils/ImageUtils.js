import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { CONFIG } from '../config/config';

/**
 * Utility class for image processing and manipulation
 */
class ImageUtils {
  /**
   * Pick an image from the device gallery
   */
  static async pickImageFromGallery(options = {}) {
    try {
      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: CONFIG.COMPRESSION_QUALITY,
      };

      const result = await ImagePicker.launchImageLibraryAsync({
        ...defaultOptions,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      throw error;
    }
  }

  /**
   * Take a photo using the camera
   */
  static async takePhoto(options = {}) {
    try {
      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: CONFIG.COMPRESSION_QUALITY,
      };

      const result = await ImagePicker.launchCameraAsync({
        ...defaultOptions,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  /**
   * Get image dimensions
   */
  static async getImageDimensions(uri) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        return new Promise((resolve, reject) => {
          Image.getSize(
            uri,
            (width, height) => resolve({ width, height }),
            (error) => reject(error)
          );
        });
      }
      return null;
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      throw error;
    }
  }

  /**
   * Resize image if it exceeds maximum dimensions
   */
  static async resizeImageIfNeeded(uri) {
    try {
      const dimensions = await this.getImageDimensions(uri);
      if (!dimensions) return uri;

      const { width, height } = dimensions;
      const maxWidth = CONFIG.MAX_IMAGE_WIDTH;
      const maxHeight = CONFIG.MAX_IMAGE_HEIGHT;

      if (width <= maxWidth && height <= maxHeight) {
        return uri;
      }

      // Calculate new dimensions maintaining aspect ratio
      const aspectRatio = width / height;
      let newWidth, newHeight;

      if (width > height) {
        newWidth = Math.min(width, maxWidth);
        newHeight = newWidth / aspectRatio;
      } else {
        newHeight = Math.min(height, maxHeight);
        newWidth = newHeight * aspectRatio;
      }

      // For React Native, we'll return the original URI
      // In a real implementation, you might use react-native-image-resizer
      return uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      return uri;
    }
  }

  /**
   * Convert image to base64
   */
  static async imageToBase64(uri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  /**
   * Create FormData from image URI
   */
  static createFormDataFromImage(uri, filename = 'image.jpg') {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: filename,
    });
    return formData;
  }

  /**
   * Validate image file
   */
  static isValidImageFile(uri) {
    if (!uri) return false;
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const extension = uri.toLowerCase().split('.').pop();
    
    return validExtensions.some(ext => ext.includes(extension));
  }

  /**
   * Calculate scale factors for bounding box overlay
   */
  static calculateScaleFactors(imageWidth, imageHeight, containerWidth, containerHeight) {
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    
    // Use the smaller scale to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY);
    
    return {
      scaleX: scale,
      scaleY: scale,
      offsetX: (containerWidth - imageWidth * scale) / 2,
      offsetY: (containerHeight - imageHeight * scale) / 2,
    };
  }
}

export default ImageUtils;
