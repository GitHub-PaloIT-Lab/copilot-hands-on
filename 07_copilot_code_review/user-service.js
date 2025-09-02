// Vulnerable Node.js backend service for user management
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// SECURITY ISSUE: Hardcoded database credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'userdb'
});

// SECURITY ISSUE: Weak JWT secret
const JWT_SECRET = '12345';

// SECURITY ISSUE: No input validation or SQL injection protection
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABILITY: SQL Injection
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.query(query, (err, results) => {
        if (err) {
            // SECURITY ISSUE: Exposing internal error details
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            const user = results[0];
            // SECURITY ISSUE: Including sensitive data in token
            const token = jwt.sign({ 
                userId: user.id, 
                username: user.username,
                password: user.password,
                ssn: user.ssn 
            }, JWT_SECRET);
            
            // SECURITY ISSUE: Sending password in response
            res.json({ 
                token, 
                user: {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    ssn: user.ssn
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// SECURITY ISSUE: No authentication middleware
app.post('/api/users/create', (req, res) => {
    const { username, password, email, ssn } = req.body;
    
    // SECURITY ISSUE: No input validation
    // SECURITY ISSUE: Storing password in plain text
    const query = `INSERT INTO users (username, password, email, ssn) VALUES ('${username}', '${password}', '${email}', '${ssn}')`;
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'User created successfully', userId: result.insertId });
    });
});

// SECURITY ISSUE: No authorization check
app.get('/api/users/all', (req, res) => {
    const query = 'SELECT * FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // SECURITY ISSUE: Exposing all user data including passwords
        res.json(results);
    });
});

// SECURITY ISSUE: No rate limiting for password reset
app.post('/api/users/reset-password', (req, res) => {
    const { username, newPassword } = req.body;
    
    // VULNERABILITY: SQL Injection
    const query = `UPDATE users SET password = '${newPassword}' WHERE username = '${username}'`;
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Password reset successfully' });
    });
});

// SECURITY ISSUE: Dangerous admin endpoint with no protection
app.delete('/api/users/delete-all', (req, res) => {
    const query = 'DELETE FROM users';
    
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'All users deleted' });
    });
});

// SECURITY ISSUE: Server running on all interfaces without HTTPS
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
    // SECURITY ISSUE: Logging sensitive configuration
    console.log('Database password: admin123');
    console.log('JWT Secret: 12345');
});
