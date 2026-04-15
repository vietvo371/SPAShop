import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const user = await getCurrentUser();
        const isAdminMode = user && (user.role === "ADMIN" || user.role === "STAFF");

        const product = await prisma.product.findUnique({
            where: {
                slug,
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
        console.error("Product Slug GET error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi lấy sản phẩm" },
            { status: 500 }
        );
    }
}
