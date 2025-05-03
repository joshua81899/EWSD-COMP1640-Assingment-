// managerRoutes.js - Backend routes for marketing manager functionality
const express = require('express');
const router = express.Router();
const db = require('./db');
const { authenticateToken, normalizeRole } = require('./middleware/auth');

/**
 * Middleware to verify manager access
 * This checks if the authenticated user has manager role
 */
const isManager = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Check if user exists and has manager role
    const query = 'SELECT role_id FROM users WHERE user_id = $1';
    const result = await db.query(query, [req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userRole = normalizeRole(result.rows[0].role_id);
    
    // Check if role is marketing manager using normalized role
    if (userRole !== 'MNGR') {
      return res.status(403).json({ error: 'Marketing Manager access required' });
    }
    
    next();
  } catch (err) {
    console.error('Manager check error:', err);
    return res.status(500).json({ error: 'Failed to verify manager status' });
  }
};

// Apply middleware
router.use(authenticateToken);
router.use(isManager);

/**
 * @route   GET /api/manager/dashboard/stats
 * @desc    Get dashboard statistics for marketing manager
 * @access  Manager only
 */
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get submissions count
    let totalSubmissions = 0;
    let selectedSubmissions = 0;
    let pendingSelections = 0;
    let totalContributors = 0;
    
    try {
      // Get total submissions count
      const submissionsResult = await db.query('SELECT COUNT(*) as total FROM submissions');
      totalSubmissions = parseInt(submissionsResult.rows[0].total);
      
      // Get selected submissions count
      const selectedResult = await db.query('SELECT COUNT(*) as total FROM submissions WHERE selected = true');
      selectedSubmissions = parseInt(selectedResult.rows[0].total);
      
      // Get pending submissions count
      const pendingResult = await db.query('SELECT COUNT(*) as total FROM submissions WHERE status = $1', ['Submitted']);
      pendingSelections = parseInt(pendingResult.rows[0].total);
      
      // Get unique contributors count
      const contributorsResult = await db.query('SELECT COUNT(DISTINCT user_id) as total FROM submissions');
      totalContributors = parseInt(contributorsResult.rows[0].total);
    } catch (err) {
      console.error('Error counting stats:', err);
      // Continue with default values
    }
    
    res.json({
      totalSubmissions,
      selectedSubmissions,
      pendingSelections,
      totalContributors
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    // Send default values instead of error response
    res.json({
      totalSubmissions: 0,
      selectedSubmissions: 0,
      pendingSelections: 0,
      totalContributors: 0
    });
  }
});

/**
 * @route   GET /api/manager/faculty-stats
 * @desc    Get faculty submission statistics
 * @access  Manager only
 */
router.get('/faculty-stats', async (req, res) => {
  try {
    // Get statistics per faculty
    const query = `
      SELECT 
        f.faculty_id,
        f.faculty_name,
        COUNT(DISTINCT s.submission_id) AS submission_count,
        COUNT(DISTINCT CASE WHEN s.selected = true THEN s.submission_id END) AS selected_count,
        COUNT(DISTINCT s.user_id) AS contributor_count
      FROM 
        faculties f
      LEFT JOIN 
        submissions s ON f.faculty_id = s.faculty_id
      GROUP BY 
        f.faculty_id, f.faculty_name
      ORDER BY 
        f.faculty_name ASC
    `;
    
    try {
      const result = await db.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing faculty stats query:', err);
      // Return empty array instead of error
      res.json([]);
    }
  } catch (err) {
    console.error('Error fetching faculty stats:', err);
    // Return empty array instead of error
    res.json([]);
  }
});

/**
 * @route   GET /api/manager/activity/recent
 * @desc    Get recent activity logs
 * @access  Manager only
 */
router.get('/activity/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent activity logs with user names
    const query = `
      SELECT 
        l.log_id,
        l.user_id,
        l.action_type,
        l.log_timestamp,
        u.first_name,
        u.last_name
      FROM 
        logs l
      LEFT JOIN 
        users u ON l.user_id = u.user_id
      ORDER BY 
        l.log_timestamp DESC
      LIMIT $1
    `;
    
    try {
      const result = await db.query(query, [limit]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing activity query:', err);
      // Return empty array instead of error
      res.json([]);
    }
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    // Return empty array instead of error
    res.json([]);
  }
});

/**
 * @route   GET /api/manager/selected-submissions
 * @desc    Get selected submissions
 * @access  Manager only
 */
router.get('/selected-submissions', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        f.faculty_name
      FROM 
        submissions s
      JOIN
        users u ON s.user_id = u.user_id
      JOIN
        faculties f ON s.faculty_id = f.faculty_id
      WHERE 
        s.selected = true
      ORDER BY 
        s.submitted_at DESC
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching selected submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * @route   GET /api/manager/download-zip
 * @desc    Download selected submissions as ZIP
 * @access  Manager only
 */
router.get('/download-zip', async (req, res) => {
  // This is a placeholder for future implementation
  res.json({
    message: 'Download feature will be implemented in future version',
    status: 'development'
  });
});

/**
 * @route   GET /api/manager/submissions/:id/approve
 * @desc    Approve a submission
 * @access  Manager only
 */
router.patch('/submissions/:id/approve', async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    // Update submission status to selected
    const query = `
      UPDATE submissions
      SET selected = true, status = 'Selected'
      WHERE submission_id = $1
      RETURNING submission_id, title, status, selected
    `;
    
    const result = await db.query(query, [submissionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Log the action
    await db.query(
      `INSERT INTO logs (user_id, action_type, log_timestamp)
      VALUES ($1, $2, NOW())`,
      [req.user.userId, 'Submission Approved']
    );
    
    res.json({
      message: 'Submission approved successfully',
      submission: result.rows[0]
    });
  } catch (err) {
    console.error('Error approving submission:', err);
    res.status(500).json({ error: 'Failed to approve submission' });
  }
});

/**
 * @route   GET /api/manager/submissions/:id/reject
 * @desc    Reject a submission
 * @access  Manager only
 */
router.patch('/submissions/:id/reject', async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    // Update submission status to rejected
    const query = `
      UPDATE submissions
      SET selected = false, status = 'Rejected'
      WHERE submission_id = $1
      RETURNING submission_id, title, status, selected
    `;
    
    const result = await db.query(query, [submissionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Log the action
    await db.query(
      `INSERT INTO logs (user_id, action_type, log_timestamp)
      VALUES ($1, $2, NOW())`,
      [req.user.userId, 'Submission Rejected']
    );
    
    res.json({
      message: 'Submission rejected successfully',
      submission: result.rows[0]
    });
  } catch (err) {
    console.error('Error rejecting submission:', err);
    res.status(500).json({ error: 'Failed to reject submission' });
  }
});

module.exports = router;