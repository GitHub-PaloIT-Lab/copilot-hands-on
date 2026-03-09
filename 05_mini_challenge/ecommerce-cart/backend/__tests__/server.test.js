const request = require('supertest');
const app = require('../server');

describe('E-commerce API', () => {
    describe('GET /api/products', () => {
        it('ควร return รายการสินค้าทั้งหมด', async () => {
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(6);
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('price');
        });

        it('ไม่ควร return ข้อมูลละเอียดในหน้ารายการ', async () => {
            const res = await request(app).get('/api/products');
            expect(res.body[0]).not.toHaveProperty('description');
            expect(res.body[0]).not.toHaveProperty('colors');
        });
    });

    describe('GET /api/products/:id', () => {
        it('ควร return รายละเอียดสินค้าพร้อมสี', async () => {
            const res = await request(app).get('/api/products/phone');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe('phone');
            expect(res.body).toHaveProperty('description');
            expect(res.body).toHaveProperty('colors');
            expect(Array.isArray(res.body.colors)).toBe(true);
        });

        it('ควร return 404 เมื่อไม่พบสินค้า', async () => {
            const res = await request(app).get('/api/products/nonexistent');
            expect(res.status).toBe(404);
        });
    });

    describe('Cart API', () => {
        const sessionId = 'test-session-' + Date.now();

        it('ควร return ตะกร้าว่างเมื่อเริ่มต้น', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('x-session-id', sessionId);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('ตะกร้าว่างเปล่า');
        });

        it('ควรเพิ่มสินค้าลงตะกร้า', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('x-session-id', sessionId)
                .send({ id: 'phone', name: 'โทรศัพท์มือถือ', price: 15000, quantity: 1 });
            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(1);
            expect(res.body.subtotal).toBe(15000);
        });

        it('ควร validate input เมื่อเพิ่มสินค้า', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('x-session-id', sessionId)
                .send({});
            expect(res.status).toBe(400);
        });

        it('ควรอัปเดตจำนวนสินค้า', async () => {
            const res = await request(app)
                .put('/api/cart/update')
                .set('x-session-id', sessionId)
                .send({ id: 'phone', quantity: 3 });
            expect(res.status).toBe(200);
            expect(res.body.items[0].quantity).toBe(3);
        });

        it('ควรลบสินค้าออกจากตะกร้า', async () => {
            const res = await request(app)
                .delete('/api/cart/remove/phone')
                .set('x-session-id', sessionId);
            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(0);
        });

        it('ควรล้างตะกร้า', async () => {
            // เพิ่มสินค้าก่อน
            await request(app)
                .post('/api/cart/add')
                .set('x-session-id', sessionId)
                .send({ id: 'case', name: 'เคสโทรศัพท์', price: 350, quantity: 1 });

            const res = await request(app)
                .delete('/api/cart/clear')
                .set('x-session-id', sessionId);
            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(0);
        });
    });

    describe('ส่วนลด', () => {
        const sessionId = 'discount-test-' + Date.now();

        it('ควรคำนวณส่วนลด 10% เมื่อซื้อเกิน 1,000 บาท', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('x-session-id', sessionId)
                .send({ id: 'powerbank', name: 'พาวเวอร์แบงค์', price: 1200, quantity: 1 });
            expect(res.body.subtotal).toBe(1200);
            expect(res.body.discount).toBe(120);
            expect(res.body.total).toBe(1080);
            expect(res.body.hasDiscount).toBe(true);
        });
    });
});
