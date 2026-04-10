import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { categorySchema } from "@/app/lib/validations";

// ============================================
// GET /api/categories - Lấy danh sách danh mục
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const categories = await prisma.category.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { orderIndex: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách danh mục" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/categories - Tạo danh mục mới (Admin)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: category, message: "Tạo danh mục thành công" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo danh mục" },
      { status: 500 }
    );
  }
}
