import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import './App.css';

function AppContent() {
    const [currentView, setCurrentView] = useState('products');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const { getTotalItems } = useCart();

    const handleSelectProduct = (productId) => {
        setSelectedProductId(productId);
        setCurrentView('detail');
    };

    const handleBack = () => {
        setCurrentView('products');
        setSelectedProductId(null);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1 onClick={() => { setCurrentView('products'); setShowCart(false); }}>
                    🛍️ E-commerce Cart System
                </h1>
                <button className="btn btn-cart" onClick={() => setShowCart(!showCart)}>
                    🛒 ตะกร้า ({getTotalItems()})
                </button>
            </header>

            <main className="app-main">
                {showCart ? (
                    <Cart />
                ) : currentView === 'detail' && selectedProductId ? (
                    <ProductDetail productId={selectedProductId} onBack={handleBack} />
                ) : (
                    <ProductList onSelectProduct={handleSelectProduct} />
                )}
            </main>

            <footer className="app-footer">
                <p>E-commerce Cart System Demo - React.js + Node.js + Express.js</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

export default App;
