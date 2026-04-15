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
