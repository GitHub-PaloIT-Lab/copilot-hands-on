-- User Management Database Schema
-- WARNING: This schema has security issues that need to be reviewed

CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

-- Users table with potential security issues
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Should be hashed but validation missing
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255) NULL,  -- Potential security issue: no expiration
    api_key VARCHAR(100) NULL       -- Stored in plain text
);

-- Sessions table - missing security features
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,      -- No automatic cleanup
    ip_address VARCHAR(45),         -- No validation
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit log table - missing important fields
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    -- Missing: IP address, user agent, detailed action data
);

-- Insert test data with security issues
INSERT INTO users (username, email, password, role, api_key) VALUES 
('admin', 'admin@example.com', 'admin123', 'admin', 'api-key-123'),  -- Plain text password
('john_doe', 'john@example.com', 'password', 'user', 'api-key-456'),  -- Weak password
('jane_smith', 'jane@example.com', 'jane2023', 'user', NULL);

-- Problematic indexes - missing security considerations
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
-- Missing: Indexes on security-related fields

-- Stored procedure with SQL injection vulnerability
DELIMITER //
CREATE PROCEDURE GetUserByEmail(IN user_email VARCHAR(100))
BEGIN
    SET @sql = CONCAT('SELECT * FROM users WHERE email = "', user_email, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
