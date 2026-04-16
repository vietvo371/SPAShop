import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/services - Lấy danh sách dịch vụ
// ============================================
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isAdminMode = user && (user.role === "ADMIN" || user.role === "STAFF");

    const services = await prisma.service.findMany({
      where: isAdminMode ? {} : { isActive: true },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách dịch vụ" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/services - Tạo dịch vụ mới
// ============================================
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, price, duration, features, imageUrl, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        price,
        duration,
        process: features, // Reusing features as process or similar if needed
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Slug đã tồn tại" }, { status: 400 });
    }
    console.error("Services POST error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo dịch vụ" },
      { status: 500 }
    );
  }
}
