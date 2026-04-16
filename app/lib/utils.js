/**
 * Formats a numeric price into a Vietnamese currency string (e.g., 1.500.000₫)
 * @param {number|string|null} price - The price value to format
 * @param {string} fallback - String to show if price is 0 or null
 * @returns {string} Formatted price or fallback
 */
export const formatPrice = (price, fallback = "Liên hệ") => {
    if (!price || Number(price) === 0) return fallback;

    const numericPrice = Number(price);
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(numericPrice).replace("₫", "₫").trim();
};
