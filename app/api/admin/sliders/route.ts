import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sliderSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/admin/sliders - Lấy danh sách slider (Admin)
// ============================================
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sliders = await prisma.slider.findMany({
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("Sliders GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách slider" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/sliders - Tạo slider mới
// ============================================
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = sliderSchema.parse(body);

    const slider = await prisma.slider.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: slider,
      message: "Tạo slider thành công",
    });
  } catch (error: any) {
    console.error("Slider POST error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo slider" },
      { status: 500 }
    );
  }
}
