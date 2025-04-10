import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';
import axios from 'axios';

// First render the app to prevent blank screen
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>Connecting to server...</p>
    </div>
  </React.StrictMode>
);

// Function to detect the server port - simplified with fewer ports to try
const detectServerPort = async () => {
  const basePorts = [5005, 8000, 5001, 9000];
  const baseUrl = 'http://localhost:';
  
  console.log('Attempting to detect server port...');
  
  for (const port of basePorts) {
    try {
      const url = `${baseUrl}${port}/health`;
      console.log(`Trying server at ${url}`);
      const response = await axios.get(url, { timeout: 800 });
      
      if (response.status === 200 && response.data.status === 'ok') {
        console.log(`Server detected at port ${port}`);
        return `${baseUrl}${port}`;
      }
    } catch (error) {
      console.log(`Port ${port} not available or not responding`);
    }
  }
  
  // Fallback to default
  console.warn('Could not detect server port, using default from .env');
  return import.meta.env.VITE_API_URL;
};

// Set up global API base URL and render the app
(async () => {
  try {
    const apiUrl = await detectServerPort();
    axios.defaults.baseURL = apiUrl;
    console.log('API URL set to:', apiUrl);
  } catch (error) {
    console.error('Error setting up API:', error);
    // Still set a default URL if detection fails
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  } finally {
    // Always render the app, even if server detection fails
    root.render(
      <React.StrictMode>
        <Router>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </React.StrictMode>
    );
  }
})(); 