/**
 * Test utility to verify backend connection
 * Run this to test if your backend is accessible from the mobile app
 */

import { CONFIG, API_ENDPOINTS } from './src/config/config';

class ConnectionTester {
  static async testBackendConnection() {
    console.log('🔍 Testing backend connection...');
    console.log(`📡 API Base URL: ${CONFIG.API_BASE_URL}`);
    
    try {
      // Test basic connectivity
      const response = await fetch(`${CONFIG.API_BASE_URL}/`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend is accessible');
        console.log(`📝 Response: ${JSON.stringify(data)}`);
        return true;
      } else {
        console.log(`❌ Backend returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log('❌ Failed to connect to backend');
      console.log(`🔧 Error: ${error.message}`);
      
      // Provide troubleshooting hints
      if (error.message.includes('Network request failed')) {
        console.log('\n💡 Troubleshooting suggestions:');
        console.log('   1. Check if backend server is running');
        console.log('   2. Verify the IP address in config.js');
        console.log('   3. Ensure your device is on the same network');
        console.log('   4. Check firewall settings');
      }
      
      return false;
    }
  }

  static async testPredictionEndpoint() {
    console.log('\n🎯 Testing prediction endpoint...');
    
    try {
      // Create a dummy FormData (this will fail but should return proper error)
      const formData = new FormData();
      formData.append('file', new Blob(['dummy'], { type: 'image/jpeg' }), 'test.jpg');
      
      const response = await fetch(API_ENDPOINTS.PREDICT, {
        method: 'POST',
        body: formData,
      });
      
      console.log(`📊 Prediction endpoint status: ${response.status}`);
      
      // Even if it fails due to invalid image, endpoint should be reachable
      if (response.status === 422 || response.status === 400) {
        console.log('✅ Prediction endpoint is accessible (returned validation error as expected)');
        return true;
      }
      
      return response.ok;
    } catch (error) {
      console.log('❌ Failed to reach prediction endpoint');
      console.log(`🔧 Error: ${error.message}`);
      return false;
    }
  }

  static async testWebSocketConnection() {
    console.log('\n🔄 Testing WebSocket connection...');
    
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(API_ENDPOINTS.WS_PREDICT);
        
        const timeout = setTimeout(() => {
          ws.close();
          console.log('⏰ WebSocket connection timed out');
          resolve(false);
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          console.log('✅ WebSocket connection successful');
          ws.close();
          resolve(true);
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          console.log('❌ WebSocket connection failed');
          console.log(`🔧 Error: ${error.message || 'Unknown error'}`);
          resolve(false);
        };

        ws.onclose = () => {
          clearTimeout(timeout);
        };
      } catch (error) {
        console.log('❌ Failed to create WebSocket connection');
        console.log(`🔧 Error: ${error.message}`);
        resolve(false);
      }
    });
  }

  static async runAllTests() {
    console.log('🧪 Running connection tests for Product Recognition Mobile App');
    console.log('=============================================================\n');

    const results = {
      backend: await this.testBackendConnection(),
      prediction: await this.testPredictionEndpoint(),
      websocket: await this.testWebSocketConnection(),
    };

    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Backend Connection:    ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Prediction Endpoint:   ${results.prediction ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`WebSocket Connection:  ${results.websocket ? '✅ PASS' : '❌ FAIL'}`);

    const overallSuccess = Object.values(results).every(result => result);
    console.log(`\nOverall Status: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    if (overallSuccess) {
      console.log('\n🎉 Your backend is properly configured and accessible!');
      console.log('📱 You can now run the mobile app with confidence.');
    } else {
      console.log('\n🔧 Please fix the failing connections before using the mobile app.');
      console.log('💡 Refer to the troubleshooting section in README.md for help.');
    }

    return overallSuccess;
  }
}

// Export for use in the app
export default ConnectionTester;

// If running directly (in a test environment)
if (typeof window !== 'undefined' && window.testConnection) {
  ConnectionTester.runAllTests();
}
