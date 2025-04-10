import axios from 'axios';
import authService from './auth.service';
import blockchainService from './blockchain.service';
import { toast } from 'react-toastify';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

console.log('Reports Service initialized with API URL:', API_URL);

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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log API errors but don't show toast here to avoid duplicate notifications
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const reportsService = {
  /**
   * Create a new medical report
   * @param {Object} reportData - Report data to create
   * @returns {Promise<Object>} Created report data
   */
  createReport: async (reportData) => {
    console.log('Creating report with data:', reportData);
    try {
      const response = await apiClient.post('/api/reports', reportData);
      console.log('Report created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error.response?.data || error.message);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get a report by ID
   * @param {string} reportId - Report ID to retrieve
   * @returns {Promise<Object>} Report data
   */
  getReport: async (reportId) => {
    console.log('Fetching report:', reportId);
    try {
      const response = await apiClient.get(`/api/reports/${reportId}`);
      console.log('Report fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error.response?.data || error.message);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get all reports for the current user
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Reports data (sent and received)
   */
  listReports: async (filters = {}) => {
    console.log('Listing reports with filters:', filters);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.reportType) params.append('reportType', filters.reportType);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      console.log(`Sending request to: ${API_URL}/api/reports${query}`);
      
      const response = await apiClient.get(`/api/reports${query}`);
      console.log('Reports fetched successfully:', {
        sentCount: response.data.sent?.length || 0,
        receivedCount: response.data.received?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('Error listing reports:', error.response?.data || error.message);
      // Return empty arrays instead of throwing to prevent UI errors
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        authService.logout();
      }
      return { sent: [], received: [] };
    }
  },
  
  /**
   * Share a report with another user
   * @param {string} reportId - Report ID to share
   * @param {string} userId - User ID to share with
   * @param {string} accessLevel - Access level to grant
   * @param {string} expiresAt - Optional expiration date
   * @returns {Promise<Object>} Shared report data
   */
  shareReport: async (reportId, userId, accessLevel = 'read', expiresAt = null) => {
    console.log('Sharing report:', { reportId, userId, accessLevel, expiresAt });
    try {
      const response = await apiClient.post(`/api/reports/${reportId}/share`, {
        userId,
        accessLevel,
        expiresAt
      });
      console.log('Report shared successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sharing report:', error.response?.data || error.message);
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Update a report's status
   * @param {string} reportId - Report ID to update
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated report data
   */
  updateReportStatus: async (reportId, status) => {
    console.log('Updating report status:', { reportId, status });
    try {
      const response = await apiClient.patch(`/api/reports/${reportId}/status`, { status });
      console.log('Report status updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating report status:', error.response?.data || error.message);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Upload a new medical report with file
   * @param {FormData} formData - Form data containing file and report details
   * @param {Function} onProgress - Callback for upload progress
   * @returns {Promise<Object>} Created report data
   */
  uploadReport: async (formData, onProgress) => {
    console.log('Uploading report with file');
    try {
      // First upload to IPFS (you'll need to implement this)
      const ipfsResponse = await uploadToIPFS(formData.get('file'));
      const ipfsHash = ipfsResponse.hash;

      // Then store the hash on blockchain
      const reportHash = await blockchainService.storeReportHash(
        ipfsHash,
        formData.get('reportType'),
        formData.get('recipientAddress'),
        ipfsHash
      );

      // Finally store in your database
      const response = await apiClient.post('/api/reports/upload', {
        ...Object.fromEntries(formData),
        ipfsHash,
        blockchainHash: reportHash
      }