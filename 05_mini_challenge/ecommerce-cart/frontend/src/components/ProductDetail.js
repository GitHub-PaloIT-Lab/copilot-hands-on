import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ProductDetail({ productId, onBack }) {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState(null);
    const { addItem } = useCart();

    useEffect(() => {
        fetch(`${API_URL}/api/products/${productId}`)
            .then(res => {
                if (!res.ok) throw new Error('ไม่พบสินค้า');
                return res.json();
            })
            .then(data => {
                setProduct(data);
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('โหลดข้อมูลสินค้าไม่สำเร็จ:', err.message);
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            const itemName = selectedColor
                ? `${product.name} (${selectedColor})`
                : product.name;
            addItem(
                selectedColor ? `${product.id}-${selectedColor}` : product.id,
                itemName,
                product.price,
                quantity
            );
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) return <div className="loading">กำลังโหลดข้อมูลสินค้า...</div>;
    if (error || !product) return (
        <div className="product-detail">
            <button className="btn btn-back" onClick={onBack}>← กลับไปหน้ารายการสินค้า</button>
            <div className="error">❌ {error || 'ไม่พบสินค้า'}</div>
        </div>
    );

    return (
        <div className="product-detail">
            <button className="btn btn-back" onClick={onBack}>← กลับไปหน้ารายการสินค้า</button>
            <div className="detail-content">
                <div className="detail-image">📦</div>
                <div className="detail-info">
                    <h2>{product.name}</h2>
                    <div className="detail-category">{product.category}</div>
                    <div className="detail-price">฿{product.price.toLocaleString()}</div>
                    <p className="detail-description">{product.description}</p>

                    {product.colors && product.colors.length > 0 && (
                        <div className="color-selector">
                            <label>สี:</label>
                            <div className="color-options">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="quantity-selector">
                        <label>จำนวน:</label>
                        <div className="quantity-controls">
                            <button
                                className="btn btn-qty"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                min="1"
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <button
                                className="btn btn-qty"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-add-cart" onClick={handleAddToCart}>
                        🛒 เพิ่มลงตะกร้า
                    </button>
                    {added && <div className="added-message">✅ เพิ่มลงตะกร้าแล้ว!</div>}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
