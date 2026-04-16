import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/articles - Lấy danh sách bài viết
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const user = await getCurrentUser();
    const isAdminMode = user && (user.role === "ADMIN" || user.role === "STAFF");

    const where: Record<string, unknown> = {
      ...(isAdminMode ? {} : { status: "PUBLISHED" }),
    };

    if (category) {
      where.category = category;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Articles GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách bài viết" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/articles - Tạo bài viết mới
// ============================================
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, category, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        contentHtml: content,
        imageUrl,
        category,
        authorId: user.id,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Slug đã tồn tại" }, { status: 400 });
    }
    console.error("Articles POST error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo bài viết" },
      { status: 500 }
    );
  }
}
