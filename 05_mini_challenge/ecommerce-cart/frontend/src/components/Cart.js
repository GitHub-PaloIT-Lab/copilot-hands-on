import React from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
    const { items, removeItem, updateQuantity, clearCart, getOrderSummary } = useCart();
    const summary = getOrderSummary();

    if (items.length === 0) {
        return (
            <div className="cart">
                <h2>🛒 ตะกร้าของคุณ</h2>
                <div className="empty-cart">ตะกร้าว่างเปล่า</div>
            </div>
        );
    }

    return (
        <div className="cart">
            <h2>🛒 ตะกร้าของคุณ ({items.reduce((t, i) => t + i.quantity, 0)} ชิ้น)</h2>
            <div className="cart-items">
                {summary.items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                            <strong>{item.name}</strong>
                            <span className="cart-item-price">
                                ฿{item.price.toLocaleString()} × {item.quantity} = ฿{item.itemTotal.toLocaleString()}
                            </span>
                        </div>
                        <div className="cart-item-controls">
                            <button
                                className="btn btn-qty"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="qty-input"
                                value={item.quantity}
                                min="1"
                                onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            />
                            <button
                                className="btn btn-qty"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                +
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => removeItem(item.id)}
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-summary">
                <h3>📋 สรุปคำสั่งซื้อ</h3>
                <div className="summary-line">
                    <span>ราคารวมก่อนส่วนลด:</span>
                    <span>฿{summary.subtotal.toLocaleString()}</span>
                </div>
                {summary.hasDiscount && (
                    <div className="summary-line discount">
                        <span>ส่วนลด 10% (ซื้อครบ ฿1,000):</span>
                        <span>-฿{summary.discount.toLocaleString()}</span>
                    </div>
                )}
                <div className="summary-line total">
                    <span>ราคารวมสุทธิ:</span>
                    <span>฿{summary.total.toLocaleString()}</span>
                </div>
                {!summary.hasDiscount && summary.subtotal > 0 && (
                    <div className="discount-hint">
                        💡 ซื้อเพิ่มอีก ฿{(1000 - summary.subtotal).toLocaleString()} เพื่อรับส่วนลด 10%
                    </div>
                )}
            </div>

            <div className="cart-actions">
                <button className="btn btn-clear" onClick={clearCart}>
                    🗑️ ล้างตะกร้า
                </button>
            </div>
        </div>
    );
}

export default Cart;
