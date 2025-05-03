import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../../components/StatCard';
import ContentCard from '../../components/ContentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { managerService } from '../../services/managerService';

/**
 * MarketingOverview component for displaying dashboard overview with statistics
 * specific to the Marketing Manager role
 * 
 * @param {Object} props
 * @param {Function} props.addToContentRefs - Function to add elements to content refs for animation
 */
const MarketingOverview = ({ addToContentRefs }) => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalContributors: 0,
    selectedSubmissions: 0,
    pendingSelections: 0
  });
  const [facultyStats, setFacultyStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get auth token
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in again.');
          setIsLoading(false);
          return;
        }

        // Check API status
        const apiStatus = await managerService.checkApiStatus(token);
        if (apiStatus.status !== 'online') {
          setError('Cannot connect to the server. Please try again later.');
          setIsLoading(false);
          return;
        }

        // Parallel fetch all data with error handling for each request
        try {
          // Fetch dashboard statistics
          const dashboardStats = await managerService.getDashboardStats(token);
          setStats(dashboardStats);

          // Fetch faculty statistics
          const facultyStatistics = await managerService.getFacultyStats(token);
          setFacultyStats(facultyStatistics || []);

          // Fetch recent activity
          const activityLogs = await managerService.getRecentActivity(token, 8);
          setRecentActivity(activityLogs || []);
          
          // Clear any previous errors if successful
          setError('');
        } catch (err) {
          console.error('API data fetch error:', err);
          // Set defaults but don't show error message yet
          setStats({
            totalSubmissions: 0,
            totalContributors: 0,
            selectedSubmissions: 0,
            pendingSelections: 0
          });
          setFacultyStats([]);
          setRecentActivity([]);
          
          // Only show error after multiple retries
          if (retryCount > 2) {
            setError('Could not load dashboard data. Please try again.');
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [retryCount]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon for activity type
  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'Selection':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Submission':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Comment':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'Download':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <div ref={addToContentRefs} className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl text-white mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={handleRetry}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Try Again
        </button>
      </div>
    );
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
        Marketing Manager Dashboard
      </motion.h1>
      
      {/* Statistics Cards */}
      <div ref={addToContentRefs} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard 
          title="Selected Submissions"
          value={stats.selectedSubmissions}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconColor="text-green-400"
        />
        <StatCard 
          title="Contributors"
          value={stats.totalContributors}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          iconColor="text-purple-400"
        />
        <StatCard 
          title="Pending Selections"
          value={stats.pendingSelections}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconColor="text-yellow-400"
        />
      </div>
      
      <div ref={addToContentRefs} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Faculty Submissions */}
        <div className="lg:col-span-2">
          <ContentCard title="Faculty Submissions">
            <div className="w-full overflow-auto" style={{ maxHeight: '300px' }}>
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Selected
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      % Selected
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {facultyStats.map((faculty, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {faculty.faculty_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {faculty.submission_count}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {faculty.selected_count}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {faculty.submission_count > 0 
                          ? ((faculty.selected_count / faculty.submission_count) * 100).toFixed(1) + '%'
                          : '0%'
                        }
                      </td>
                    </tr>
                  ))}
                  {facultyStats.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                        No faculty data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </div>
        
        {/* Quick Actions */}
        <div>
          <ContentCard title="Quick Actions">
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/manager/submissions'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Selected Submissions
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded flex items-center justify-center transition-colors">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Magazine ZIP
              </button>
              <button 
                onClick={() => window.location.href = '/manager/statistics'}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Statistics
              </button>
              <button 
                onClick={() => window.location.href = '/manager/settings'}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded flex items-center justify-center transition-colors">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Update Settings
              </button>
            </div>
          </ContentCard>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div ref={addToContentRefs}>
        <ContentCard title="Recent Activity">
          <div className="space-y-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="bg-gray-600 p-2 rounded-full mr-3">
                  {getActivityIcon(activity.action_type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action_details}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">
                      {activity.first_name ? `${activity.first_name} ${activity.last_name}` : 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(activity.log_timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No recent activity found
              </div>
            )}
          </div>
        </ContentCard>
      </div>
    </>
  );
};

export default MarketingOverview;