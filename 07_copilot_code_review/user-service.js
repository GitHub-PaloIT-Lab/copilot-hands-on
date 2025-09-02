const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - has security issues
app.use(cors()); // Too permissive CORS
app.use(express.json({ limit: '50mb' })); // No size limit protection

// Database connection - security issues
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Empty password
    database: 'user_management'
});

// Hardcoded secret key - major security issue
const JWT_SECRET = 'my-super-secret-key-123';

// User registration endpoint - multiple security issues
app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    
    // No input validation
    // No password strength requirements
    // SQL injection vulnerability
    const query = `INSERT INTO users (username, email, password, role) VALUES ('${username}', '${email}', '${password}', '${role}')`;
    
    db.query(query, (err, result) => {
        if (err) {
            console.log(err); // Exposing internal errors
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        
        // Returning sensitive information
        res.json({ 
            message: 'User created successfully',
            userId: result.insertId,
            password: password // Never return password
        });
    });
});

// Login endpoint - security vulnerabilities
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // SQL injection vulnerability
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    
    db.query(query, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        // Plain text password comparison (should use bcrypt)
        if (password === user.password) {
            // Weak JWT token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                JWT_SECRET // Should use environment variable
                // No expiration time
            );
            
            // Returning too much user information
            res.json({ 
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password, // Never return password
                    role: user.role,
                    api_key: user.api_key // Sensitive information
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Middleware for authentication - insecure
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    // No error handling for invalid tokens
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get all users - major security issue
app.get('/api/users', (req, res) => {
    // No authentication required
    // No pagination
    // Returns sensitive information
    const query = 'SELECT * FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Returning passwords and API keys
        res.json(results);
    });
});

// Get user by ID - security issues
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    // No input validation
    // SQL injection vulnerability
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Returning sensitive information without authorization check
        res.json(results[0]);
    });
});

// Update user - multiple vulnerabilities
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;
    
    // No authentication
    // No authorization (users can modify other users)
    // No input validation
    // SQL injection vulnerability
    const query = `UPDATE users SET username = '${username}', email = '${email}', password = '${password}', role = '${role}' WHERE id = ${userId}`;
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'User updated successfully' });
    });
});

// Delete user - security issues
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    // No authentication or authorization
    // No soft delete implementation
    // SQL injection vulnerability
    const query = `DELETE FROM users WHERE id = ${userId}`;
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'User deleted successfully' });
    });
});

// Admin endpoint - improper access control
app.get('/api/admin/stats', (req, res) => {
    // No proper role-based access control
    const query = 'SELECT COUNT(*) as total_users FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({
            total_users: results[0].total_users,
            server_info: process.env, // Exposing environment variables
            database_config: db.config // Exposing database configuration
        });
    });
});

// File upload endpoint - security vulnerabilities
app.post('/api/upload', (req, res) => {
    // No file type validation
    // No size limits
    // No authentication
    // Path traversal vulnerability possible
    
    res.json({ message: 'File upload endpoint - needs implementation' });
});

// Error handling middleware - information disclosure
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Exposing internal error details
    res.status(500).json({
        error: 'Something went wrong!',
        details: err.message,
        stack: err.stack // Never expose stack traces in production
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database config: ${JSON.stringify(db.config)}`); // Logging sensitive info
});

module.exports = app;
