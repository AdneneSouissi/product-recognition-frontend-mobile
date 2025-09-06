# 🚀 Deployment & Testing Guide

## Quick Start Checklist

### ✅ Before You Start
- [ ] Backend server (`product-recognition-backend`) is running
- [ ] Node.js and npm are installed
- [ ] Expo CLI is installed globally (`npm install -g @expo/cli`)
- [ ] Expo Go app is installed on your mobile device

### ✅ Setup Steps
1. **Configure API URL:**
   ```bash
   node setup.js
   ```
   Or manually update `src/config/config.js` with your backend IP address.

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Connect your device:**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Make sure your device is on the same WiFi network

### ✅ Testing Features

#### 📷 Camera Functionality
- [ ] Grant camera permissions when prompted
- [ ] Take photos using the camera button
- [ ] Switch between front/back cameras
- [ ] Verify bounding boxes appear on detected products

#### 🖼️ Image Gallery
- [ ] Select images from gallery
- [ ] Verify automatic prediction runs
- [ ] Check bounding box overlays are correct

#### 🔄 Real-time Detection
- [ ] Start real-time mode in camera view
- [ ] Verify WebSocket connection indicator
- [ ] Check live predictions update smoothly
- [ ] Stop real-time mode successfully

#### 💾 Database Storage
- [ ] Save detected products to database
- [ ] Verify success message appears
- [ ] Check backend logs for saved data

## 🛠️ Common Issues & Solutions

### Camera Issues
**Problem:** Camera not working or app crashes
**Solution:**
- Check camera permissions in device settings
- Restart the app
- Try switching camera types
- Ensure device has a working camera

### Network Issues
**Problem:** "Network Error" or predictions not working
**Solution:**
- Verify backend server is running (`python main.py`)
- Check IP address in `src/config/config.js`
- Ensure device and computer are on same WiFi
- Test backend with browser: `http://YOUR_IP:8000`

### WebSocket Issues
**Problem:** Real-time detection not working
**Solution:**
- Check WebSocket endpoint accessibility
- Verify firewall allows connections on port 8000
- Restart both backend and mobile app
- Check backend WebSocket logs

### Permission Issues
**Problem:** Camera or gallery access denied
**Solution:**
- Go to device Settings > Apps > Expo Go > Permissions
- Enable Camera and Storage permissions
- Restart the app

## 🌐 Network Configuration

### For Local Development
1. **Find your computer's IP address:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr show`

2. **Update configuration:**
   ```javascript
   // src/config/config.js
   API_BASE_URL: 'http://YOUR_IP_ADDRESS:8000'
   ```

3. **Start backend with correct binding:**
   ```python
   # In main.py, ensure you use:
   uvicorn.run(app, host="0.0.0.0", port=8000)
   # NOT host="127.0.0.1"
   ```

### For Production Deployment
1. **Update production URL in config:**
   ```javascript
   API_BASE_URL: 'https://your-production-domain.com'
   ```

2. **Build for production:**
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS (requires Mac)
   ```

## 📱 Device Testing

### Physical Device (Recommended)
- Install Expo Go from app store
- Scan QR code from terminal
- Full camera and sensor access
- Best performance and user experience

### Simulator/Emulator
```bash
npm run ios     # iOS Simulator (Mac only)
npm run android # Android Emulator
```
Note: Limited camera functionality in simulators

## 🔍 Debugging

### Enable Debug Mode
1. Shake device or press Ctrl+M (Android) / Cmd+D (iOS)
2. Select "Debug" to open Chrome DevTools
3. Check console for errors and logs

### Common Debug Commands
```bash
# Clear cache and restart
expo start --clear

# Start with tunnel (for network issues)
expo start --tunnel

# View detailed logs
expo start --verbose
```

### Backend Testing
Test if backend is accessible:
```bash
# Test basic endpoint
curl http://YOUR_IP:8000/

# Test prediction endpoint
curl -X POST http://YOUR_IP:8000/predict -F "file=@test_image.jpg"
```

## 📊 Performance Tips

### Optimize App Performance
- Close other apps to free memory
- Use airplane mode + WiFi for stable connection
- Restart Expo Go if app becomes slow
- Clear device cache periodically

### Improve Prediction Speed
- Use lower camera quality for real-time mode
- Reduce capture interval in real-time mode
- Compress images before sending to backend

## 🔒 Security Notes

### Development Environment
- Backend runs on local network only
- No authentication required for development
- All traffic is unencrypted HTTP

### Production Deployment
- Use HTTPS for all API endpoints
- Implement proper authentication
- Add rate limiting and input validation
- Consider using a VPN for secure connections

## 📈 Monitoring & Analytics

### Check App Health
- Monitor memory usage in Expo DevTools
- Watch network requests in debug mode
- Check for memory leaks during long sessions

### Backend Monitoring
- Monitor FastAPI logs for errors
- Check WebSocket connection counts
- Monitor database storage growth

## 🎯 Feature Testing Matrix

| Feature | iOS | Android | Expected Behavior |
|---------|-----|---------|------------------|
| Camera Access | ✅ | ✅ | Permission prompt, camera opens |
| Gallery Access | ✅ | ✅ | Permission prompt, gallery opens |
| Image Prediction | ✅ | ✅ | Bounding boxes appear |
| Real-time Mode | ✅ | ✅ | Live predictions update |
| WebSocket | ✅ | ✅ | Connection indicator shows |
| Save to DB | ✅ | ✅ | Success message appears |
| Orientation | ✅ | ✅ | Portrait mode locked |
| Performance | ✅ | ✅ | Smooth 30fps+ |

## 🚨 Emergency Fixes

### App Won't Start
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Expo cache: `expo start --clear`
3. Restart computer and mobile device
4. Check Expo CLI version: `expo --version`

### Complete Reset
```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json
npm install
expo start --clear
```

### Backend Not Responding
1. Check if process is running: `ps aux | grep python`
2. Kill and restart: `pkill -f main.py && python main.py`
3. Check port availability: `netstat -an | grep 8000`
4. Try different port: Update both backend and mobile config

## 📞 Support

### When Reporting Issues
Please include:
- Device model and OS version
- Expo Go version
- Error messages from console
- Steps to reproduce the issue
- Network configuration details

### Useful Logs
- Expo DevTools console
- Backend server logs
- Device system logs (if accessible)
- Network request/response details
