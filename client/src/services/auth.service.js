import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise<Object>} Registration result
   */
  register: async (userData) => {
    try {
      console.log('Registering with API URL:', API_URL);
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} walletAddress - Optional wallet address
   * @returns {Promise<Object>} Login result
   */
  login: async (email, password, walletAddress = null) => {
    try {
      console.log('Logging in with API URL:', API_URL);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
        walletAddress
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get the current user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get the auth token
   * @returns {string|null} Auth token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 