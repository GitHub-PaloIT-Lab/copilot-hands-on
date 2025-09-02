-- Database schema with security issues

-- SECURITY ISSUE: No proper indexing for performance
-- SECURITY ISSUE: No constraints on sensitive data
CREATE DATABASE IF NOT EXISTS userdb;
USE userdb;

-- SECURITY ISSUE: Storing sensitive data without encryption
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,  -- ISSUE: Should be hashed
    email VARCHAR(100),
    ssn VARCHAR(11),  -- SECURITY ISSUE: Storing SSN in plain text
    credit_card VARCHAR(16),  -- SECURITY ISSUE: Storing credit card numbers
    phone VARCHAR(15),
    address TEXT,
    bio TEXT,  -- VULNERABILITY: No length limit, potential for XSS storage
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,  -- No automatic lockout mechanism
    
    -- MISSING: No unique constraints
    -- MISSING: No proper indexing for queries
    -- MISSING: No foreign key constraints
    INDEX(username)  -- Basic index only
);

-- SECURITY ISSUE: Default admin user with weak credentials
INSERT INTO users (username, password, email, ssn, is_admin) VALUES 
('admin', 'admin', 'admin@example.com', '123-45-6789', TRUE),
('test', 'test123', 'test@example.com', '987-65-4321', FALSE),
('guest', 'guest', 'guest@example.com', '555-55-5555', FALSE);

-- SECURITY ISSUE: Overly permissive user privileges
-- CREATE USER 'webapp'@'%' IDENTIFIED BY 'webapp123';
-- GRANT ALL PRIVILEGES ON userdb.* TO 'webapp'@'%';

-- MISSING: No audit trail table
-- MISSING: No session management table
-- MISSING: No password history table
-- MISSING: No role-based access control tables
