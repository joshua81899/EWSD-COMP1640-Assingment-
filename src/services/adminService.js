import axios from 'axios';

/**
 * Admin Service - Handles all API requests for admin functionality
 * This service provides methods to interact with the backend API
 */
export const adminService = {
  /**
   * Get dashboard statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/dashboard/stats`, {
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
        totalUsers: 0,
        pendingSubmissions: 0,
        selectedSubmissions: 0
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
      const response = await axios.get(`${apiUrl}/api/admin/faculties/stats`, {
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
   * Get recent activity logs
   * 
   * @param {string} token - Authentication token
   * @param {number} limit - Number of records to return
   * @returns {Promise<Array>} Recent activity array
   */
  getRecentActivity: async (token, limit = 10) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/activity/recent`, {
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
   * Get users with pagination and filtering
   * 
   * @param {string} token - Authentication token
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>} Paginated users response
   */
  getUsers: async (token, page = 1, limit = 10, search = '') => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        params: { page, limit, search },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return default structured response
      return {
        users: [],
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0
      };
    }
  },

  /**
   * Create new user
   * 
   * @param {string} token - Authentication token
   * @param {Object} userData - User data object
   * @returns {Promise<Object>} Created user data
   */
  createUser: async (token, userData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/admin/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   * 
   * @param {string} token - Authentication token
   * @param {number} userId - User ID to update
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (token, userId, userData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(`${apiUrl}/api/admin/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * 
   * @param {string} token - Authentication token
   * @param {number} userId - User ID to delete
   * @returns {Promise<Object>} Response data
   */
  deleteUser: async (token, userId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.delete(`${apiUrl}/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
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
   * Create new faculty
   * 
   * @param {string} token - Authentication token
   * @param {Object} facultyData - Faculty data object
   * @returns {Promise<Object>} Created faculty data
   */
  createFaculty: async (token, facultyData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/admin/faculties`, facultyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating faculty:', error);
      throw error;
    }
  },

  /**
   * Update existing faculty
   * 
   * @param {string} token - Authentication token
   * @param {string} facultyId - Faculty ID to update
   * @param {Object} facultyData - Updated faculty data
   * @returns {Promise<Object>} Updated faculty data
   */
  updateFaculty: async (token, facultyId, facultyData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(`${apiUrl}/api/admin/faculties/${facultyId}`, facultyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  },

  /**
   * Delete faculty
   * 
   * @param {string} token - Authentication token
   * @param {string} facultyId - Faculty ID to delete
   * @returns {Promise<Object>} Response data
   */
  deleteFaculty: async (token, facultyId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.delete(`${apiUrl}/api/admin/faculties/${facultyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting faculty:', error);
      throw error;
    }
  },

  /**
   * Get all roles
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Roles array
   */
  getRoles: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get marketing coordinators
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Marketing coordinators array
   */
  getMarketingCoordinators: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/users/coordinators`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing coordinators:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get submissions with pagination and filtering
   * 
   * @param {string} token - Authentication token
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Paginated submissions response
   */
  getSubmissions: async (token, page = 1, limit = 10, search = '', filters = {}) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/submissions`, {
        params: { 
          page, 
          limit, 
          search,
          faculty: filters.faculty || '',
          status: filters.status || '',
          academicYear: filters.academicYear || ''
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
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
   * Get comments for a submission
   * 
   * @param {string} token - Authentication token
   * @param {number} submissionId - Submission ID
   * @returns {Promise<Array>} Comments array
   */
  getSubmissionComments: async (token, submissionId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/submissions/${submissionId}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching submission comments:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Add a comment to a submission
   * 
   * @param {string} token - Authentication token
   * @param {number} submissionId - Submission ID
   * @param {string} commentText - Comment text
   * @returns {Promise<Object>} Created comment data
   */
  addSubmissionComment: async (token, submissionId, commentText) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/admin/submissions/${submissionId}/comments`, 
        { comment_text: commentText },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Update submission status
   * 
   * @param {string} token - Authentication token
   * @param {number} submissionId - Submission ID
   * @param {string} status - New status ('Selected' or 'Rejected')
   * @returns {Promise<Object>} Updated submission data
   */
  updateSubmissionStatus: async (token, submissionId, status) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.patch(
        `${apiUrl}/api/admin/submissions/${submissionId}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
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
        `${apiUrl}/api/admin/submissions/${submissionId}/download`,
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
   * Get page visits statistics
   * 
   * @param {string} token - Authentication token
   * @param {string} dateRange - Date range filter ('week', 'month', 'year')
   * @returns {Promise<Array>} Page visits statistics
   */
  getPageVisits: async (token, dateRange = 'week') => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/analytics/page-visits`, {
        params: { dateRange },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching page visits:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get browser usage statistics
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Browser statistics
   */
  getBrowserStats: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/analytics/browser-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching browser stats:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get user activity statistics
   * 
   * @param {string} token - Authentication token
   * @param {string} dateRange - Date range filter ('week', 'month', 'year')
   * @returns {Promise<Array>} User activity statistics
   */
  getUserActivity: async (token, dateRange = 'week') => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/analytics/user-activity`, {
        params: { dateRange },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get academic settings
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Academic settings
   */
  getAcademicSettings: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/settings/academic`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching academic settings:', error);
      // Return default settings instead of throwing
      return {
        academic_year: '2024-2025',
        submission_deadline: '2025-05-25',
        final_edit_deadline: '2025-06-23'
      };
    }
  },

  /**
   * Update academic settings
   * 
   * @param {string} token - Authentication token
   * @param {Object} settings - Academic settings
   * @returns {Promise<Object>} Updated academic settings
   */
  updateAcademicSettings: async (token, settings) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(`${apiUrl}/api/admin/settings/academic`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating academic settings:', error);
      throw error;
    }
  },

  /**
   * Get security settings
   * 
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Security settings
   */
  getSecuritySettings: async (token) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/admin/settings/security`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      // Return default settings instead of throwing
      return {
        password_expiry: 90,
        max_login_attempts: 5,
        session_timeout: 30
      };
    }
  },

  /**
   * Update security settings
   * 
   * @param {string} token - Authentication token
   * @param {Object} settings - Security settings
   * @returns {Promise<Object>} Updated security settings
   */
  updateSecuritySettings: async (token, settings) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.put(`${apiUrl}/api/admin/settings/security`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
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
      const response = await axios.get(`${apiUrl}/api/admin/settings/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return default settings instead of throwing
      return {
        email_notifications: true,
        comment_notifications: true,
        status_change_notifications: true,
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
      const response = await axios.put(`${apiUrl}/api/admin/settings/notifications`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
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

export default adminService;