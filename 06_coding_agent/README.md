# Coding Agent - ใช้ Copilot เป็น AI Assistant

## เป้าหมาย
- เรียนรู้การใช้ Copilot เป็น Coding Agent
- ให้ Copilot เขียนโค้ดจากความต้องการที่ซับซ้อน
- ใช้ Copilot เป็น Code Reviewer

## การใช้ Copilot เป็น Coding Agent

### 1. การให้ Copilot เขียนโค้ดทั้งฟังก์ชัน
- เขียน comment อธิบายความต้องการอย่างชัดเจน
- ระบุ input, output, และ logic หลัก
- ให้ Copilot สร้างโค้ดทั้งหมด

### 2. การใช้ Copilot Chat
- ถามคำถามเกี่ยวกับโค้ด
- ขอคำแนะนำในการแก้ปัญหา
- ขอให้อธิบายโค้ดที่ซับซ้อน

### 3. การใช้ Copilot เป็น Code Reviewer
- ให้ Copilot ตรวจสอบโค้ด
- หาข้อผิดพลาดและจุดที่ปรับปรุงได้
- แนะนำ best practices

## แบบฝึกหัด

### การให้ Copilot เขียนโค้ดซับซ้อน
ลองให้ Copilot เขียนโค้ดจาก requirement ที่ซับซ้อน

### การใช้เป็น Code Reviewer
ให้ Copilot ตรวจสอบโค้ดและแนะนำการปรับปรุง

## ตัวอย่าง: SQL Injection Prevention

ในโฟลเดอร์นี้มีตัวอย่างการแก้ไขปัญหา SQL injection ด้วยการใช้ parameterized queries

### ไฟล์ที่สำคัญ

- `sql-injection-example.js` - ตัวอย่างการแก้ไขปัญหา SQL injection
- `sql-injection-test.js` - Test สำหรับตรวจสอบการป้องกัน SQL injection
- `exercises.js` - แบบฝึกหัดต่าง ๆ สำหรับ Coding Agent

### การแก้ไขปัญหา SQL Injection

#### ❌ วิธีที่ไม่ปลอดภัย (String Concatenation)
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
connection.query(query, callback);
```

#### ✅ วิธีที่ปลอดภัย (Parameterized Queries)
```javascript
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
connection.query(query, [username, password], callback);
```

### วิธีการรันตัวอย่าง

```bash
# รันการสาธิต SQL injection
node sql-injection-example.js

# รัน tests
node sql-injection-test.js
```

## เทคนิคการใช้งาน
- เขียน requirement ที่ชัดเจนและเฉพาะเจาะจง
- แบ่งปัญหาใหญ่เป็นปัญหาเล็กๆ
- ทดสอบและปรับแต่งโค้ดที่ได้
- ใช้ Copilot Chat เพื่อถามคำถามเพิ่มเติม
