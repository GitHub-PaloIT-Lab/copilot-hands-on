// E-commerce Cart System
// ระบบตะกร้าสินค้าที่มีฟีเจอร์ครบครัน

class ShoppingCart {
    constructor() {
        this.items = [];
        this.discountThreshold = 1000; // จำนวนเงินขั้นต่ำสำหรับส่วนลด
        this.discountRate = 0.1; // ส่วนลด 10%
    }

    // เพิ่มสินค้าลงตะกร้า
    addItem(id, name, price, quantity = 1) {
        // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าแล้วหรือไม่
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            // ถ้ามีแล้ว เพิ่มจำนวน
            existingItem.quantity += quantity;
        } else {
            // ถ้าไม่มี สร้างใหม่
            this.items.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity
            });
        }
        
        console.log(`เพิ่ม ${name} จำนวน ${quantity} ชิ้นลงในตะกร้าแล้ว`);
        return this;
    }

    // ลบสินค้าออกจากตะกร้า
    removeItem(id) {
        const itemIndex = this.items.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            const removedItem = this.items.splice(itemIndex, 1)[0];
            console.log(`ลบ ${removedItem.name} ออกจากตะกร้าแล้ว`);
            return true;
        } else {
            console.log('ไม่พบสินค้าที่ต้องการลบ');
            return false;
        }
    }

    // อัพเดทจำนวนสินค้า
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        
        if (item) {
            if (quantity <= 0) {
                // ถ้าจำนวนเป็น 0 หรือติดลบ ให้ลบสินค้าออก
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                console.log(`อัพเดทจำนวน ${item.name} เป็น ${quantity} ชิ้นแล้ว`);
            }
            return true;
        } else {
            console.log('ไม่พบสินค้าที่ต้องการอัพเดท');
            return false;
        }
    }

    // คำนวณราคารวมก่อนส่วนลด
    calculateSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // คำนวณส่วนลด
    calculateDiscount() {
        const subtotal = this.calculateSubtotal();
        if (subtotal > this.discountThreshold) {
            return subtotal * this.discountRate;
        }
        return 0;
    }

    // คำนวณราคารวมหลังหักส่วนลด
    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount();
        return subtotal - discount;
    }

    // แสดงสรุปคำสั่งซื้อ
    getOrderSummary() {
        if (this.items.length === 0) {
            return {
                items: [],
                subtotal: 0,
                discount: 0,
                total: 0,
                message: 'ตะกร้าว่างเปล่า'
            };
        }

        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount();
        const total = this.calculateTotal();

        return {
            items: this.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                itemTotal: item.price * item.quantity
            })),
            subtotal: subtotal,
            discount: discount,
            total: total,
            hasDiscount: discount > 0
        };
    }

    // แสดงสรุปคำสั่งซื้อในรูปแบบข้อความ
    displayOrderSummary() {
        const summary = this.getOrderSummary();
        
        if (summary.message) {
            console.log(summary.message);
            return;
        }

        console.log('\n=== สรุปคำสั่งซื้อ ===');
        console.log('สินค้าในตะกร้า:');
        
        summary.items.forEach(item => {
            console.log(`- ${item.name} x ${item.quantity} @ ฿${item.price} = ฿${item.itemTotal}`);
        });
        
        console.log(`\nราคารวมก่อนส่วนลด: ฿${summary.subtotal}`);
        
        if (summary.hasDiscount) {
            console.log(`ส่วนลด 10% (ซื้อครบ ฿${this.discountThreshold}): -฿${summary.discount}`);
        }
        
        console.log(`ราคารวมสุทธิ: ฿${summary.total}`);
        console.log('===================\n');
    }

    // ล้างตะกร้า
    clearCart() {
        this.items = [];
        console.log('ล้างตะกร้าแล้ว');
    }

    // นับจำนวนสินค้าทั้งหมดในตะกร้า
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
}

// Export สำหรับใช้งานใน Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}