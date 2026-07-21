// Trang xác nhận sau khi đặt hàng, chỉ dành cho khách vừa mua -> không index.
export const metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: true },
};

export default function DatHangThanhCongLayout({ children }) {
  return children;
}
