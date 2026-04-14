export default function PromoBanner() {
  const content = (
    <p className="promo-text">
      Mã Voucher Giảm 1.000.000đ độc quyền dành riêng cho bạn:
      <span className="promo-code">taman30.04</span>
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
