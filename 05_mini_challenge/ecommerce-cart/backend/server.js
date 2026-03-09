const express = require('express');
const cors = require('cors');
const products = require('./data/products');
const ShoppingCart = require('../cart-system');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// เก็บ cart sessions (ใช้ in-memory สำหรับ demo)
const carts = {};

// Helper: ดึงหรือสร้างตะกร้าตาม session
function getCart(sessionId) {
    if (!carts[sessionId]) {
        carts[sessionId] = new ShoppingCart();
    }
    return carts[sessionId];
}

// ==================== Product API ====================

// GET /api/products - ดึงรายการสินค้าทั้งหมด
app.get('/api/products', (req, res) => {
    const productList = products.map(({ id, name, price, image, category }) => ({
        id,
        name,
        price,
        image,
        category
    }));
    res.json(productList);
});

// GET /api/products/:id - ดึงรายละเอียดสินค้า
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }
    res.json(product);
});

// ==================== Cart API ====================

// GET /api/cart - ดึงข้อมูลตะกร้าสินค้า
app.get('/api/cart', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const cart = getCart(sessionId);
    res.json(cart.getOrderSummary());
});

// POST /api/cart/add - เพิ่มสินค้าลงตะกร้า
app.post('/api/cart/add', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const { id, name, price, quantity } = req.body;

    if (!id || !name || price == null) {
        return res.status(400).json({ error: 'กรุณาระบุ id, name, price' });
    }

    const cart = getCart(sessionId);
    cart.addItem(id, name, Number(price), Number(quantity) || 1);
    res.json(cart.getOrderSummary());
});

// PUT /api/cart/update - อัปเดตจำนวนสินค้า
app.put('/api/cart/update', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const { id, quantity } = req.body;

    if (!id || quantity == null) {
        return res.status(400).json({ error: 'กรุณาระบุ id และ quantity' });
    }

    const cart = getCart(sessionId);
    cart.updateQuantity(id, Number(quantity));
    res.json(cart.getOrderSummary());
});

// DELETE /api/cart/remove/:id - ลบสินค้าออกจากตะกร้า
app.delete('/api/cart/remove/:id', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const cart = getCart(sessionId);
    cart.removeItem(req.params.id);
    res.json(cart.getOrderSummary());
});

// DELETE /api/cart/clear - ล้างตะกร้า
app.delete('/api/cart/clear', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const cart = getCart(sessionId);
    cart.clearCart();
    res.json(cart.getOrderSummary());
});

// เริ่ม server (เฉพาะเมื่อรันโดยตรง ไม่ใช่ตอน require)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 E-commerce API Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
