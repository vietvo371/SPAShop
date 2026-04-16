"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [buyNowItem, setBuyNowItem] = useState(null);

    const openCart = () => setIsSidebarOpen(true);
    const closeCart = () => setIsSidebarOpen(false);

    const setBuyNow = (product, quantity = 1) => {
        setBuyNowItem({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || (product.images?.[0]?.url),
            slug: product.slug,
            quantity
        });
    };

    const clearBuyNow = () => setBuyNowItem(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("chanan_cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chanan_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl || (product.images?.[0]?.url),
                slug: product.slug,
                quantity
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => {
        // Parse price string like "3.800.000đ" to number
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
        return total + priceNum * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isInitialized,
                isSidebarOpen,
                openCart,
                closeCart,
                buyNowItem,
                setBuyNow,
                clearBuyNow
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
