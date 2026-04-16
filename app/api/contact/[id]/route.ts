import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, replyNote } = body;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(replyNote && {
                    replyNote,
                    repliedAt: new Date(),
                    repliedById: user.id
                }),
            },
        });

        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        console.error("Contact PATCH error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi cập nhật tin nhắn" },
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
        await prisma.contactMessage.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Đã xóa tin nhắn" });
    } catch (error) {
        console.error("Contact DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi xóa tin nhắn" },
            { status: 500 }
        );
    }
}
