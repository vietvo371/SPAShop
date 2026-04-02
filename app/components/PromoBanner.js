export default function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-marquee">
        {[...Array(5)].map((_, i) => (
          <p key={i} className="promo-text">
            Mã Voucher Giảm 50.000đ độc quyền dành riêng cho bạn:
            <span className="promo-code">muatet2026</span>
            Áp dụng cho tất cả sản phẩm!
          </p>
        ))}
      </div>
    </div>
  );
}
