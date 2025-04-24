import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Use createRoot API for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 