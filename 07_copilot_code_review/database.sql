-- Database schema with security issues

-- SECURITY ISSUE: No proper indexing for performance
-- SECURITY ISSUE: No constraints on sensitive data
CREATE DATABASE IF NOT EXISTS userdb;
USE userdb;

-- SECURITY ISSUE: Storing sensitive data without encryption
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    ssn VARCHAR(11),
    credit_card VARCHAR(16),
    phone VARCHAR(15),
    address TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    INDEX(username)
);

-- SECURITY ISSUE: Default admin user with weak credentials
INSERT INTO users (username, password, email, ssn, is_admin) VALUES 
('admin', 'admin', 'admin@example.com', '123-45-6789', TRUE),
('test', 'test123', 'test@example.com', '987-65-4321', FALSE),
('guest', 'guest', 'guest@example.com', '555-55-5555', FALSE);
