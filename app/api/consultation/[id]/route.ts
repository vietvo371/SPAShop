import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// ============================================
// PATCH /api/consultation/[id] - Cập nhật trạng thái và ghi chú (Admin)
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, note } = body;

    const lead = await prisma.consultationLead.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(note !== undefined && { note }),
      },
    });

    return NextResponse.json({
      success: true,
      data: lead,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    console.error("Consultation PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật thông tin" },
      { status: 500 }
    );
  }
}

// ================= ============================
// DELETE /api/consultation/[id] - Xóa thông tin khách tư vấn (Admin)
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.consultationLead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa thông tin",
    });
  } catch (error) {
    console.error("Consultation DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa dữ liệu" },
      { status: 500 }
    );
  }
}
