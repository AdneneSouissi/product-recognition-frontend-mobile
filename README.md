# Product Recognition Mobile App

A React Native mobile application built with Expo that provides real-time product recognition using your camera or image gallery. This app seamlessly integrates with the FastAPI backend to deliver the same functionality as the web version, optimized for mobile devices.

## 🚀 Features

- **📷 Camera Integration**: Take photos directly with your device camera
- **🖼️ Image Gallery**: Select images from your photo library
- **🔄 Real-time Recognition**: Live product detection using WebSocket connection
- **🎯 Bounding Box Visualization**: Visual overlay showing detected products
- **💾 Database Storage**: Save detected products to the backend database
- **📱 Mobile Optimized**: Responsive design for various screen sizes
- **🔗 Backend Integration**: Seamless connection to FastAPI backend

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)
- Running FastAPI backend server

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd product-recognition-frontend-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the backend API URL:**
   - Open `src/config/config.js`
   - Update the `API_BASE_URL` with your backend server's IP address
   - Find your IP address:
     - Windows: `ipconfig`
     - Mac/Linux: `ifconfig`
   - Example: `API_BASE_URL: 'http://192.168.1.100:8000'`

## 🚀 Running the App

1. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

2. **Run on your device:**
   - **Physical Device**: Scan the QR code with Expo Go app
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## 📱 App Usage

### Taking Photos
1. Tap "Use Camera" to access the camera
2. Point camera at products
3. Tap the camera button (📷) to capture
4. View predictions with bounding boxes

### Selecting Images
1. Tap "Pick Image" to access gallery
2. Select an image with products
3. Automatic prediction will run
4. View results with visual overlays

### Real-time Detection
1. In camera mode, tap the play button (▶️)
2. App will continuously analyze camera feed
3. See live predictions with bounding boxes
4. Tap stop button (⏹️) to end real-time mode

### Saving to Database
1. After detection, tap "Save to Database" (💾)
2. All detected products will be saved to backend
3. Success confirmation will appear

## 🔧 Configuration

### API Configuration (`src/config/config.js`)
```javascript
export const CONFIG = {
  API_BASE_URL: 'http://YOUR_IP_ADDRESS:8000',
  // ... other settings
};
```

### Permissions
The app automatically requests necessary permissions:
- **Camera**: For taking photos and real-time detection
- **Photo Library**: For selecting images from gallery

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── BoundingBoxOverlay.js   # Visual overlay for predictions
├── services/           # API and business logic
│   └── PredictionService.js    # Backend communication
├── styles/             # Styling and themes
│   └── AppStyles.js           # Application styles
└── config/             # Configuration files
    └── config.js              # API and app settings
```

## 🔌 Backend Integration

This mobile app integrates with the FastAPI backend through:

- **REST API**: Image prediction endpoint (`/predict`)
- **WebSocket**: Real-time prediction stream (`/ws/predict`)
- **Database**: Save products endpoint (`/add_to_database`)

Ensure your backend server is running and accessible from your mobile device's network.

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error" or "Connection Failed"**
   - Check if backend server is running
   - Verify IP address in config.js
   - Ensure mobile device is on same network

2. **Camera Permission Denied**
   - Grant camera permissions in device settings
   - Restart the app after granting permissions

3. **WebSocket Connection Issues**
   - Check if WebSocket endpoint is accessible
   - Verify firewall settings on backend server

4. **App Crashes on Camera Usage**
   - Ensure all camera-related packages are properly installed
   - Check Expo Go app is updated to latest version

### Getting Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address under your active network interface.

## 📦 Dependencies

- **expo**: Expo SDK framework
- **expo-camera**: Camera functionality
- **expo-image-picker**: Image gallery access
- **expo-file-system**: File operations
- **react-native-svg**: SVG graphics for bounding boxes
- **@react-native-async-storage/async-storage**: Local storage

## 🔄 Development Workflow

1. **Make changes** to the code
2. **Save files** - Expo will auto-reload
3. **Test on device** using Expo Go
4. **Debug** using Expo DevTools

## 🌐 Network Configuration

For local development:
- Backend and mobile device must be on same WiFi network
- Backend should bind to `0.0.0.0:8000` not `127.0.0.1:8000`
- Update config.js with your computer's local IP address

## 📝 Notes

- The app mirrors all functionality from the web version
- Optimized for mobile user experience
- Uses native mobile features (camera, gallery)
- Maintains the same visual style as web app
- Clean, modular architecture for easy maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## 📄 License

This project is licensed under the same license as the main product recognition project.
