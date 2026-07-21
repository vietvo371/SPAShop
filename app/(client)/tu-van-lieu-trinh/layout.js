// Trang tư vấn liệu trình là client component nên không tự khai metadata được.
export const metadata = {
  title: "Tư vấn liệu trình",
  description:
    "Trả lời vài câu hỏi ngắn để Tâm An Energy Healing gợi ý liệu trình chăm sóc sức khỏe bằng công nghệ hồng ngoại xa phù hợp với bạn.",
  alternates: { canonical: "/tu-van-lieu-trinh" },
};

export default function TuVanLieuTrinhLayout({ children }) {
  return children;
}
