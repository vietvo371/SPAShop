// Trang liên hệ là client component nên không tự khai metadata được.
export const metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ Tâm An Energy Healing để được tư vấn về liệu trình chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR). Hotline: 035 630 8211.",
  alternates: { canonical: "/lien-he" },
};

export default function LienHeLayout({ children }) {
  return children;
}
