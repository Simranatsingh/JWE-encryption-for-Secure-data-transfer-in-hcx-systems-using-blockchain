import axios from 'axios';
import authService from './auth.service';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

// Setup axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * List all users (for admin/selection purposes)
   * @returns {Promise<Object>} List of users
   */
  listUsers: async () => {
    try {
      console.log('Fetching users from:', `${API_URL}/api/auth/users`);
      // Direct axios call with headers for debugging
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Users response:', response.data);
      return { users: response.data || [] };
    } catch (error) {
      console.error('Error listing users:', error);
      // Return empty array instead of throwing to prevent UI breaking
      return { users: [] };
    }
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default userService; 