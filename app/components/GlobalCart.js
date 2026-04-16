"use client";

import { useCart } from "@/app/context/CartContext";
import CartSidebar from "@/app/components/CartSidebar";

export default function GlobalCart() {
    const { isSidebarOpen, closeCart } = useCart();

    return <CartSidebar isOpen={isSidebarOpen} onClose={closeCart} />;
}
