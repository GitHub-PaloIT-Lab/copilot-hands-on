const ShoppingCart = require('../../cart-system');

describe('ShoppingCart', () => {
    let cart;

    beforeEach(() => {
        cart = new ShoppingCart();
    });

    describe('constructor', () => {
        it('ควรสร้างตะกร้าว่าง', () => {
            expect(cart.items).toEqual([]);
            expect(cart.discountThreshold).toBe(1000);
            expect(cart.discountRate).toBe(0.1);
        });
    });

    describe('addItem', () => {
        it('ควรเพิ่มสินค้าใหม่ลงตะกร้า', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            expect(cart.items).toHaveLength(1);
            expect(cart.items[0]).toEqual({
                id: 'phone',
                name: 'โทรศัพท์มือถือ',
                price: 15000,
                quantity: 1
            });
        });

        it('ควรเพิ่มจำนวนถ้าสินค้ามีอยู่แล้ว', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 2);
            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].quantity).toBe(3);
        });

        it('ควรใช้ quantity เป็น 1 ถ้าไม่ระบุ', () => {
            cart.addItem('case', 'เคสโทรศัพท์', 350);
            expect(cart.items[0].quantity).toBe(1);
        });

        it('ควร return this เพื่อรองรับ method chaining', () => {
            const result = cart.addItem('phone', 'โทรศัพท์มือถือ', 15000);
            expect(result).toBe(cart);
        });
    });

    describe('removeItem', () => {
        it('ควรลบสินค้าออกจากตะกร้า', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000);
            const result = cart.removeItem('phone');
            expect(result).toBe(true);
            expect(cart.items).toHaveLength(0);
        });

        it('ควร return false ถ้าไม่พบสินค้า', () => {
            const result = cart.removeItem('nonexistent');
            expect(result).toBe(false);
        });
    });

    describe('updateQuantity', () => {
        it('ควรอัปเดตจำนวนสินค้า', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            cart.updateQuantity('phone', 5);
            expect(cart.items[0].quantity).toBe(5);
        });

        it('ควรลบสินค้าถ้า quantity เป็น 0', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            cart.updateQuantity('phone', 0);
            expect(cart.items).toHaveLength(0);
        });

        it('ควร return false ถ้าไม่พบสินค้า', () => {
            const result = cart.updateQuantity('nonexistent', 5);
            expect(result).toBe(false);
        });
    });

    describe('calculateSubtotal', () => {
        it('ควรคำนวณราคารวมถูกต้อง', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            cart.addItem('case', 'เคสโทรศัพท์', 350, 2);
            expect(cart.calculateSubtotal()).toBe(15700);
        });

        it('ควร return 0 เมื่อตะกร้าว่าง', () => {
            expect(cart.calculateSubtotal()).toBe(0);
        });
    });

    describe('calculateDiscount', () => {
        it('ควรให้ส่วนลด 10% เมื่อซื้อเกิน 1,000 บาท', () => {
            cart.addItem('powerbank', 'พาวเวอร์แบงค์', 1200, 1);
            expect(cart.calculateDiscount()).toBe(120);
        });

        it('ไม่ควรให้ส่วนลดเมื่อซื้อไม่ถึง 1,000 บาท', () => {
            cart.addItem('case', 'เคสโทรศัพท์', 350, 1);
            expect(cart.calculateDiscount()).toBe(0);
        });

        it('ไม่ควรให้ส่วนลดเมื่อซื้อพอดี 1,000 บาท', () => {
            cart.addItem('item', 'สินค้า', 1000, 1);
            expect(cart.calculateDiscount()).toBe(0);
        });
    });

    describe('calculateTotal', () => {
        it('ควรคำนวณราคารวมหลังส่วนลดถูกต้อง', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            // subtotal = 15000, discount = 1500, total = 13500
            expect(cart.calculateTotal()).toBe(13500);
        });

        it('ควรไม่หักส่วนลดเมื่อซื้อไม่ถึง 1,000 บาท', () => {
            cart.addItem('case', 'เคสโทรศัพท์', 350, 1);
            expect(cart.calculateTotal()).toBe(350);
        });
    });

    describe('getOrderSummary', () => {
        it('ควร return message เมื่อตะกร้าว่าง', () => {
            const summary = cart.getOrderSummary();
            expect(summary.message).toBe('ตะกร้าว่างเปล่า');
            expect(summary.items).toEqual([]);
        });

        it('ควร return สรุปคำสั่งซื้อที่ถูกต้อง', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 1);
            const summary = cart.getOrderSummary();
            expect(summary.subtotal).toBe(15000);
            expect(summary.discount).toBe(1500);
            expect(summary.total).toBe(13500);
            expect(summary.hasDiscount).toBe(true);
            expect(summary.items).toHaveLength(1);
        });
    });

    describe('clearCart', () => {
        it('ควรล้างสินค้าทั้งหมดออกจากตะกร้า', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000);
            cart.addItem('case', 'เคสโทรศัพท์', 350);
            cart.clearCart();
            expect(cart.items).toHaveLength(0);
        });
    });

    describe('getTotalItems', () => {
        it('ควรนับจำนวนสินค้าทั้งหมดถูกต้อง', () => {
            cart.addItem('phone', 'โทรศัพท์มือถือ', 15000, 2);
            cart.addItem('case', 'เคสโทรศัพท์', 350, 3);
            expect(cart.getTotalItems()).toBe(5);
        });

        it('ควร return 0 เมื่อตะกร้าว่าง', () => {
            expect(cart.getTotalItems()).toBe(0);
        });
    });
});
