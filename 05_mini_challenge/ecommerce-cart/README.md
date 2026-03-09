# E-commerce Cart System 🛒

ระบบรายการสินค้าและตะกร้าสินค้าที่มีฟีเจอร์ครบครันสำหรับ E-commerce

## ฟีเจอร์ที่รองรับ ✨

- ✅ **หน้าแสดงรายการสินค้า** - แสดงรายการสินค้าและราคารวม
- ✅ **หน้าแสดงรายการละเอียดสินค้า** - แสดงรายละเอียดสินค้าและราคา รวมถึงตัวเลือก เช่น สี
- ✅ **เพิ่มสินค้าลงตะกร้า** - เพิ่มสินค้าพร้อม id, name, price, quantity
- ✅ **ลบสินค้าออกจากตะกร้า** - ลบสินค้าทั้งหมดออกจากตะกร้า
- ✅ **อัพเดทจำนวนสินค้า** - เปลี่ยนจำนวนสินค้าในตะกร้า
- ✅ **คำนวณราคารวม** - คำนวณราคารวมของสินค้าทั้งหมด
- ✅ **คำนวณส่วนลด** - ส่วนลด 10% เมื่อซื้อครบ 1,000 บาท
- ✅ **แสดงสรุปคำสั่งซื้อ** - แสดงรายการสินค้าและราคารวม

## เทคโนโลยีที่ใช้ 🛠️

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Testing**: Jest + Supertest + React Testing Library

## ไฟล์ในโปรเจ็กต์ 📁

```
ecommerce-cart/
├── cart-system.js         # คลาสหลักของระบบตะกร้า
├── cart-demo.html         # หน้าเว็บสำหรับทดสอบ (Vanilla JS)
├── README.md              # เอกสารนี้
├── backend/               # Backend API (Node.js + Express.js)
│   ├── package.json
│   ├── server.js          # Express API server
│   ├── data/
│   │   └── products.js    # ข้อมูลสินค้าตัวอย่าง
│   └── __tests__/
│       ├── cart-system.test.js  # Unit tests สำหรับ ShoppingCart
│       └── server.test.js       # API integration tests
└── frontend/              # Frontend (React.js)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js         # Main App component
        ├── App.css        # Styles
        ├── App.test.js    # Frontend tests
        ├── context/
        │   └── CartContext.js    # Cart state management
        └── components/
            ├── ProductList.js    # หน้าแสดงรายการสินค้า
            ├── ProductDetail.js  # หน้าแสดงรายละเอียดสินค้า
            └── Cart.js           # ตะกร้าสินค้าและสรุปคำสั่งซื้อ
```

## วิธีใช้งาน 🚀

### 1. รัน Backend API

```bash
cd backend
npm install
npm start
```

Server จะรันที่ `http://localhost:3001`

### 2. รัน Frontend (React)

```bash
cd frontend
npm install
npm start
```

App จะเปิดที่ `http://localhost:3000`

### 3. การใช้งานแบบ Vanilla JS

เปิดไฟล์ `cart-demo.html` ในเบราว์เซอร์เพื่อดูการทำงานแบบ interactive

### 4. การใช้งานใน JavaScript

```javascript
const ShoppingCart = require('./cart-system.js');
const cart = new ShoppingCart();

// เพิ่มสินค้าลงตะกร้า (รองรับ method chaining)
cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1)
    .addItem('case', 'เคสโทรศัพท์', 350, 2);

// อัพเดทจำนวนสินค้า
cart.updateQuantity('phone', 2);

// ลบสินค้า
cart.removeItem('case');

// ดูสรุปคำสั่งซื้อ
cart.displayOrderSummary();
```

## API Endpoints 📡

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | ดึงรายการสินค้าทั้งหมด |
| GET | `/api/products/:id` | ดึงรายละเอียดสินค้า (พร้อมสี) |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | ดึงข้อมูลตะกร้าสินค้า |
| POST | `/api/cart/add` | เพิ่มสินค้าลงตะกร้า |
| PUT | `/api/cart/update` | อัปเดตจำนวนสินค้า |
| DELETE | `/api/cart/remove/:id` | ลบสินค้าออกจากตะกร้า |
| DELETE | `/api/cart/clear` | ล้างตะกร้า |

## การรัน Tests 🧪

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## ข้อกำหนดระบบส่วนลด 🎯

- **เงื่อนไข**: ซื้อสินค้ารวมมากกว่า 1,000 บาท
- **ส่วนลด**: 10% ของราคารวม
- **การคำนวณ**: หักส่วนลดจากราคารวมก่อนส่วนลด

---

**หมายเหตุ**: ระบบนี้เหมาะสำหรับการเรียนรู้และต้นแบบ สำหรับการใช้งานจริงควรเพิ่มการตรวจสอบความปลอดภัยและการจัดการข้อผิดพลาดเพิ่มเติม