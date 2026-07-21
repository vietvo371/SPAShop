// Trang sản phẩm là client component nên không tự khai metadata được.
// Layout này chỉ tồn tại để cung cấp title/description/canonical riêng cho route.
export const metadata = {
  title: "Sản phẩm công nghệ hồng ngoại xa",
  description:
    "Trang sức, thảm đá ngọc và thiết bị ứng dụng công nghệ hồng ngoại xa (FIR) của Tâm An Energy Healing - hỗ trợ tuần hoàn máu, giảm đau, thư giãn.",
  alternates: { canonical: "/san-pham" },
};

export default function SanPhamLayout({ children }) {
  return children;
}
