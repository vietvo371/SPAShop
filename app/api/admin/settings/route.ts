import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/admin/settings - Lấy cấu hình hệ thống
// ============================================
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.setting.findMany();
    
    // Transform array to object { key: value }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string | null>);

    return NextResponse.json({
      success: true,
      data: settingsObj,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy cấu hình" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/settings - Cập nhật cấu hình
// ============================================
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json(); // Object like { businessName: "...", phone: "..." }

    // Use transaction to update/create multiple settings
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key: key as string },
        update: { value: String(value) },
        create: { key: key as string, value: String(value) },
      });
    });

    await prisma.$transaction(updates);

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật cấu hình thành công",
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lưu cấu hình" },
      { status: 500 }
    );
  }
}
