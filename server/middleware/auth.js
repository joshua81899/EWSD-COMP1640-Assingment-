// middleware/auth.js - Authentication and authorization middleware
const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * Authenticate JWT token middleware
 * Verifies the JWT token from the Authorization header
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
  // Get the auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
    
    // Set the user info in the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Admin role check middleware
 * Verifies that the authenticated user has admin role
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Check if user exists and has admin role
    const query = 'SELECT role_id FROM users WHERE user_id = $1';
    const result = await db.query(query, [req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userRole = result.rows[0].role_id;
    
    // Check if role is admin (assuming role_id 1 is admin)
    if (userRole !== 1 && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    return res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};