import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SubmissionsPage from './pages/SubmissionsPage';
import './App.css';

// Setup axios interceptors for automatic token handling
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling 401/403 responses
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If the error is due to token expiration (403) and we haven't retried yet
    if ((error.response?.status === 403 || error.response?.status === 401) && 
        !originalRequest._retry && 
        error.response?.data?.error?.includes('Invalid or expired token')) {
      
      originalRequest._retry = true;
      
      try {
        // Clear the stored token
        localStorage.removeItem('token');
        
        // Either redirect to login or attempt to refresh token
        // For now, we'll just redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
        
        // In a more advanced implementation, you would add token refresh logic here
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Modified Protected Route component for role-based access control
// Now with allowGuest parameter to make certain routes accessible to everyone
const ProtectedRoute = ({ children, allowedRoles = [], allowGuest = false }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userString = localStorage.getItem('user');
  let user = null;
  
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // If guest access is allowed, render the component regardless of authentication
  if (allowGuest) {
    return children;
  }
  
  // Check if user is logged in
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect admins to admin dashboard, students to student dashboard
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the expiration from the token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    
    const { exp } = JSON.parse(jsonPayload);
    
    // Check if the token is expired
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.error('Error checking token expiration:', err);
    return true;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (loggedIn && userData && token) {
        try {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Token is expired, logging out');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          } else {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setInitialCheckDone(true);
    };
    
    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('lastLoginTime');
    
    // Navigate to home page (handled by router)
  };

  // Determine dashboard redirect based on user role
  const getDashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }
    
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  };

  // Show loading spinner while checking authentication
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />} />
        
        <Route 
          path="/login" 
          element={isAuthenticated ? getDashboardRedirect() : <LoginPage onLoginSuccess={(userData) => {
            setUser(userData);
            setIsAuthenticated(true);
          }} />} 
        />
        
        <Route 
          path="/register" 
          element={isAuthenticated ? getDashboardRedirect() : <RegisterPage onRegisterSuccess={(userData) => {
            setUser(userData);
            setIsAuthenticated(true);
          }} />} 
        />
        
        {/* Student dashboard - only accessible by students */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['STUDT']}>
              <StudentDashboardPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin dashboard - only accessible by admins */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Submissions page - accessible by everyone (allowGuest=true) */}
        <Route 
          path="/submissions" 
          element={
            <ProtectedRoute allowGuest={true}>
              <SubmissionsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/about" element={<div className="p-10 text-center">About Page (Coming Soon)</div>} />
        <Route path="/guidelines" element={<div className="p-10 text-center">Guidelines Page (Coming Soon)</div>} />
        <Route path="/contact" element={<div className="p-10 text-center">Contact Page (Coming Soon)</div>} />
        <Route path="/terms" element={<div className="p-10 text-center">Terms & Conditions (Coming Soon)</div>} />
        <Route path="/help" element={<div className="p-10 text-center">Help Page (Coming Soon)</div>} />
        <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;