import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================
// PUT /api/orders/[id] - Cập nhật trạng thái đơn hàng (Admin)
// ============================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
            return NextResponse.json(
                { success: false, error: "Không có quyền truy cập" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status, staffNote } = body;

        const existing = await prisma.order.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Đơn hàng không tồn tại" },
                { status: 404 }
            );
        }

        const updated = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(staffNote !== undefined && { staffNote }),
            },
        });

        return NextResponse.json({
            success: true,
            data: updated,
            message: "Cập nhật đơn hàng thành công",
        });
    } catch (error) {
        console.error("Order PUT error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi cập nhật đơn hàng" },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE /api/orders/[id] - Xóa đơn hàng (Admin)
// ============================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, error: "Không có quyền thực hiện" },
                { status: 403 }
            );
        }

        const { id } = await params;

        await prisma.order.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Xóa đơn hàng thành công",
        });
    } catch (error) {
        console.error("Order DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi xóa đơn hàng" },
            { status: 500 }
        );
    }
}
