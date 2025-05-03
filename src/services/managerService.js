import axios from 'axios';

/**
 * Manager Service - Handles all API requests for Marketing Manager functionality
 * This service provides methods to interact with the backend API
 */
export const managerService = {
  /**
   * Get dashboard statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values instead of throwing error
      return {
        totalSubmissions: 0,
        totalContributors: 0,
        selectedSubmissions: 0,
        pendingSelections: 0
      };
    }
  },

  /**
   * Get faculty statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Faculty statistics array
   */
  getFacultyStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/faculties/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get all selected submissions with pagination and filtering
   * 
   * @param {string} token - Authentication token
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Paginated submissions response
   */
  getSelectedSubmissions: async (token, page = 1, limit = 10, search = '', filters = {}) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/submissions`, {
        params: { 
          page, 
          limit, 
          search,
          faculty: filters.faculty || '',
          academicYear: filters.academicYear || ''
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching selected submissions:', error);
      // Return default structured response
      return {
        submissions: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  },

  /**
   * Get publication statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Publication statistics
   */
  getPublicationStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching publication stats:', error);
      // Return default stats instead of throwing
      return {
        totalSubmissions: 0,
        totalContributors: 0,
        selectedSubmissions: 0,
        pendingSelections: 0
      };
    }
  },

  /**
   * Get faculty submission statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Faculty submission statistics
   */
  getFacultySubmissionStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/stats/faculties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty submission stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get contributor statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Contributor statistics
   */
  getContributorStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/stats/contributors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching contributor stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get yearly statistics
   * 
   * @param {string} token - Authentication token
   * @param {string} timespan - Timespan ('month' or 'year')
   * @returns {Promise<Array>} Yearly statistics
   */
  getYearlyStats: async (token, timespan = 'year') => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/stats/trends`, {
        params: { timespan },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching yearly stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get document type statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Document type statistics
   */
  getDocumentTypeStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/stats/document-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching document type stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get recent activity logs
   * 
   * @param {string} token - Authentication token
   * @param {number} limit - Number of records to return
   * @returns {Promise<Array>} Recent activity array
   */
  getRecentActivity: async (token, limit = 10) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/activity/recent`, {
        params: { limit },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Download submission file
   * 
   * @param {string} token - Authentication token
   * @param {number} submissionId - Submission ID
   * @param {string} filePath - File path
   * @returns {Promise<Blob>} File blob
   */
  downloadSubmissionFile: async (token, submissionId, filePath) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(
        `${apiUrl}/api/manager/submissions/${submissionId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  /**
   * Download submissions as ZIP
   * 
   * @param {string} token - Authentication token
   * @param {Array} submissionIds - Array of submission IDs (null for all)
   * @returns {Promise<Blob>} ZIP file blob
   */
  downloadSubmissionsZip: async (token, submissionIds = null) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(
        `${apiUrl}/api/manager/submissions/download-zip`,
        { submissionIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `selected-submissions-${new Date().toISOString().slice(0, 10)}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      throw error;
    }
  },

  /**
   * Log an activity
   * 
   * @param {string} token - Authentication token
   * @param {string} actionType - Type of action
   * @param {string} actionDetails - Details about the action
   * @returns {Promise<Object>} Response data
   */
  logActivity: async (token, actionType, actionDetails) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(
        `${apiUrl}/api/manager/activity/log`,
        { action_type: actionType, action_details: actionDetails },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw, just log the error
      return { success: false };
    }
  },

  /**
   * Get faculties
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Faculties array
   */
  getFaculties: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/faculties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching faculties:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get current user information
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const userData = response.data;
      return {
        id: userData.user_id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        facultyId: userData.faculty_id,
        faculty: userData.faculty_name
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Try to get from localStorage as fallback
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      return storedUser;
    }
  },

  /**
   * Update user profile
   * 
   * @param {string} token - Authentication token
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (token, userData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.patch(
        `${apiUrl}/api/users/profile`,
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get notification settings
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Notification settings
   */
  getNotificationSettings: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/settings/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return default settings
      return {
        email_notifications: true,
        comment_notifications: true,
        selection_notifications: true,
        deadline_reminders: true
      };
    }
  },

  /**
   * Update notification settings
   * 
   * @param {string} token - Authentication token
   * @param {Object} settings - Notification settings
   * @returns {Promise<Object>} Updated notification settings
   */
  updateNotificationSettings: async (token, settings) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(
        `${apiUrl}/api/manager/settings/notifications`,
        settings,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Get display settings
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Display settings
   */
  getDisplaySettings: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/settings/display`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching display settings:', error);
      // Return default settings
      return {
        dark_mode: true,
        compact_view: false,
        show_statistics: true,
        default_view: 'submissions'
      };
    }
  },

  /**
   * Update display settings
   * 
   * @param {string} token - Authentication token
   * @param {Object} settings - Display settings
   * @returns {Promise<Object>} Updated display settings
   */
  updateDisplaySettings: async (token, settings) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(
        `${apiUrl}/api/manager/settings/display`,
        settings,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating display settings:', error);
      throw error;
    }
  },

  /**
   * Get export settings
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Export settings
   */
  getExportSettings: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/manager/settings/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching export settings:', error);
      // Return default settings
      return {
        include_comments: true,
        include_metadata: true,
        default_format: 'zip'
      };
    }
  },

  /**
   * Update export settings
   * 
   * @param {string} token - Authentication token
   * @param {Object} settings - Export settings
   * @returns {Promise<Object>} Updated export settings
   */
  updateExportSettings: async (token, settings) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(
        `${apiUrl}/api/manager/settings/export`,
        settings,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating export settings:', error);
      throw error;
    }
  },

  /**
   * Check API and authentication status
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Status information
   */
  checkApiStatus: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        status: 'online',
        serverTime: response.data.timestamp,
        authenticated: true
      };
    } catch (error) {
      console.error('API status check failed:', error);
      return {
        status: 'offline',
        error: error.message,
        authenticated: false
      };
    }
  }
};

export default managerService;