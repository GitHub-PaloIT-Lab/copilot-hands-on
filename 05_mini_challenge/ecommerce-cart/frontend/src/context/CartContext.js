import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
            let newItems;
            if (existingIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                        : item
                );
            } else {
                newItems = [...state.items, {
                    id: action.payload.id,
                    name: action.payload.name,
                    price: action.payload.price,
                    quantity: action.payload.quantity || 1
                }];
            }
            return { ...state, items: newItems };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(item => item.id !== action.payload) };
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    const addItem = (id, name, price, quantity = 1) => {
        dispatch({ type: 'ADD_ITEM', payload: { id, name, price, quantity } });
    };

    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const discountThreshold = 1000;
    const discountRate = 0.1;

    const calculateSubtotal = () => {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        return subtotal > discountThreshold ? subtotal * discountRate : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getOrderSummary = () => {
        if (state.items.length === 0) {
            return { items: [], subtotal: 0, discount: 0, total: 0, message: 'ตะกร้าว่างเปล่า' };
        }
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        const total = calculateTotal();
        return {
            items: state.items.map(item => ({
                ...item,
                itemTotal: item.price * item.quantity
            })),
            subtotal,
            discount,
            total,
            hasDiscount: discount > 0
        };
    };

    return (
        <CartContext.Provider value={{
            items: state.items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            calculateSubtotal,
            calculateDiscount,
            calculateTotal,
            getTotalItems,
            getOrderSummary
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
