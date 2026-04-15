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
