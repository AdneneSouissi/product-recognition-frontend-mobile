import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#181c24',
  },
  
  header: {
    backgroundColor: '#23283a',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#181c24',
  },
  
  camera: {
    flex: 1,
    width: '100%',
  },
  
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  
  imagePreview: {
    width: screenWidth,
    height: screenHeight * 0.6,
    resizeMode: 'contain',
  },
  
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  previewControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  selectionControls: {
    padding: 20,
    gap: 15,
  },
  
  controlButton: {
    backgroundColor: '#0078d4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  captureButton: {
    backgroundColor: '#0078d4',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 50,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButton: {
    backgroundColor: '#0078d4',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  
  saveButton: {
    backgroundColor: '#ffb300',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  saveButtonLarge: {
    backgroundColor: '#ffb300',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  
  activeButton: {
    backgroundColor: '#00b96b',
  },
  
  disabledButton: {
    backgroundColor: '#888888',
    opacity: 0.7,
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  connectionStatus: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  
  connectedText: {
    color: '#00ff90',
    fontSize: 14,
    fontWeight: '600',
  },
  
  predictionsContainer: {
    backgroundColor: '#23283a',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
  },
  
  predictionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b96b',
    marginBottom: 12,
  },
  
  predictionsList: {
    maxHeight: 150,
  },
  
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  
  predictionClass: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffb300',
    flex: 1,
  },
  
  predictionConfidence: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 10,
  },
  
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  loadingText: {
    color: '#ffb300',
    fontSize: 16,
    marginTop: 10,
  },
  
  permissionContainer: {
    flex: 1,
    backgroundColor: '#181c24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  permissionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
