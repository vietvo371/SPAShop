import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { productSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/products - Lấy danh sách sản phẩm
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const user = await getCurrentUser();
    const isAdminMode = user && (user.role === "ADMIN" || user.role === "STAFF");

    const where = {
      ...(isAdminMode ? {} : { isActive: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(featured === "true" && { isFeatured: true }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform data
    const transformedProducts = products.map((p) => ({
      ...p,
      primaryImage: p.images[0]?.url || p.imageUrl,
      images: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/products - Tạo sản phẩm mới
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: validatedData,
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(
      { success: true, data: product, message: "Tạo sản phẩm thành công" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Products POST error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }
}
