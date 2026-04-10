import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { productSchema } from "@/app/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================
// GET /api/products/[id] - Lấy chi tiết sản phẩm
// ============================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { 
        id,
        isActive: true 
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { orderIndex: "asc" }],
        },
        details: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy sản phẩm" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/products/[id] - Cập nhật sản phẩm
// ============================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = productSchema.partial().parse(body);

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changing
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Slug đã tồn tại" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
        images: true,
        details: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/products/[id] - Xóa sản phẩm
// ============================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    // Soft delete - set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa sản phẩm" },
      { status: 500 }
    );
  }
}
