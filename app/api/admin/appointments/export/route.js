import { NextResponse } from "next/server";
// Cài đặt: yarn add xlsx
// import XLSX from "xlsx";

const statusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export async function GET(request) {
  try {
    // TODO: Lấy dữ liệu từ database
    // const appointments = await prisma.appointment.findMany({
    //   include: { service: true },
    //   orderBy: { appointmentDate: "desc" },
    // });

    // Mock data hiện tại - thay bằng dữ liệu thật khi kết nối database
    const appointments = [
      { id: 1, customerName: "Nguyễn Văn A", customerPhone: "0912345678", serviceName: "Khai thông vùng đầu", appointmentDate: "2026-04-15 09:00", status: "PENDING" },
      { id: 2, customerName: "Trần Thị B", customerPhone: "0987654321", serviceName: "Cổ vai gáy", appointmentDate: "2026-04-15 10:30", status: "CONFIRMED" },
      { id: 3, customerName: "Lê Văn C", customerPhone: "0934567890", serviceName: "Phục hồi thận khí", appointmentDate: "2026-04-15 14:00", status: "PENDING" },
      { id: 4, customerName: "Phạm Thị D", customerPhone: "0978901234", serviceName: "Bài độc gan", appointmentDate: "2026-04-16 09:30", status: "COMPLETED" },
      { id: 5, customerName: "Hoàng Văn E", customerPhone: "0967890123", serviceName: "Kiện tỳ vị", appointmentDate: "2026-04-16 11:00", status: "CONFIRMED" },
    ];

    // Chuyển đổi dữ liệu
    const exportData = appointments.map((apt) => ({
      "STT": apt.id,
      "Khách hàng": apt.customerName,
      "Số điện thoại": apt.customerPhone,
      "Dịch vụ": apt.serviceName,
      "Ngày giờ": apt.appointmentDate,
      "Trạng thái": statusLabels[apt.status] || apt.status,
    }));

    // Format JSON response - sẽ chuyển thành file Excel khi cài xlsx
    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lich-hen-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });

    // Khi cài xlsx, uncomment đoạn code dưới và comment đoạn trên:
    /*
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch hẹn");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="lich-hen-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
    */
  } catch (error) {
    console.error("Lỗi export:", error);
    return NextResponse.json(
      { error: "Không thể xuất file" },
      { status: 500 }
    );
  }
}