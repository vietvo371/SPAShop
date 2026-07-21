// Trang đặt lịch hẹn là client component nên không tự khai metadata được.
export const metadata = {
  title: "Đặt lịch hẹn",
  description:
    "Đặt lịch hẹn trải nghiệm dịch vụ chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Tâm An Energy Healing.",
  alternates: { canonical: "/dat-lich-hen" },
};

export default function DatLichHenLayout({ children }) {
  return children;
}
