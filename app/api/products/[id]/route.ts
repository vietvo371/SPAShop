import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { productSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================
// GET /api/products/[id] - Lấy chi tiết sản phẩm
// ============================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();
    const isAdminMode = user && (user.role === "ADMIN" || user.role === "STAFF");

    const product = await prisma.product.findUnique({
      where: {
        id,
        ...(isAdminMode ? {} : { isActive: true })
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

    // Check name uniqueness if changing
    if (validatedData.name && validatedData.name !== existing.name) {
      const nameExists = await prisma.product.findFirst({
        where: { name: validatedData.name },
      });
      if (nameExists) {
        return NextResponse.json(
          { success: false, error: "Tên sản phẩm đã tồn tại" },
          { status: 400 }
        );
      }
    }

    const { images, ...productUpdateData } = validatedData;

    const product = await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      const updated = await tx.product.update({
        where: { id },
        data: productUpdateData,
      });

      // 2. Sync images if provided
      if (images) {
        // Delete current images
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        // Create new ones
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img) => ({
              productId: id,
              url: img.url,
              isPrimary: img.isPrimary,
              orderIndex: img.orderIndex,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
          details: true,
        },
      });
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

    // Hard delete
    await prisma.product.delete({
      where: { id },
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
