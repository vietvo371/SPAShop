import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sliderSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================
// GET /api/admin/sliders/[id] - Lấy chi tiết slider
// ============================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const slider = await prisma.slider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json(
        { success: false, error: "Slider không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: slider,
    });
  } catch (error) {
    console.error("Slider GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy slider" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/admin/sliders/[id] - Cập nhật slider
// ============================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = sliderSchema.partial().parse(body);

    const existing = await prisma.slider.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Slider không tồn tại" },
        { status: 404 }
      );
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: slider,
      message: "Cập nhật slider thành công",
    });
  } catch (error) {
    console.error("Slider PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật slider" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/admin/sliders/[id] - Xóa slider
// ============================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.slider.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Slider không tồn tại" },
        { status: 404 }
      );
    }

    await prisma.slider.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa slider thành công",
    });
  } catch (error) {
    console.error("Slider DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa slider" },
      { status: 500 }
    );
  }
}
