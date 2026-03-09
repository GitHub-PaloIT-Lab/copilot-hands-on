import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ProductList({ onSelectProduct }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('โหลดข้อมูลสินค้าจาก API ไม่สำเร็จ:', err.message);
                // ใช้ข้อมูลตัวอย่างถ้า API ไม่ตอบ
                setProducts([
                    { id: 'phone', name: 'โทรศัพท์มือถือ', price: 15000, category: 'อิเล็กทรอนิกส์' },
                    { id: 'headphone', name: 'หูฟัง Bluetooth', price: 2500, category: 'อิเล็กทรอนิกส์' },
                    { id: 'case', name: 'เคสโทรศัพท์', price: 350, category: 'อุปกรณ์เสริม' },
                    { id: 'cable', name: 'สายชาร์จ USB-C', price: 450, category: 'อุปกรณ์เสริม' },
                    { id: 'stand', name: 'แท่นวางโทรศัพท์', price: 750, category: 'อุปกรณ์เสริม' },
                    { id: 'powerbank', name: 'พาวเวอร์แบงค์', price: 1200, category: 'อิเล็กทรอนิกส์' }
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">กำลังโหลดสินค้า...</div>;

    return (
        <div className="product-list">
            <h2>🏪 สินค้าในร้าน</h2>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">📦</div>
                        <h3>{product.name}</h3>
                        <div className="product-category">{product.category}</div>
                        <div className="product-price">฿{product.price.toLocaleString()}</div>
                        <div className="product-actions">
                            <button
                                className="btn btn-detail"
                                onClick={() => onSelectProduct(product.id)}
                            >
                                ดูรายละเอียด
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => addItem(product.id, product.name, product.price)}
                            >
                                🛒 เพิ่มลงตะกร้า
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
