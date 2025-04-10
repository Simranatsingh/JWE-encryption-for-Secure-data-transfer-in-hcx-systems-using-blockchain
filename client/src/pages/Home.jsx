import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    console.log('Home component mounted');
    // Debug information
    try {
      console.log('Environment variables:', {
        apiUrl: import.meta.env.VITE_API_URL || 'not set'
      });
    } catch (error) {
      console.error('Error accessing environment variables:', error);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to HCX Secure Transfer</h1>
      <p>Secure Healthcare Data Exchange Platform</p>
      <div style={{ margin: '20px 0' }}>
        <Link to="/register" style={{ marginRight: '10px', padding: '8px 16px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Sign Up
        </Link>
        <Link to="/login" style={{ padding: '8px 16px', border: '1px solid #1976d2', color: '#1976d2', textDecoration: 'none', borderRadius: '4px' }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home; 