// แบบฝึกหัด Coding Agent
// ให้ Copilot เป็น AI Assistant ช่วยเขียนโค้ดและ review

// === แบบฝึกหัดที่ 1: E-commerce Cart System ===
// E-commerce Cart System 🛒
// ระบบรายการสินค้าและตะกร้าสินค้าที่มีฟีเจอร์ครบครันสำหรับ E-commerce

// ฟีเจอร์ที่รองรับ ✨

// ✅ หน้าแสดงรายการสินค้า - แสดงรายการสินค้าและราคารวม
// ✅ หน้าแสดงรายการละเอียดสินค้า - แสดงรายละเอียดสินค้าและราคา รวมถึงตัวเลือก เช่น สี
// ✅ เพิ่มสินค้าลงตะกร้า - เพิ่มสินค้าพร้อม id, name, price, quantity
// ✅ ลบสินค้าออกจากตะกร้า - ลบสินค้าทั้งหมดออกจากตะกร้า
// ✅ อัพเดทจำนวนสินค้า - เปลี่ยนจำนวนสินค้าในตะกร้า
// ✅ คำนวณราคารวม - คำนวณราคารวมของสินค้าทั้งหมด
// ✅ คำนวณส่วนลด - ส่วนลด 10% เมื่อซื้อครบ 1,000 บาท
// ✅ แสดงสรุปคำสั่งซื้อ - แสดงรายการสินค้าและราคารวม
// Tech
// Frontend: React.js
// Backend: Node.js + Express.js


// === แบบฝึกหัดที่ 2: User Authentication System ===
// ให้ Copilot สร้างระบบ authentication ที่มี:
// - สมัครสมาชิก (ตรวจสอบ email format, password strength)
// - เข้าสู่ระบบ
// - ออกจากระบบ
// - เปลี่ยนรหัสผ่าน
// - reset รหัสผ่าน (generate token)


// === แบบฝึกหัดที่ 3: Task Management API ===
// ให้ Copilot สร้าง API สำหรับจัดการ tasks:
// - สร้าง task ใหม่ (title, description, priority, due_date)
// - แสดงรายการ tasks (มีการกรองตาม status, priority)
// - อัพเดท task (เปลี่ยน status, แก้ไขรายละเอียด)
// - ลบ task
// - ค้นหา tasks ด้วย keyword


// === แบบฝึกหัดที่ 4: Data Validation & Sanitization ===
// ให้ Copilot สร้างระบบ validation สำหรับ:
// - Email validation (format, domain check)
// - Phone number validation (รองรับรูปแบบไทย)
// - Credit card validation (Luhn algorithm)
// - URL validation
// - SQL injection prevention (ดูตัวอย่างใน sql-injection-example.js)
// - XSS prevention

// SQL Injection Prevention Example:
// ❌ ไม่ปลอดภัย: const query = `SELECT * FROM users WHERE username = '${username}'`;
// ✅ ปลอดภัย: const query = 'SELECT * FROM users WHERE username = ?';
//              connection.query(query, [username], callback);


// === แบบฝึกหัดที่ 5: Performance Monitoring ===
// ให้ Copilot สร้างระบบ monitor performance:
// - วัดเวลาที่ใช้ในการทำงานของฟังก์ชัน
// - นับจำนวนครั้งที่เรียกใช้ฟังก์ชัน
// - เก็บ log การทำงาน
// - สร้าง report สรุปผลการทำงาน
// - แจ้งเตือนเมื่อ performance ไม่ดี


// === Code Review Challenge ===
// ให้ Copilot ตรวจสอบโค้ดด้านล่างและแนะนำการปรับปรุง

function processPayment(amount, cardNumber, expiry, cvv) {
    if (amount > 0) {
        if (cardNumber.length == 16) {
            if (expiry.length == 5) {
                if (cvv.length == 3) {
                    // Process payment
                    return { success: true, message: "Payment processed" };
                }
            }
        }
    }
    return { success: false, message: "Invalid payment details" };
}

// ให้ Copilot ชี้จุดปรับปรุงและเขียนโค้ดที่ดีกว่า
