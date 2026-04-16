"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./CartSidebar.module.css";
import { formatPrice } from "../lib/utils";

export default function CartSidebar({ isOpen, onClose }) {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`} onClick={handleClose}>
            <div
                className={`${styles.sidebar} ${isClosing ? styles.slideOut : styles.slideIn}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <ShoppingBag size={20} />
                        <span>GIỎ HÀNG CỦA BẠN ({cartCount})</span>
                    </div>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <ShoppingBag size={64} className={styles.emptyIcon} />
                            <p>Giỏ hàng của bạn đang trống</p>
                            <button className={styles.continueBtn} onClick={handleClose}>
                                TIẾP TỤC MUA SẮM
                            </button>
                        </div>
                    ) : (
                        <div className={styles.itemList}>
                            {cartItems.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <Link href={`/san-pham/${item.slug}`} className={styles.itemName} onClick={handleClose}>
                                            {item.name}
                                        </Link>
                                        <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
                                        <div className={styles.itemActions}>
                                            <div className={styles.quantityControls}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.subtotal}>
                            <span>Tạm tính:</span>
                            <span className={styles.totalAmount}>{formatPrice(cartTotal)}</span>
                        </div>
                        <p className={styles.taxNote}>Thuế và phí vận chuyển được tính lúc thanh toán</p>
                        <div className={styles.footerBtns}>
                            <Link href="/gio-hang" className={styles.checkoutBtn} onClick={handleClose}>
                                THANH TOÁN <ArrowRight size={18} />
                            </Link>
                            <button className={styles.keepShoppingBtn} onClick={handleClose}>
                                TIẾP TỤC MUA HÀNG
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
