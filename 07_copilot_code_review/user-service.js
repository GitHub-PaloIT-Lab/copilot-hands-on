// User Service with Security Issues and Poor Practices
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Security Issue: Hardcoded credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'userdb'
};

const connection = mysql.createConnection(dbConfig);

// Security Issue: No rate limiting, weak JWT secret
const JWT_SECRET = '123456';

// Poor Practice: No input validation, SQL Injection vulnerability
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // SQL Injection vulnerability
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  connection.query(query, (err, results) => {
    if (err) {
      // Security Issue: Exposing internal errors
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length > 0) {
      // Security Issue: No password hashing verification
      const token = jwt.sign({ userId: results[0].id }, JWT_SECRET);
      res.json({ token: token, user: results[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Poor Practice: No authentication middleware
app.get('/users', (req, res) => {
  // Security Issue: Exposing all user data including passwords
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Poor Practice: No input validation, potential for XSS
app.post('/users', (req, res) => {
  const { username, email, password, role } = req.body;
  
  // Security Issue: No password strength validation
  // Poor Practice: Storing plain text password
  const query = `INSERT INTO users (username, email, password, role) VALUES ('${username}', '${email}', '${password}', '${role}')`;
  
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User created', id: result.insertId });
  });
});

// Security Issue: No authorization checks
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // No validation if user can delete this record
  connection.query(`DELETE FROM users WHERE id = ${userId}`, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User deleted' });
  });
});

// Poor Practice: No environment configuration
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Security Issue: Logging sensitive information
  console.log(`Database connected with password: ${dbConfig.password}`);
});

// Poor Practice: No error handling for database connection
connection.connect();

module.exports = app;
