import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/services/[id] - Lấy chi tiết dịch vụ
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: "Không tìm thấy dịch vụ" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Service GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/services/[id] - Cập nhật dịch vụ
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, price, duration, features, imageUrl, isActive } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        duration,
        process: features,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error("Service PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật dịch vụ" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/services/[id] - Xóa dịch vụ
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Chỉ Admin mới có quyền xóa" }, { status: 401 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa dịch vụ thành công",
    });
  } catch (error) {
    console.error("Service DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa dịch vụ" },
      { status: 500 }
    );
  }
}
