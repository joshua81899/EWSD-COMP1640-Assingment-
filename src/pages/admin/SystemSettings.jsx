import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentCard from '../../components/ContentCard';
import FormComponent from '../../components/FormComponent';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/adminService';

/**
 * SystemSettings component for managing application settings
 * 
 * @param {Object} props
 * @param {Function} props.addToContentRefs - Function to add elements to content refs for animation
 */
const SystemSettings = ({ addToContentRefs }) => {
  const [academicSettings, setAcademicSettings] = useState({
    academic_year: '',
    submission_deadline: '',
    final_edit_deadline: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    password_expiry: 90,
    max_login_attempts: 5,
    session_timeout: 30
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    comment_notifications: true,
    status_change_notifications: true,
    deadline_reminders: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('academic');

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setFormError('');
        
        // Get auth token
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        
        // Fetch academic settings
        const academicResponse = await adminService.getAcademicSettings(token);
        setAcademicSettings(academicResponse);
        
        // Fetch security settings
        const securityResponse = await adminService.getSecuritySettings(token);
        setSecuritySettings(securityResponse);
        
        // Fetch notification settings
        const notificationResponse = await adminService.getNotificationSettings(token);
        setNotificationSettings(notificationResponse);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setFormError('Failed to load settings. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Academic settings form fields
  const getAcademicFields = () => [
    {
      name: 'academicYear',
      label: 'Current Academic Year',
      type: 'select',
      required: true,
      value: academicSettings.academic_year,
      options: [
        { value: '', label: 'Select academic year' },
        { value: '2024-2025', label: '2024-2025' },
        { value: '2025-2026', label: '2025-2026' },
        { value: '2026-2027', label: '2026-2027' }
      ]
    },
    {
      name: 'submissionDeadline',
      label: 'Submission Deadline',
      type: 'date',
      required: true,
      value: academicSettings.submission_deadline,
      helpText: 'Last day for new submissions'
    },
    {
      name: 'finalEditDeadline',
      label: 'Final Edit Deadline',
      type: 'date',
      required: true,
      value: academicSettings.final_edit_deadline,
      helpText: 'Last day for editing submissions'
    }
  ];

  // Security settings form fields
  const getSecurityFields = () => [
    {
      name: 'passwordExpiry',
      label: 'Password Expiry (days)',
      type: 'number',
      required: true,
      value: securitySettings.password_expiry,
      min: 30,
      max: 365,
      helpText: 'Number of days before passwords expire (30-365)'
    },
    {
      name: 'maxLoginAttempts',
      label: 'Maximum Login Attempts',
      type: 'number',
      required: true,
      value: securitySettings.max_login_attempts,
      min: 3,
      max: 10,
      helpText: 'Number of failed login attempts before account lockout (3-10)'
    },
    {
      name: 'sessionTimeout',
      label: 'Session Timeout (minutes)',
      type: 'number',
      required: true,
      value: securitySettings.session_timeout,
      min: 5,
      max: 120,
      helpText: 'Minutes of inactivity before session expiry (5-120)'
    }
  ];

  // Notification settings form fields
  const getNotificationFields = () => [
    {
      name: 'emailNotifications',
      type: 'checkbox',
      checkboxLabel: 'Enable email notifications',
      checked: notificationSettings.email_notifications
    },
    {
      name: 'commentNotifications',
      type: 'checkbox',
      checkboxLabel: 'Send notification when a comment is added to a submission',
      checked: notificationSettings.comment_notifications
    },
    {
      name: 'statusChangeNotifications',
      type: 'checkbox',
      checkboxLabel: 'Send notification when submission status changes',
      checked: notificationSettings.status_change_notifications
    },
    {
      name: 'deadlineReminders',
      type: 'checkbox',
      checkboxLabel: 'Send deadline reminder notifications',
      checked: notificationSettings.deadline_reminders
    }
  ];

  // Handle form submission
  const handleSubmit = async (formValues) => {
    try {
      setIsLoading(true);
      setFormError('');
      
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      if (activeTab === 'academic') {
        // Update academic settings
        const academicData = {
          academic_year: formValues.academicYear,
          submission_deadline: formValues.submissionDeadline,
          final_edit_deadline: formValues.finalEditDeadline
        };
        
        await adminService.updateAcademicSettings(token, academicData);
        setAcademicSettings(academicData);
        setSuccessMessage('Academic settings updated successfully!');
      } else if (activeTab === 'security') {
        // Update security settings
        const securityData = {
          password_expiry: parseInt(formValues.passwordExpiry),
          max_login_attempts: parseInt(formValues.maxLoginAttempts),
          session_timeout: parseInt(formValues.sessionTimeout)
        };
        
        await adminService.updateSecuritySettings(token, securityData);
        setSecuritySettings(securityData);
        setSuccessMessage('Security settings updated successfully!');
      } else if (activeTab === 'notifications') {
        // Update notification settings
        const notificationData = {
          email_notifications: formValues.emailNotifications,
          comment_notifications: formValues.commentNotifications,
          status_change_notifications: formValues.statusChangeNotifications,
          deadline_reminders: formValues.deadlineReminders
        };
        
        await adminService.updateNotificationSettings(token, notificationData);
        setNotificationSettings(notificationData);
        setSuccessMessage('Notification settings updated successfully!');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error updating settings:', err);
      setFormError(err.response?.data?.error || 'Failed to update settings. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormError('');
    setSuccessMessage('');
  };

  if (isLoading && activeTab === 'academic' && !academicSettings.academic_year) {
    return <LoadingSpinner label="Loading settings..." />;
  }

  return (
    <>
      <motion.h1 
        ref={addToContentRefs}
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        System Settings
      </motion.h1>
      
      {/* Success Message */}
      {successMessage && (
        <div ref={addToContentRefs} className="mb-6">
          <div className="bg-green-700 border border-green-600 text-white px-4 py-3 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage('')}
            >
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Settings Tabs */}
      <div ref={addToContentRefs} className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'academic'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('academic')}
          >
            Academic
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'security'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('security')}
          >
            Security
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'notifications'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('notifications')}
          >
            Notifications
          </button>
        </div>
      </div>
      
      {/* Settings Forms */}
      <div ref={addToContentRefs}>
        <ContentCard>
          {activeTab === 'academic' && (
            <>
              <p className="text-gray-400 mb-6">
                Configure the academic year and important deadlines for student submissions.
              </p>
              <FormComponent
                fields={getAcademicFields()}
                onSubmit={handleSubmit}
                submitText={isLoading ? "Saving..." : "Save Academic Settings"}
                isSubmitting={isLoading}
                error={formError}
              />
            </>
          )}
          
          {activeTab === 'security' && (
            <>
              <p className="text-gray-400 mb-6">
                Configure security settings for the application, including password policies and session management.
              </p>
              <FormComponent
                fields={getSecurityFields()}
                onSubmit={handleSubmit}
                submitText={isLoading ? "Saving..." : "Save Security Settings"}
                isSubmitting={isLoading}
                error={formError}
              />
            </>
          )}
          
          {activeTab === 'notifications' && (
            <>
              <p className="text-gray-400 mb-6">
                Configure notification settings for users, including email notifications and reminders.
              </p>
              <FormComponent
                fields={getNotificationFields()}
                onSubmit={handleSubmit}
                submitText={isLoading ? "Saving..." : "Save Notification Settings"}
                isSubmitting={isLoading}
                error={formError}
              />
            </>
          )}
        </ContentCard>
      </div>
    </>
  );
};

export default SystemSettings;