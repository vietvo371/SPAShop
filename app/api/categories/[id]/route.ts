import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { categorySchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================
// GET /api/categories/[id] - Lấy chi tiết danh mục
// ============================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Danh mục không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Category GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh mục" },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/categories/[id] - Cập nhật danh mục
// ============================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = categorySchema.partial().parse(body);

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Danh mục không tồn tại" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changing
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Slug đã tồn tại" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "Cập nhật danh mục thành công",
    });
  } catch (error) {
    console.error("Category PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật danh mục" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/categories/[id] - Xóa danh mục
// ============================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Danh mục không tồn tại" },
        { status: 404 }
      );
    }

    // Unlink products before delete (set categoryId to null)
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa danh mục" },
      { status: 500 }
    );
  }
}
