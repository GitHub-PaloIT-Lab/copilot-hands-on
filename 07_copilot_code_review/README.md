# User Management System - Code Review Exercise

## Overview
ระบบจัดการผู้ใช้นี้ถูกสร้างขึ้นเพื่อใช้เป็นตัวอย่างในการ code review โดย GitHub Copilot มีการใส่ปัญหาด้าน security และ best practices หลายประการเพื่อให้ Copilot สามารถตรวจสอบและแนะนำการปรับปรุงได้

## ไฟล์ที่มีปัญหา

### 1. `user-service.js` - Backend API Service
**ปัญหาด้าน Security:**
- SQL Injection vulnerabilities
- Hardcoded JWT secret key
- Plain text password storage
- No input validation
- Information disclosure in error messages
- Missing authentication/authorization
- Exposed sensitive data in responses
- No rate limiting
- Insecure CORS configuration

**ปัญหาด้าน Best Practices:**
- No error handling middleware
- Missing logging system
- No API documentation
- Poor code organization
- No environment variable usage

### 2. `UserDashboard.jsx` - Frontend React Component
**ปัญหาด้าน Security:**
- Insecure token storage (localStorage)
- XSS vulnerabilities
- Exposed sensitive information
- No input sanitization
- Client-side JWT decoding without verification
- Missing CSRF protection

**ปัญหาด้าน Best Practices:**
- Inline styles instead of CSS modules
- Poor error handling
- No proper loading states
- Missing prop validation
- Performance issues with inline functions
- No accessibility considerations
- Poor UX (using alert/prompt)

### 3. `database.sql` - Database Schema
**ปัญหาด้าน Security:**
- Plain text API keys storage
- Missing password policies
- Vulnerable stored procedures
- No data encryption
- Missing audit trail fields
- No automatic session cleanup

**ปัญหาด้าน Best Practices:**
- Missing indexes for performance
- No data retention policies
- Poor naming conventions

### 4. `package.json` - Dependencies
**ปัญหาที่อาจมี:**
- Outdated dependencies
- Missing security-related packages
- No security audit scripts

## วิธีการ Review

1. **สร้าง Pull Request**
   ```bash
   git add .
   git commit -m "Add user management system with security issues for review"
   git push origin copilot-code-review
   ```

2. **ใช้ GitHub Copilot ใน VS Code**
   - เปิด GitHub Copilot Chat
   - พิมพ์: "Please review this code for security vulnerabilities and best practices"
   - Copilot จะวิเคราะห์และแนะนำการปรับปรุง

3. **รอ Copilot แนะนำ**
   Copilot อาจจะแนะนำ:
   - การใช้ parameterized queries
   - Password hashing ด้วย bcrypt
   - Input validation และ sanitization
   - Environment variables สำหรับ secrets
   - Proper error handling
   - Security headers
   - Rate limiting
   - HTTPS enforcement
   - และอื่นๆ

## ผลลัพธ์ที่คาดหวัง

หลังจาก Copilot review แล้ว ควรได้:
1. โค้ดที่มีความปลอดภัยมากขึ้น
2. การใช้ best practices ที่ถูกต้อง
3. การจัดการ errors ที่ดีขึ้น
4. Performance ที่ดีขึ้น
5. Code ที่อ่านง่ายและดูแลรักษาได้

## การติดตั้งและรัน

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm start

# รัน tests (หลังจากแก้ไขแล้ว)
npm test
```

## หมายเหตุ
โค้ดในระบบนี้มีปัญหาด้าน security มากมาย **ห้ามนำไปใช้ใน production** โดยตรง ใช้เป็นตัวอย่างสำหรับการเรียนรู้เท่านั้น
