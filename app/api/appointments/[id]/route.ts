import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, notes, staffId } = body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes && { notes }),
                ...(staffId && { staffId }),
            },
        });

        return NextResponse.json({ success: true, data: appointment });
    } catch (error) {
        console.error("Appointment PATCH error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi cập nhật lịch hẹn" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.appointment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Đã xóa lịch hẹn" });
    } catch (error) {
        console.error("Appointment DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi xóa lịch hẹn" },
            { status: 500 }
        );
    }
}
