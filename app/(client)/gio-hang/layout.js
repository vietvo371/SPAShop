// Trang giỏ hàng mang tính giao dịch, không có giá trị với tìm kiếm -> không index.
export const metadata = {
  title: "Giỏ hàng",
  robots: { index: false, follow: true },
};

export default function GioHangLayout({ children }) {
  return children;
}
