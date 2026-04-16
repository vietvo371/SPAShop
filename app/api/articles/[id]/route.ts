import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/articles/[id] - Lấy chi tiết bài viết
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Article GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/articles/[id] - Cập nhật bài viết
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, category, status } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        contentHtml: content,
        imageUrl,
        category,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    console.error("Article PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi cập nhật bài viết" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/articles/[id] - Xóa bài viết
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Chỉ Admin mới có quyền xóa" }, { status: 401 });
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài viết thành công",
    });
  } catch (error) {
    console.error("Article DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa bài viết" },
      { status: 500 }
    );
  }
}
