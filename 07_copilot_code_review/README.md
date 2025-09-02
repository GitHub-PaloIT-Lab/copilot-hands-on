# Code Review Exercise

## Overview
This folder contains intentionally vulnerable and poorly written code for GitHub Copilot code review demonstration.

## Security Issues Present

### Backend (user-service.js)
1. **SQL Injection**: Direct string concatenation in SQL queries
2. **Hardcoded Credentials**: Database passwords in source code
3. **Weak JWT Secret**: Simple numeric secret key
4. **No Input Validation**: Missing sanitization and validation
5. **Information Disclosure**: Exposing internal errors and sensitive data
6. **No Authentication/Authorization**: Missing middleware and access controls
7. **Plain Text Passwords**: No password hashing
8. **No Rate Limiting**: Vulnerable to brute force attacks

### Frontend (UserDashboard.jsx)
1. **XSS Vulnerability**: Direct innerHTML manipulation with user input
2. **Sensitive Data Exposure**: Displaying passwords in UI
3. **Insecure Storage**: Using localStorage for tokens
4. **No CSRF Protection**: Missing anti-CSRF tokens
5. **Information Leakage**: Console logging sensitive data
6. **Poor Error Handling**: No proper error boundaries

## Best Practice Issues
1. **No Environment Configuration**: Hardcoded values
2. **Poor Error Handling**: Exposing internal errors
3. **No Code Documentation**: Missing comments and documentation
4. **Direct DOM Manipulation in React**: Anti-pattern usage
5. **Inline Event Handlers**: Performance and maintainability issues
6. **No Confirmation Dialogs**: Poor UX for destructive actions

## Instructions for Review
1. Create a Pull Request with these files
2. Request review from GitHub Copilot
3. Observe the security and best practice suggestions
4. Implement the recommended fixes

## Expected Copilot Suggestions
- Input validation and sanitization
- Parameterized queries to prevent SQL injection
- Environment variables for configuration
- Proper authentication middleware
- Password hashing with bcrypt
- Error handling improvements
- React best practices
- Security headers and CORS configuration
