// แบบฝึกหัด Coding Agent
// ให้ Copilot เป็น AI Assistant ช่วยเขียนโค้ดและ review

// === แบบฝึกหัดที่ 1: E-commerce Cart System ===
// ให้ Copilot สร้างระบบตะกร้าสินค้าที่มีฟีเจอร์:
// - เพิ่มสินค้าลงตะกร้า (id, name, price, quantity)
// - ลบสินค้าออกจากตะกร้า
// - อัพเดทจำนวนสินค้า
// - คำนวณราคารวม
// - คำนวณส่วนลด (ถ้าซื้อมากกว่า 1000 บาท ลด 10%)
// - แสดงสรุปคำสั่งซื้อ


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
// - SQL injection prevention
// - XSS prevention


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
