import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { removeAuthCookie } from "@/app/lib/auth";

// ============================================
// POST /api/auth/logout - Đăng xuất
// ============================================
export async function POST(request: NextRequest) {
  try {
    await removeAuthCookie();

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi đăng xuất" },
      { status: 500 }
    );
  }
}
