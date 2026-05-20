"use client";

import { useSettings } from "@/app/context/SettingsContext";

export default function PromoBanner() {
  const { settings } = useSettings();
  const voucherCode = settings.voucherCode?.trim();
  const voucherDiscount = settings.voucherDiscount?.trim();
  const voucherExpiry = settings.voucherExpiry?.trim();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = voucherExpiry ? new Date(voucherExpiry) : null;
  if (expiryDate) {
    expiryDate.setHours(0, 0, 0, 0);
  }

  const isExpired = expiryDate ? expiryDate < today : false;

  if (!voucherCode || isExpired) {
    return null;
  }

  const content = (
    <p className="promo-text">
      {voucherDiscount ? `Mã Voucher Giảm ${voucherDiscount}% độc quyền dành riêng cho bạn:` : "Mã Voucher độc quyền dành riêng cho bạn:"}
      <span className="promo-code">{voucherCode}</span>
      Áp dụng cho tất cả sản phẩm!
    </p>
  );

  return (
    <div className="promo-banner">
      <div className="promo-marquee">
        {content}
        {content}
      </div>
    </div>
  );
}
