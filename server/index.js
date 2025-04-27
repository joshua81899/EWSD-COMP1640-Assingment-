// index.js - Backend server with plain text password storage
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import admin routes
const adminRoutes = require('./adminRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Debug middleware - logs all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Create a middleware to track page visits
app.use((req, res, next) => {
  // Only track GET requests to pages, not API calls or static resources
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
    const logPageVisit = async () => {
      try {
        // Get user ID if authenticated
        let userId = null;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
            userId = decoded.userId;
          } catch (err) {
            // Invalid token, continue without user ID
          }
        }
        
        // Log the page visit
        await db.query(
          `INSERT INTO page_visits (user_id, page_url, visit_timestamp, browser_info, ip_address)
           VALUES ($1, $2, NOW(), $3, $4)`,
          [
            userId,
            req.path,
            req.headers['user-agent'] || null,
            req.ip || req.connection.remoteAddress
          ]
        );
      } catch (err) {
        console.error('Error logging page visit:', err);
        // Don't block the request if logging fails
      }
    };
    
    // Log the visit without waiting for the database operation
    logPageVisit();
  }
  next();
});

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create a folder for each user
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
        const userDir = path.join(uploadDir, `user_${decoded.userId}`);
        
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }
        
        cb(null, userDir);
      } catch (err) {
        cb(null, uploadDir);
      }
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function(req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept only common document and image types
  const allowedTypes = [
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .doc, .docx
    'application/pdf', // .pdf
    'image/jpeg', 'image/png', 'image/jpg' // .jpg, .jpeg, .png
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only DOC, DOCX, PDF, JPG, JPEG, and PNG files are allowed.'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Add Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size exceeds the 10MB limit'
      });
    }
    return res.status(400).json({
      error: `Upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      error: err.message
    });
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Test database connection endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'Database connection successful', 
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

// Registration Endpoint - NO PASSWORD HASHING
app.post('/api/auth/register', async (req, res) => {
  console.log('\n=== NEW REGISTRATION ATTEMPT ===');
  console.log('Request body:', { ...req.body, password: '[REDACTED]' });

  try {
    const { first_name, last_name, email, faculty_id, password } = req.body;
    
    // Validation
    if (!first_name || !last_name || !email || !faculty_id || !password) {
      return res.status(400).json({ 
        error: "All fields are required",
        required_fields: ['first_name', 'last_name', 'email', 'faculty_id', 'password']
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if user exists
    const userExists = await db.query(
      `SELECT user_id FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ 
        error: "Email already in use",
        suggestion: "Try resetting your password if this is your email"
      });
    }

    // Store plain text password (NO HASHING)
    const plainTextPassword = password;

    // Insert new user
    const newUser = await db.query(
      `INSERT INTO users 
       (first_name, last_name, email, password, faculty_id, role_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING user_id, first_name, last_name, email, faculty_id`,
      [
        first_name.trim(),
        last_name.trim(),
        email.toLowerCase().trim(),
        plainTextPassword, // Store as plain text
        faculty_id,
        4 // Student role
      ]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.rows[0].user_id,
        role: 4
      },
      process.env.JWT_SECRET || 'default_secret_for_development',
      { 
        expiresIn: '1h'
      }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].user_id,
        firstName: newUser.rows[0].first_name,
        lastName: newUser.rows[0].last_name,
        email: newUser.rows[0].email,
        faculty: newUser.rows[0].faculty_id,
        role: 4
      },
      expiresIn: 3600
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: "Registration failed",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login Endpoint - PLAIN TEXT PASSWORD COMPARISON
app.post('/api/auth/login', async (req, res) => {
  console.log('\n=== NEW LOGIN ATTEMPT ===');
  console.log('Request body:', { ...req.body, password: '[REDACTED]' });

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required"
      });
    }

    // Find user by email
    let userResult;
    try {
      userResult = await db.query(
        `SELECT user_id, first_name, last_name, email, password, faculty_id, role_id, last_login
        FROM users 
        WHERE email = $1`,
        [email.toLowerCase().trim()]
      );
    } catch (dbError) {
      console.error('Database error when finding user:', dbError);
      return res.status(500).json({ 
        error: "Login failed due to database error",
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    
    // Simple direct password comparison (plain text)
    const isValidPassword = (password === user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login time
    try {
      await db.query(
        `UPDATE users SET last_login = NOW() WHERE user_id = $1`,
        [user.user_id]
      );
    } catch (updateError) {
      // Non-critical error, just log it
      console.error('Failed to update last login time:', updateError);
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.user_id,
        role: user.role_id
      },
      process.env.JWT_SECRET || 'default_secret_for_development',
      { 
        expiresIn: '1h'
      }
    );

    // Return user data
    res.status(200).json({
      token,
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        faculty: user.faculty_id,
        role: user.role_id,
        lastLogin: user.last_login
      },
      expiresIn: 3600
    });

  } catch (err) {
    console.error('Unexpected login error:', err);
    res.status(500).json({ 
      error: "Login failed due to server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get current user info
app.get('/api/users/me', async (req, res) => {
  try {
    // Get the auth header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
      
      // Get user data from database
      const userResult = await db.query(
        `SELECT 
          u.user_id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.faculty_id, 
          u.role_id, 
          u.last_login,
          f.faculty_name
        FROM 
          users u
        LEFT JOIN 
          faculties f ON u.faculty_id = f.faculty_id
        WHERE 
          u.user_id = $1`,
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(userResult.rows[0]);
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Get faculty list
app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await db.query('SELECT faculty_id, faculty_name, description FROM faculties ORDER BY faculty_name');
    res.json(faculties.rows);
  } catch (err) {
    console.error('Error fetching faculties:', err);
    res.status(500).json({ error: "Failed to retrieve faculties" });
  }
});

// Public submissions endpoint - no authentication required
app.get('/api/public/submissions', async (req, res) => {
  try {
    console.log('Public submissions API called with query:', req.query);
    const { faculty, academicYear, search } = req.query;
    
    // Build the base query - only return Selected submissions for public view
    let query = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email
      FROM 
        submissions s
      LEFT JOIN
        users u ON s.user_id = u.user_id
      WHERE 
        s.status = 'Selected'`;
    
    const params = [];
    let paramIndex = 1;
    
    // Add faculty filter if provided
    if (faculty && faculty.trim() !== '') {
      params.push(faculty);
      query += ` AND s.faculty_id = $${paramIndex++}`;
    }
    
    // Add academic year filter if provided
    if (academicYear && academicYear.trim() !== '') {
      params.push(academicYear);
      query += ` AND s.academic_year = $${paramIndex++}`;
    }
    
    // Add search filter if provided
    if (search && search.trim() !== '') {
      const searchParam = `%${search.trim()}%`;
      params.push(searchParam);
      query += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
      paramIndex++;
    }
    
    // Order by submission date, newest first
    query += ` ORDER BY s.submitted_at DESC`;
    
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    
    // Execute query with error handling
    try {
      const result = await db.query(query, params);
      console.log(`Found ${result.rows.length} public submissions`);
      
      // Return submissions
      res.json(result.rows);
    } catch (queryError) {
      console.error('Error executing main query:', queryError);
      
      // Fallback to a simpler query
      try {
        console.log('Attempting fallback query...');
        const fallbackQuery = 'SELECT * FROM submissions WHERE status = $1 LIMIT 10';
        const fallbackResult = await db.query(fallbackQuery, ['Selected']);
        
        // If the fallback succeeds, return those results
        console.log(`Fallback found ${fallbackResult.rows.length} submissions`);
        res.json(fallbackResult.rows);
      } catch (fallbackError) {
        // If even the fallback fails, throw an error to be caught by the outer try/catch
        console.error('Fallback query failed:', fallbackError);
        throw new Error('Both main and fallback queries failed');
      }
    }
  } catch (err) {
    console.error('Error in public submissions endpoint:', err);
    res.status(500).json({ 
      error: 'Failed to fetch submissions',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
});

// Get submissions for authenticated users
app.get('/api/submissions', async (req, res) => {
  try {
    // Get the auth header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
      
      // Get user's role and faculty
      const userResult = await db.query(
        'SELECT role_id, faculty_id FROM users WHERE user_id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = userResult.rows[0];
      const { faculty, academicYear, search } = req.query;
      
      let query;
      let params;
      
      // Different queries based on user role
      if (user.role_id === 1 || user.role_id === 'ADMIN') {
        // Admin can see all submissions
        query = `
          SELECT 
            s.*,
            u.first_name,
            u.last_name,
            u.email
          FROM 
            submissions s
          LEFT JOIN
            users u ON s.user_id = u.user_id`;
        params = [];
      } else if (user.role_id === 2 || user.role_id === 'MNGR') {
        // Marketing Manager can see all selected submissions
        query = `
          SELECT 
            s.*,
            u.first_name,
            u.last_name,
            u.email
          FROM 
            submissions s
          LEFT JOIN
            users u ON s.user_id = u.user_id
          WHERE 
            s.status = $1`;
        params = ['Selected'];
      } else if (user.role_id === 3 || user.role_id === 'COORD') {
        // Marketing Coordinator can see submissions from their faculty
        query = `
          SELECT 
            s.*,
            u.first_name,
            u.last_name,
            u.email
          FROM 
            submissions s
          LEFT JOIN
            users u ON s.user_id = u.user_id
          WHERE 
            s.faculty_id = $1`;
        params = [user.faculty_id];
      } else {
        // Students can only see their own submissions
        query = `
          SELECT 
            s.*,
            u.first_name,
            u.last_name,
            u.email
          FROM 
            submissions s
          LEFT JOIN
            users u ON s.user_id = u.user_id
          WHERE 
            s.user_id = $1`;
        params = [decoded.userId];
      }
      
      // Add faculty filter if provided
      if (faculty && (user.role_id === 1 || user.role_id === 'ADMIN')) {
        query += params.length ? ' AND' : ' WHERE';
        query += ' s.faculty_id = $' + (params.length + 1);
        params.push(faculty);
      }
      
      // Add academic year filter if provided
      if (academicYear) {
        query += params.length ? ' AND' : ' WHERE';
        query += ' s.academic_year = $' + (params.length + 1);
        params.push(academicYear);
      }
      
      // Add search filter if provided
      if (search) {
        query += params.length ? ' AND' : ' WHERE';
        query += ' (s.title ILIKE $' + (params.length + 1) + ' OR s.description ILIKE $' + (params.length + 1) + ')';
        params.push('%' + search + '%');
      }
      
      // Order by submission date, newest first
      query += ' ORDER BY s.submitted_at DESC';
      
      // Execute query
      const submissionsResult = await db.query(query, params);
      
      // Return submissions
      res.json(submissionsResult.rows);
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// NEW ENDPOINT: Create a new submission
app.post('/api/submissions', upload.single('file'), async (req, res) => {
  console.log('\n=== NEW SUBMISSION ATTEMPT ===');
  console.log('Request body:', req.body);
  console.log('File:', req.file);
  
  try {
    // Get the auth header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_development');
      
      // Get user's faculty
      const userResult = await db.query(
        'SELECT faculty_id FROM users WHERE user_id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Extract fields from request
      const { title, description, academicYear, termsAccepted } = req.body;
      
      // Validation with detailed error
      if (!title || !req.file || !academicYear) {
        return res.status(400).json({ 
          error: "Required fields missing",
          received: {
            title: !!title,
            file: !!req.file,
            academicYear: !!academicYear
          }
        });
      }
      
      // Check if user has agreed to terms - handle both string and boolean values
      const termsAcceptedValue = termsAccepted === 'true' || termsAccepted === true;
      if (!termsAcceptedValue) {
        return res.status(400).json({ error: "Terms and conditions must be accepted" });
      }
      
      // Create relative file path for database storage
      const relativePath = req.file.path.replace(__dirname, '');
      const userFaculty = userResult.rows[0].faculty_id;
      
      // Insert new submission
      const submissionResult = await db.query(
        `INSERT INTO submissions
          (user_id, title, description, file_path, submitted_at, status, terms_accepted, academic_year, selected, faculty_id)
        VALUES
          ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9)
        RETURNING submission_id, title, status, submitted_at`,
        [
          decoded.userId,           // user_id
          title,                    // title
          description || null,      // description
          relativePath,             // file_path
          'Submitted',              // status
          true,                     // terms_accepted
          academicYear,             // academic_year
          false,                    // selected
          userFaculty               // faculty_id
        ]
      );
      
      const newSubmission = submissionResult.rows[0];
      
      // Log activity
      try {
        await db.query(
          `INSERT INTO logs (user_id, action_type, log_timestamp)
          VALUES ($1, $2, NOW())`,
          [decoded.userId, 'Submission']
        );
      } catch (logError) {
        console.error('Error logging submission activity:', logError);
        // Non-critical error, continue
      }
      
      // Send notification email to faculty coordinator (in a real app)
      // This is a placeholder - in a real app, you would send an actual email
      console.log(`Notification would be sent to faculty coordinator for ${userFaculty}`);
      
      // Return the new submission
      res.status(201).json({
        message: 'Submission created successfully',
        submission: newSubmission
      });
      
    } catch (err) {
      console.error('Token verification error:', err);
      
      // If file was uploaded but there was an error, attempt to delete it
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log(`Deleted file ${req.file.path} after submission error`);
        } catch (deleteErr) {
          console.error('Error deleting file after submission error:', deleteErr);
        }
      }
      
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('Error creating submission:', err);
    
    // If file was uploaded but there was an error, attempt to delete it
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
        console.log(`Deleted file ${req.file.path} after submission error`);
      } catch (deleteErr) {
        console.error('Error deleting file after submission error:', deleteErr);
      }
    }
    
    // Provide a detailed error message
    let errorMessage = 'Failed to create submission';
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorMessage = 'File size exceeds the 10MB limit';
    } else if (err.message.includes('Invalid file type')) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
});

// Add admin routes
app.use('/api/admin', adminRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`Register endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log(`Admin endpoints: http://localhost:${PORT}/api/admin/*\n`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});