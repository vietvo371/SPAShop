import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const [
            productsCount,
            todayAppointments,
            newMessages,
            viewStats,
            recentAppointments,
            recentMessages
        ] = await Promise.all([
            prisma.product.count(),
            prisma.appointment.count({
                where: {
                    appointmentDate: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            prisma.contactMessage.count({
                where: {
                    status: "NEW",
                },
            }),
            prisma.article.aggregate({
                _sum: {
                    viewCount: true,
                },
            }),
            prisma.appointment.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    service: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.contactMessage.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                products: productsCount,
                appointmentsToday: todayAppointments,
                newMessages: newMessages,
                totalViews: viewStats._sum.viewCount || 0,
            },
            recentAppointments,
            recentMessages,
        });
    } catch (error) {
        console.error("Dashboard Stats API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
